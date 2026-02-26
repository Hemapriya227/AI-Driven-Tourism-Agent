from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from fastapi import BackgroundTasks # Add this import
from app.agents.extractor import extract_and_save_insight

from app.core.config import settings
from app.core.toon_engine import TOONEngine

# Import and initialize Supabase client
from app.db.supabase_client import supabase                # Fixes "supabase not defined"

from app.agents.squad import itera_brain # Will be defined in next batch
from anthropic import Anthropic

app = FastAPI(title="ITERA Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Vite's default port
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)
class PlanRequest(BaseModel):
    destination: str
    startDate: str
    endDate: str
    startTime: str
    endTime: str
    timePeriod: str
    budgetMax: int # Changed to int
    persona: str
    isReligious: bool
    accommodation: str
    interests: List[str]
    duration: int

class ChatRequest(BaseModel):
    message: str
    current_itinerary: List[dict]
    last_reached_index: int

@app.post("/plan")
async def plan_trip(req: PlanRequest):
    try:

        # Inside plan_trip function
        # 1. Geocode the destination first
        from app.agents.researcher import get_destination_coords
        dest_center = get_destination_coords(req.destination)
 
        
        # Now req.endTime will not throw an AttributeError
        initial_state = {
            "target": req.destination,
            "persona": req.persona,
            "days": int(req.duration),
            "budgetMax": req.budgetMax,  # Ensure this matches OnboardingModal
            "is_religious": req.isReligious,
            "accommodation": req.accommodation or "Boutique Hotel",
            "interests": req.interests or [],
            "startTime": req.startTime or "09:00",
            "endTime": req.endTime or "21:00",
            "poi_pool": [],
            "final_json": [],
            "insights": [],
            "efficiency": "35%",
            "weather": "Sunny", # Added for safety
            "hotel_name": ""
        }
        # Invoke the Agentic Squad
        result = await itera_brain.ainvoke(initial_state)
        
        # Backend/main.py -> inside plan_trip

        # ... (after result = await itera_brain.ainvoke)
        
        # PERSIST TO SUPABASE
        from app.db.supabase_client import save_full_journey
        save_full_journey(
            req.destination, 
            result['final_json'], 
            result['insights'], 
            dest_center
        )

        return {
            "status": "success",
            "itinerary": result['final_json'],
            "insights": result['insights'],
            "center": dest_center,
            "efficiency_metric": result['efficiency']
        }
    except Exception as e:
        import traceback
        traceback.print_exc() 
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chat")
async def handle_chat(req: ChatRequest):
    """
    The Self-Healing Gateway. 
    Routes between informational chat and logistical re-planning.
    """
    # 1. Routing Intelligence
    router_prompt = f"""
    Analyze user message: "{req.message}"
    If they want to change plans, skip an activity, or report a delay: Reply 'REPLAN'.
    If they are asking a general question: Reply 'CHAT'.
    Reply ONLY with the word.
    """
    
    route_res = client.messages.create(
        model=settings.CLAUDE_MODEL,
        max_tokens=10,
        messages=[{"role": "user", "content": router_prompt}]
    )
    
    decision = route_res.content[0].text.strip()

    if "REPLAN" in decision:
        # SELF-HEALING LOGIC:
        # Keep nodes up to last_reached_index. Re-generate the rest.
        completed = req.current_itinerary[:req.last_reached_index + 1]
        to_reschedule = req.current_itinerary[req.last_reached_index + 1:]
        
        heal_prompt = f"""
        User Message: {req.message}
        Current Index: {req.last_reached_index}
        Remaining Items: {to_reschedule}
        TASK: Re-optimize the remaining items based on the user message. 
        Return ONLY TOON format.
        """
        
        res = client.messages.create(
            model=settings.CLAUDE_MODEL,
            max_tokens=1000,
            system=TOONEngine.get_system_prompt(),
            messages=[{"role": "user", "content": heal_prompt}]
        )
        
        new_nodes = TOONEngine.parse(res.content[0].text)
        return {"type": "replan", "new_itinerary": completed + new_nodes}
    

    else:
        # IMPROVED CONCIERGE PROMPT
        chat_res = client.messages.create(
            model=settings.CLAUDE_MODEL,
            max_tokens=500,
            system="You are ITERA, a travel agent. Use the provided itinerary context to answer.",
            messages=[{
                "role": "user", 
                "content": f"Current Itinerary: {req.current_itinerary}\n\nUser Question: {req.message}"
            }]
        )
        return {"type": "answer", "answer": chat_res.content[0].text}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)