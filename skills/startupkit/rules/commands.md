# StartupKit Pro Commands

## Quick Reference

### Authentication
- `startupkit-pro login` - Login with API key
- `startupkit-pro logout` - Logout
- `startupkit-pro whoami` - Show current user info

### Research Commands

#### Trends
```bash
startupkit-pro trends <query> [options]
  --region, -r <region>    Geographic region (US, GB, AU, CA) [default: US]
  --category, -c <cat>     Category ID
  --days, -d <days>        Time range in days [default: 90]
```

#### SEO
```bash
startupkit-pro seo <domain> [options]
  --overview, -o           Get SEO overview [default: true]
```

#### Keywords
```bash
startupkit-pro keywords <keyword> [options]
  --limit, -l <limit>      Max results [default: 20]
```

#### Domains
```bash
startupkit-pro domains <name> [options]
  --ext, -e <extensions>   Comma-separated extensions [default: .com,.io,.co,.ai,.app]
```

#### Apps
```bash
startupkit-pro apps <app> [options]
  --store, -s <store>      ios, android, or both [default: both]
```

#### Research
```bash
startupkit-pro research <topic> [options]
  --tools, -t <tools>      Comma-separated tools [default: trends,seo,keywords,domains]
```

#### Chat
```bash
startupkit-pro chat [topic]
```

### Credits
```bash
startupkit-pro credits    Show credit balance and usage history
```

---

## Credit Costs

| Command | Credits |
|---------|---------|
| trends | 2 |
| seo | 5 |
| keywords | 3 |
| domains | 1/domain |
| apps | 3 |
| research | sum of tools |
| chat | 5 |
