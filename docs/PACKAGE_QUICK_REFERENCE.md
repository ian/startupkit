# Package Strategy Quick Reference

> 📖 For full details, see [PACKAGE_STRATEGY.md](./PACKAGE_STRATEGY.md)

## Decision Tree

```
Need to create a package?
│
├─ Will it be used across multiple projects? ────────────── YES ──→ Centralized (@startupkit/*)
│                                                            │
│                                                            └─ Does it need project-specific config?
│                                                               │
│                                                               ├─ YES → Hybrid Pattern
│                                                               └─ NO  → Centralized Only
│
└─ NO → Local (@repo/*)
```

## Package Types at a Glance

| Feature | Centralized | Local | Hybrid |
|---------|-------------|-------|--------|
| **Location** | `packages/` | `templates/repo/packages/` | Both |
| **Scope** | `@startupkit/*` | `@repo/*` | Both |
| **Published** | ✅ NPM | ❌ Private | ✅ Core only |
| **Compiled** | ✅ Rollup | ❌ Source | ✅ Core only |
| **Versioned** | ✅ Semver | ❌ No | ✅ Core only |
| **Iteration** | 🐢 Slower | ⚡ Fast | ⚡ Wrapper fast |
| **Use Case** | Multi-project | Single project | Best of both |

## CLI Commands

### Create a Package

```bash
# Interactive (recommended)
pnpm add-package

# Choose from:
# 1. Local Package (@repo/*) - Project-specific, fast iteration
# 2. Centralized Package (@startupkit/*) - Shared across projects
```

### Version Management

```bash
# Bump centralized packages (only affects @startupkit/* packages)
./scripts/bump           # patch: 0.4.0 → 0.4.1
./scripts/bump minor     # minor: 0.4.0 → 0.5.0
./scripts/bump major     # major: 0.4.0 → 1.0.0

# Note: Local packages (@repo/*) don't need versioning
```

## Package Configuration

### Centralized Package (`@startupkit/*`)

```json
{
  "name": "@startupkit/my-package",
  "version": "0.4.0",
  "main": "./dist/esm/index.js",
  "types": "./dist/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/types/index.d.ts",
      "import": "./dist/esm/index.js"
    }
  },
  "scripts": {
    "build": "rollup -c && tsc --emitDeclarationOnly",
    "clean": "rm -rf ./dist"
  }
}
```

### Local Package (`@repo/*`)

```json
{
  "name": "@repo/my-package",
  "private": true,
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    }
  },
  "dependencies": {
    "@repo/other": "workspace:*"
  }
}
```

### Hybrid Pattern

**Core** (`@startupkit/auth`):
```json
{
  "name": "@startupkit/auth",
  "version": "0.4.0"
}
```

**Wrapper** (`@repo/auth`):
```json
{
  "name": "@repo/auth",
  "private": true,
  "dependencies": {
    "@startupkit/auth": "0.4.0",
    "@repo/db": "workspace:*",
    "@repo/emails": "workspace:*"
  }
}
```

## Common Patterns

### Import Patterns

```typescript
// Centralized (compiled, from dist/)
import { parseUrl } from "@startupkit/utils";

// Local (source, directly)
import { Button } from "@repo/ui/components/button";

// Hybrid (wrapper exposes everything)
import { authClient } from "@repo/auth";
```

### Export Patterns

```typescript
// Centralized: Export compiled code
export * from "./lib/utils";

// Local: Export source directly
export * from "./components/button";

// Hybrid: Wrapper re-exports core + adds extras
export { createAuthClient } from "@startupkit/auth";
export * from "./custom-hooks";
```

## Real Examples

### ✅ Good: Centralized

```typescript
// @startupkit/utils - Framework-agnostic utilities
export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "-");
}
```

### ✅ Good: Local

```typescript
// @repo/db - Project-specific Drizzle schema
export * from "./schema";
export { db } from "./client";
```

### ✅ Good: Hybrid

```typescript
// @startupkit/auth - Core auth logic
export { createAuthClient } from "better-auth/react";

// @repo/auth - Project wrapper
import { createAuth } from "@startupkit/auth";
import { db, users } from "@repo/db";

export const auth = createAuth({
  db,
  users,
  // ... project-specific config
});
```

## Anti-Patterns

### ❌ Bad: Centralized package with project-specific code

```typescript
// @startupkit/payments - DON'T DO THIS
import { db } from "@repo/db"; // ❌ Can't import local packages
```

**Fix**: Use hybrid pattern instead

### ❌ Bad: Local package duplicated across projects

```typescript
// @repo/utils in multiple projects with same code
// ❌ Should be centralized
```

**Fix**: Extract to `@startupkit/utils`

### ❌ Bad: Centralized package with frequent breaking changes

```typescript
// @startupkit/ui - Constantly changing
// ❌ Makes updates painful
```

**Fix**: Make it a local package for easier iteration

## Migration Paths

### Local → Centralized

1. Move from `templates/repo/packages/` to `packages/`
2. Update `package.json`:
   - Change name to `@startupkit/*`
   - Remove `"private": true`
   - Add version and compilation
3. Add build scripts (rollup + tsc)
4. Publish to NPM

### Centralized → Local

1. Move from `packages/` to project's `packages/`
2. Update `package.json`:
   - Change name to `@repo/*`
   - Add `"private": true`
   - Update exports to point to source
3. Remove build scripts
4. Update imports to use source

### Standalone → Hybrid

1. Keep centralized core as-is
2. Create local wrapper package
3. Import core in wrapper
4. Add project-specific integrations
5. Update consumers to use wrapper

## Analytics Package Decision

**For product apps**: Use `@repo/analytics`
- ✅ Type-safe events
- ✅ Server-side tracking
- ✅ Feature flags

**For marketing sites**: Use `@startupkit/analytics`
- ⚠️ Legacy, consider deprecating
- Client-side only
- Multiple providers

## Need Help?

1. **Not sure which type?** → Start with **local**, extract to centralized later if needed
2. **Complex feature?** → Use **hybrid pattern**
3. **Simple utility?** → Use **centralized**
4. **Project-specific?** → Use **local**

📖 See [PACKAGE_STRATEGY.md](./PACKAGE_STRATEGY.md) for detailed guidelines

