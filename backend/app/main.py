from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from app.chat import get_rag_chain
import asyncio
import os

# Load environment variables
load_dotenv()

# Define lifespan handler
async def lifespan(app: FastAPI):
    # Initialize RAG chain on startup
    app.state.rag_chain = await get_rag_chain()
    print("RAG chain initialized successfully")
    yield
    # Cleanup on shutdown
    print("Shutting down RAG chain")

app = FastAPI(lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str

@app.post("/chat")
async def chat_endpoint(req: QueryRequest):
    try:
        # Test retriever
        retriever_response = await asyncio.to_thread(
            app.state.rag_chain.retriever.invoke,
            req.query
        )
        
        if not retriever_response:
            return {
                "response": "MOSDAC is ISRO's Meteorological and Oceanographic Satellite Data Archival Centre. I couldn't find specific documents, but it's used for weather and ocean data.",
                "suggestions": [
                    "Try 'MOSDAC satellite data'",
                    "Ask about 'ISRO MOSDAC portal'"
                ]
            }

        # Get full response
        response = await asyncio.to_thread(
            app.state.rag_chain.invoke,
            {"query": req.query}
        )
        
        return {
            "response": response.get("result", "Information not available"),
            "sources": [doc.metadata.get("source", "") for doc in retriever_response]
        }

    except Exception as e:
        return {
            "response": "Temporary service interruption",
            "error": str(e)
        }