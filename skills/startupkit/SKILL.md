---
name: startupkit
description: AI-powered research toolkit for entrepreneurs - domain search, SEO, Google Trends, keyword research, mobile app research, and market research
tools:
  - name: trends
    description: Search Google Trends data for keywords and topics
    input: keyword (string), region (string, optional), timeframe (string, optional)
  - name: seo
    description: Get SEO overview and analytics for any domain
    input: domain (string)
  - name: keywords
    description: Research keywords for SEO and content strategy
    input: keyword (string), limit (number, optional)
  - name: domains
    description: Search and check domain name availability
    input: name (string), extensions (string[], optional)
  - name: apps
    description: Research mobile apps on iOS and Android stores
    input: app (string), store (string, optional)
  - name: research
    description: Comprehensive market research combining multiple tools
    input: topic (string), tools (string[], optional)
  - name: chat
    description: Interactive AI research assistant
    input: topic (string)
credits:
  starter: 10/month
  pro: 1000/month
  enterprise: 10000/month
auth: API key required
---
