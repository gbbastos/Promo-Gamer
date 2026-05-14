from fastapi import APIRouter, Query
from typing import Optional
from app.database import deals_collection
from bson import ObjectId

router = APIRouter(prefix="/deals", tags=["deals"])


def serialize(doc) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


@router.get("/")
def get_deals(
    platform: Optional[str] = Query(None, description="Filter by platform: epic, steam, gog"),
    type: Optional[str] = Query(None, description="Filter by type: free, deal"),
    min_discount: Optional[int] = Query(None, ge=1, le=100, description="Minimum discount percentage"),
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0),
):
    query = {}
    if platform:
        query["platform"] = platform.lower()
    if type:
        query["type"] = type.lower()
    if min_discount is not None:
        query["discount_percent"] = {"$gte": min_discount}

    results = list(deals_collection.find(query).sort("fetched_at", -1).skip(skip).limit(limit))
    return [serialize(doc) for doc in results]


@router.get("/free")
def get_free_games():
    results = list(deals_collection.find({"type": "free"}).sort("fetched_at", -1))
    return [serialize(doc) for doc in results]


@router.get("/platforms")
def get_platforms():
    return {"platforms": ["epic", "steam", "gog"]}
