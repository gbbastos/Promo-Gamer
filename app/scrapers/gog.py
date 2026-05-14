import requests
from datetime import datetime

# countryCode=BR + currencyCode=BRL juntos retornam preços em BRL
GOG_DEALS_URL = (
    "https://catalog.gog.com/v1/catalog"
    "?limit=20&order=desc:bestselling&discounted=eq:true"
    "&productType=in:game,pack&page=1"
    "&countryCode=BR&currencyCode=BRL"
)


def scrape_gog() -> list[dict]:
    try:
        deals = []

        response = requests.get(GOG_DEALS_URL, timeout=10)
        response.raise_for_status()
        data = response.json()

        for game in data.get("products", []):
                price_info = game.get("price", {})
                discount = abs(int(price_info.get("discount", "0").replace("%", "") or 0))
                if discount == 0:
                    continue

                base_money = price_info.get("baseMoney", {})
                try:
                    original_price = float(base_money.get("amount", 0) or 0)
                except (ValueError, TypeError):
                    original_price = 0.0

                slug = game.get("slug", "")
                url = f"https://www.gog.com/en/game/{slug}" if slug else "https://www.gog.com"
                cover = game.get("coverHorizontal") or game.get("coverVertical") or None

                deals.append({
                    "title": game.get("title", "Unknown"),
                    "platform": "gog",
                    "type": "free" if discount == 100 else "deal",
                    "original_price": original_price,
                    "discount_percent": discount,
                    "url": url,
                    "image_url": cover,
                    "end_date": None,
                    "fetched_at": datetime.utcnow(),
                })

        return deals

    except Exception as e:
        print(f"[GOG scraper error] {e}")
        return []
