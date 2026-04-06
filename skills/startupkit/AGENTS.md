# StartupKit Pro - Agent Documentation

StartupKit Pro provides AI agents and CLI tools with capabilities for domain name search, SEO data searches, Google Trends, keyword research, mobile app research, and market research.

## Available Tools

### 1. Trends (`trends`)

Search Google Trends data for keywords and topics.

**Input:**
- `keyword` (string, required): The search term to analyze
- `region` (string, optional): Geographic region code (US, GB, AU, CA, etc.). Default: US
- `category` (number, optional): Category ID for filtering
- `timeframe` (string, optional): Time range (7d, 30d, 90d, 365d). Default: 90d

**Output:**
```json
{
  "keyword": "string",
  "region": "string", 
  "timeframe": "string",
  "interest": [{"keyword": "string", "timestamp": "ISO8601", "value": 0-100}],
  "relatedQueries": [{"query": "string", "value": 0-100}],
  "relatedTopics": [{"topic": "string", "type": "string", "value": 0-100}]
}
```

**Credits:** 2 per request

---

### 2. SEO Overview (`seo`)

Get comprehensive SEO analytics for any domain including authority scores, backlinks, and traffic data.

**Input:**
- `domain` (string, required): Domain to analyze (e.g., "example.com")

**Output:**
```json
{
  "domain": "string",
  "overview": {
    "domainAuthority": 0-100,
    "pageAuthority": 0-100,
    "backlinks": number,
    "referringDomains": number,
    "monthlyVisits": number,
    "organicKeywords": number
  },
  "topKeywords": [{"keyword": "string", "position": number, "traffic": number, "trafficPercent": number}],
  "topPages": [{"url": "string", "traffic": number, "keywords": number}]
}
```

**Credits:** 5 per request

---

### 3. Keywords (`keywords`)

Research keywords for SEO and content strategy with search volume, competition, and CPC data.

**Input:**
- `keyword` (string, required): Seed keyword to research
- `limit` (number, optional): Maximum results. Default: 20, Max: 100

**Output:**
```json
{
  "keyword": "string",
  "keywords": [{
    "keyword": "string",
    "searchVolume": number,
    "competition": "low|medium|high",
    "cpc": number,
    "trend": [number, number, ...]
  }],
  "questions": [{"question": "string", "popularity": 0-100}]
}
```

**Credits:** 3 per request

---

### 4. Domain Search (`domains`)

Search and check domain name availability across multiple TLDs.

**Input:**
- `name` (string, required): Domain name to search (without TLD)
- `extensions` (string[], optional): TLDs to check. Default: [".com", ".io", ".co", ".ai", ".app"]

**Output:**
```json
[{
  "name": "string",
  "available": boolean,
  "price": number,
  "renewalPrice": number,
  "registrar": "string"
}]
```

**Credits:** 1 per domain checked

---

### 5. App Research (`apps`)

Research mobile applications on iOS App Store and Google Play Store.

**Input:**
- `app` (string, required): App name or package/bundle ID
- `store` (string, optional): "ios", "android", or "both". Default: "both"

**Output:**
```json
{
  "name": "string",
  "appStore": "iOS|Android",
  "developer": "string",
  "iconUrl": "string",
  "rating": 0-5,
  "ratingsCount": number,
  "price": number,
  "category": "string",
  "version": "string",
  "size": "string",
  "installCount": "string",
  "ageRating": "string",
  "released": "ISO8601",
  "updated": "ISO8601",
  "description": "string",
  "similarApps": [{"name": "string", "appId": "string"}]
}
```

**Credits:** 3 per request

---

### 6. Market Research (`research`)

Comprehensive market research combining multiple tools into a single report.

**Input:**
- `topic` (string, required): Research topic or industry
- `tools` (string[], optional): Tools to use. Default: ["trends", "seo", "keywords", "domains"]

**Output:**
```json
{
  "trends": {...},
  "seo": {...},
  "keywords": {...},
  "domains": [...],
  "summary": "string"
}
```

**Credits:** Sum of individual tools used

---

### 7. Research Chat (`chat`)

Interactive AI research assistant that intelligently uses research tools based on your questions.

**Input:**
- `topic` (string, required): What you want to research

**Output:**
```json
{
  "message": "string (human-readable research findings)",
  "toolsUsed": ["string", ...],
  "creditsUsed": number,
  "creditsRemaining": number
}
```

**Credits:** 5 per message

---

## Credit System

### Plans

| Plan | Credits/Month | Price |
|------|---------------|-------|
| Starter | 10 | Free |
| Pro | 1000 | $29/mo |
| Enterprise | 10000 | $99/mo |

All plans include 10 bonus credits for new users.

### Credit Costs by Tool

- Trends: 2 credits
- SEO Overview: 5 credits
- Keywords: 3 credits
- Domain Search: 1 credit per domain
- App Research: 3 credits
- Market Research: Sum of tools used
- Research Chat: 5 credits

---

## Authentication

All API requests require authentication using a Bearer token:

```
Authorization: Bearer sk_pro_xxxxxxxxxxxxxxxxxxxx
```

### CLI Usage

```bash
# Login
startupkit-pro login

# Check credits
startupkit-pro credits

# Search trends
startupkit-pro trends "artificial intelligence" --region US --days 90

# SEO analysis
startupkit-pro seo example.com

# Keyword research
startupkit-pro keywords "saas pricing"

# Domain search
startupkit-pro domains myidea --ext .com,.io,.co

# App research
startupkit-pro apps slack --store ios

# Full research
startupkit-pro research "online education" --tools trends,seo,keywords
```

---

## Best Practices

1. **Start with broad research, then narrow down** - Use Market Research first to get a comprehensive view, then drill into specific areas with individual tools.

2. **Use Keywords before content creation** - Always research keywords before creating content to ensure you're targeting achievable terms.

3. **Check domain availability early** - When validating an idea, check domain availability alongside keyword research.

4. **Monitor trends for timing** - Check Google Trends to understand if a topic is growing, stable, or declining before investing heavily.

5. **Use Research Chat for quick answers** - For fast research questions, use the chat interface which intelligently selects the right tools.

6. **Track your credit usage** - Use `credits` command to monitor your consumption and avoid running out mid-research.

---

## Error Handling

Common error codes:

- `401` - Invalid or expired API key
- `402` - Insufficient credits
- `429` - Rate limited (wait before retry)
- `400` - Invalid request parameters
- `500` - Internal server error

---

## Rate Limits

- Starter: 10 requests/minute
- Pro: 100 requests/minute
- Enterprise: 1000 requests/minute
