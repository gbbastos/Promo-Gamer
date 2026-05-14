import requests
from datetime import datetime

EPIC_API_URL = (
    "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions"
    "?locale=pt-BR&country=BR&allowCountries=BR"
)


def scrape_epic() -> list[dict]:
    try:
        response = requests.get(EPIC_API_URL, timeout=10)
        response.raise_for_status()
        data = response.json()

        games = (
            data.get("data", {})
            .get("Catalog", {})
            .get("searchStore", {})
            .get("elements", [])
        )

        deals = []
        for game in games:
            promotions = game.get("promotions")
            if not promotions:
                continue

            offers = promotions.get("promotionalOffers", [])
            if not offers:
                continue

            for promo_block in offers:
                for offer in promo_block.get("promotionalOffers", []):
                    discount = offer.get("discountSetting", {}).get("discountPercentage", 100)
                    if discount != 0:
                        continue

                    title = game.get("title", "Unknown")
                    slug = game.get("productSlug") or game.get("urlSlug") or ""
                    url = f"https://store.epicgames.com/en-US/p/{slug}" if slug else "https://store.epicgames.com"

                    image_url = None
                    for img in game.get("keyImages", []):
                        if img.get("type") in ("Thumbnail", "DieselStoreFrontWide"):
                            image_url = img.get("url")
                            break

                    original_price = game.get("price", {}).get("totalPrice", {}).get("originalPrice", 0)
                    original_price_formatted = original_price / 100 if original_price else 0.0

                    deals.append({
                        "title": title,
                        "platform": "epic",
                        "type": "free",
                        "original_price": original_price_formatted,
                        "discount_percent": 100,
                        "url": url,
                        "image_url": image_url,
                        "end_date": offer.get("endDate", ""),
                        "fetched_at": datetime.utcnow(),
                    })

        return deals

    except Exception as e:
        print(f"[Epic scraper error] {e}")
        return []
