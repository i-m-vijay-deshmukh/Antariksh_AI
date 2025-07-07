import os
import json
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.schema import Document
from langchain.text_splitter import CharacterTextSplitter

EMBEDDINGS_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

def load_data(json_path='app/data/data.json'):
    with open(json_path, 'r', encoding='utf-8') as f:
        raw = json.load(f)

    docs = []
    for key, value in raw.items():
        content = f"{value.get('title', '')}\n{value.get('content', '')}"
        docs.append(Document(
            page_content=content, 
            metadata={"source": value.get("url", key)}
        ))
    return docs

def build_vector_store(documents, save_path='app/data/faiss_index'):
    # Create embeddings
    embeddings = HuggingFaceEmbeddings(model_name=EMBEDDINGS_MODEL)
    
    # Split documents
    splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_documents(documents)

    # Create and save vector store
    db = FAISS.from_documents(chunks, embeddings)
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    db.save_local(save_path)
    return db

if __name__ == "__main__":
    # Example usage
    documents = load_data()
    build_vector_store(documents)