# StartupKit Next.js Template

A modern Next.js template with authentication, database, and UI components built-in.

## Features

- ✅ **Authentication** - Email OTP & Google OAuth via Better Auth
- ✅ **Database** - PostgreSQL with Drizzle ORM
- ✅ **UI Components** - Shadcn UI components with Tailwind CSS
- ✅ **Analytics** - PostHog integration ready
- ✅ **TypeScript** - Fully typed with strict mode
- ✅ **Monorepo Ready** - Uses workspace packages from StartupKit

## Getting Started

### Prerequisites

1. **PostgreSQL Database**: Set up a PostgreSQL database (local or hosted)
2. **Google OAuth** (optional): Create a Google OAuth application for social sign-in

### Environment Variables

Create a `.env.local` file in the root:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Authentication (Optional - for Google OAuth)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Analytics (Optional)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Installation

```bash
pnpm install
```

### Database Setup

Run database migrations:

```bash
pnpm --filter @repo/db db:migrate
```

### Development

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Authentication

This template includes a complete authentication setup using `@repo/auth` (built on Better Auth).

### Available Routes

- `/` - Home page with authentication overview
- `/sign-in` - Sign in page with Email OTP and Google OAuth
- `/dashboard` - Protected route (requires authentication)

### Authentication Methods

#### Email OTP (One-Time Password)

Users receive a 6-digit code via email that expires in 10 minutes. The OTP is currently logged to console (configure email sending in `src/lib/auth.ts`).

#### Google OAuth

Users can sign in with their Google account. Requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` environment variables.

### Using Authentication in Your Code

#### Client Components

```typescript
"use client"

import { useAuth } from "@repo/auth"

export function MyComponent() {
  const { isAuthenticated, user, logout } = useAuth()

  if (!isAuthenticated) {
    return <a href="/sign-in">Sign In</a>
  }

  return (
    <div>
      <p>Welcome, {user.name}</p>
      <button onClick={logout}>Sign Out</button>
    </div>
  )
}
```

#### Server Components

```typescript
import { withAuth } from "@repo/auth/server"
import { redirect } from "next/navigation"

export default async function ProtectedPage() {
  const { user } = await withAuth()

  if (!user) {
    redirect("/sign-in")
  }

  return <div>Hello, {user.name}</div>
}
```

#### API Routes

```typescript
import { withAuth } from "@repo/auth/server"
import { NextResponse } from "next/server"

export async function GET() {
  const { user } = await withAuth()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({ user })
}
```

## Project Structure

```
src/
├── app/
│   ├── auth/[...all]/         # Auth API routes (served at /auth/*)
│   ├── dashboard/             # Protected dashboard page
│   ├── sign-in/               # Sign in page
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   └── providers.tsx          # Client providers
└── components/
    ├── container.tsx          # Container component
    ├── header.tsx             # Header with auth UI
    └── footer.tsx             # Footer component
```

The authentication configuration lives in the `@repo/auth` workspace package.

## Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run linter
pnpm lint:fix     # Fix linting issues
pnpm typecheck    # Type check the project
pnpm format       # Format code with Biome
```

## Customization

### Email OTP Configuration

Authentication is configured in the `@repo/auth` workspace package. The email OTP sends verification codes via the `@repo/emails` package. To customize email sending, you'll need to modify the auth package in your local workspace or fork the StartupKit packages.

### Adding More OAuth Providers

The `@repo/auth` package uses Better Auth and can support additional OAuth providers (GitHub, Twitter, etc.). To add more providers:

1. Add the required environment variables (e.g., `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`)
2. Configure the provider in the auth package's configuration
3. Update your sign-in UI to include the new provider button

See the [Better Auth documentation](https://better-auth.com) for available providers.

### Customizing UI Components

UI components are from `@repo/ui` (Shadcn components). You can override these components in your `src/components/` directory or modify the shared package.

## Learn More

- [StartupKit Documentation](https://startupkit.com)
- [Better Auth Documentation](https://better-auth.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Shadcn UI Documentation](https://ui.shadcn.com)

## Deploy

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Other Platforms

This is a standard Next.js app and can be deployed to any platform that supports Next.js:

- Railway
- Render
- Fly.io
- AWS
- Digital Ocean

Make sure to:
1. Set environment variables
2. Run database migrations
3. Build the app with `pnpm build`

## Support

- [GitHub Issues](https://github.com/ian/startupkit/issues)
- [Documentation](https://startupkit.com)
