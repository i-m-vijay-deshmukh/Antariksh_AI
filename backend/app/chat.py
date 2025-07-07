from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.chains import RetrievalQA
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
import os
import asyncio

async def get_rag_chain(index_path='app/data/faiss_index'):
    try:
        # Initialize embeddings
        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={'device': 'cpu'}
        )

        # Load FAISS index
        if not os.path.exists(index_path):
            raise FileNotFoundError(f"FAISS index not found at {index_path}")
            
        db = await asyncio.to_thread(
            FAISS.load_local,
            index_path,
            embeddings,
            allow_dangerous_deserialization=True
        )

        # Configure retriever
        retriever = db.as_retriever(
            search_type="similarity_score_threshold",
            search_kwargs={"k": 10, "score_threshold": 0.4}
        )

        # Initialize LLM
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found")

        llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            temperature=0.3,
            google_api_key=api_key
        )

        # Create prompt template
        prompt_template = """Answer based on context:
        {context}
        Question: {question}
        Answer:"""
        
        PROMPT = PromptTemplate(
            template=prompt_template, 
            input_variables=["context", "question"]
        )

        # Create and return chain
        return RetrievalQA.from_chain_type(
            llm=llm,
            retriever=retriever,
            chain_type="stuff",
            return_source_documents=True,
            chain_type_kwargs={
                "prompt": PROMPT,
                "verbose": True
            }
        )

    except Exception as e:
        print(f"Error initializing RAG chain: {e}")
        raise