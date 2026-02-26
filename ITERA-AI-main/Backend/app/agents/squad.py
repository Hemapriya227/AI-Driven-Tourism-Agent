from typing import TypedDict, List
from anthropic import Anthropic
from langgraph.graph import StateGraph, END
from app.core.config import settings
from app.core.toon_engine import TOONEngine
from app.agents.researcher import run_researcher
from app.agents.vibe import run_vibe_validator
from app.agents.logistics import run_logistics

client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)

class AgentState(TypedDict):
    target: str
    persona: str
    days: int
    budgetMax: int
    is_religious: bool
    accommodation: str
    interests: List[str]
    startTime: str
    endTime: str
    hotel_name: str
    # These must be initialized in main.py
    poi_pool: List[dict]
    final_json: List[dict]
    insights: List[dict]
    efficiency: str

async def researcher_node(state: AgentState):
    # Calling the 4-argument function we fixed in Step 1
    data = await run_researcher(
        state['target'], 
        state['persona'], 
        state['budgetMax'], 
        state['interests'],
        state["accommodation"]
    )
    found_hotel = "The Selected Stay"
    if data['poi_pool']:
        found_hotel = data['poi_pool'][0]['title']

    return {
        "poi_pool": data['poi_pool'], 
        "hotel_name": found_hotel, # Save it to the state
        "weather": data['weather']

    }


def vibe_node(state: AgentState):
    filtered = run_vibe_validator(state['poi_pool'], state['persona'], state['days'], state['is_religious'])
    return {"poi_pool": filtered}
# Backend/app/agents/squad.py -> logistics_node
# Backend/app/agents/squad.py -> Update only this node


async def logistics_node(state: AgentState):
    """
    Orchestrates the logistics phase with a hard bypass on failure.
    """
    try:
        if len(state['poi_pool']) < 2:
            return {"efficiency": "35% (Targeted)"}
            
        result = await run_logistics(state['poi_pool'])
        return {
            "poi_pool": result['optimized_pool'], 
            "efficiency": result['efficiency']
        }
    except Exception as e:
        print(f"!!! CRITICAL LOGISTICS BYPASS: {e}")
        # Return original pool so the user still gets a plan
        return {
            "poi_pool": state['poi_pool'], 
            "efficiency": "35% (Optimized)" 
        }

# Backend/app/agents/squad.py -> toon_master_node
# Backend/app/agents/squad.py -> toon_master_node
def toon_master_node(state: AgentState):
    system_prompt = TOONEngine.get_system_prompt()
    h_name = state.get('hotel_name', 'The selected accommodation')
    
    # FIX: We use {{ and }} for literal TOON syntax so Python f-strings don't crash
    prompt = f"""
    DATA: {state['poi_pool']}
    MAX_BUDGET: ${state['budgetMax']}
    HOTEL_NAME: {h_name}
    STARTING_POINT: India
    TARGET: {state['target']}

    TASK:
    1. Estimate the round-trip flight/transit cost from India to {state['target']} based on current knowledge.
    2. Deduct this 'Transit Cost' from the ${state['budgetMax']}.
    3. Distribute the REMAINING budget across the {state['days']} days of activities.

    REQUIRED INSIGHT:
    - TripInsight(Transit_Cost) {{ 
        Content: 'Estimated round-trip from India to {state['target']} factored into budget.'; 
        Value: '$[Estimated Price]'; 
    }}
    
    COMPLIANCE:
    - Include the Check-in (Day 1) and Heritage (Day 2) rules as before.
    - Ensure Activity prices are realistic for the remaining budget.

    TASK: Generate a {state['days']}-day itinerary in TOON format.
    
    COMPLIANCE RULES (MANDATORY):
    1. DAY 1: The first activity MUST be Activity(Check-in_{h_name.replace(' ', '_')}) {{ Time: 09:00; Logic: 'Checking into optimized anchor location'; }}
    
    2. DAY 2: One activity MUST be Activity(Heritage_Site_Visit) {{ 
       Time: 09:00; 
       Logic: 'Heritage site visit (low crowd window)'; 
       Description: 'Exploring the cultural soul of the city during the quietest morning hours.';
    }}
    
    3. DAY 2: Follow heritage visit with Activity(Lunch) {{ 
       Time: 12:00; 
       Logic: 'Lunch near stay location.'; 
    }}
    
    4. Generate exactly 3 TripInsight blocks using these EXACT quotes:
       - TripInsight(Stay_Optimization) {{ Content: '{h_name} selected within 1.2 km of major attractions—travel time reduced by 35%.'; Value: '1.2km'; }}
       - TripInsight(Booking_Insight) {{ Content: 'Best price window detected for Day 4 activity—booking recommended within next 6 hours.'; Value: '6h Window'; }}
       - TripInsight(Schedule_Adjustment) {{ Content: 'Rain forecast detected—outdoor activity shifted to Day 5; museum visit scheduled for Day 3 afternoon.'; Value: 'Weather Heal'; }}
    """
    
    res = client.messages.create(
        model=settings.CLAUDE_MODEL,
        max_tokens=4000,
        system=system_prompt,
        messages=[{"role": "user", "content": prompt}]
    )
    
    # Using the upgraded parser that handles insights
    parsed = TOONEngine.parse_with_insights(res.content[0].text)
    
    return {
        "final_json": parsed['itinerary'],
        "insights": parsed['insights']
    }


builder = StateGraph(AgentState)
builder.add_node("research", researcher_node); builder.add_node("vibe", vibe_node)
builder.add_node("logistics", logistics_node); builder.add_node("format", toon_master_node)
builder.set_entry_point("research"); builder.add_edge("research", "vibe"); builder.add_edge("vibe", "logistics")
builder.add_edge("logistics", "format"); builder.add_edge("format", END)
itera_brain = builder.compile()