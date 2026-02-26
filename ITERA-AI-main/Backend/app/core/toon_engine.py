import re

class TOONEngine:

    @staticmethod
    def get_system_prompt():
        return """
        STRICT_PROTOCOL: TOON.
        Output ONLY blocks in this format:
        Activity(Exact_Name_of_Place) {
          Time: HH:MM;
          Loc: Full Address;
          Lat: Dec;
          Lon: Dec;
          Type: Indoor/Outdoor;
          Logic: Why this fits the user vibe;
          Description: 1-sentence vibe check;
          Price: $XX;
        }
        TripInsight(Category_Name) {
          Content: One sentence insight;
          Value: Metric;
        }
        NO INTRO. NO OUTRO. NO MARKDOWN.
        """

    @staticmethod
    def parse(toon_str: str) -> list:
        """Legacy parser — returns only the itinerary list."""
        return TOONEngine.parse_with_insights(toon_str)['itinerary']

    @staticmethod
    def parse_with_insights(toon_str: str) -> dict:
        """
        Full parser — returns both itinerary and insights.
        Returns: { 'itinerary': [...], 'insights': [...] }
        """
        itinerary = []
        insights = []

        # Clean markdown formatting
        clean_str = re.sub(r'```[\w]*', '', toon_str).replace('```', '').strip()

        # --- Parse Activity blocks ---
        activity_pattern = r"Activity\s*\((.*?)\)\s*\{([\s\S]*?)\}"
        for idx, (name, content) in enumerate(re.findall(activity_pattern, clean_str)):
            item = {
                "id": idx,
                "title": name.replace("_", " ").strip(),
                "reached": False
            }
            for k, v in re.findall(r"(\w+)\s*:\s*(.*?)(?:;|\n|$)", content):
                item[k.strip().lower()] = v.strip().strip('"').strip("'").replace("_", " ")

            if "lat" in item and "lon" in item:
                itinerary.append(item)

        # --- Parse TripInsight blocks ---
        insight_pattern = r"TripInsight\s*\((.*?)\)\s*\{([\s\S]*?)\}"
        for category, content in re.findall(insight_pattern, clean_str):
            insight = {"category": category.strip()}
            for k, v in re.findall(r"(\w+)\s*:\s*(.*?)(?:;|\n|$)", content):
                insight[k.strip().lower()] = v.strip().strip('"').strip("'")
            insights.append(insight)

        return {"itinerary": itinerary, "insights": insights}