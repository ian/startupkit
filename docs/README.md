# StartupKit Documentation

Welcome to the StartupKit documentation. This directory contains comprehensive guides and best practices for working with StartupKit.

## Available Guides

### 📦 [Package Strategy](./PACKAGE_STRATEGY.md)

**Status**: ✅ Complete  
**Related Ticket**: [STARTUP-93](https://linear.app/startup/issue/STARTUP-93)

Comprehensive guide to StartupKit's hybrid package approach, including:
- When to use centralized packages (`@startupkit/*`) vs local packages (`@repo/*`)
- The hybrid pattern for complex features
- Decision framework and flowcharts
- Complete package inventory
- Analytics package strategy resolution
- Best practices and examples

**Quick Links**:
- [Decision Framework](./PACKAGE_STRATEGY.md#decision-framework)
- [Current Package Inventory](./PACKAGE_STRATEGY.md#current-package-inventory)
- [Analytics Package Strategy](./PACKAGE_STRATEGY.md#analytics-package-strategy)
- [Best Practices](./PACKAGE_STRATEGY.md#best-practices)

## Quick Reference

### Package Types

```
┌──────────────────────────────────────────────────────────┐
│ Centralized (@startupkit/*)                              │
│ • Published to NPM                                       │
│ • Compiled with rollup                                   │
│ • Semantic versioning                                    │
│ • Multi-project use                                      │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Local (@repo/*)                                          │
│ • Private to monorepo                                    │
│ • Source consumed directly                               │
│ • Fast iteration                                         │
│ • Project-specific                                       │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Hybrid Pattern                                           │
│ • Centralized core (@startupkit/*)                       │
│ • Local wrapper (@repo/*)                                │
│ • Best of both worlds                                    │
└──────────────────────────────────────────────────────────┘
```

### Common Commands

```bash
# Create a new local package
pnpm add-package
# Select: "Local Package (@repo/*) - Project-specific, fast iteration"

# Create a new centralized package
pnpm add-package
# Select: "Centralized Package (@startupkit/*) - Shared across projects"

# Bump centralized package versions
./scripts/bump patch  # 0.4.0 → 0.4.1
./scripts/bump minor  # 0.4.0 → 0.5.0
./scripts/bump major  # 0.4.0 → 1.0.0
```

### Package Examples

**Centralized Only**:
- `@startupkit/utils` - Framework-agnostic utilities
- `@startupkit/cli` - CLI tooling

**Hybrid Pattern** (Recommended):
- `@startupkit/auth` + `@repo/auth` - Auth with project integrations
- Future: `@startupkit/payments` + `@repo/payments`

**Local Only**:
- `@repo/ui` - shadcn-based UI components
- `@repo/db` - Drizzle ORM database schema
- `@repo/emails` - Email templates
- `@repo/analytics` - Product analytics (recommended)

## When to Use Each Type

| Use Case | Package Type |
|----------|-------------|
| 🌍 Multi-project sharing | Centralized |
| ⚡ Rapid iteration needed | Local |
| 🏗️ Project infrastructure | Local |
| 📚 Stable business logic | Centralized |
| 🎨 UI components | Local |
| 🔌 Core + custom config | Hybrid |

## Contributing

When adding new documentation:

1. Create a new `.md` file in this directory
2. Add it to the "Available Guides" section above
3. Include clear examples and use cases
4. Link to related Linear tickets where applicable
5. Update the quick reference if needed

## Support

- **GitHub**: https://github.com/01-studio/startupkit
- **Website**: https://startupkit.com
- **Linear**: https://linear.app/startup

---

📝 Last updated: 2025-10-25  
🎫 Related tickets: STARTUP-93

