import requests
from datetime import datetime

STEAM_APP_URL = "https://store.steampowered.com/app/{appid}"

# featuredcategories retorna preços em BRL quando cc=br
# É a única API pública da Steam que inclui discount + preço na mesma chamada
ENDPOINTS = [
    "https://store.steampowered.com/api/featuredcategories?cc=br&l=brazilian",
]


def scrape_steam() -> list[dict]:
    try:
        deals = []
        seen = set()

        for url in ENDPOINTS:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()

            specials = data.get("specials", {}).get("items", [])

            for game in specials:
                discount = game.get("discount_percent", 0)
                if discount == 0:
                    continue

                appid = game.get("id")
                if appid in seen:
                    continue
                seen.add(appid)

                original_price = (game.get("original_price") or 0) / 100

                deals.append({
                    "title": game.get("name", "Unknown"),
                    "platform": "steam",
                    "type": "free" if discount == 100 else "deal",
                    "original_price": original_price,
                    "discount_percent": discount,
                    "url": STEAM_APP_URL.format(appid=appid),
                    "image_url": game.get("large_capsule_image") or game.get("small_capsule_image"),
                    "end_date": None,
                    "fetched_at": datetime.utcnow(),
                })

        return deals

    except Exception as e:
        print(f"[Steam scraper error] {e}")
        return []
