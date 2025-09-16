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

# Global variables for models and agent data storage
gwl_preprocessor = None
gwl_model = None
agent_data_store = {}  # Store data between tool calls

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

# --- 2. Pydantic Models ---
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
    """The final structured report for the user."""
    ai_recommendation: str = Field(description="A detailed, user-friendly recommendation paragraph.")
    annual_savings_inr: int = Field(description="The estimated total annual savings in Indian Rupees.")
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
        print("ℹ️  Application will continue without GWL prediction functionality.")
        return False

def predict_gwl(district: str, latitude: float, longitude: float):
    """Predict groundwater level with improved error handling"""
    try:
        print(f"🔍 Predicting GWL for {district} at ({latitude}, {longitude})")
        
        if gwl_preprocessor is None or gwl_model is None:
            print("⚠️  GWL models not available, using fallback calculation")
            if 8 <= latitude <= 20:  # Southern India
                fallback_gwl = 15.5
            elif 20 <= latitude <= 28:  # Central India
                fallback_gwl = 12.0
            elif 28 <= latitude <= 35:  # Northern India
                fallback_gwl = 8.5
            else:
                fallback_gwl = 12.0
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

        # Preprocess and predict
        input_data_processed = gwl_preprocessor.transform(input_data)
        prediction = gwl_model.predict(input_data_processed)
        
        predicted_gwl = float(prediction[0])
        print(f"✅ Predicted GWL: {predicted_gwl} mbgl")
        return predicted_gwl
        
    except Exception as e:
        print(f"❌ Error in GWL prediction: {e}")
        # Fallback calculation
        if 8 <= latitude <= 20:
            fallback_gwl = 15.5
        elif 20 <= latitude <= 28:
            fallback_gwl = 12.0
        elif 28 <= latitude <= 35:
            fallback_gwl = 8.5
        else:
            fallback_gwl = 12.0
        return fallback_gwl

# --- 3. Enhanced Tool Functions ---
async def get_hydrogeological_data(latitude: float, longitude: float) -> dict:
    print(f"🌍 TOOL EXECUTED: Fetching hydrogeological data for ({latitude}, {longitude})")
    start_date = "1990-01-01"
    end_date = "2023-12-31"
    api_url = f"https://archive-api.open-meteo.com/v1/archive?latitude={latitude}&longitude={longitude}&start_date={start_date}&end_date={end_date}&daily=precipitation_sum"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(api_url, timeout=30.0)
            response.raise_for_status()
            weather_data = response.json()
            
        daily_precip = weather_data.get('daily', {}).get('precipitation_sum', [])
        if not daily_precip:
            avg_annual_rainfall_mm = 970  # Bengaluru average
        else:
            valid_precip = [p for p in daily_precip if p is not None]
            total_precip = sum(valid_precip)
            num_years = len(weather_data['daily']['time']) / 365.25
            avg_annual_rainfall_mm = round(total_precip / num_years) if num_years > 0 else 970
            
    except Exception as e:
        print(f"❌ Weather API error: {e}")
        avg_annual_rainfall_mm = 970
    
    # Use GWL prediction for groundwater depth
    try:
        gwl_depth = predict_gwl("Bengaluru", latitude, longitude)
    except Exception as e:
        gwl_depth = 15.5
    
    result = {
        "principal_aquifer": "Phreatic Aquifer in Peninsular Gneissic Complex",
        "groundwater_depth_meters": gwl_depth,
        "annual_rainfall_mm": avg_annual_rainfall_mm,
    }
    
    # Store in agent data store
    agent_data_store['environmental_data'] = result
    
    print(f"✅ Hydrogeological data result: {result}")
    return result

async def calculate_harvesting_potential(roof_area_sqm: float, annual_rainfall_mm: int) -> dict:
    print(f"💧 TOOL EXECUTED: Calculating harvesting potential for {roof_area_sqm} sqm roof with {annual_rainfall_mm}mm rainfall")
    
    try:
        runoff_coefficient = 0.85
        runoff_liters = int(roof_area_sqm * annual_rainfall_mm * runoff_coefficient)
        
        water_cost_per_1000l = 18
        potential_savings_inr = int((runoff_liters / 1000) * water_cost_per_1000l)
        
        result = {"runoff_liters": runoff_liters, "annual_savings_inr": potential_savings_inr}
        
        # Store in agent data store
        agent_data_store['harvesting_data'] = result
        
        print(f"✅ Harvesting potential result: {result}")
        return result
        
    except Exception as e:
        print(f"❌ Error calculating harvesting potential: {e}")
        return {"runoff_liters": 50000, "annual_savings_inr": 900}

async def recommend_recharge_structure(roof_area_sqm: float, groundwater_depth_meters: float, runoff_liters: int) -> dict:
    print(f"🏗️ TOOL EXECUTED: Recommending structure for {roof_area_sqm}sqm roof, {groundwater_depth_meters}m GWL depth, {runoff_liters}L runoff")
    
    try:
        # Structure selection logic
        if groundwater_depth_meters > 10:
            structure_type = "Recharge Shaft"
            dims = "1m diameter, 18m depth"
            cost = 95000
            radius = 0.5
            depth = 18
            porosity = 0.4
            capacity_liters = int(3.14159 * radius * radius * depth * porosity * 1000)
            subsidy_amount = 30000
        elif roof_area_sqm > 200:
            structure_type = "Recharge Trench"
            dims = "1.5m width, 2m depth, 10m length"
            cost = 70000
            width, depth, length = 1.5, 2, 10
            porosity = 0.35
            capacity_liters = int(width * depth * length * porosity * 1000)
            subsidy_amount = 20000
        else:
            structure_type = "Recharge Pit"
            dims = "2m x 2m x 3m"
            cost = 45000
            length, width, depth = 2, 2, 3
            porosity = 0.4
            capacity_liters = int(length * width * depth * porosity * 1000)
            subsidy_amount = 12000
        
        water_cost_per_1000l = 18
        annual_savings = int((runoff_liters / 1000) * water_cost_per_1000l)
        payback = round(cost / annual_savings, 1) if annual_savings > 0 else float('inf')
        
        result = {
            "suggested_structure": structure_type,
            "recommended_dimensions": dims,
            "estimated_cost_inr": cost,
            "capacity_liters": capacity_liters,
            "subsidy_available_inr": subsidy_amount,
            "payback_period_years": payback,
            "annual_savings_inr": annual_savings,
        }
        
        # Store in agent data store
        agent_data_store['structure_data'] = result
        
        print(f"✅ Structure recommendation result: {result}")
        return result
        
    except Exception as e:
        print(f"❌ Error recommending structure: {e}")
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
    
    # Get stored data from previous tools
    environmental_data = agent_data_store.get('environmental_data', {})
    harvesting_data = agent_data_store.get('harvesting_data', {})
    structure_data = agent_data_store.get('structure_data', {})
    
    result = {
        "ai_recommendation": ai_recommendation,
        "annual_savings_inr": annual_savings_inr,
        "payback_period_years": payback_period_years,
        "structure_data": structure_data,
        "environmental_data": {
            "annual_rainfall_mm": environmental_data.get("annual_rainfall_mm", 0),
            "runoff_liters": harvesting_data.get("runoff_liters", 0)
        }
    }
    
    print(f"✅ Final report formatted: {result}")
    return result

# --- 4. Create LangChain Tools ---
class GetHydrogeologicalDataTool(BaseTool):
    name: str = "get_hydrogeological_data"
    description: str = "Essential for finding the aquifer type, groundwater level, and average annual rainfall for a given geographic location."
    args_schema: Type[BaseModel] = HydrogeologyInput

    def _run(self, *args, **kwargs):
        raise NotImplementedError("This tool does not support synchronous execution.")

    async def _arun(self, latitude: float, longitude: float):
        try:
            result = await get_hydrogeological_data(latitude, longitude)
            return result
        except Exception as e:
            print(f"❌ Error in GetHydrogeologicalDataTool: {e}")
            raise

class CalculateHarvestingPotentialTool(BaseTool):
    name: str = "calculate_harvesting_potential"
    description: str = "Calculates the total annual runoff in liters and provides an estimated annual savings in INR."
    args_schema: Type[BaseModel] = RunoffInput

    def _run(self, *args, **kwargs):
        raise NotImplementedError("This tool does not support synchronous execution.")

    async def _arun(self, roof_area_sqm: float, annual_rainfall_mm: int):
        try:
            result = await calculate_harvesting_potential(roof_area_sqm, annual_rainfall_mm)
            return result
        except Exception as e:
            print(f"❌ Error in CalculateHarvestingPotentialTool: {e}")
            raise

class RecommendRechargeStructureTool(BaseTool):
    name: str = "recommend_recharge_structure"
    description: str = "Recommends the best type of recharge structure with details."
    args_schema: Type[BaseModel] = StructureInput

    def _run(self, *args, **kwargs):
        raise NotImplementedError("This tool does not support synchronous execution.")

    async def _arun(self, roof_area_sqm: float, groundwater_depth_meters: float, runoff_liters: int):
        try:
            result = await recommend_recharge_structure(roof_area_sqm, groundwater_depth_meters, runoff_liters)
            return result
        except Exception as e:
            print(f"❌ Error in RecommendRechargeStructureTool: {e}")
            raise

class FormatFinalReportTool(BaseTool):
    name: str = "format_final_report"
    description: str = "Use this as your final step to format the complete report for the user."
    args_schema: Type[BaseModel] = FinalReport

    def _run(self, *args, **kwargs):
        raise NotImplementedError("This tool does not support synchronous execution.")
        
    async def _arun(self, ai_recommendation: str, annual_savings_inr: int, payback_period_years: float):
        try:
            result = await format_final_report(ai_recommendation, annual_savings_inr, payback_period_years)
            return result
        except Exception as e:
            print(f"❌ Error in FormatFinalReportTool: {e}")
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
1. First, use the `get_hydrogeological_data` tool to find the essential environmental data.
2. Second, use the `calculate_harvesting_potential` tool with the roof area and rainfall data.
3. Third, use the `recommend_recharge_structure` tool to get the final recommendations.
4. Finally, you MUST use the `format_final_report` tool as your final action.

When creating the `ai_recommendation` text, synthesize the data you have gathered into a friendly, human-readable paragraph. Start with the recommended structure, explain why it was chosen (citing data like rainfall and groundwater depth), and include the cost, capacity, and any available subsidy.
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

# --- 7. FastAPI Endpoints ---

@app.get("/")
async def root():
    return {
        "status": "AI Agent is running",
        "gwl_models_loaded": gwl_preprocessor is not None and gwl_model is not None,
        "version": "2.0.0-enhanced"
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
    """Standalone GWL prediction endpoint"""
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
        raise HTTPException(status_code=500, detail=f"GWL prediction error: {str(e)}")

@app.post("/get-recommendation", response_model=FinalReport)
async def get_agent_recommendation(payload: AgentInput):
    """Receives user input and runs the full agent process"""
    try:
        print(f"🤖 Agent recommendation request: {payload.input}")
        
        # Clear previous agent data
        global agent_data_store
        agent_data_store.clear()
        
        if 'agent_executor' not in globals():
            print("❌ Agent executor not available")
            raise HTTPException(status_code=500, detail="Agent not properly initialized")
        
        result = await agent_executor.ainvoke({"input": payload.input})
        print(f"🤖 Agent execution result keys: {result.keys()}")
        
        # Extract the final tool's output from intermediate steps
        if "intermediate_steps" in result and result["intermediate_steps"]:
            print(f"🔍 Found {len(result['intermediate_steps'])} intermediate steps")
            
            last_step = result["intermediate_steps"][-1]
            last_action, last_observation = last_step
            
            if isinstance(last_action, AgentActionMessageLog) and last_action.tool == "format_final_report":
                if isinstance(last_observation, dict) and "ai_recommendation" in last_observation:
                    final_report = FinalReport(**last_observation)
                    print(f"✅ Successfully created final report: {final_report}")
                    return final_report

        # Fallback response
        print("⚠️ Could not extract final report from agent's intermediate steps")
        fallback_response = FinalReport(
            ai_recommendation=result.get("output", "Unable to generate detailed recommendation due to processing error."),
            annual_savings_inr=0,
            payback_period_years=0.0
        )
        return fallback_response

    except Exception as e:
        print(f"❌ Unexpected error in agent executor: {e}")
        raise HTTPException(status_code=500, detail=f"Agent processing error: {str(e)}")

@app.post("/get-recommendation-with-gwl")
async def get_recommendation_with_gwl(request: CombinedRequest):
    """Enhanced endpoint that returns both AI recommendation and GWL with structured data"""
    try:
        print(f"🔄 Combined request received: {request}")
        
        # Clear previous agent data
        global agent_data_store
        agent_data_store.clear()
        
        # Get AI recommendation using the agent executor
        ai_recommendation = None
        if request.input:
            try:
                print("🤖 Starting agent execution...")
                
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

                    if isinstance(last_action, AgentActionMessageLog) and last_action.tool == "format_final_report":
                        if isinstance(last_observation, dict):
                            ai_recommendation = last_observation
                            print(f"✅ Extracted structured AI recommendation: {ai_recommendation}")
                
                # Fallback to the agent's output if structured report not found
                if not ai_recommendation:
                    print("⚠️ Using fallback AI recommendation")
                    ai_recommendation = {
                        "ai_recommendation": result.get("output", "Unable to generate recommendation"),
                        "annual_savings_inr": 0,
                        "payback_period_years": 0.0,
                        "structure_data": {},
                        "environmental_data": {}
                    }
                    
            except Exception as e:
                print(f"❌ Error getting AI recommendation: {e}")
                ai_recommendation = {
                    "ai_recommendation": f"Error generating recommendation: {str(e)}",
                    "annual_savings_inr": 0,
                    "payback_period_years": 0.0,
                    "structure_data": {},
                    "environmental_data": {}
                }
        else:
            print("⚠️ No input provided for AI recommendation")
            ai_recommendation = {
                "ai_recommendation": "No input provided for recommendation",
                "annual_savings_inr": 0,
                "payback_period_years": 0.0,
                "structure_data": {},
                "environmental_data": {}
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
            except Exception as e:
                print(f"❌ Error predicting GWL: {e}")
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
        
        print(f"✅ Combined response prepared successfully")
        return response
        
    except Exception as e:
        print(f"❌ Unexpected error in get_recommendation_with_gwl: {e}")
        raise HTTPException(status_code=500, detail=f"Combined endpoint error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Rainwater Harvesting AI Agent server...")
    uvicorn.run(app, host="0.0.0.0", port=5000, log_level="info")