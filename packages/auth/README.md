# @startupkit/auth

Authentication package built on [WorkOS](https://workos.com) with iron-session for Next.js applications.

## Installation

This package is part of the monorepo workspace and is already configured with WorkOS AuthKit and iron-session.

The package provides multiple entry points:
- `@startupkit/auth` - Client-side authentication utilities (AuthProvider, useAuth)
- `@startupkit/auth/server` - Server-side session management (getSession, getUser, clearSession)
- `@startupkit/auth/routes` - API route handlers for authentication flow
- `@startupkit/auth/config` - Next.js configuration plugin

## Client-Side Usage

### Setup AuthProvider

Wrap your application with the `AuthProvider` component to enable authentication context throughout your app:

```tsx
import { AuthProvider } from "@startupkit/auth"
import { getUser } from "@startupkit/auth/server"

export default async function RootLayout({ children }) {
  const { user } = await getUser()
  const session = user ? { user, createdAt: new Date().toISOString() } : undefined

  return (
    <html>
      <body>
        <AuthProvider session={session}>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

### Using the useAuth Hook

Access authentication state and methods in your components:

```tsx
import { useAuth } from "@startupkit/auth"

export function Header() {
  const { user, login, logout } = useAuth()

  return (
    <header>
      {user ? (
        <div>
          <span>Welcome, {user.firstName || user.email}</span>
          <button onClick={logout}>Sign Out</button>
        </div>
      ) : (
        <button onClick={login}>Sign In</button>
      )}
    </header>
  )
}
```

### Authentication Methods

The `useAuth` hook provides the following:

```tsx
const { user, login, logout } = useAuth()
```

- `user` - The authenticated user object or undefined
- `login()` - Redirects to WorkOS authentication
- `logout()` - Clears the session and logs out the user

## Server-Side Usage

### Session Management

Access and manage user sessions in Server Components and API routes:

```tsx
import { getUser, getSession, clearSession } from "@startupkit/auth/server"

export default async function ProfilePage() {
  const { user, isAuthenticated } = await getUser()

  if (!isAuthenticated) {
    redirect("/login")
  }

  return <div>Welcome {user?.firstName}</div>
}
```

### Available Server Functions

#### getUser()

Returns the current user and authentication status:

```tsx
const { user, isAuthenticated } = await getUser()
```

#### getSession()

Returns the iron-session instance for advanced usage:

```tsx
const session = await getSession()
```

#### clearSession()

Destroys the current session:

```tsx
await clearSession()
```

### API Routes Setup

Set up authentication routes in your Next.js app at `app/api/auth/[...auth]/route.ts`:

```ts
export { GET, POST, PUT, DELETE, PATCH, OPTIONS } from "@startupkit/auth/routes"
```

This provides the following endpoints:
- `/api/auth/login` - Initiates WorkOS authentication
- `/api/auth/callback` - OAuth callback handler
- `/api/auth/session` - Returns current session data
- `/api/auth/logout` - Clears session (POST)

## Configuration

### Environment Variables

Required environment variables:

```bash
AUTH_SECRET=your_session_encryption_secret
WORKOS_API_KEY=your_workos_api_key
WORKOS_CLIENT_ID=your_workos_client_id
WORKOS_REDIRECT_URI=https://yourdomain.com/api/auth/callback
```

Optional (can use `NEXT_PUBLIC_` prefix for client-side access):

```bash
NEXT_PUBLIC_WORKOS_CLIENT_ID=your_workos_client_id
NEXT_PUBLIC_WORKOS_REDIRECT_URI=https://yourdomain.com/api/auth/callback
```

### WorkOS Setup

1. Create a WorkOS account at [workos.com](https://workos.com)
2. Configure AuthKit with your redirect URI
3. Copy your API key and client ID to environment variables

## Authentication Flow

1. User clicks login button, triggering `login()` from `useAuth`
2. User is redirected to `/api/auth/login`
3. Server redirects to WorkOS AuthKit
4. User authenticates with WorkOS
5. WorkOS redirects to `/api/auth/callback` with code
6. Server exchanges code for user data
7. Session is created with iron-session
8. User is redirected to `/dash`

## API Reference

### Types

```ts
import type { SessionUser, SessionData } from "@startupkit/auth/server"
```

#### SessionUser

```ts
type SessionUser = {
  id: string
  email: string
  firstName?: string | null
  lastName?: string | null
  avatarUrl?: string | null
}
```

#### SessionData

```ts
interface SessionData {
  user: SessionUser
  createdAt: string
}
```

### Client Exports

```ts
import { AuthProvider, useAuth } from "@startupkit/auth"
```

- `AuthProvider({ children, session })` - React context provider
- `useAuth()` - Hook returning `{ user, login, logout }`

### Server Exports

```ts
import { getSession, getUser, clearSession, SessionUser, SessionData } from "@startupkit/auth/server"
```

- `getSession()` - Returns IronSession<SessionData>
- `getUser()` - Returns `{ user: SessionUser | null, isAuthenticated: boolean }`
- `clearSession()` - Destroys the session

## Dependencies

### Core Dependencies

- **@workos-inc/node** (^5.0.0) - WorkOS SDK for authentication
- **iron-session** (^8.0.1) - Secure session management
- **swr** (^2.2.5) - React hooks for data fetching

### Workspace Dependencies

- **@startupkit/utils** - Shared utilities (URL helpers)

### Peer Dependencies

- **next** (^14) - Next.js framework
- **react** (^18.2.0) - React library

## Security

- Sessions are encrypted using iron-session with your `AUTH_SECRET`
- WorkOS handles all authentication security and compliance
- Session cookies are HTTP-only and secure
- No passwords are stored in your application
