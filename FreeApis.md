# Free APIs for Practice Projects
## No Credit Card Required

All APIs listed here are free to use for learning and portfolio projects. Rate limits noted where relevant.

---

## No Auth Required (Just Fetch)

These work immediately — no signup needed.

| API | What it does | Base URL |
|-----|-------------|---------|
| JSONPlaceholder | Fake posts, users, todos | https://jsonplaceholder.typicode.com |
| Random User | Generate fake user data | https://randomuser.me/api |
| Open Library | Books and authors | https://openlibrary.org/api |
| REST Countries | Country data | https://restcountries.com/v3.1 |
| Cat Facts | Random cat facts | https://catfact.ninja/fact |
| Quotable | Random quotes | https://api.quotable.io/random |
| Dog CEO | Random dog images | https://dog.ceo/api/breeds/image/random |
| Advice Slip | Random advice | https://api.adviceslip.com/advice |
| Open Meteo | Weather (no key) | https://api.open-meteo.com |
| Deck of Cards | Card deck simulator | https://deckofcardsapi.com |

**Open Meteo — Waregem weather, no API key:**
```
GET https://api.open-meteo.com/v1/forecast
  ?latitude=50.88
  &longitude=3.43
  &current_weather=true
  &hourly=temperature_2m,precipitation
```

---

## Free Tier with API Key (5-10 min signup)

### OpenWeatherMap
- **What:** Current weather, forecasts, historical data
- **Sign up:** openweathermap.org/api
- **Free tier:** 1,000 calls/day
- **Waregem endpoint:**
  ```
  GET https://api.openweathermap.org/data/2.5/weather?q=Waregem,BE&appid=KEY&units=metric
  ```

### NewsAPI
- **What:** News articles from 70,000+ sources
- **Sign up:** newsapi.org
- **Free tier:** 100 requests/day (developer plan)
- **Example:** Headlines about Belgium
  ```
  GET https://newsapi.org/v2/top-headlines?country=be&apiKey=KEY
  ```

### The Movie Database (TMDB)
- **What:** Movies, TV shows, actors, ratings
- **Sign up:** themoviedb.org/settings/api
- **Free tier:** Generous — no strict daily limit
- **Example:** Popular movies
  ```
  GET https://api.themoviedb.org/3/movie/popular?api_key=KEY
  ```

### ExchangeRate-API
- **What:** Currency exchange rates
- **Sign up:** exchangerate-api.com
- **Free tier:** 1,500 requests/month
- **Example:**
  ```
  GET https://v6.exchangerate-api.com/v6/KEY/latest/EUR
  ```

### OpenFDA
- **What:** FDA drug, device, food data
- **Sign up:** open.fda.gov/apis/authentication (optional — higher limits with key)
- **Free tier:** 240 requests/minute without key

### IP Geolocation (ip-api)
- **What:** Get location from IP address
- **No signup needed**
- **Free tier:** 45 requests/minute
  ```
  GET http://ip-api.com/json/
  ```

---

## GitHub API (Use Your Existing Account)

No extra signup — use your GitHub account.

```
# Your profile
GET https://api.github.com/users/XavierDM

# Your repos
GET https://api.github.com/users/XavierDM/repos

# A specific repo
GET https://api.github.com/repos/XavierDM/repo-name

# Commits
GET https://api.github.com/repos/XavierDM/repo-name/commits

# Authenticated (higher rate limit — 5000/hr vs 60/hr)
Authorization: token ghp_yourtoken
```

Create a Personal Access Token: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token (read:user, public_repo scopes).

---

## Game/Entertainment APIs

### Steam Web API
- **What:** Steam games, player stats, achievements
- **Get key:** steamcommunity.com/dev/apikey
- **Free:** Yes
- **Example:** Your games list
  ```
  GET https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=KEY&steamid=YOUR_STEAM_ID
  ```

### IGDB (Internet Games Database)
- **What:** Comprehensive game database
- **Sign up:** api.igdb.com (via Twitch developer account)
- **Free tier:** 4 requests/second
- Used in the Week 7 game library tracker project

### Board Game Atlas
- **What:** Board game data
- **Sign up:** boardgameatlas.com/api/docs
- **Free tier:** Generous

### Pokémon API (PokeAPI)
- **What:** All Pokémon data
- **No auth needed**
- **Free:** https://pokeapi.co/api/v2/pokemon/pikachu

---

## Productivity / Data APIs

### Notion API
- **What:** Read/write Notion databases and pages
- **Sign up:** Create integration at notion.so/my-integrations
- **Free:** Yes
- Great for: storing automation results, building personal dashboards

### Airtable API
- **What:** Spreadsheet-database hybrid
- **Sign up:** airtable.com → Account → API
- **Free tier:** 1,200 records/base

### Google Sheets API (via n8n node)
- **What:** Read/write Google Sheets
- **Auth:** Google OAuth (set up in n8n credentials)
- Free — just needs a Google account

---

## Belgium-Specific / Transport APIs

### iRail API (Belgian Rail Open Data)
- **What:** NMBS/SNCB train connections, stations, live data
- **No auth needed**
- **Base URL:** https://api.irail.be
- **Endpoints:**
  ```
  GET https://api.irail.be/stations/?format=json
  GET https://api.irail.be/connections/?from=Gent-Sint-Pieters&to=Brussel-Centraal&format=json
  GET https://api.irail.be/liveboard/?station=Waregem&format=json
  ```
- **Perfect for NMBS/SNCB context projects** — shows domain knowledge in your portfolio

### De Lijn API
- **What:** Flemish bus and tram data
- **Sign up:** data.delijn.be
- **Free tier:** Available

### OpenStreetMap / Nominatim
- **What:** Geocoding, maps, POI data
- **No auth needed**
- **Geocode an address:**
  ```
  GET https://nominatim.openstreetmap.org/search?q=Waregem+Belgium&format=json
  ```

---

## Useful for Automation Projects

### Webhook.site
- **What:** Inspect incoming webhooks — instant temporary URLs
- **No signup:** https://webhook.site
- **Use for:** Testing n8n workflows that send webhooks

### Mocky
- **What:** Create mock API endpoints that return custom responses
- **No signup:** mocky.io
- **Use for:** Testing your code against fake API responses

### httpbin
- **What:** HTTP testing — echo requests, test auth, delays
- **No signup:** https://httpbin.org
- **Example:**
  ```
  GET https://httpbin.org/get           — Returns your request details
  POST https://httpbin.org/post         — Echoes your POST body
  GET https://httpbin.org/delay/2       — Responds after 2 seconds (test timeouts)
  GET https://httpbin.org/status/404    — Returns a 404 (test error handling)
  ```

---

## Rate Limit Quick Reference

| API | Free Limit |
|-----|-----------|
| GitHub (unauth) | 60 req/hour |
| GitHub (auth) | 5,000 req/hour |
| OpenWeatherMap | 1,000 req/day |
| NewsAPI | 100 req/day |
| TMDB | ~40 req/10s |
| ip-api | 45 req/minute |
| iRail | No stated limit (be reasonable) |
| JSONPlaceholder | No limit |
| PokeAPI | No limit (with caching) |

**Best practice for learning:** Cache responses locally during development. Saves your quota and makes development faster.

```typescript
// Simple file cache for development
import fs from 'fs';

async function fetchWithCache<T>(url: string, cacheFile: string): Promise<T> {
  if (fs.existsSync(cacheFile)) {
    return JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
  }
  const response = await fetch(url);
  const data = await response.json();
  fs.writeFileSync(cacheFile, JSON.stringify(data));
  return data;
}
```
