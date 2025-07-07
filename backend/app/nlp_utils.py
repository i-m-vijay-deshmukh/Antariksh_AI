def classify_intent(query: str) -> str:
    """Classify user query into one of predefined intents."""
    query_lower = query.lower()
    
    # Weather-related queries
    weather_keywords = ["weather", "forecast", "rain", "temperature", "climate"]
    if any(word in query_lower for word in weather_keywords):
        return "weather_query"
    
    # Satellite-related queries
    satellite_keywords = ["satellite", "insat", "data", "image", "mosdac"]
    if any(word in query_lower for word in satellite_keywords):
        return "satellite_data"
    
    # Help-related queries
    help_keywords = ["help", "support", "how to", "guide", "tutorial"]
    if any(word in query_lower for word in help_keywords):
        return "help_request"
    
    # Default case
    return "general"