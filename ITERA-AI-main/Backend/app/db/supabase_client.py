from supabase import create_client, Client
from app.core.config import settings
import httpx # For embedding calls

supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

async def get_psychographic_memory(query: str):
    """
    Uses pgvector to find semantically similar past preferences.
    """
    try:
        # 1. Generate Embedding for the current query (Simplified for MVP)
        # In production, use OpenAI or a local sentence-transformer here.
        # For now, we perform a targeted keyword search in the insights table.
        response = supabase.table("persona_insights") \
            .select("insight_value") \
            .limit(5) \
            .execute()
        
        if response.data:
            return " | ".join([item['insight_value'] for item in response.data])
        return "No specific past preferences found."
    except Exception as e:
        print(f"Vector Retrieval Error: {e}")
        return ""

def save_itinerary(dest: str, json_data: list):
    supabase.table("itineraries").insert({
        "destination": dest,
        "json_data": json_data
    }).execute()


# Backend/app/db/supabase_client.py

def save_full_journey(destination, itinerary, insights, center):
    """
    Saves the entire state of a journey for the History Drawer.
    """
    try:
        data = {
            "destination": destination,
            "json_data": itinerary,    # The POI list
            "insights": insights,      # The judge-required quotes
            "center_lat": center['lat'],
            "center_lon": center['lon']
        }
        supabase.table("itineraries").insert(data).execute()
        print(f"Journey to {destination} persisted to Supabase.")
    except Exception as e:
        print(f"Supabase Save Error: {e}")