---
name: startupkit
description: AI-powered research toolkit for entrepreneurs - domain search, SEO, Google Trends, keyword research, mobile app research, and market research. MCP server for AI agents.
tools:
  - trends
  - seo
  - keywords
  - domains
  - apps
  - research
  - chat
  - credits
credits:
  starter: 10/month
  pro: 1000/month
  enterprise: 10000/month
auth: API key required (set STARTUPKIT_API_KEY environment variable)
---

# StartupKit Pro MCP Server

MCP server providing entrepreneurial research tools for AI agents via the Model Context Protocol.

## Installation

Configure in your MCP client (Cursor, Claude Desktop, etc.):

```json
{
  "mcpServers": {
    "startupkit-pro": {
      "command": "node",
      "args": ["/path/to/packages/mcp-pro/dist/index.js"],
      "env": {
        "STARTUPKIT_API_KEY": "your-api-key"
      }
    }
  }
}
```

Or use the remote server:

```json
{
  "mcpServers": {
    "startupkit-pro": {
      "url": "https://pro.startupkit.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

## Available Tools

### trends

Search Google Trends data for keywords and topics.

- Input: `keyword` (string, required), `region` (string, optional), `timeframe` (string, optional)
- Credits: 2

### seo

Get SEO overview and analytics for any domain.

- Input: `domain` (string, required)
- Credits: 5

### keywords

Research keywords for SEO and content strategy.

- Input: `keyword` (string, required), `limit` (number, optional)
- Credits: 3

### domains

Search and check domain name availability.

- Input: `name` (string, required), `extensions` (array, optional)
- Credits: 1 per domain

### apps

Research mobile apps on iOS and Android.

- Input: `app` (string, required), `store` (string, optional)
- Credits: 3

### research

Comprehensive market research combining multiple tools.

- Input: `topic` (string, required), `tools` (array, optional)
- Credits: Sum of tools used

### chat

Interactive AI research assistant.

- Input: `topic` (string, required)
- Credits: 5

### credits

Check your credit balance and usage history.

- Input: `action` (string, optional: "balance" or "history")
- Credits: 0

## Credit Costs

| Tool     | Credits  |
| -------- | -------- |
| trends   | 2        |
| seo      | 5        |
| keywords | 3        |
| domains  | 1/domain |
| apps     | 3        |
| research | varies   |
| chat     | 5        |
| credits  | 0        |

## Plans

- **Starter**: 10 credits/month (free)
- **Pro**: 1000 credits/month ($29)
- **Enterprise**: 10000 credits/month ($99)

New users get 10 bonus credits.

## CLI Companion

The CLI tool provides the same functionality:

```bash
# Install
npm install -g @startupkit/pro

# Login
startupkit-pro login

# Use tools
startupkit-pro trends "artificial intelligence"
startupkit-pro seo example.com
startupkit-pro keywords "saas pricing"
startupkit-pro domains myidea --ext .com,.io
```
