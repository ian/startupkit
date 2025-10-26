# Package Refactor Summary

**Date**: October 26, 2025  
**Scope**: Refactored @startupkit/analytics and @startupkit/auth to follow shadcn principles

## The Shadcn Principle Applied

> **Import directly from upstream libraries. Only use @startupkit/* when it adds real value.**

## What Changed

### @startupkit/analytics - REMOVED!

**Before** (Bundled Dependencies - BAD):
```json
{
  "dependencies": {
    "@analytics/google-analytics": "^1.0.7",
    "analytics": "^0.8.13",
    "posthog-js": "1.154.2",  // Locked version!
    "react-ga": "^3.3.1"
  }
}
```
❌ Problem: Projects stuck with bundled versions, can't upgrade

**After** (REMOVED ENTIRELY - BEST):
```typescript
// No @startupkit/analytics needed!
// @repo/analytics imports directly:
import posthog from "posthog-js";  // YOU control version
import { RudderAnalytics } from "@rudderstack/analytics-js";  // YOU control version
```
✅ Solution: No unnecessary abstraction, direct imports only

**Why Removed?**
- Wasn't providing real value
- Multi-provider coordination is trivial without a framework
- Utilities like `pruneEmpty` belong in `@repo/utils`
- Following shadcn principle: only create wrappers when they add substantial value

### @startupkit/auth - Now Uses Peer Dependencies

**Before**:
```json
{
  "peerDependencies": {
    "better-auth": "1.3.27"  // Exact version
  }
}
```

**After**:
```json
{
  "peerDependencies": {
    "better-auth": ">=1.3.0"  // Flexible version
  }
}
```

**What It Provides**:
- `createAuth()` helper with StartupKit conventions
- Default user fields (firstName, lastName, phone)
- Hooks for onUserLogin, onUserSignup
- AuthProvider component
- Pre-configured plugins setup

### @repo/analytics - Imports Directly (No Wrapper!)

**Key Changes**:
```typescript
// Direct imports from upstream (YOU control versions)
import posthog from "posthog-js";
import { RudderAnalytics } from "@rudderstack/analytics-js";
import { pruneEmpty } from "@repo/utils";  // Utilities from your utils package

// Your implementation - no wrapper needed!
export const analytics = {
  track: (event, props) => {
    posthog.capture(event, pruneEmpty(props));
    rudderstack.track(event, props);
  }
};
```

This is the **pure shadcn approach** - no centralized package at all!

### @repo/auth - Now Imports Directly

**Key Changes**:
```typescript
// Direct import from better-auth (YOU control version)
import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

// Uses @startupkit/auth helper for server-side (adds value)
import { createAuth } from "@startupkit/auth";
```

## Benefits of This Refactor

### 1. No Version Lock-in
**Before**: PostHog releases security patch → stuck waiting for @startupkit update  
**After**: Run `pnpm update posthog-js` → fixed immediately

### 2. You Own The Code
**Before**: @repo/analytics was a wrapper with limited visibility  
**After**: Full source code in your repo, modify freely like shadcn components

### 3. Minimal Core
**Before**: @startupkit/* packages were heavy wrappers  
**After**: Tiny utility packages, only what's truly reusable

### 4. Easy Upgrades
```bash
# Upgrade PostHog when YOU want
pnpm update posthog-js

# Upgrade Stripe when new features release
pnpm update stripe

# Upgrade better-auth for security patches
pnpm update better-auth
```

## Files Changed

### @startupkit/analytics
**DELETED ENTIRELY** - Not needed!
- Package provided no real value
- @repo/analytics imports directly from upstream
- Utilities moved to @repo/utils where they belong
- Following shadcn principle: don't create wrappers unnecessarily

### @startupkit/auth
**Modified**:
- `package.json` - Changed to flexible peer dependencies (>=1.3.0)

### @repo/analytics
**Modified**:
- `src/index.ts` - Updated exports
- `src/components/analytics-provider.tsx` - Direct posthog/rudderstack imports
- `src/server.ts` - Direct rudderstack imports
- `src/types.ts` - Added Flags type
- `src/vendor/rudderstack.ts` - Added direct import comments
- `src/vendor/posthog.ts` - Added direct import comments

### @repo/auth
**Modified**:
- `src/index.ts` - Direct better-auth imports
- `src/server.ts` - Uses @startupkit/auth helper
- `src/components/provider.tsx` - Simplified with direct imports

### Documentation
**Modified**:
- `docs/PACKAGE_STRATEGY.md` - Updated hybrid pattern, examples, inventory
- `packages/analytics/README.md` - Updated to reflect new architecture
- `templates/repo/packages/analytics/README.md` - Updated examples

## How to Use

### For New Projects

When you initialize a new StartupKit project:

```bash
pnpm create-startupkit my-app
```

You get:
- `@repo/analytics` - YOUR code, imports posthog/rudderstack directly
- `@repo/auth` - YOUR code, imports better-auth directly
- You control ALL dependency versions

### For Existing Projects

#### Update @repo/analytics

```typescript
// Old (if using @startupkit/analytics)
import { AnalyticsProvider } from "@startupkit/analytics";

// New
import posthog from "posthog-js";
import rudderstack from "@rudderstack/analytics-js";
// Optionally use @startupkit/analytics utilities
import { pruneEmpty } from "@startupkit/analytics";
```

#### Update @repo/auth

```typescript
// Old (if wrapping)
import { createAuthClient } from "@startupkit/auth";

// New (direct)
import { createAuthClient } from "better-auth/react";
// Use @startupkit/auth createAuth helper on server (adds value)
import { createAuth } from "@startupkit/auth";
```

## Architecture Comparison

### Before (Wrapper Pattern - BAD)
```
@startupkit/analytics (bundles posthog v1.154.2)
    ↓ (version locked)
@repo/analytics (wrapper)
    ↓
Your app (can't upgrade posthog)
```

### After (Shadcn Pattern - GOOD)
```
posthog-js (YOU control version)
    ↓ (direct import)
@repo/analytics (your code)
    ↓ (optionally uses)
@startupkit/analytics (utilities only)
```

## Testing

Both packages build successfully:
```bash
✓ @startupkit/analytics built successfully
✓ @startupkit/auth built successfully
```

Peer dependency warnings are expected and correct.

## Next Steps for Other Packages

Apply the same principle to future packages:

### @startupkit/billing (Future)
```typescript
// @repo/billing imports directly
import Stripe from "stripe";  // YOU control version

// Optionally use @startupkit/billing utilities
import { handleSubscriptionLifecycle } from "@startupkit/billing";
```

### @startupkit/emails (Future)
```typescript
// @repo/emails imports directly
import { Resend } from "resend";  // YOU control version

// Your templates are yours
export { VerifyEmail } from "./templates/verify-email";
```

## Summary

This refactor aligns StartupKit with the shadcn philosophy:
1. **Import directly** from upstream libraries
2. **You control** all dependency versions
3. **@startupkit/*packages** provide only utilities (when they add value)
4. **@repo/* code** is yours to own and customize

No more version lock-in. No more waiting for upstream updates. Full control.

