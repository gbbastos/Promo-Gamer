from apscheduler.schedulers.blocking import BlockingScheduler
from app.main import run_all_scrapers

scheduler = BlockingScheduler()
scheduler.add_job(run_all_scrapers, "interval", hours=6)

if __name__ == "__main__":
    print("Scheduler started. Scrapers will run every 6 hours.")
    run_all_scrapers()
    scheduler.start()
