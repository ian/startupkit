# @repo/auth

Authentication package built on [better-auth](https://better-auth.com) with dual client/server exports for Next.js applications.

## Installation

This package is part of the monorepo workspace and is already configured with Drizzle ORM adapter, PostgreSQL, and Google OAuth support.

The package exports two entry points:
- `@repo/auth` - Client-side authentication utilities (AuthProvider, useAuth, authClient)
- `@repo/auth/server` - Server-side authentication helpers (withAuth, handler, auth)

## Client-Side Usage

### Setup AuthProvider

Wrap your application with the `AuthProvider` component to enable authentication context throughout your app:

```tsx
import { AuthProvider } from "@repo/auth"

export function Providers({ children, user }) {
  return (
    <AuthProvider user={user}>
      {children}
    </AuthProvider>
  )
}
```

### Using the useAuth Hook

Access authentication state and methods in your components:

```tsx
import { useAuth } from "@repo/auth"

export function Header() {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <header>
      {isAuthenticated ? (
        <div>
          <span>Welcome, {user?.name}</span>
          <button onClick={logout}>Sign Out</button>
        </div>
      ) : (
        <a href="/auth/sign-in">Sign In</a>
      )}
    </header>
  )
}
```

### Authentication Methods

The `useAuth` hook provides the following methods:

```tsx
const {
  isAuthenticated,
  isLoading,
  user,
  sendAuthCode,
  verifyAuthCode,
  googleAuth,
  logout
} = useAuth()
```

#### Email OTP Flow

```tsx
import { useAuth } from "@repo/auth"

export function SignIn() {
  const { sendAuthCode, verifyAuthCode } = useAuth()
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [step, setStep] = useState<"email" | "code">("email")

  const handleSendCode = async () => {
    await sendAuthCode(email)
    setStep("code")
  }

  const handleVerifyCode = async () => {
    await verifyAuthCode(email, code)
  }

  return step === "email" ? (
    <form onSubmit={handleSendCode}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <button type="submit">Send Code</button>
    </form>
  ) : (
    <form onSubmit={handleVerifyCode}>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter code"
      />
      <button type="submit">Verify</button>
    </form>
  )
}
```

#### Google OAuth

```tsx
import { useAuth } from "@repo/auth"

export function SocialSignIn() {
  const { googleAuth } = useAuth()

  return (
    <button onClick={googleAuth}>
      Sign in with Google
    </button>
  )
}
```

## Server-Side Usage

### Using withAuth Helper

Access the authenticated user in Server Components:

```tsx
import { withAuth } from "@repo/auth/server"

export default async function RootLayout({ children }) {
  const { user, session } = await withAuth()

  return (
    <html>
      <body>
        <Providers user={user}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

The `withAuth` helper returns:
- `user` - The authenticated user or null
- `session` - The session object or null
- `flags` - Optional feature flags (when `opts.flags: true`)

```tsx
const { user, session, flags } = await withAuth({ flags: true })
```

### API Route Handler

Export the auth handler in your Next.js API route:

```ts
import { handler } from "@repo/auth/server"

export const { GET, POST } = handler()
```

### Accessing Core Auth Instance

For advanced use cases, access the core better-auth instance:

```ts
import { auth } from "@repo/auth/server"
```

## Configuration

### Environment Variables

Required environment variables for authentication:

```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Base Path

All authentication routes are served at `/auth`:
- `/auth/sign-in/google` - Google OAuth
- `/auth/sign-in/email-otp` - Email OTP sign in
- `/auth/sign-out` - Sign out

### Integration

The auth package integrates with other workspace packages:
- `@repo/emails` - Sends OTP verification emails
- `@repo/analytics` - Tracks user authentication events
- `@repo/db` - Drizzle ORM database adapter for user and session storage

## Authentication Methods

### Google OAuth

Configured with automatic profile mapping to extract:
- First name and last name from Google profile
- Profile picture
- Email address

### Email OTP Verification

One-time password authentication via email:
- OTP codes expire after 10 minutes
- Verification emails sent via `@repo/emails` package
- Supports both sign-up and sign-in flows

### Session Management

Sessions are configured with:
- **Expiration**: 7 days (604,800 seconds)
- **Update Age**: 24 hours (86,400 seconds)

Sessions automatically refresh their expiration time every 24 hours when the user is active.

## API Reference

### Types

```ts
import type { User, Session } from "@repo/auth"
```

#### User Type

Inferred from better-auth with additional fields:

```ts
type User = {
  id: string
  email: string
  name: string
  firstName?: string
  lastName?: string
  phone?: string
  image?: string
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}
```

#### Session Type

```ts
type Session = {
  id: string
  userId: string
  expiresAt: Date
  token: string
  ipAddress?: string
  userAgent?: string
}
```

### AuthContext Interface

The context provided by `AuthProvider` and accessed via `useAuth`:

```ts
interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null | undefined
  logout: () => Promise<void>
  sendAuthCode: (email: string) => Promise<void>
  verifyAuthCode: (email: string, code: string) => Promise<void>
  googleAuth: () => Promise<void>
}
```

## Dependencies

### Core Dependencies

- **better-auth** (1.2.5) - Modern authentication library for TypeScript
- **swr** (2.2.5) - React hooks for data fetching

### Workspace Dependencies

- **@repo/analytics** - User tracking and feature flags
- **@repo/db** - Drizzle ORM database client
- **@repo/emails** - Email sending service
- **@repo/utils** - Shared utilities

### Peer Dependencies

- **next** - Next.js framework
- **react** - React 19
- **react-dom** - React DOM 19

### Integration Points

The package leverages workspace dependencies for:
- **Database**: Drizzle ORM adapter connects to PostgreSQL via `@repo/db`
- **Email**: OTP codes sent through `@repo/emails` with custom templates
- **Analytics**: User identification and event tracking via `@repo/analytics`
- **Middleware**: Updates user's `lastSeenAt` timestamp on each session creation
