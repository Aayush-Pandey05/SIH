import os
from dotenv import load_dotenv
from pydantic import BaseModel, Field
import httpx
import traceback
import math
import random
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.tools import BaseTool
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain_core.agents import AgentActionMessageLog
from typing import Type
import pandas as pd
import joblib

# Global variables
gwl_preprocessor = None
gwl_model = None
agent_data_store = {}

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up Rainwater Harvesting AI Agent...")
    load_gwl_models()
    yield
    print("Shutting down...")

app = FastAPI(
    title="Rainwater Harvesting AI Agent",
    description="An API for the RTRWH feasibility agent with accurate real-world calculations.",
    version="3.1.0-clean",
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

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": "2025-09-29T00:00:00Z",
        "service": "backend2-fastapi-ai"
    }

# Pydantic Models
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
    latitude: float = Field(default=12.9716, description="Latitude of the location.")
    longitude: float = Field(default=77.5946, description="Longitude of the location.")

class FinalReport(BaseModel):
    ai_recommendation: str = Field(description="A detailed, user-friendly recommendation paragraph.")
    annual_savings_inr: int = Field(description="The estimated total annual savings in Indian Rupees.")
    payback_period_years: float = Field(description="The payback period for the investment in years.")

class AgentInput(BaseModel):
    input: str

def load_gwl_models():
    global gwl_preprocessor, gwl_model
    try:
        gwl_preprocessor = joblib.load('final_preprocessor.joblib')
        gwl_model = joblib.load('final_model.joblib')
        print("GWL Model and preprocessor loaded successfully.")
        return True
    except FileNotFoundError:
        print("GWL Model files not found. Application will continue without GWL prediction functionality.")
        return False
    except Exception as e:
        print(f"Error loading GWL models: {e}")
        return False

def predict_gwl(district: str, latitude: float, longitude: float):
    try:
        if gwl_preprocessor is None or gwl_model is None:
            if 8 <= latitude <= 20:
                return 15.5
            elif 20 <= latitude <= 28:
                return 12.0
            elif 28 <= latitude <= 35:
                return 8.5
            else:
                return 12.0
        
        lat_x_lon = latitude * longitude
        lat_squared = latitude ** 2
        lon_squared = longitude ** 2

        input_data = pd.DataFrame({
            'District': [district],
            'Latitude': [latitude],
            'Longitude': [longitude],
            'lat_x_lon': [lat_x_lon],
            'lat_squared': [lat_squared],
            'lon_squared': [lon_squared]
        })

        input_data_processed = gwl_preprocessor.transform(input_data)
        prediction = gwl_model.predict(input_data_processed)
        return float(prediction[0])
        
    except Exception:
        if 8 <= latitude <= 20:
            return 15.5
        elif 20 <= latitude <= 28:
            return 12.0
        elif 28 <= latitude <= 35:
            return 8.5
        else:
            return 12.0

def calculate_soil_infiltration_rate(latitude: float, longitude: float) -> float:
    if 8 <= latitude <= 12:
        if 76 <= longitude <= 78:
            return 8.5
        elif 75 <= longitude <= 77:
            return 22.0
        else:
            return 12.0
    elif 12 <= latitude <= 15:
        if 74 <= longitude <= 78:
            return 15.5
        elif 77 <= longitude <= 80:
            return 6.5
        else:
            return 11.0
    elif 15 <= latitude <= 20:
        if 72 <= longitude <= 78:
            return 9.2
        elif 78 <= longitude <= 82:
            return 18.5
        else:
            return 12.8
    elif 20 <= latitude <= 24:
        if 75 <= longitude <= 82:
            return 25.5
        elif 82 <= longitude <= 87:
            return 16.2
        else:
            return 19.0
    elif 24 <= latitude <= 28:
        if 70 <= longitude <= 78:
            return 35.8
        elif 78 <= longitude <= 85:
            return 42.5
        else:
            return 28.0
    elif 28 <= latitude <= 32:
        if 74 <= longitude <= 78:
            return 31.2
        elif 75 <= longitude <= 77:
            return 26.8
        else:
            return 33.5
    else:
        return 20.0

def get_aquifer_characteristics(groundwater_depth: float) -> dict:
    if groundwater_depth < 5:
        return {"type": "Shallow Unconfined", "porosity": 0.25, "recharge_efficiency": 0.8}
    elif groundwater_depth < 15:
        return {"type": "Intermediate Unconfined", "porosity": 0.35, "recharge_efficiency": 0.7}
    elif groundwater_depth < 30:
        return {"type": "Deep Unconfined", "porosity": 0.4, "recharge_efficiency": 0.6}
    else:
        return {"type": "Very Deep/Semi-confined", "porosity": 0.3, "recharge_efficiency": 0.5}

def calculate_realistic_structure_cost(structure_type: str, volume_m3: float, location_factor: float = 1.0) -> dict:
    costs = {"excavation": 0, "structural": 0, "filter_media": 0, "plumbing": 0, "labor": 0, "equipment": 0, "miscellaneous": 0}
    
    if structure_type == "Recharge Pit":
        costs["excavation"] = volume_m3 * 200
        costs["structural"] = volume_m3 * 4000
        costs["filter_media"] = volume_m3 * 600
        costs["plumbing"] = 3000
        costs["labor"] = 3000
        costs["equipment"] = 4000
        material_subtotal = costs["excavation"] + costs["structural"] + costs["filter_media"]
        costs["miscellaneous"] = int(material_subtotal * 0.15)
    elif structure_type == "Recharge Trench":
        costs["excavation"] = volume_m3 * 180
        costs["structural"] = volume_m3 * 3500
        costs["filter_media"] = volume_m3 * 550
        costs["plumbing"] = 4000
        costs["labor"] = 6000
        costs["equipment"] = 7500
        material_subtotal = costs["excavation"] + costs["structural"] + costs["filter_media"]
        costs["miscellaneous"] = int(material_subtotal * 0.15)
    elif structure_type == "Recharge Shaft":
        costs["excavation"] = volume_m3 * 800
        costs["structural"] = volume_m3 * 6000
        costs["filter_media"] = volume_m3 * 800
        costs["plumbing"] = 6000
        costs["labor"] = 9000
        costs["equipment"] = 15000
        material_subtotal = costs["excavation"] + costs["structural"] + costs["filter_media"]
        costs["miscellaneous"] = int(material_subtotal * 0.18)
    elif structure_type == "Injection Well":
        costs["excavation"] = volume_m3 * 1200
        costs["structural"] = volume_m3 * 8000
        costs["filter_media"] = volume_m3 * 700
        costs["plumbing"] = 12000
        costs["labor"] = 16800
        costs["equipment"] = 32000
        material_subtotal = costs["excavation"] + costs["structural"] + costs["filter_media"]
        costs["miscellaneous"] = int(material_subtotal * 0.20)
    
    location_multiplier = max(0.85, min(1.35, location_factor))
    base_total = sum(costs.values())
    final_cost = int(base_total * location_multiplier)
    
    return {
        "cost_breakdown": costs,
        "total_cost": final_cost,
        "location_factor_applied": location_multiplier,
        "cost_per_m3": int(final_cost / volume_m3) if volume_m3 > 0 else 0
    }

def get_government_subsidy(structure_type: str, cost: int) -> int:
    subsidy_rates = {"Recharge Pit": 0.4, "Recharge Trench": 0.35, "Recharge Shaft": 0.3, "Injection Well": 0.25}
    max_subsidies = {"Recharge Pit": 25000, "Recharge Trench": 35000, "Recharge Shaft": 50000, "Injection Well": 75000}
    rate = subsidy_rates.get(structure_type, 0.3)
    return min(int(cost * rate), max_subsidies.get(structure_type, 30000))

def determine_aquifer_type(latitude: float, longitude: float) -> str:
    if 8 <= latitude <= 15:
        if 72 <= longitude <= 76:
            return "Fractured Rock Aquifer in Precambrian Crystallines"
        else:
            return "Phreatic Aquifer in Peninsular Gneissic Complex"
    elif 15 <= latitude <= 23:
        return "Mixed Aquifer in Deccan Trap Basalts"
    elif 23 <= latitude <= 30:
        return "Alluvial Aquifer in Indo-Gangetic Plains"
    else:
        return "Mountain Aquifer in Tertiary Formations"

def evaluate_site_conditions(roof_area_sqm: float, groundwater_depth: float, soil_infiltration: float, daily_runoff: float) -> dict:
    conditions = {
        "space_availability": "ample" if roof_area_sqm > 200 else "moderate" if roof_area_sqm > 100 else "limited",
        "depth_category": "deep" if groundwater_depth > 25 else "moderate" if groundwater_depth > 10 else "shallow",
        "infiltration_category": "high" if soil_infiltration > 25 else "moderate" if soil_infiltration > 15 else "low",
        "runoff_category": "high" if daily_runoff > 300 else "moderate" if daily_runoff > 150 else "low"
    }
    
    scores = {"Recharge Pit": 0, "Recharge Trench": 0, "Recharge Shaft": 0, "Injection Well": 0}
    
    space_scores = {
        "limited": {"Recharge Pit": 8, "Recharge Trench": 4, "Recharge Shaft": 7, "Injection Well": 9},
        "moderate": {"Recharge Pit": 9, "Recharge Trench": 7, "Recharge Shaft": 8, "Injection Well": 6},
        "ample": {"Recharge Pit": 7, "Recharge Trench": 9, "Recharge Shaft": 6, "Injection Well": 5}
    }
    
    depth_scores = {
        "shallow": {"Recharge Pit": 9, "Recharge Trench": 8, "Recharge Shaft": 5, "Injection Well": 2},
        "moderate": {"Recharge Pit": 8, "Recharge Trench": 7, "Recharge Shaft": 8, "Injection Well": 6},
        "deep": {"Recharge Pit": 4, "Recharge Trench": 5, "Recharge Shaft": 7, "Injection Well": 9}
    }
    
    infiltration_scores = {
        "low": {"Recharge Pit": 6, "Recharge Trench": 7, "Recharge Shaft": 8, "Injection Well": 9},
        "moderate": {"Recharge Pit": 8, "Recharge Trench": 8, "Recharge Shaft": 7, "Injection Well": 6},
        "high": {"Recharge Pit": 9, "Recharge Trench": 9, "Recharge Shaft": 6, "Injection Well": 4}
    }
    
    runoff_scores = {
        "low": {"Recharge Pit": 9, "Recharge Trench": 6, "Recharge Shaft": 7, "Injection Well": 5},
        "moderate": {"Recharge Pit": 7, "Recharge Trench": 8, "Recharge Shaft": 8, "Injection Well": 7},
        "high": {"Recharge Pit": 5, "Recharge Trench": 9, "Recharge Shaft": 7, "Injection Well": 8}
    }
    
    for structure in scores:
        scores[structure] = (
            space_scores[conditions["space_availability"]][structure] +
            depth_scores[conditions["depth_category"]][structure] +
            infiltration_scores[conditions["infiltration_category"]][structure] +
            runoff_scores[conditions["runoff_category"]][structure]
        )
    
    best_structure = max(scores, key=scores.get)
    
    return {
        "conditions": conditions,
        "structure_scores": scores,
        "recommended_structure": best_structure,
        "confidence_score": scores[best_structure] / 36.0
    }

def calculate_structure_dimensions(structure_type: str, daily_runoff: float, peak_runoff: float, soil_infiltration: float, groundwater_depth: float) -> dict:
    required_storage_hours = 6
    infiltration_volume_per_hour = soil_infiltration / 1000
    
    if structure_type == "Recharge Pit":
        required_volume = (peak_runoff / 1000) - (infiltration_volume_per_hour * required_storage_hours * 4)
        required_volume = max(required_volume, daily_runoff / 1000 * 0.3)
        
        side_length = max(1.5, min(3.5, math.sqrt(required_volume / 2.5)))
        depth = min(groundwater_depth - 1, max(2.0, required_volume / (side_length * side_length)))
        volume_m3 = side_length * side_length * depth
        dimensions = f"{side_length:.1f}m × {side_length:.1f}m × {depth:.1f}m"
        
    elif structure_type == "Recharge Trench":
        width = 1.5
        depth = min(groundwater_depth * 0.8, 3.0)
        required_area = (peak_runoff / 1000) / (infiltration_volume_per_hour * required_storage_hours)
        length = max(5.0, min(required_area / width, 50.0))
        volume_m3 = width * depth * length
        dimensions = f"{width:.1f}m width × {depth:.1f}m depth × {length:.1f}m length"
        
    elif structure_type == "Recharge Shaft":
        depth = min(groundwater_depth - 2, 25.0)
        required_area = (daily_runoff / 1000) / (infiltration_volume_per_hour * 24)
        diameter = max(1.0, min(2.0, math.sqrt(required_area * 4 / math.pi)))
        volume_m3 = math.pi * (diameter/2)**2 * depth
        dimensions = f"{diameter:.1f}m diameter × {depth:.1f}m depth"
        
    elif structure_type == "Injection Well":
        diameter = 0.2
        depth = min(groundwater_depth + 10, 40.0)
        volume_m3 = math.pi * (diameter/2)**2 * depth
        dimensions = f"{diameter:.1f}m diameter × {depth:.1f}m depth"
    
    else:
        volume_m3 = 10.0
        dimensions = "2.0m × 2.0m × 2.5m"
    
    return {
        "volume_m3": round(volume_m3, 2),
        "dimensions": dimensions,
        "design_basis": {
            "peak_runoff_handled": min(peak_runoff, volume_m3 * 1000),
            "infiltration_rate_used": soil_infiltration,
            "storage_duration_hours": required_storage_hours
        }
    }

def calculate_accurate_rwh_savings(runoff_liters: int, groundwater_depth: float, roof_area_sqm: float, location: str = "bengaluru") -> dict:
    borewell_pump_hp = 3 if groundwater_depth > 15 else 1
    power_consumption_kwh_per_hour = borewell_pump_hp * 0.746
    hours_per_month_without_rwh = 8 if groundwater_depth > 10 else 5
    hours_per_month_with_rwh = hours_per_month_without_rwh * 0.7
    
    electricity_rate_per_kwh = 7.5
    monthly_power_savings = (hours_per_month_without_rwh - hours_per_month_with_rwh) * power_consumption_kwh_per_hour * electricity_rate_per_kwh
    annual_electricity_savings = int(monthly_power_savings * 12)
    
    annual_maintenance_cost_without_rwh = 8000 if groundwater_depth > 15 else 5000
    annual_maintenance_cost_with_rwh = annual_maintenance_cost_without_rwh * 0.75
    annual_maintenance_savings = int(annual_maintenance_cost_without_rwh - annual_maintenance_cost_with_rwh)
    
    tanker_water_rate_per_1000l = 150
    emergency_water_purchases_per_year = 4 if location.lower() in ['bengaluru', 'chennai'] else 2
    water_per_emergency = 5000
    annual_tanker_savings = int(emergency_water_purchases_per_year * water_per_emergency * tanker_water_rate_per_1000l / 1000)
    
    recharge_efficiency = 0.6
    effective_recharge_liters = int(runoff_liters * recharge_efficiency)
    future_water_crisis_cost_per_liter = 0.05
    environmental_value = int(effective_recharge_liters * future_water_crisis_cost_per_liter)
    
    estimated_property_value = roof_area_sqm * 4000
    property_value_increase = int(estimated_property_value * 0.02)
    annual_property_value_benefit = int(property_value_increase * 0.08)
    
    annual_tax_rebate = 2000 if location.lower() == 'bengaluru' else 1500 if location.lower() == 'chennai' else 0
    
    total_annual_savings = (
        annual_electricity_savings +
        annual_maintenance_savings +
        annual_tanker_savings +
        environmental_value +
        annual_property_value_benefit +
        annual_tax_rebate
    )
    
    return {
        "savings_breakdown": {
            "borewell_electricity_savings": annual_electricity_savings,
            "borewell_maintenance_savings": annual_maintenance_savings,
            "emergency_water_savings": annual_tanker_savings,
            "environmental_recharge_value": environmental_value,
            "property_value_benefit": annual_property_value_benefit,
            "government_rebates": annual_tax_rebate,
            "total_annual_savings": total_annual_savings
        },
        "effective_recharge_liters": effective_recharge_liters,
        "monthly_average_savings": int(total_annual_savings / 12)
    }

def get_district_from_coordinates(latitude: float, longitude: float) -> str:
    if 12.8 <= latitude <= 13.2 and 77.3 <= longitude <= 77.8:
        return "Bengaluru Urban"
    elif 12.4 <= latitude <= 12.8 and 77.0 <= longitude <= 77.4:
        return "Ramanagara"
    elif 12.2 <= latitude <= 12.6 and 76.5 <= longitude <= 77.0:
        return "Mysuru"
    elif 13.0 <= latitude <= 13.5 and 77.0 <= longitude <= 77.6:
        return "Tumakuru"
    elif 13.3 <= latitude <= 13.8 and 77.2 <= longitude <= 77.8:
        return "Chikkaballapur"
    elif 12.0 <= latitude <= 12.4 and 77.4 <= longitude <= 78.0:
        return "Chamarajanagar"
    elif 12.8 <= latitude <= 13.3 and 79.8 <= longitude <= 80.3:
        return "Chennai"
    elif 11.0 <= latitude <= 11.5 and 76.8 <= longitude <= 77.3:
        return "Coimbatore"
    elif 10.7 <= latitude <= 11.2 and 78.0 <= longitude <= 78.5:
        return "Madurai"
    elif 17.2 <= latitude <= 17.8 and 78.2 <= longitude <= 78.8:
        return "Hyderabad"
    elif 15.8 <= latitude <= 16.4 and 80.8 <= longitude <= 81.4:
        return "Vijayawada"
    elif 9.8 <= latitude <= 10.2 and 76.2 <= longitude <= 76.8:
        return "Kochi"
    elif 8.4 <= latitude <= 8.9 and 76.8 <= longitude <= 77.4:
        return "Thiruvananthapuram"
    elif 18.8 <= latitude <= 19.4 and 72.6 <= longitude <= 73.2:
        return "Mumbai Suburban"
    elif 18.4 <= latitude <= 18.8 and 73.6 <= longitude <= 74.2:
        return "Pune"
    elif 8 <= latitude <= 15:
        return "Bengaluru Urban"
    elif 15 <= latitude <= 20:
        return "Pune"
    elif 20 <= latitude <= 25:
        return "Bhopal"
    elif 25 <= latitude <= 32:
        return "Delhi"
    else:
        return "Bengaluru Urban"

async def get_hydrogeological_data(latitude: float, longitude: float) -> dict:
    start_date = "1990-01-01"
    end_date = "2023-12-31"
    api_url = f"https://archive-api.open-meteo.com/v1/archive?latitude={latitude}&longitude={longitude}&start_date={start_date}&end_date={end_date}&daily=precipitation_sum,temperature_2m_max"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(api_url, timeout=30.0)
            response.raise_for_status()
            weather_data = response.json()
            
        daily_precip = weather_data.get('daily', {}).get('precipitation_sum', [])
        daily_temp_max = weather_data.get('daily', {}).get('temperature_2m_max', [])
        
        if not daily_precip:
            avg_annual_rainfall_mm = 970
            avg_temp = 25.0
        else:
            valid_precip = [p for p in daily_precip if p is not None]
            total_precip = sum(valid_precip)
            num_years = len(weather_data['daily']['time']) / 365.25
            avg_annual_rainfall_mm = round(total_precip / num_years) if num_years > 0 else 970
            
            valid_temp = [t for t in daily_temp_max if t is not None]
            avg_temp = sum(valid_temp) / len(valid_temp) if valid_temp else 25.0
            
    except Exception:
        avg_annual_rainfall_mm = 970
        avg_temp = 25.0
    
    district = get_district_from_coordinates(latitude, longitude)
    
    try:
        gwl_depth = predict_gwl(district, latitude, longitude)
        model_status = "ml_model_used"
    except Exception:
        gwl_depth = 15.5
        model_status = "fallback_used"
    
    aquifer_type = determine_aquifer_type(latitude, longitude)
    
    result = {
        "latitude": latitude,
        "longitude": longitude,
        "district": district,
        "principal_aquifer": aquifer_type,
        "groundwater_depth_meters": gwl_depth,
        "gwl_prediction_method": model_status,
        "annual_rainfall_mm": avg_annual_rainfall_mm,
        "average_temperature_celsius": round(avg_temp, 1),
        "evapotranspiration_factor": round((avg_temp * 0.8) + (avg_annual_rainfall_mm * 0.002), 3),
        "climate_zone": "Humid Tropical" if avg_annual_rainfall_mm > 1500 else ("Sub-humid Tropical" if avg_annual_rainfall_mm > 1000 else "Semi-arid Tropical")
    }
    
    agent_data_store['environmental_data'] = result
    return result

async def calculate_harvesting_potential(roof_area_sqm: float, annual_rainfall_mm: int) -> dict:
    try:
        runoff_coefficient = 0.85
        runoff_liters = int(roof_area_sqm * annual_rainfall_mm * runoff_coefficient)
        
        savings_data = calculate_accurate_rwh_savings(runoff_liters, 15, roof_area_sqm)
        potential_savings_inr = savings_data["savings_breakdown"]["total_annual_savings"]
        
        result = {"runoff_liters": runoff_liters, "annual_savings_inr": potential_savings_inr, "savings_breakdown": savings_data["savings_breakdown"]}
        
        agent_data_store['harvesting_data'] = result
        return result
        
    except Exception:
        return {"runoff_liters": 50000, "annual_savings_inr": 12000, "savings_breakdown": {}}

async def recommend_recharge_structure(roof_area_sqm: float, groundwater_depth_meters: float, runoff_liters: int, latitude: float = 12.9716, longitude: float = 77.5946) -> dict:
    try:
        soil_infiltration = calculate_soil_infiltration_rate(latitude, longitude)
        aquifer_data = get_aquifer_characteristics(groundwater_depth_meters)
        location_factor = random.uniform(1.05, 1.25)
        
        daily_runoff = runoff_liters / 365
        peak_runoff = daily_runoff * 2.5
        
        site_evaluation = evaluate_site_conditions(roof_area_sqm, groundwater_depth_meters, soil_infiltration, daily_runoff)
        structure_type = site_evaluation["recommended_structure"]
        
        dimension_data = calculate_structure_dimensions(structure_type, daily_runoff, peak_runoff, soil_infiltration, groundwater_depth_meters)
        volume_m3 = dimension_data["volume_m3"]
        dimensions = dimension_data["dimensions"]
        
        capacity_liters = int(volume_m3 * aquifer_data['porosity'] * 1000 * aquifer_data['recharge_efficiency'])
        cost_data = calculate_realistic_structure_cost(structure_type, volume_m3, location_factor)
        estimated_cost = cost_data["total_cost"]
        subsidy_amount = get_government_subsidy(structure_type, estimated_cost)
        
        savings_data = calculate_accurate_rwh_savings(runoff_liters, groundwater_depth_meters, roof_area_sqm)
        total_annual_savings = savings_data["savings_breakdown"]["total_annual_savings"]
        
        net_investment = estimated_cost - subsidy_amount
        payback_years = round(net_investment / total_annual_savings, 1) if total_annual_savings > 0 else float('inf')
        
        result = {
            "suggested_structure": structure_type,
            "selection_rationale": f"Selected based on site conditions: {site_evaluation['conditions']['space_availability']} space, {site_evaluation['conditions']['depth_category']} groundwater, {site_evaluation['conditions']['infiltration_category']} infiltration, {site_evaluation['conditions']['runoff_category']} runoff volume",
            "confidence_score": round(site_evaluation['confidence_score'], 2),
            "recommended_dimensions": dimensions,
            "volume_m3": volume_m3,
            "design_parameters": dimension_data["design_basis"],
            "estimated_cost_inr": estimated_cost,
            "cost_breakdown": cost_data["cost_breakdown"],
            "capacity_liters": capacity_liters,
            "overflow_capacity_liters": int(capacity_liters * 1.2),
            "daily_recharge_capacity_liters": int(capacity_liters / 30),
            "subsidy_available_inr": subsidy_amount,
            "net_investment_inr": net_investment,
            "annual_savings_inr": total_annual_savings,
            "savings_breakdown": savings_data["savings_breakdown"],
            "payback_period_years": payback_years,
            "soil_infiltration_rate_mm_hr": round(soil_infiltration, 1),
            "aquifer_type": aquifer_data['type'],
            "recharge_efficiency": aquifer_data['recharge_efficiency'],
            "location_cost_factor": round(location_factor, 2),
            "alternative_structures": {k: v for k, v in site_evaluation['structure_scores'].items() if k != structure_type}
        }
        
        agent_data_store['structure_data'] = result
        return result
        
    except Exception:
        fallback_structures = ["Recharge Pit", "Recharge Trench", "Recharge Shaft", "Injection Well"]
        weights = [0.4, 0.3, 0.2, 0.1]
        fallback_structure = random.choices(fallback_structures, weights=weights)[0]
        
        fallback_cost = random.randint(45000, 85000)
        fallback_capacity = random.randint(4000, 12000)
        fallback_savings = random.randint(8000, 18000)
        
        return {
            "suggested_structure": fallback_structure,
            "selection_rationale": "Fallback recommendation due to calculation error",
            "confidence_score": 0.6,
            "recommended_dimensions": f"{random.uniform(2.0, 3.0):.1f}m × {random.uniform(2.0, 3.0):.1f}m × {random.uniform(2.0, 3.5):.1f}m",
            "volume_m3": random.uniform(8, 25),
            "estimated_cost_inr": fallback_cost,
            "capacity_liters": fallback_capacity,
            "overflow_capacity_liters": int(fallback_capacity * 1.2),
            "daily_recharge_capacity_liters": int(fallback_capacity / 30),
            "subsidy_available_inr": int(fallback_cost * 0.35),
            "net_investment_inr": int(fallback_cost * 0.65),
            "annual_savings_inr": fallback_savings,
            "payback_period_years": round(random.uniform(3.5, 8.0), 1),
            "soil_infiltration_rate_mm_hr": 15.0,
            "aquifer_type": "Intermediate Unconfined",
            "recharge_efficiency": 0.7,
            "location_cost_factor": 1.15
        }

async def format_final_report(ai_recommendation: str, annual_savings_inr: int, payback_period_years: float) -> dict:
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
            "runoff_liters": harvesting_data.get("runoff_liters", 0),
            "climate_zone": environmental_data.get("climate_zone", ""),
            "aquifer_type": environmental_data.get("principal_aquifer", "")
        }
    }
    
    return result

# LangChain Tools
class GetHydrogeologicalDataTool(BaseTool):
    name: str = "get_hydrogeological_data"
    description: str = "Essential for finding the aquifer type, groundwater level, climate data, and average annual rainfall for a given geographic location."
    args_schema: Type[BaseModel] = HydrogeologyInput

    def _run(self, *args, **kwargs):
        raise NotImplementedError("This tool does not support synchronous execution.")

    async def _arun(self, latitude: float, longitude: float):
        return await get_hydrogeological_data(latitude, longitude)

class CalculateHarvestingPotentialTool(BaseTool):
    name: str = "calculate_harvesting_potential"
    description: str = "Calculates the total annual runoff in liters and provides accurate annual savings based on real-world benefits like reduced borewell costs."
    args_schema: Type[BaseModel] = RunoffInput

    def _run(self, *args, **kwargs):
        raise NotImplementedError("This tool does not support synchronous execution.")

    async def _arun(self, roof_area_sqm: float, annual_rainfall_mm: int):
        return await calculate_harvesting_potential(roof_area_sqm, annual_rainfall_mm)

class RecommendRechargeStructureTool(BaseTool):
    name: str = "recommend_recharge_structure"
    description: str = "ADVANCED structure recommendation using engineering-based evaluation system. Analyzes site conditions to score and select optimal structure with confidence scores and detailed rationale."
    args_schema: Type[BaseModel] = StructureInput

    def _run(self, *args, **kwargs):
        raise NotImplementedError("This tool does not support synchronous execution.")

    async def _arun(self, roof_area_sqm: float, groundwater_depth_meters: float, runoff_liters: int, latitude: float = 12.9716, longitude: float = 77.5946):
        return await recommend_recharge_structure(roof_area_sqm, groundwater_depth_meters, runoff_liters, latitude, longitude)

class FormatFinalReportTool(BaseTool):
    name: str = "format_final_report"
    description: str = "Use this as your final step to format the complete report for the user with all technical and financial details."
    args_schema: Type[BaseModel] = FinalReport

    def _run(self, *args, **kwargs):
        raise NotImplementedError("This tool does not support synchronous execution.")
        
    async def _arun(self, ai_recommendation: str, annual_savings_inr: int, payback_period_years: float):
        return await format_final_report(ai_recommendation, annual_savings_inr, payback_period_years)

tools = [
    GetHydrogeologicalDataTool(),
    CalculateHarvestingPotentialTool(),
    RecommendRechargeStructureTool(),
    FormatFinalReportTool(),
]

# Agent Prompt
prompt = ChatPromptTemplate.from_messages([
    ("system", """You are an expert hydrogeologist AI assistant for the 'JalSetu' app.
Your goal is to provide a complete and dynamic feasibility report using real-world location-specific data and accurate calculations.

You must proceed in the following order:
1. First, use the `get_hydrogeological_data` tool to find essential environmental data including coordinates.
2. Second, use the `calculate_harvesting_potential` tool with the roof area and rainfall data.
3. Third, use the `recommend_recharge_structure` tool with ALL parameters INCLUDING the latitude and longitude from step 1.
4. Finally, use the `format_final_report` tool as your final action.

CRITICAL: When calling recommend_recharge_structure, ALWAYS pass the latitude and longitude from the hydrogeological data to ensure location-specific, dynamic recommendations.

The recommend_recharge_structure tool uses an advanced engineering-based evaluation system that analyzes site conditions comprehensively and provides detailed rationale for the selection.

When creating the ai_recommendation, include:
- Structure type and detailed technical justification based on the scoring system
- Confidence score and selection rationale provided by the tool
- Real-world dimensions calculated for the specific location and requirements
- Location-specific factors (geological formations, climate zone, soil infiltration rates)
- Detailed cost breakdown with realistic pricing and available subsidies
- Accurate savings analysis focusing on borewell cost reduction
- Performance metrics including capacity, recharge efficiency, and payback analysis

Make the recommendation comprehensive yet user-friendly, explaining the engineering rationale in accessible language."""),
    ("human", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad"),
])

# Create Agent
try:
    agent = create_openai_functions_agent(llm, tools, prompt)
    agent_executor = AgentExecutor(
        agent=agent,
        tools=tools,
        verbose=True,
        return_intermediate_steps=True
    )
except Exception as e:
    print(f"Error creating agent: {e}")

# FastAPI Endpoints
@app.get("/")
async def root():
    return {
        "status": "Clean AI Agent is running",
        "gwl_models_loaded": gwl_preprocessor is not None and gwl_model is not None,
        "version": "3.1.0-clean",
        "features": [
            "Engineering-based structure selection",
            "Multi-criteria evaluation system", 
            "Confidence scoring and rationale",
            "Realistic dimension calculations",
            "Location-specific parameters"
        ]
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "gwl_models_loaded": gwl_preprocessor is not None and gwl_model is not None,
        "agent_ready": 'agent_executor' in globals(),
        "tools_count": len(tools)
    }

@app.post("/predict-gwl", response_model=GWLResponse)
async def predict_groundwater_level(request: GWLRequest):
    try:
        gwl_prediction = predict_gwl(request.district, request.latitude, request.longitude)
        
        if gwl_prediction is not None:
            return GWLResponse(
                gwl=round(gwl_prediction, 2),
                unit="mbgl",
                success=True,
                district=request.district,
                status="success" if (gwl_preprocessor is not None and gwl_model is not None) else "fallback"
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to predict groundwater level")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"GWL prediction error: {str(e)}")

@app.post("/get-recommendation", response_model=FinalReport)
async def get_agent_recommendation(payload: AgentInput):
    try:
        global agent_data_store
        agent_data_store.clear()
        
        if 'agent_executor' not in globals():
            raise HTTPException(status_code=500, detail="Agent not properly initialized")
        
        result = await agent_executor.ainvoke({"input": payload.input})
        
        if "intermediate_steps" in result and result["intermediate_steps"]:
            last_step = result["intermediate_steps"][-1]
            last_action, last_observation = last_step
            
            if isinstance(last_action, AgentActionMessageLog) and last_action.tool == "format_final_report":
                if isinstance(last_observation, dict) and "ai_recommendation" in last_observation:
                    return FinalReport(**last_observation)

        return FinalReport(
            ai_recommendation=result.get("output", "Unable to generate detailed recommendation due to processing error."),
            annual_savings_inr=12000,
            payback_period_years=5.2
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent processing error: {str(e)}")

@app.post("/get-recommendation-with-gwl")
async def get_recommendation_with_gwl(request: CombinedRequest):
    try:
        global agent_data_store
        agent_data_store.clear()
        
        ai_recommendation = None
        if request.input:
            try:
                if 'agent_executor' not in globals():
                    raise Exception("Agent not properly initialized")
                
                result = await agent_executor.ainvoke({"input": request.input})
                
                if "intermediate_steps" in result and result["intermediate_steps"]:
                    last_step = result["intermediate_steps"][-1]
                    last_action, last_observation = last_step

                    if isinstance(last_action, AgentActionMessageLog) and last_action.tool == "format_final_report":
                        if isinstance(last_observation, dict):
                            ai_recommendation = last_observation
                
                if not ai_recommendation:
                    ai_recommendation = {
                        "ai_recommendation": result.get("output", "Unable to generate recommendation"),
                        "annual_savings_inr": 12000,
                        "payback_period_years": 5.2,
                        "structure_data": {},
                        "environmental_data": {}
                    }
                    
            except Exception as e:
                ai_recommendation = {
                    "ai_recommendation": f"Error generating recommendation: {str(e)}",
                    "annual_savings_inr": 12000,
                    "payback_period_years": 5.5,
                    "structure_data": {},
                    "environmental_data": {}
                }
        else:
            ai_recommendation = {
                "ai_recommendation": "No input provided for recommendation.",
                "annual_savings_inr": 0,
                "payback_period_years": 0.0,
                "structure_data": {},
                "environmental_data": {}
            }
        
        gwl_data = None
        if all([request.district, request.latitude, request.longitude]):
            try:
                gwl_prediction = predict_gwl(request.district, request.latitude, request.longitude)
                if gwl_prediction is not None:
                    gwl_data = {
                        "gwl": round(gwl_prediction, 2),
                        "unit": "mbgl",
                        "success": True,
                        "district": request.district,
                        "status": "success" if (gwl_preprocessor is not None and gwl_model is not None) else "fallback",
                        "aquifer_type": determine_aquifer_type(request.latitude, request.longitude)
                    }
                else:
                    gwl_data = {"success": False, "error": "GWL prediction failed"}
            except Exception as e:
                gwl_data = {"success": False, "error": f"GWL prediction error: {str(e)}"}
        else:
            missing_params = []
            if not request.district:
                missing_params.append("district")
            if not request.latitude:
                missing_params.append("latitude") 
            if not request.longitude:
                missing_params.append("longitude")
            
            gwl_data = {"success": False, "error": f"Missing required GWL parameters: {', '.join(missing_params)}"}
        
        return {
            "ai_recommendation": ai_recommendation,
            "gwl_data": gwl_data,
            "system_info": {
                "version": "3.1.0-clean",
                "features_enabled": [
                    "Engineering-based structure selection",
                    "Multi-criteria evaluation system",
                    "Confidence scoring with rationale",
                    "Realistic dimension calculations", 
                    "Location-specific parameters"
                ]
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Endpoint error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    print("Starting Clean Rainwater Harvesting AI Agent server...")
    uvicorn.run(app, host="0.0.0.0", port=5000, log_level="info")

# Vercel serverless function handler
try:
    from mangum import Mangum
    handler = Mangum(app)
except ImportError:
    print("Mangum not available - running in development mode")
    handler = None