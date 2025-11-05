# CLI Init Command Tests

## What Gets Tested

The `init` command creates a new StartupKit project by cloning two separate directories:

1. **`templates/repo`** - Base monorepo structure
2. **`templates/packages`** - Shared packages (ui, auth, db, etc.)

### Expected Installation Structure

```
my-project/
├── package.json           <- from templates/repo
├── pnpm-workspace.yaml    <- from templates/repo
├── turbo.json            <- from templates/repo
├── biome.jsonc           <- from templates/repo
├── components.json       <- from templates/repo
├── apps/                 <- from templates/repo
│   └── (app templates)
├── config/               <- from templates/repo
│   ├── biome/
│   └── typescript/
└── packages/             <- from templates/packages
    ├── ui/
    ├── auth/
    ├── db/
    ├── analytics/
    ├── utils/
    └── emails/
```

## Test Coverage

### 1. Unit Tests (`init.test.ts`)

**Fast tests (no I/O):**
- ✅ Slugify function with various inputs (spaces, special chars, etc.)
- ✅ Path resolution for degit sources
- ✅ Branch name handling

### 2. Full Integration Test (`init.integration.test.ts`)

**One project creation, comprehensive checks:**
- ✅ Repo structure files cloned correctly
- ✅ Packages directory created with all packages
- ✅ PROJECT placeholders replaced
- ✅ Drizzle schema and config exist
- ✅ Auth package structure correct
- ✅ UI package exports properly configured
- ✅ pnpm-workspace.yaml valid
- ✅ No template artifacts (.git, PLACEHOLDER)

## Key Validation Points

### Packages Directory
After installation, `packages/` should contain:
- `ui/` - UI components, Tailwind config, PostCSS config
- `auth/` - Authentication setup
- `db/` - Database schema and migrations
- `analytics/` - Analytics integration
- `utils/` - Utility functions
- `emails/` - Email templates

### Package Exports (UI Package)
The `@repo/ui` package must export:
- `./components/*` - Individual components
- `./hooks` - React hooks
- `./providers` - Context providers
- `./utils` - Utility functions (cn, etc.)
- `./postcss.config` - PostCSS configuration
- `./styles.css` - Global styles
- `./tailwind.config` - Tailwind configuration

### Template References
Templates in `apps/next/` should correctly reference:
```typescript
// tsconfig.json
"@repo/ui/*": ["../../packages/ui/src/*"]

// tailwind.config.ts
export * from "@repo/ui/tailwind.config"

// postcss.config.mjs
export { default } from "@repo/ui/postcss.config"
```

## Running Tests

```bash
# Run all tests (once)
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm vitest run src/cmd/init.test.ts

# Run integration tests
pnpm vitest run src/cmd/init.integration.test.ts
```

## Test Development Notes

- Tests use **Vitest** for fast, modern testing experience
- Integration tests should run the actual `init` command
- Clean up test directories in `afterAll()` hooks
- Verify both structure AND functionality
- Use `expect().toBeTruthy()` for existence checks
- Use `expect().toBeDefined()` for value checks
- Vitest provides great TypeScript support and watch mode

