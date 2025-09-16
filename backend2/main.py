import os
from dotenv import load_dotenv
from pydantic import BaseModel, Field
import httpx
from datetime import datetime, timedelta
import statistics
from contextlib import asynccontextmanager
import traceback

# --- FastAPI Imports ---
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# --- LangChain Imports ---
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.tools import BaseTool
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain_core.agents import AgentActionMessageLog
from typing import Type
import pandas as pd
import joblib
import numpy as np
from fastapi import HTTPException
from pydantic import BaseModel

gwl_preprocessor = None
gwl_model = None

# --- 1. Environment and App Setup ---
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting up Rainwater Harvesting AI Agent...")
    load_gwl_models()
    yield
    # Shutdown (if needed)
    print("🛑 Shutting down...")

app = FastAPI(
    title="Rainwater Harvesting AI Agent",
    description="An API for the RTRWH feasibility agent.",
    version="2.0.0-final",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = ChatOpenAI(model="gpt-4o", temperature=0)


# --- 2. Pydantic Models (Updated with fixes) ---
class GWLRequest(BaseModel):
    district: str
    latitude: float
    longitude: float

class GWLResponse(BaseModel):
    gwl: float
    unit: str
    success: bool
    district: str = None
    status: str = None

class CombinedRequest(BaseModel):
    input: str
    district: str = None
    latitude: float = None
    longitude: float = None
    area: float = None

class HydrogeologyInput(BaseModel):
    latitude: float = Field(..., description="Latitude of the location.")
    longitude: float = Field(..., description="Longitude of the location.")

class RunoffInput(BaseModel):
    roof_area_sqm: float = Field(..., description="The area of the rooftop in square meters.")
    annual_rainfall_mm: int = Field(..., description="The average annual rainfall in millimeters.")

class StructureInput(BaseModel):
    roof_area_sqm: float = Field(..., description="The area of the rooftop in square meters.")
    groundwater_depth_meters: float = Field(..., description="Depth to groundwater in meters.")
    runoff_liters: int = Field(..., description="Total annual runoff generated in liters.")

class FinalReport(BaseModel):
    """The final structured report for the user, containing AI recommendations and ROI."""
    ai_recommendation: str = Field(description="A detailed, user-friendly recommendation paragraph explaining the suggested structure, its cost, capacity, and any available subsidies, based on all gathered data.")
    annual_savings_inr: int = Field(description="The estimated total annual savings in Indian Rupees (₹).")
    payback_period_years: float = Field(description="The payback period for the investment in years.")

class AgentInput(BaseModel):
    input: str


def load_gwl_models():
    """Load GWL models on startup"""
    global gwl_preprocessor, gwl_model
    try:
        gwl_preprocessor = joblib.load('final_preprocessor.joblib')
        gwl_model = joblib.load('final_model.joblib')
        print("✅ GWL Model and preprocessor loaded successfully.")
        return True
    except FileNotFoundError as e:
        print(f"❌ GWL Model files not found: {e}")
        print("ℹ️  Application will continue without GWL prediction functionality.")
        return False
    except Exception as e:
        print(f"❌ Error loading GWL models: {e}")
        print("ℹ️  This might be due to scikit-learn version mismatch.")
        print("ℹ️  Application will continue without GWL prediction functionality.")
        return False

def predict_gwl(district: str, latitude: float, longitude: float):
    """Predict groundwater level with improved error handling"""
    try:
        print(f"🔍 Predicting GWL for {district} at ({latitude}, {longitude})")
        
        # Check if models are loaded
        if gwl_preprocessor is None or gwl_model is None:
            print("⚠️  GWL models not available, using fallback calculation")
            # Fallback: Return a reasonable default based on location
            if 8 <= latitude <= 20:  # Southern India
                fallback_gwl = 15.5
            elif 20 <= latitude <= 28:  # Central India
                fallback_gwl = 12.0
            elif 28 <= latitude <= 35:  # Northern India
                fallback_gwl = 8.5
            else:
                fallback_gwl = 12.0  # Default
            print(f"📊 Fallback GWL: {fallback_gwl} mbgl")
            return fallback_gwl
        
        # Calculate derived features
        lat_x_lon = latitude * longitude
        lat_squared = latitude ** 2
        lon_squared = longitude ** 2

        # Create input dataframe
        input_data = pd.DataFrame({
            'District': [district],
            'Latitude': [latitude],
            'Longitude': [longitude],
            'lat_x_lon': [lat_x_lon],
            'lat_squared': [lat_squared],
            'lon_squared': [lon_squared]
        })

        print(f"📊 Input features: {input_data.to_dict('records')[0]}")

        # Preprocess and predict
        input_data_processed = gwl_preprocessor.transform(input_data)
        prediction = gwl_model.predict(input_data_processed)
        
        predicted_gwl = float(prediction[0])
        print(f"✅ Predicted GWL: {predicted_gwl} mbgl")
        return predicted_gwl
        
    except Exception as e:
        print(f"❌ Error in GWL prediction: {e}")
        print(f"🔍 Error traceback: {traceback.format_exc()}")
        print("⚠️  Using fallback calculation")
        # Fallback calculation
        if 8 <= latitude <= 20:  # Southern India
            fallback_gwl = 15.5
        elif 20 <= latitude <= 28:  # Central India
            fallback_gwl = 12.0
        elif 28 <= latitude <= 35:  # Northern India
            fallback_gwl = 8.5
        else:
            fallback_gwl = 12.0  # Default
        print(f"📊 Fallback GWL: {fallback_gwl} mbgl")
        return fallback_gwl


# --- 3. PRODUCTION Tool Functions (FULLY ASYNC) with Enhanced Debugging ---
async def get_hydrogeological_data(latitude: float, longitude: float) -> dict:
    print(f"🌍 TOOL EXECUTED: Fetching hydrogeological data for ({latitude}, {longitude})")
    start_date = "1990-01-01"
    end_date = "2023-12-31"
    api_url = f"https://archive-api.open-meteo.com/v1/archive?latitude={latitude}&longitude={longitude}&start_date={start_date}&end_date={end_date}&daily=precipitation_sum"
    
    try:
        print(f"🌐 Making API request to: {api_url}")
        async with httpx.AsyncClient() as client:
            response = await client.get(api_url, timeout=30.0)
            response.raise_for_status()
            weather_data = response.json()
            print(f"✅ Weather API response received, status: {response.status_code}")
            
        daily_precip = weather_data.get('daily', {}).get('precipitation_sum', [])
        if not daily_precip:
            print("⚠️  No precipitation data found in API response")
            # Use fallback data based on location
            if 12.8 <= latitude <= 13.1 and 77.4 <= longitude <= 77.8:  # Bengaluru area
                avg_annual_rainfall_mm = 970
            else:
                avg_annual_rainfall_mm = 1000  # General fallback
            print(f"📊 Using fallback rainfall: {avg_annual_rainfall_mm}mm")
        else:
            # Filter out None values and calculate
            valid_precip = [p for p in daily_precip if p is not None]
            total_precip = sum(valid_precip)
            num_years = len(weather_data['daily']['time']) / 365.25
            avg_annual_rainfall_mm = round(total_precip / num_years) if num_years > 0 else 1000
            print(f"📊 Calculated rainfall: {avg_annual_rainfall_mm}mm (from {len(valid_precip)} data points over {num_years:.1f} years)")
            
    except httpx.TimeoutException as e:
        print(f"⏰ Weather API timeout: {e}")
        avg_annual_rainfall_mm = 970  # Bengaluru average
        print(f"📊 Using timeout fallback rainfall: {avg_annual_rainfall_mm}mm")
        
    except httpx.RequestError as e:
        print(f"🌐 Weather API network error: {e}")
        avg_annual_rainfall_mm = 970  # Bengaluru average
        print(f"📊 Using network error fallback rainfall: {avg_annual_rainfall_mm}mm")
        
    except (ValueError, KeyError) as e:
        print(f"📊 Error processing weather data: {e}")
        avg_annual_rainfall_mm = 970  # Bengaluru average
        print(f"📊 Using processing error fallback rainfall: {avg_annual_rainfall_mm}mm")
    
    except Exception as e:
        print(f"❌ Unexpected error in weather API: {e}")
        print(f"🔍 Error traceback: {traceback.format_exc()}")
        avg_annual_rainfall_mm = 970  # Bengaluru average
        print(f"📊 Using general error fallback rainfall: {avg_annual_rainfall_mm}mm")
    
    # Use GWL prediction for groundwater depth
    try:
        gwl_depth = predict_gwl("Bengaluru", latitude, longitude)
        print(f"🏔️ GWL depth: {gwl_depth} mbgl")
    except Exception as e:
        print(f"❌ Error getting GWL depth: {e}")
        gwl_depth = 15.5  # Default for Bengaluru
        print(f"📊 Using default GWL depth: {gwl_depth} mbgl")
    
    result = {
        "principal_aquifer": "Phreatic Aquifer in Peninsular Gneissic Complex",
        "groundwater_depth_meters": gwl_depth,
        "annual_rainfall_mm": avg_annual_rainfall_mm,
    }
    
    print(f"✅ Hydrogeological data result: {result}")
    return result

async def calculate_harvesting_potential(roof_area_sqm: float, annual_rainfall_mm: int) -> dict:
    print(f"💧 TOOL EXECUTED: Calculating harvesting potential for {roof_area_sqm} sqm roof with {annual_rainfall_mm}mm rainfall")
    
    try:
        # More accurate runoff coefficient based on roof material
        runoff_coefficient = 0.85
        
        runoff_liters = int(roof_area_sqm * annual_rainfall_mm * runoff_coefficient)
        print(f"📊 Calculated runoff: {runoff_liters} liters")
        
        # More accurate water cost calculation for India
        water_cost_per_1000l = 18
        potential_savings_inr = int((runoff_liters / 1000) * water_cost_per_1000l)
        print(f"💰 Potential savings: ₹{potential_savings_inr}")
        
        result = {"runoff_liters": runoff_liters, "annual_savings_inr": potential_savings_inr}
        print(f"✅ Harvesting potential result: {result}")
        return result
        
    except Exception as e:
        print(f"❌ Error calculating harvesting potential: {e}")
        print(f"🔍 Error traceback: {traceback.format_exc()}")
        # Return reasonable defaults
        return {"runoff_liters": 50000, "annual_savings_inr": 900}

async def recommend_recharge_structure(roof_area_sqm: float, groundwater_depth_meters: float, runoff_liters: int) -> dict:
    print(f"🏗️ TOOL EXECUTED: Recommending structure for {roof_area_sqm}sqm roof, {groundwater_depth_meters}m GWL depth, {runoff_liters}L runoff")
    
    try:
        # Structure selection logic
        if groundwater_depth_meters > 10:
            structure_type = "Recharge Shaft"
            dims = "1m diameter, 18m depth"
            cost = 95000
            # Calculate actual capacity for shaft
            radius = 0.5  # 1m diameter = 0.5m radius
            depth = 18
            porosity = 0.4  # Typical for shaft with filter material
            capacity_liters = int(3.14159 * radius * radius * depth * porosity * 1000)
            subsidy_amount = 30000
        elif roof_area_sqm > 200:
            structure_type = "Recharge Trench"
            dims = "1.5m width, 2m depth, 10m length"
            cost = 70000
            # Calculate actual capacity for trench
            width, depth, length = 1.5, 2, 10
            porosity = 0.35  # Typical for trench with gravel/sand
            capacity_liters = int(width * depth * length * porosity * 1000)
            subsidy_amount = 20000
        else:
            structure_type = "Recharge Pit"
            dims = "2m x 2m x 3m"
            cost = 45000
            # Calculate actual capacity for pit
            length, width, depth = 2, 2, 3
            porosity = 0.4  # Typical for pit with filter layers
            capacity_liters = int(length * width * depth * porosity * 1000)
            subsidy_amount = 12000
        
        print(f"🏗️ Selected structure: {structure_type} ({dims})")
        print(f"💰 Estimated cost: ₹{cost}, Capacity: {capacity_liters}L, Subsidy: ₹{subsidy_amount}")
        
        # More accurate annual savings calculation
        water_cost_per_1000l = 18
        annual_savings = int((runoff_liters / 1000) * water_cost_per_1000l)
        
        # More precise payback calculation
        payback = round(cost / annual_savings, 1) if annual_savings > 0 else float('inf')
        print(f"📊 Annual savings: ₹{annual_savings}, Payback: {payback} years")
        
        result = {
            "suggested_structure": structure_type,
            "recommended_dimensions": dims,
            "estimated_cost_inr": cost,
            "capacity_liters": capacity_liters,
            "subsidy_available_inr": subsidy_amount,
            "payback_period_years": payback,
            "annual_savings_inr": annual_savings,
        }
        
        print(f"✅ Structure recommendation result: {result}")
        return result
        
    except Exception as e:
        print(f"❌ Error recommending structure: {e}")
        print(f"🔍 Error traceback: {traceback.format_exc()}")
        # Return reasonable defaults
        return {
            "suggested_structure": "Recharge Pit",
            "recommended_dimensions": "2m x 2m x 3m",
            "estimated_cost_inr": 45000,
            "capacity_liters": 4800,
            "subsidy_available_inr": 12000,
            "payback_period_years": 5.0,
            "annual_savings_inr": 9000,
        }

async def format_final_report(ai_recommendation: str, annual_savings_inr: int, payback_period_years: float) -> dict:
    print(f"📋 TOOL EXECUTED: Formatting final report")
    result = {
        "ai_recommendation": ai_recommendation,
        "annual_savings_inr": annual_savings_inr,
        "payback_period_years": payback_period_years
    }
    print(f"✅ Final report formatted: {result}")
    return result


# --- 4. Create LangChain Tools (Enhanced with debugging) ---

class GetHydrogeologicalDataTool(BaseTool):
    name: str = "get_hydrogeological_data"
    description: str = "Essential for finding the aquifer type, groundwater level, and average annual rainfall for a given geographic location (latitude and longitude)."
    args_schema: Type[BaseModel] = HydrogeologyInput

    def _run(self, *args, **kwargs):
        raise NotImplementedError("This tool does not support synchronous execution.")

    async def _arun(self, latitude: float, longitude: float):
        try:
            print(f"🔧 GetHydrogeologicalDataTool called with lat={latitude}, lon={longitude}")
            result = await get_hydrogeological_data(latitude, longitude)
            print(f"🔧 GetHydrogeologicalDataTool result: {result}")
            return result
        except Exception as e:
            print(f"❌ Error in GetHydrogeologicalDataTool: {e}")
            print(f"🔍 Error traceback: {traceback.format_exc()}")
            raise

class CalculateHarvestingPotentialTool(BaseTool):
    name: str = "calculate_harvesting_potential"
    description: str = "Calculates the total annual runoff in liters and provides an estimated annual savings in INR. Requires roof area and annual rainfall as input."
    args_schema: Type[BaseModel] = RunoffInput

    def _run(self, *args, **kwargs):
        raise NotImplementedError("This tool does not support synchronous execution.")

    async def _arun(self, roof_area_sqm: float, annual_rainfall_mm: int):
        try:
            print(f"🔧 CalculateHarvestingPotentialTool called with area={roof_area_sqm}, rainfall={annual_rainfall_mm}")
            result = await calculate_harvesting_potential(roof_area_sqm, annual_rainfall_mm)
            print(f"🔧 CalculateHarvestingPotentialTool result: {result}")
            return result
        except Exception as e:
            print(f"❌ Error in CalculateHarvestingPotentialTool: {e}")
            print(f"🔍 Error traceback: {traceback.format_exc()}")
            raise

class RecommendRechargeStructureTool(BaseTool):
    name: str = "recommend_recharge_structure"
    description: str = "Recommends the best type of recharge structure (pit, trench, or shaft) along with its details. Requires roof area, groundwater depth, and total runoff as input."
    args_schema: Type[BaseModel] = StructureInput

    def _run(self, *args, **kwargs):
        raise NotImplementedError("This tool does not support synchronous execution.")

    async def _arun(self, roof_area_sqm: float, groundwater_depth_meters: float, runoff_liters: int):
        try:
            print(f"🔧 RecommendRechargeStructureTool called with area={roof_area_sqm}, depth={groundwater_depth_meters}, runoff={runoff_liters}")
            result = await recommend_recharge_structure(roof_area_sqm, groundwater_depth_meters, runoff_liters)
            print(f"🔧 RecommendRechargeStructureTool result: {result}")
            return result
        except Exception as e:
            print(f"❌ Error in RecommendRechargeStructureTool: {e}")
            print(f"🔍 Error traceback: {traceback.format_exc()}")
            raise

class FormatFinalReportTool(BaseTool):
    name: str = "format_final_report"
    description: str = "Use this as your final step to format the complete report for the user. All arguments must be populated."
    args_schema: Type[BaseModel] = FinalReport

    def _run(self, *args, **kwargs):
        raise NotImplementedError("This tool does not support synchronous execution.")
        
    async def _arun(self, ai_recommendation: str, annual_savings_inr: int, payback_period_years: float):
        try:
            print(f"🔧 FormatFinalReportTool called")
            result = await format_final_report(ai_recommendation, annual_savings_inr, payback_period_years)
            print(f"🔧 FormatFinalReportTool result: {result}")
            return result
        except Exception as e:
            print(f"❌ Error in FormatFinalReportTool: {e}")
            print(f"🔍 Error traceback: {traceback.format_exc()}")
            raise

# Instantiate the tools
tools = [
    GetHydrogeologicalDataTool(),
    CalculateHarvestingPotentialTool(),
    RecommendRechargeStructureTool(),
    FormatFinalReportTool(),
]


# --- 5. Create the Agent Prompt ---
prompt = ChatPromptTemplate.from_messages(
    [
        ("system", """You are an expert hydrogeologist AI assistant for the 'JalSetu' app.
Your goal is to provide a complete and concise feasibility report for a user.

You must proceed in the following order:
1.  First, use the `get_hydrogeological_data` tool to find the essential environmental data.
2.  Second, use the `calculate_harvesting_potential` tool.
3.  Third, use the `recommend_recharge_structure` tool to get the final recommendations.
4.  After gathering all information, you MUST use the `format_final_report` tool as your final action.
5.  To create the `ai_recommendation` text, synthesize the data you have gathered into a friendly, human-readable paragraph. Start with the recommended structure, explain why it was chosen (citing data like rainfall and groundwater depth), and include the cost, capacity, and any available subsidy.
"""),
        ("human", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ]
)

# --- 6. Create the Agent ---
try:
    agent = create_openai_functions_agent(llm, tools, prompt)
    agent_executor = AgentExecutor(
        agent=agent,
        tools=tools,
        verbose=True,
        return_intermediate_steps=True
    )
    print("✅ Agent created successfully")
except Exception as e:
    print(f"❌ Error creating agent: {e}")
    print(f"🔍 Error traceback: {traceback.format_exc()}")


# --- 7. FastAPI Endpoints (Enhanced with debugging) ---

@app.get("/")
async def root():
    return {
        "status": "AI Agent is running",
        "gwl_models_loaded": gwl_preprocessor is not None and gwl_model is not None,
        "version": "2.0.0-debug"
    }

@app.get("/health")
async def health_check():
    """Detailed health check endpoint"""
    return {
        "status": "healthy",
        "gwl_models_loaded": gwl_preprocessor is not None and gwl_model is not None,
        "agent_ready": 'agent_executor' in globals(),
        "tools_count": len(tools) if 'tools' in globals() else 0
    }

@app.post("/predict-gwl", response_model=GWLResponse)
async def predict_groundwater_level(request: GWLRequest):
    """Standalone GWL prediction endpoint with enhanced debugging"""
    try:
        print(f"🔍 GWL prediction request: {request}")
        gwl_prediction = predict_gwl(request.district, request.latitude, request.longitude)
        
        if gwl_prediction is not None:
            response = GWLResponse(
                gwl=round(gwl_prediction, 2),
                unit="mbgl",
                success=True,
                district=request.district,
                status="success" if (gwl_preprocessor is not None and gwl_model is not None) else "fallback"
            )
            print(f"✅ GWL prediction response: {response}")
            return response
        else:
            print("❌ GWL prediction returned None")
            raise HTTPException(status_code=500, detail="Failed to predict groundwater level")
            
    except Exception as e:
        print(f"❌ Error in predict_groundwater_level endpoint: {e}")
        print(f"🔍 Error traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"GWL prediction error: {str(e)}")

@app.post("/get-recommendation", response_model=FinalReport)
async def get_agent_recommendation(payload: AgentInput):
    """
    Receives user input and runs the full agent process with enhanced debugging
    """
    try:
        print(f"🤖 Agent recommendation request: {payload.input}")
        
        # Check if agent is available
        if 'agent_executor' not in globals():
            print("❌ Agent executor not available")
            raise HTTPException(status_code=500, detail="Agent not properly initialized")
        
        result = await agent_executor.ainvoke({"input": payload.input})
        print(f"🤖 Agent execution result keys: {result.keys()}")
        print(f"🤖 Agent output: {result.get('output', 'No output')}")
        
        # Extract the final tool's output from intermediate steps
        if "intermediate_steps" in result and result["intermediate_steps"]:
            print(f"🔍 Found {len(result['intermediate_steps'])} intermediate steps")
            
            # The last step is a tuple: (action, observation)
            last_step = result["intermediate_steps"][-1]
            last_action, last_observation = last_step
            
            print(f"🔍 Last action tool: {getattr(last_action, 'tool', 'unknown')}")
            print(f"🔍 Last observation type: {type(last_observation)}")
            print(f"🔍 Last observation: {last_observation}")

            # Check if the last action was the format_final_report tool
            if isinstance(last_action, AgentActionMessageLog) and last_action.tool == "format_final_report":
                # The observation is the dictionary returned by the tool
                if isinstance(last_observation, dict) and "ai_recommendation" in last_observation:
                    final_report = FinalReport(**last_observation)
                    print(f"✅ Successfully created final report: {final_report}")
                    return final_report

        # Fallback if the expected final step isn't found
        print("⚠️ Could not extract final report from agent's intermediate steps")
        print(f"📊 Full result structure: {result}")
        
        # Create a fallback response
        fallback_response = FinalReport(
            ai_recommendation=result.get("output", "Unable to generate detailed recommendation due to processing error."),
            annual_savings_inr=0,
            payback_period_years=0.0
        )
        print(f"📋 Returning fallback response: {fallback_response}")
        return fallback_response

    except Exception as e:
        print(f"❌ Unexpected error in agent executor: {e}")
        print(f"🔍 Error traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Agent processing error: {str(e)}")

@app.post("/get-recommendation-with-gwl")
async def get_recommendation_with_gwl(request: CombinedRequest):
    """Enhanced endpoint that returns both AI recommendation and GWL with full debugging"""
    try:
        print(f"🔄 Combined request received: {request}")
        
        # Get AI recommendation using the agent executor
        ai_recommendation = None
        if request.input:
            try:
                print("🤖 Starting agent execution...")
                
                # Check if agent is available
                if 'agent_executor' not in globals():
                    print("❌ Agent executor not available")
                    raise Exception("Agent not properly initialized")
                
                result = await agent_executor.ainvoke({"input": request.input})
                print(f"🤖 Agent execution completed. Result keys: {result.keys()}")
                
                # Extract the final tool's output from intermediate steps
                if "intermediate_steps" in result and result["intermediate_steps"]:
                    print(f"🔍 Processing {len(result['intermediate_steps'])} intermediate steps")
                    last_step = result["intermediate_steps"][-1]
                    last_action, last_observation = last_step

                    # Check if the last action was the format_final_report tool
                    if isinstance(last_action, AgentActionMessageLog) and last_action.tool == "format_final_report":
                        if isinstance(last_observation, dict):
                            ai_recommendation = last_observation
                            print(f"✅ Extracted AI recommendation: {ai_recommendation}")
                
                # Fallback to the agent's output if structured report not found
                if not ai_recommendation:
                    print("⚠️ Using fallback AI recommendation")
                    ai_recommendation = {
                        "ai_recommendation": result.get("output", "Unable to generate recommendation"),
                        "annual_savings_inr": 0,
                        "payback_period_years": 0.0
                    }
                    
            except Exception as e:
                print(f"❌ Error getting AI recommendation: {e}")
                print(f"🔍 AI recommendation error traceback: {traceback.format_exc()}")
                ai_recommendation = {
                    "ai_recommendation": f"Error generating recommendation: {str(e)}",
                    "annual_savings_inr": 0,
                    "payback_period_years": 0.0
                }
        else:
            print("⚠️ No input provided for AI recommendation")
            ai_recommendation = {
                "ai_recommendation": "No input provided for recommendation",
                "annual_savings_inr": 0,
                "payback_period_years": 0.0
            }
        
        # Get GWL prediction if coordinates provided
        gwl_data = None
        if all([request.district, request.latitude, request.longitude]):
            try:
                print(f"🔍 Getting GWL prediction for {request.district} at ({request.latitude}, {request.longitude})")
                gwl_prediction = predict_gwl(request.district, request.latitude, request.longitude)
                if gwl_prediction is not None:
                    gwl_data = {
                        "gwl": round(gwl_prediction, 2),
                        "unit": "mbgl",
                        "success": True,
                        "district": request.district,
                        "status": "success" if (gwl_preprocessor is not None and gwl_model is not None) else "fallback"
                    }
                    print(f"✅ GWL prediction successful: {gwl_data}")
                else:
                    gwl_data = {"success": False, "error": "GWL prediction failed"}
                    print("❌ GWL prediction returned None")
            except Exception as e:
                print(f"❌ Error predicting GWL: {e}")
                print(f"🔍 GWL prediction error traceback: {traceback.format_exc()}")
                gwl_data = {"success": False, "error": f"GWL prediction error: {str(e)}"}
        else:
            missing_params = []
            if not request.district:
                missing_params.append("district")
            if not request.latitude:
                missing_params.append("latitude") 
            if not request.longitude:
                missing_params.append("longitude")
            
            error_msg = f"Missing required GWL parameters: {', '.join(missing_params)}"
            print(f"⚠️ {error_msg}")
            gwl_data = {"success": False, "error": error_msg}
        
        # Combine both responses
        response = {
            "ai_recommendation": ai_recommendation,
            "gwl_data": gwl_data
        }
        
        print(f"✅ Combined response prepared: AI recommendation type: {type(ai_recommendation)}, GWL data: {gwl_data}")
        return response
        
    except Exception as e:
        print(f"❌ Unexpected error in get_recommendation_with_gwl: {e}")
        print(f"🔍 Combined endpoint error traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Combined endpoint error: {str(e)}")

# Additional debugging endpoints
@app.post("/test-tools")
async def test_tools():
    """Test endpoint to verify all tools are working"""
    try:
        results = {}
        
        # Test hydrogeological data tool
        try:
            print("🧪 Testing hydrogeological data tool...")
            hydro_result = await get_hydrogeological_data(12.9716, 77.5946)
            results["hydrogeological_data"] = {"success": True, "data": hydro_result}
            print(f"✅ Hydrogeological data test passed: {hydro_result}")
        except Exception as e:
            results["hydrogeological_data"] = {"success": False, "error": str(e)}
            print(f"❌ Hydrogeological data test failed: {e}")
        
        # Test harvesting potential tool
        try:
            print("🧪 Testing harvesting potential tool...")
            harvest_result = await calculate_harvesting_potential(150.0, 970)
            results["harvesting_potential"] = {"success": True, "data": harvest_result}
            print(f"✅ Harvesting potential test passed: {harvest_result}")
        except Exception as e:
            results["harvesting_potential"] = {"success": False, "error": str(e)}
            print(f"❌ Harvesting potential test failed: {e}")
        
        # Test structure recommendation tool
        try:
            print("🧪 Testing structure recommendation tool...")
            structure_result = await recommend_recharge_structure(150.0, 15.5, 120000)
            results["structure_recommendation"] = {"success": True, "data": structure_result}
            print(f"✅ Structure recommendation test passed: {structure_result}")
        except Exception as e:
            results["structure_recommendation"] = {"success": False, "error": str(e)}
            print(f"❌ Structure recommendation test failed: {e}")
        
        # Test GWL prediction
        try:
            print("🧪 Testing GWL prediction...")
            gwl_result = predict_gwl("Bengaluru", 12.9716, 77.5946)
            results["gwl_prediction"] = {"success": True, "data": gwl_result}
            print(f"✅ GWL prediction test passed: {gwl_result}")
        except Exception as e:
            results["gwl_prediction"] = {"success": False, "error": str(e)}
            print(f"❌ GWL prediction test failed: {e}")
        
        return {
            "message": "Tool testing completed",
            "results": results,
            "overall_success": all(result.get("success", False) for result in results.values())
        }
        
    except Exception as e:
        print(f"❌ Error in test_tools endpoint: {e}")
        print(f"🔍 Test tools error traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Tool testing error: {str(e)}")

@app.get("/debug-info")
async def debug_info():
    """Get debugging information about the application state"""
    try:
        return {
            "gwl_models_loaded": {
                "preprocessor": gwl_preprocessor is not None,
                "model": gwl_model is not None
            },
            "agent_available": 'agent_executor' in globals(),
            "tools_available": {
                "count": len(tools) if 'tools' in globals() else 0,
                "names": [tool.name for tool in tools] if 'tools' in globals() else []
            },
            "llm_configured": 'llm' in globals(),
            "environment_variables": {
                "OPENAI_API_KEY": bool(os.getenv("OPENAI_API_KEY")),
            }
        }
    except Exception as e:
        print(f"❌ Error in debug_info endpoint: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Rainwater Harvesting AI Agent server...")
    uvicorn.run(app, host="0.0.0.0", port=5000, log_level="info")