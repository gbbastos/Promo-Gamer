# PromoGamer API

A REST API that aggregates free games and deals from **Epic Games**, **Steam**, and **GOG** — updated automatically every 6 hours.

Built with **Python**, **FastAPI**, and **MongoDB Atlas**.

---

## Features

- Aggregates deals from Epic Games, Steam, and GOG using their public APIs
- Stores results in MongoDB with upsert (no duplicates)
- Automatic scraping every 6 hours via APScheduler
- Filter by platform, deal type, and minimum discount
- Pagination support

---

## Tech Stack

- **Python 3.12**
- **FastAPI** — REST API framework
- **MongoDB Atlas** — cloud database
- **APScheduler** — background job scheduling
- **Requests** — HTTP client for public APIs

---

## Getting Started

### Prerequisites

- Python 3.12+
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

### Installation

```bash
git clone https://github.com/gbbastos/PromoGamer.git
cd PromoGamer

python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/macOS

pip install -r requirements.txt
```

### Environment Variables

Create a `.env` file in the project root:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?appName=<appname>
MONGODB_DB=gamedeals
```

### Running

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.  
Interactive docs: `http://localhost:8000/docs`

---

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API status and available endpoints |
| GET | `/deals/` | List all deals (supports filters) |
| GET | `/deals/free` | List only free games |
| GET | `/deals/platforms` | List supported platforms |

### Query Parameters for `GET /deals/`

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `platform` | string | Filter by platform | `epic`, `steam`, `gog` |
| `type` | string | Filter by deal type | `free`, `deal` |
| `min_discount` | integer | Minimum discount % (1–100) | `50` |
| `limit` | integer | Results per page (default: 50, max: 100) | `20` |
| `skip` | integer | Number of results to skip | `50` |

### Examples

```bash
# All free games
GET /deals/free

# Epic Games deals only
GET /deals/?platform=epic

# Steam deals with at least 75% discount
GET /deals/?platform=steam&min_discount=75

# Paginate: page 2 with 20 results per page
GET /deals/?limit=20&skip=20
```

### Response Schema

```json
{
  "id": "string",
  "title": "string",
  "platform": "epic | steam | gog",
  "type": "free | deal",
  "original_price": 29.99,
  "discount_percent": 75,
  "url": "https://store.example.com/game",
  "image_url": "https://cdn.example.com/image.jpg",
  "end_date": "2024-12-31T23:59:59Z",
  "fetched_at": "2024-12-01T12:00:00Z"
}
```

---

## Data Sources

| Platform | Source | Coverage |
|----------|--------|----------|
| Epic Games | `freeGamesPromotions` API | Weekly free games only |
| Steam | `featuredcategories` API | Top 20 featured specials |
| GOG | `catalog` API | Top 20 trending discounted games |

---

## License

MIT
