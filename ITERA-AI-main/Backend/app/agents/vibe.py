from anthropic import Anthropic
from app.core.config import settings

client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)

def run_vibe_validator(poi_pool: list, persona: str, days: int, is_religious: bool):
    """
    Maintains density (4 nodes/day). 
    Swaps religious sites for 'Hidden Gems' if the user prefers none.
    """
    target_count = int(days) * 4
    filtered_list = poi_pool[:int(days) * 4] # or your substitution logic

    # We use Claude to handle the "Substitution" logic intelligently
    prompt = f"""
    PERSONA: {persona}
    RELIGIOUS SITES ALLOWED: {is_religious}
    TARGET COUNT: {target_count}
    POOL: {poi_pool}

    TASK:
    1. Select the best {target_count} items.
    2. IF 'is_religious' is False: 
       Identify any religious sites (Church, Temple, Cathedral, Mosque) 
       and REPLACE them with a 'Hidden Gem' or 'Local Secret' in the same city 
       that matches the {persona} vibe.
    3. Return the FINAL list of {target_count} POIs as a Python list of dicts.
    
    Output ONLY the list.
    """

    reindexed_pool = []
    for i, poi in enumerate(filtered_list):
        poi['id'] = i  # Resetting the ID to match the list position
        reindexed_pool.append(poi)

    res = client.messages.create(
        model=settings.CLAUDE_MODEL,
        max_tokens=2500,
        messages=[{"role": "user", "content": prompt}]
    )

    try:
        import ast
        clean_res = res.content[0].text.strip().replace('```python', '').replace('```', '')
        return ast.literal_eval(clean_res)[:target_count]
    except:
        # Emergency Fallback: If AI fails, return the first available nodes
        return reindexed_pool
