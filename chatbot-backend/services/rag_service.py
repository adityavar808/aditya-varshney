import os
import re
import logging
import warnings
from pathlib import Path
import numpy as np
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
import faiss

# Suppress model-loading warnings and HF noise before importing sentence_transformers
warnings.filterwarnings("ignore", message=".*UNEXPECTED.*")
warnings.filterwarnings("ignore", message=".*different task/architecture.*")
warnings.filterwarnings("ignore", message=".*can be ignored when loading.*")
logging.getLogger("transformers").setLevel(logging.ERROR)
logging.getLogger("sentence_transformers").setLevel(logging.ERROR)
os.environ.setdefault("HF_HUB_DISABLE_PROGRESS_BARS", "1")
os.environ.setdefault("TRANSFORMERS_VERBOSITY", "error")

CHUNK_SIZE = 400
CHUNK_OVERLAP = 80
TOP_K = 7

def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP):
    """Split text into overlapping chunks."""
    text = re.sub(r"\s+", " ", text).strip()
    if not text:
        return []
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        if chunk.strip():
            chunks.append(chunk.strip())
        start = end - overlap
    return chunks


def load_documents():
    """Load PDFs and summary from me/ into list of (source, text) tuples."""
    docs = []
    me_dir = Path(__file__).resolve().parent.parent / "me"
    if not me_dir.exists():
        me_dir.mkdir(parents=True, exist_ok=True)
        
    summary_path = me_dir / "summary.txt"
    if summary_path.is_file():
        try:
            with open(summary_path, "r", encoding="utf-8") as f:
                docs.append(("summary.txt", f.read()))
        except Exception as e:
            print(f"Error reading summary.txt: {e}", flush=True)
            
    # PDFs
    for name in ["linkedin.pdf", "Resume.pdf", "resume.pdf", "Linkedin.pdf"]:
        path = me_dir / name
        if path.is_file():
            try:
                reader = PdfReader(path)
                text = ""
                for page in reader.pages:
                    t = page.extract_text()
                    if t:
                        text += t
                if text:
                    docs.append((name, text))
            except Exception as e:
                print(f"Error reading PDF {name}: {e}", flush=True)
    return docs


class RAGStore:
    """RAG index using Hugging Face sentence-transformers + FAISS vector store."""
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model = None
        self.chunks = []
        self.index = None
        self.dimension = 384
        self.model_name = model_name

    def load_model(self):
        if self.model is None:
            print(f"Loading embedding model: {self.model_name}", flush=True)
            self.model = SentenceTransformer(self.model_name)
            self.dimension = self.model.get_sentence_embedding_dimension()

    def index_documents(self, documents):
        """Build FAISS index from list of (source_name, text) tuples."""
        self.chunks = []
        for source, text in documents:
            for chunk in chunk_text(text):
                self.chunks.append((source, chunk))
        if not self.chunks:
            print("No documents found to index in RAGStore.", flush=True)
            return
        
        self.load_model()
        texts = [c[1] for c in self.chunks]
        embeddings = self.model.encode(texts, normalize_embeddings=True)
        embeddings = np.ascontiguousarray(embeddings.astype(np.float32))
        self.index = faiss.IndexFlatIP(self.dimension)
        self.index.add(embeddings)
        print(f"Successfully indexed {len(self.chunks)} chunks in FAISS.", flush=True)

    def retrieve(self, query: str, top_k: int = TOP_K) -> str:
        """Return top-k relevant chunks using FAISS similarity search."""
        if not self.chunks or self.index is None:
            return ""
        self.load_model()
        q_emb = self.model.encode([query], normalize_embeddings=True)
        q_emb = np.ascontiguousarray(q_emb.astype(np.float32))
        scores, indices = self.index.search(q_emb, min(top_k, len(self.chunks)))
        indices = indices.flatten()
        parts = []
        for i in indices:
            if i < 0 or i >= len(self.chunks):
                continue
            source, chunk = self.chunks[i]
            parts.append(f"[{source}]\n{chunk}")
        return "\n\n---\n\n".join(parts)


# Initialize and load index at startup
rag_store = RAGStore()
try:
    docs = load_documents()
    if docs:
        rag_store.index_documents(docs)
except Exception as e:
    print(f"Error during initial document indexing: {e}", flush=True)
