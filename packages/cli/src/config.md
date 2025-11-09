# Template Dependency System

The StartupKit CLI includes an automatic dependency management system that ensures all required packages and configurations are installed when adding apps to your workspace.

## How It Works

Each app template includes a `startupkit.config.ts` file that declares its dependencies:

```typescript
import type { StartupKitConfig } from "@startupkit/cli/config"

const config: StartupKitConfig = {
	type: "app",
	dependencies: {
		packages: ["analytics", "auth", "db", "ui", "utils"],
		config: ["nextjs", "biome", "typescript"],
	},
}

export default config
```

When you run `npx startupkit add`, the CLI will:

1. **Check dependencies** - Scan the template's config to find required packages and config
2. **Detect missing items** - Compare against your workspace to find what's missing
3. **Prompt for installation** - Ask if you want to install missing dependencies
4. **Auto-install** - Clone missing packages/config from the StartupKit repo
5. **Install the template** - Finally, add your requested app

## Template Dependencies

### Next.js App
- **Packages**: `analytics`, `auth`, `db`, `ui`, `utils`
- **Config**: `nextjs`, `biome`, `typescript`

### Vite App
- **Packages**: `analytics`, `auth`, `db`, `ui`, `utils`
- **Config**: `biome`, `typescript`

### Workspace Packages

The following workspace packages are available and will be automatically installed as dependencies:

#### @repo/analytics
- **Config**: `biome`, `typescript`

#### @repo/auth
- **Packages**: `db` (required for session storage)
- **Config**: `biome`, `typescript`

#### @repo/db
- **Config**: `biome`, `typescript`

#### @repo/emails
- **Config**: `typescript`

#### @repo/ui
- **Config**: `biome`, `typescript`

#### @repo/utils
- **Config**: `typescript`

## Example Workflow

```bash
# In an empty workspace (only packages/analytics exists)
$ npx startupkit add next --name web

🔍 Checking template dependencies...

⚠️  This template requires 5 workspace dependencies that are not installed:

  Packages:
    - @repo/auth
    - @repo/db
    - @repo/ui
    - @repo/utils
  Config:
    - @config/nextjs

? Would you like to install these dependencies now? (Y/n) 

✓ Installing @repo/auth
✓ Installing @repo/db
✓ Installing @repo/ui
✓ Installing @repo/utils
✓ Installing @config/nextjs
✓ Installing dependencies
✅ All dependencies installed successfully

✓ Cloning template into apps/web
✓ Installing dependencies

✅ App added successfully at: apps/web
```

## Adding Config Files to Custom Templates

If you're creating custom app templates or forking StartupKit templates, add a `startupkit.config.ts` file at the root:

```typescript
import type { StartupKitConfig } from "@startupkit/cli/config"

const config: StartupKitConfig = {
	type: "app",
	dependencies: {
		// List workspace packages this app needs
		packages: ["auth", "db", "ui"],
		
		// List config packages this app needs
		config: ["nextjs", "typescript"],
	},
}

export default config
```

**Note**: Package names should match the directory names in `packages/` and `config/` (without the `@repo/` or `@config/` prefix).

## Adding Individual Packages

If you need to add workspace packages individually (e.g., just adding `@repo/auth` without a full app), you can manually copy them from the StartupKit templates or use the init command to get the full workspace setup.

## Dependency Resolution

The CLI uses a simple dependency resolution strategy:

1. **No recursive dependencies** - Only direct dependencies are checked
2. **Fail fast** - If a user declines to install missing dependencies, the command exits
3. **Workspace-aware** - Checks `packages/` and `config/` directories
4. **Template source** - Missing items are cloned from `ian/startupkit/templates/packages/*` or `ian/startupkit/templates/repo/config/*`

## Future Enhancements

Potential improvements for the dependency system:

- [ ] Recursive dependency resolution (e.g., if auth needs db, auto-detect that)
- [ ] Version checking and compatibility warnings
- [ ] Dependency graph visualization
- [ ] Custom template repositories with dependency configs
- [ ] Dry-run mode to preview what would be installed

