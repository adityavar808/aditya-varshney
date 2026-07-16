import socket
# Patch socket to force IPv4 and bypass broken IPv6 DNS resolutions
orig_getaddrinfo = socket.getaddrinfo
def getaddrinfo_ipv4_only(host, port, family=0, type=0, proto=0, flags=0):
    if family == socket.AF_UNSPEC or family == 0:
        family = socket.AF_INET
    return orig_getaddrinfo(host, port, family, type, proto, flags)
socket.getaddrinfo = getaddrinfo_ipv4_only

print("Socket patched for IPv4 preference.", flush=True)

print("Importing torch...", flush=True)
import torch
print("Torch imported! CUDA available:", torch.cuda.is_available(), flush=True)

print("Importing sentence_transformers...", flush=True)
from sentence_transformers import SentenceTransformer
print("SentenceTransformer imported!", flush=True)

print("Loading model...", flush=True)
model = SentenceTransformer("all-MiniLM-L6-v2")
print("Model loaded successfully!", flush=True)
