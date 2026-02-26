import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # --- API KEYS (The Squad's Sensory Inputs) ---
    # We do not provide defaults here so Pydantic forces a crash if missing
    ANTHROPIC_API_KEY: str 
    GOOGLE_MAPS_KEY: str   # Fixed the AttributeError by adding this schema definition
    OPENWEATHER_KEY: str
    
    # --- DATABASE (The Psychographic Memory) ---
    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str

    # --- PROJECT CONFIG ---
    PROJECT_NAME: str = "ITERA_ORCHESTRATOR"
    CLAUDE_MODEL: str = "claude-haiku-4-5-20251001" # Locked for ITERA Logic

    # --- CONFIGURATION SETTINGS ---
    # This tells Pydantic to look for the .env file and ignore extra variables
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8",
        extra="ignore"
    )

# Instantiate as a singleton to be used across the app
settings = Settings()