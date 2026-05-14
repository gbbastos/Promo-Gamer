from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DB = os.getenv("MONGODB_DB", "gamedeals")

client = MongoClient(MONGODB_URI)
db = client[MONGODB_DB]

deals_collection = db["deals"]
