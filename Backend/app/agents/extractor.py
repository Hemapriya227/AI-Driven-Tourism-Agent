# Backend/app/agents/extractor.py
from anthropic import Anthropic
from app.core.config import settings
from app.db.supabase_client import supabase

client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)

async def extract_and_save_insight(text: str):
    """Listens for vibes and saves them to the DB."""
    try:
        prompt = f"Analyze: '{text}'. Extract one specific preference. Reply ONLY with 'User prefers [vibe]'."
        
        res = client.messages.create(
            model=settings.CLAUDE_MODEL,
            max_tokens=50,
            messages=[{"role": "user", "content": prompt}]
        )
        
        insight = res.content[0].text.strip()
        # Non-blocking save to Supabase
        supabase.table("user_insights").insert({"insight_text": insight}).execute()
        return insight
    except Exception as e:
        print(f"Extraction Error (Ignored): {e}")
        return None