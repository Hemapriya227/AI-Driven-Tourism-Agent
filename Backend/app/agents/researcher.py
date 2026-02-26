import httpx
import googlemaps
from anthropic import Anthropic
from app.core.config import settings

client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)
gmaps = googlemaps.Client(key=settings.GOOGLE_MAPS_KEY)

async def get_weather_context(city: str):
    """Fetches real-time weather to influence POI sourcing."""
    try:
        url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={settings.OPENWEATHER_KEY}&units=metric"
        async with httpx.AsyncClient() as http_client:
            res = await http_client.get(url)
            data = res.json()
            if res.status_code != 200: return "Sunny (22°C)"
            return f"{data['weather'][0]['main']} ({data['main']['temp']}°C)"
    except:
        return "Mild (20°C)"


async def resolve_place_details(place_name: str, city: str):
    """
    Overwrites AI 'guesses' with verified Google Geocoding coordinates.
    Uses Geocoding API first, falls back to Places search.
    """
    try:
        query = f"{place_name}, {city}"

        # 1. Use Geocoding API for the most accurate Lat/Lon
        geo_result = gmaps.geocode(query)
        if geo_result:
            location = geo_result[0]['geometry']['location']
            return {
                "lat": location['lat'],
                "lon": location['lng'],
                "address": geo_result[0].get('formatted_address', query),
                "price_level": 2
            }

        # 2. Fallback to Places search if Geocoding is vague
        places_result = gmaps.places(query=query)
        if places_result.get('results'):
            loc = places_result['results'][0]['geometry']['location']
            return {
                "lat": loc['lat'],
                "lon": loc['lng'],
                "address": places_result['results'][0].get('formatted_address', query),
                "price_level": places_result['results'][0].get('price_level', 2)
            }

    except Exception as e:
        print(f"Geospatial error for {place_name}: {e}")
    return None


def get_destination_coords(city: str):
    """Geocode the destination itself for map centering."""
    try:
        res = gmaps.geocode(city)
        if res:
            loc = res[0]['geometry']['location']
            return {"lat": loc['lat'], "lon": loc['lng']}
    except:
        pass
    return {"lat": 41.3851, "lon": 2.1734}  # Barcelona fallback


async def run_researcher(target: str, persona: str, budget: int, interests: list, accommodation: str):
    """The core Researcher execution pipeline."""

    # 1. Environmental Sensing
    weather = await get_weather_context(target)
    interest_str = ", ".join(interests) if interests else "Sightseeing"
    accommodation = "hotel" if budget > 250 else "hostel"

    # 2. Source POI candidates from Claude
    prompt = f"""
    SYSTEM: You are the Lead Researcher for ITERA.
    DESTINATION: {target}
    WEATHER: {weather}
    PERSONA: {persona}
    INTERESTS: {interest_str}
    STAY_PREFERENCE: {accommodation}

    Note: The user is traveling from India. 
    Calculate the 'Transit_Cost' (Flight/Visa) for a round trip to {target}.
    Factor this into the 'Total Budget' of ${budget}.

    TASK: Find 15 high-value POIs. 
    CRITICAL RULE: The very first POI (Index 0) MUST be a real, highly-rated {accommodation} in {target}.
    The other 14 should be vibe-aligned landmarks and cafes.
    
    Format: Name | Type (Indoor/Outdoor/Stay) | Description
    """

    response = client.messages.create(
        model=settings.CLAUDE_MODEL,
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}]
    )

    raw_lines = response.content[0].text.strip().split('\n')
    poi_pool = []

    # 3. Geospatial Validation
    for line in raw_lines:
        if "|" in line:
            parts = [p.strip() for p in line.split('|')]
            if len(parts) >= 2:
                # Clean name: remove **, numbers, extra spaces
                raw_name = parts[0]
                clean_name = raw_name.replace("**", "").strip()
                if ". " in clean_name[:4]:
                    clean_name = clean_name.split(". ", 1)[-1]

                p_type = parts[1]
                desc = parts[2] if len(parts) > 2 else ""

                geo = await resolve_place_details(clean_name, target)
                if geo:
                    poi_pool.append({
                        "title": clean_name,
                        "type": p_type,
                        "description": desc,
                        "lat": geo['lat'],
                        "lon": geo['lon'],
                        "loc": geo['address'],
                        "price_level": geo['price_level']
                    })

        if len(poi_pool) >= 15:
            break

    return {"poi_pool": poi_pool, "weather": weather}