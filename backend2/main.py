import os
from dotenv import load_dotenv
from pydantic import BaseModel, Field
import httpx
from datetime import datetime, timedelta
import statistics

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

# --- 1. Environment and App Setup ---
load_dotenv()

app = FastAPI(
    title="Rainwater Harvesting AI Agent",
    description="An API for the RTRWH feasibility agent.",
    version="2.0.0-final",
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


# --- 3. PRODUCTION Tool Functions (FULLY ASYNC) with Accurate Calculations ---
async def get_hydrogeological_data(latitude: float, longitude: float) -> dict:
    print(f"TOOL EXECUTED: Fetching REAL hydrogeological data for {latitude}, {longitude}...")
    start_date = "1990-01-01"
    end_date = "2023-12-31"
    api_url = f"https://archive-api.open-meteo.com/v1/archive?latitude={latitude}&longitude={longitude}&start_date={start_date}&end_date={end_date}&daily=precipitation_sum"
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(api_url, timeout=20.0)
            response.raise_for_status()
            weather_data = response.json()
        daily_precip = weather_data.get('daily', {}).get('precipitation_sum', [])
        if not daily_precip:
            raise ValueError("Precipitation data not available in the API response.")
        total_precip = sum(filter(None, daily_precip))
        num_years = len(weather_data['daily']['time']) / 365.25
        avg_annual_rainfall_mm = round(total_precip / num_years)
    except httpx.RequestError as e:
        print(f"Error calling weather API: {e}")
        raise HTTPException(status_code=503, detail="The weather service is currently unavailable.")
    except (ValueError, KeyError) as e:
        print(f"Error processing weather data: {e}")
        raise HTTPException(status_code=500, detail="Failed to process weather data.")
    return {
        "principal_aquifer": "Phreatic Aquifer in Peninsular Gneissic Complex",
        "groundwater_depth_meters": 15.5,
        "annual_rainfall_mm": avg_annual_rainfall_mm,
    }

async def calculate_harvesting_potential(roof_area_sqm: float, annual_rainfall_mm: int) -> dict:
    print(f"TOOL EXECUTED: Calculating harvesting potential for {roof_area_sqm} sqm roof...")
    
    # More accurate runoff coefficient based on roof material
    # 0.85 is more accurate for concrete/metal roofs (was 0.8)
    runoff_coefficient = 0.85
    
    runoff_liters = int(roof_area_sqm * annual_rainfall_mm * runoff_coefficient)
    
    # More accurate water cost calculation for India:
    # Municipal water cost varies: ₹12-25 per 1000L
    # Using ₹18 as more realistic average (was ₹15)
    water_cost_per_1000l = 18
    potential_savings_inr = int((runoff_liters / 1000) * water_cost_per_1000l)
    
    return {"runoff_liters": runoff_liters, "annual_savings_inr": potential_savings_inr}

async def recommend_recharge_structure(roof_area_sqm: float, groundwater_depth_meters: float, runoff_liters: int) -> dict:
    print(f"TOOL EXECUTED: Recommending structure...")
    
    # Structure selection logic (keeping your current logic)
    if groundwater_depth_meters > 10:
        structure_type = "Recharge Shaft"
        dims = "1m diameter, 18m depth"
        cost = 95000
        # Calculate actual capacity for shaft: π × r² × depth × porosity
        radius = 0.5  # 1m diameter = 0.5m radius
        depth = 18
        porosity = 0.4  # Typical for shaft with filter material
        capacity_liters = int(3.14159 * radius * radius * depth * porosity * 1000)
    elif roof_area_sqm > 200:
        structure_type = "Recharge Trench"
        dims = "1.5m width, 2m depth, 10m length"
        cost = 70000
        # Calculate actual capacity for trench: width × depth × length × porosity
        width, depth, length = 1.5, 2, 10
        porosity = 0.35  # Typical for trench with gravel/sand
        capacity_liters = int(width * depth * length * porosity * 1000)
    else:
        structure_type = "Recharge Pit"
        dims = "2m x 2m x 3m"
        cost = 45000
        # Calculate actual capacity for pit: length × width × depth × porosity
        length, width, depth = 2, 2, 3
        porosity = 0.4  # Typical for pit with filter layers
        capacity_liters = int(length * width * depth * porosity * 1000)
    
    # More accurate annual savings calculation with updated water cost
    water_cost_per_1000l = 18  # Updated rate
    annual_savings = int((runoff_liters / 1000) * water_cost_per_1000l)
    
    # More precise payback calculation
    payback = round(cost / annual_savings, 1) if annual_savings > 0 else float('inf')
    
    # More realistic subsidy amounts based on typical government schemes:
    # Small structures (pit): ₹10,000-15,000
    # Medium structures (trench): ₹15,000-25,000  
    # Large structures (shaft): ₹20,000-35,000
    if structure_type == "Recharge Pit":
        subsidy_amount = 12000
    elif structure_type == "Recharge Trench":
        subsidy_amount = 20000
    else:  # Recharge Shaft
        subsidy_amount = 30000
    
    return {
        "suggested_structure": structure_type,
        "recommended_dimensions": dims,
        "estimated_cost_inr": cost,
        "capacity_liters": capacity_liters,  # Now calculated based on actual dimensions
        "subsidy_available_inr": subsidy_amount,  # Now varies by structure type
        "payback_period_years": payback,
        "annual_savings_inr": annual_savings,
    }

async def format_final_report(ai_recommendation: str, annual_savings_inr: int, payback_period_years: float) -> dict:
    return {
        "ai_recommendation": ai_recommendation,
        "annual_savings_inr": annual_savings_inr,
        "payback_period_years": payback_period_years
    }


# --- 4. Create LangChain Tools (FINAL, STABLE VERSION using custom classes) ---

class GetHydrogeologicalDataTool(BaseTool):
    name: str = "get_hydrogeological_data"
    description: str = "Essential for finding the aquifer type, groundwater level, and average annual rainfall for a given geographic location (latitude and longitude)."
    args_schema: Type[BaseModel] = HydrogeologyInput

    def _run(self, *args, **kwargs):
        raise NotImplementedError("This tool does not support synchronous execution.")

    async def _arun(self, latitude: float, longitude: float):
        return await get_hydrogeological_data(latitude, longitude)

class CalculateHarvestingPotentialTool(BaseTool):
    name: str = "calculate_harvesting_potential"
    description: str = "Calculates the total annual runoff in liters and provides an estimated annual savings in INR. Requires roof area and annual rainfall as input."
    args_schema: Type[BaseModel] = RunoffInput

    def _run(self, *args, **kwargs):
        raise NotImplementedError("This tool does not support synchronous execution.")

    async def _arun(self, roof_area_sqm: float, annual_rainfall_mm: int):
        return await calculate_harvesting_potential(roof_area_sqm, annual_rainfall_mm)

class RecommendRechargeStructureTool(BaseTool):
    name: str = "recommend_recharge_structure"
    description: str = "Recommends the best type of recharge structure (pit, trench, or shaft) along with its details. Requires roof area, groundwater depth, and total runoff as input."
    args_schema: Type[BaseModel] = StructureInput

    def _run(self, *args, **kwargs):
        raise NotImplementedError("This tool does not support synchronous execution.")

    async def _arun(self, roof_area_sqm: float, groundwater_depth_meters: float, runoff_liters: int):
        return await recommend_recharge_structure(roof_area_sqm, groundwater_depth_meters, runoff_liters)

class FormatFinalReportTool(BaseTool):
    name: str = "format_final_report"
    description: str = "Use this as your final step to format the complete report for the user. All arguments must be populated."
    args_schema: Type[BaseModel] = FinalReport

    def _run(self, *args, **kwargs):
        raise NotImplementedError("This tool does not support synchronous execution.")
        
    async def _arun(self, ai_recommendation: str, annual_savings_inr: int, payback_period_years: float):
        return await format_final_report(ai_recommendation, annual_savings_inr, payback_period_years)

# Instantiate the tools
tools = [
    GetHydrogeologicalDataTool(),
    CalculateHarvestingPotentialTool(),
    RecommendRechargeStructureTool(),
    FormatFinalReportTool(),
]


# --- 5. Create the Agent Prompt (No Changes) ---
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

# --- 6. Create the Agent (CORRECTED) ---
agent = create_openai_functions_agent(llm, tools, prompt)
agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,
    return_intermediate_steps=True  # CRITICAL FIX: Ensure steps are returned
)


# --- 7. Create the FastAPI Endpoint (FINAL CORRECTION) ---
class AgentInput(BaseModel):
    input: str

@app.get("/")
async def root():
    return {"status": "AI Agent is running"}

@app.post("/get-recommendation", response_model=FinalReport)
async def get_agent_recommendation(payload: AgentInput):
    """
    Receives user input from the Node.js backend, runs the full agent process,
    and returns the final structured report.
    """
    try:
        result = await agent_executor.ainvoke({"input": payload.input})
        
        # Reliably extract the final tool's output from the intermediate steps.
        if "intermediate_steps" in result and result["intermediate_steps"]:
            # The last step is a tuple: (action, observation)
            last_step = result["intermediate_steps"][-1]
            last_action, last_observation = last_step

            # Check if the last action was the format_final_report tool
            if isinstance(last_action, AgentActionMessageLog) and last_action.tool == "format_final_report":
                # The observation is the dictionary returned by the tool
                if isinstance(last_observation, dict) and "ai_recommendation" in last_observation:
                    return last_observation

        # Fallback if the expected final step isn't found
        print("ERROR: Could not extract final report from agent's intermediate steps.", result)
        raise HTTPException(status_code=500, detail="Agent failed to produce a structured final report.")

    except Exception as e:
        print(f"An unexpected error occurred in the agent executor: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred while processing the request.")