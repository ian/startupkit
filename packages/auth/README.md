# @startupkit/auth

Lightweight React components and hooks for [better-auth](https://better-auth.com) in Next.js applications.

## Installation

```bash
pnpm add @startupkit/auth better-auth
```

## What's Included

This package provides **client-side utilities only**:

- 🎨 `AuthProvider` - React context provider
- 🪝 `useAuth()` - Authentication hook
- 📦 `createServerUtils()` - Server-side helpers for Next.js
- 🎯 Full TypeScript support

**You call `betterAuth()` directly** in your project for full control over configuration.

## Usage

### Server Setup

Call `betterAuth()` directly in your project with full control:

```ts
// lib/auth.ts
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/lib/db"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg"
  }),
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }
  }
})
```

### API Routes

Export the auth handler in your Next.js API route at `/app/api/auth/[...all]/route.ts`:

```ts
import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { GET, POST } = toNextJsHandler(auth.handler)
```

### Server-Side Authentication

Access the authenticated user in Server Components:

```tsx
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export default async function Layout({ children }) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  return (
    <html>
      <body>
        <Providers user={session?.user}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

### Client Setup

Create your auth client using Better Auth directly:

```tsx
// lib/auth-client.ts
import { createAuthClient } from "better-auth/react"
import { adminClient, emailOTPClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  basePath: "/api/auth",
  plugins: [
    adminClient(),
    emailOTPClient()
  ]
})
```

Then wrap your application with the `AuthProvider` from `@startupkit/auth`:

```tsx
"use client"

import { AuthProvider } from "@startupkit/auth"
import { authClient } from "@/lib/auth-client"

export function Providers({ children, user }) {
  return (
    <AuthProvider user={user} authClient={authClient}>
      {children}
    </AuthProvider>
  )
}
```

### Using Authentication in Components

Access authentication state and methods with the `useAuth` hook:

```tsx
"use client"

import { useAuth } from "@startupkit/auth"

export function Header() {
  const { isAuthenticated, user, logout } = useAuth()

  if (!isAuthenticated) {
    return <a href="/auth/sign-in">Sign In</a>
  }

  return (
    <div>
      <span>Welcome, {user?.name}</span>
      <button onClick={logout}>Sign Out</button>
    </div>
  )
}
```

### Email OTP Flow

```tsx
"use client"

import { useAuth } from "@startupkit/auth"
import { useState } from "react"

export function SignIn() {
  const { sendAuthCode, verifyAuthCode } = useAuth()
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [step, setStep] = useState<"email" | "code">("email")

  if (step === "email") {
    return (
      <form onSubmit={async (e) => {
        e.preventDefault()
        await sendAuthCode(email)
        setStep("code")
      }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <button type="submit">Send Code</button>
      </form>
    )
  }

  return (
    <form onSubmit={async (e) => {
      e.preventDefault()
      await verifyAuthCode(email, code)
    }}>
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

### Google OAuth

```tsx
"use client"

import { useAuth } from "@startupkit/auth"

export function SocialSignIn() {
  const { googleAuth } = useAuth()

  return (
    <button onClick={googleAuth}>
      Sign in with Google
    </button>
  )
}
```

## Configuration

This package provides minimal opinions - you configure Better Auth directly. See the [Better Auth documentation](https://better-auth.com/docs) for all configuration options.

## API Reference

### Client Exports

- `AuthProvider` - React context provider wrapping Better Auth client
- `useAuth()` - Hook to access authentication state and methods
- `AuthContext` - React context (if you need direct access)

### Server Exports  

- `createServerUtils(auth)` - Factory to create server utilities like `withAuth()`

### useAuth() Hook

```ts
const {
  isAuthenticated,    // boolean
  isLoading,          // boolean  
  user,               // User | null | undefined
  logout,             // () => Promise<void>
  sendAuthCode,       // (email: string) => Promise<void>
  verifyAuthCode,     // (email: string, code: string) => Promise<void>
  googleAuth          // () => Promise<void>
} = useAuth()
```

## License

ISC

