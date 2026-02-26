from anthropic import Anthropic
from app.core.config import settings
from app.core.toon_engine import TOONEngine
from app.db.supabase_client import save_itinerary

client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)

async def run_monitor(message: str, current_plan: list, reached_idx: int):
    """
    Slices the plan at reached_idx. 
    Heals the future nodes based on the disruption (Rain/Delay/Preference).
    """
    # 1. State Slicing
    past_nodes = current_plan[:reached_idx + 1]
    future_nodes = current_plan[reached_idx + 1:]
    
    # 2. Healing Logic
    heal_prompt = f"""
    DISRUPTION: {message}
    FUTURE_NODES: {future_nodes}
    
    TASK: Re-optimize these nodes. 
    - If it's RAIN: Swap 'Outdoor' types for 'Indoor' alternatives.
    - If it's a DELAY: Remove the least important node to save time.
    Return ONLY in TOON Protocol format.
    """
    
    res = client.messages.create(
        model=settings.CLAUDE_MODEL,
        max_tokens=1000,
        system=TOONEngine.get_system_prompt(),
        messages=[{"role": "user", "content": heal_prompt}]
    )
    
    healed_nodes = TOONEngine.parse(res.content[0].text)
    new_full_plan = past_nodes + healed_nodes
    
    # 3. Auto-Persistence to Supabase
    destination = current_plan[0].get('loc', 'Unknown') if current_plan else 'Updated Trip'
    save_itinerary(destination, new_full_plan)
    
    return new_full_plan