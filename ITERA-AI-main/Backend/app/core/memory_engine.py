# Backend/app/core/memory_engine.py
from app.db.supabase_client import supabase

async def get_relevant_memories(target_city: str):
    """
    Lite RAG: Pulls any past preferences related to the city or 
    general user vibes to inject into the Researcher.
    """
    try:
        # Pull everything (small scale) and let the LLM filter in the prompt
        res = supabase.table("user_insights").select("insight_text").order("created_at", desc=True).limit(10).execute()
        if res.data:
            return " | ".join([m['insight_text'] for m in res.data])
        return ""
    except Exception as e:
        print(f"Memory Retrieval Error: {e}")
        return ""