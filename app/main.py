from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from app.routes.deals import router as deals_router
from app.database import deals_collection
from app.scrapers.epic import scrape_epic
from app.scrapers.steam import scrape_steam
from app.scrapers.gog import scrape_gog
from datetime import datetime

scheduler = BackgroundScheduler()


def run_all_scrapers():
    scrapers = [
        ("epic", scrape_epic),
        ("steam", scrape_steam),
        ("gog", scrape_gog),
    ]

    total = 0
    for name, scraper in scrapers:
        print(f"[{datetime.utcnow()}] Running {name} scraper...")
        deals = scraper()

        for deal in deals:
            deals_collection.update_one(
                {"title": deal["title"], "platform": deal["platform"]},
                {"$set": deal},
                upsert=True,
            )

        print(f"  -> {len(deals)} deals upserted from {name}")
        total += len(deals)

    print(f"[Done] Total: {total} deals in DB.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Running scrapers on startup...")
    run_all_scrapers()
    scheduler.add_job(run_all_scrapers, "interval", hours=6, id="scraper_job")
    scheduler.start()
    print("Scheduler started — scrapers will run every 6 hours.")
    yield
    scheduler.shutdown()


app = FastAPI(
    title="PromoGamer API",
    description="Aggregates free games and deals from Epic Games, Steam, and GOG.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(deals_router)

app.mount("/ui", StaticFiles(directory="frontend", html=True), name="frontend")


@app.get("/")
def root():
    return {
        "message": "PromoGamer API is running.",
        "endpoints": {
            "all deals": "/deals/",
            "free games": "/deals/free",
            "filter by platform": "/deals/?platform=epic",
            "docs": "/docs",
        },
    }
