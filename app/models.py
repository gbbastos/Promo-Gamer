from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class Deal(BaseModel):
    title: str
    platform: str
    type: str
    original_price: Optional[float] = None
    discount_percent: Optional[int] = None
    url: str
    image_url: Optional[str] = None
    end_date: Optional[str] = None
    fetched_at: datetime = datetime.utcnow()
