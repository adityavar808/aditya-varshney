import socket
import os
import logging
from dotenv import load_dotenv
import pymongo

# Patch socket to force IPv4 and bypass broken IPv6 DNS resolutions
orig_getaddrinfo = socket.getaddrinfo

def getaddrinfo_ipv4_only(host, port, family=0, type=0, proto=0, flags=0):
    if family == socket.AF_UNSPEC or family == 0:
        family = socket.AF_INET
    return orig_getaddrinfo(host, port, family, type, proto, flags)

socket.getaddrinfo = getaddrinfo_ipv4_only

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("chatbot")

# Connect to MongoDB
MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    logger.error("MONGODB_URI environment variable is missing!")

db = None
try:
    client = pymongo.MongoClient(MONGODB_URI)
    try:
        db = client.get_default_database()
    except Exception:
        # Mongoose defaults to "test" database when none is specified in URI path
        db = client["test"]
    logger.info(f"Connected to MongoDB database: {db.name}")
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {e}")
