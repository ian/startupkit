# @startupkit/auth

Authentication package built on [better-auth](https://better-auth.com) providing flexible authentication for Next.js applications.

## Installation

```bash
pnpm add @startupkit/auth better-auth
```

## Features

- 🔐 Google OAuth authentication
- 📧 Email OTP (one-time password) authentication
- 🔄 Automatic session management
- 🎯 TypeScript support with full type inference
- 📦 Dual client/server exports for Next.js
- 🪝 Extensible hooks for custom logic
- 🗄️ Prisma database adapter

## Usage

### Server Setup

Create your auth instance by configuring `createAuth` with your Prisma client and email sender:

```ts
// lib/auth.ts
import { prisma } from "@/lib/db"
import { createAuth } from "@startupkit/auth"

async function sendVerificationOTP({ email, otp }: { email: string; otp: string }) {
  // Implement your email sending logic
  await sendEmail({
    to: email,
    subject: "Verify your email",
    template: "verify-code",
    data: { code: otp }
  })
}

export const auth = createAuth({
  prisma,
  sendEmail: sendVerificationOTP,
  onUserSignup: async (userId) => {
    // Optional: Track user signup
    console.log("New user signed up:", userId)
  },
  onUserLogin: async (userId) => {
    // Optional: Track user login
    console.log("User logged in:", userId)
  }
})
```

### API Routes

Export the auth handler in your Next.js API route at `/app/auth/[...all]/route.ts`:

```ts
import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { GET, POST } = toNextJsHandler(auth.handler)
```

Or if you're re-exporting from a server module:

```ts
// server.ts
import { auth } from "./lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const handler = () => toNextJsHandler(auth.handler)

// In your API route
import { handler } from "@/lib/server"
export const { GET, POST } = handler()
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

Create your auth client with the plugins you need:

```tsx
// lib/auth-client.ts
import {
  adminClient,
  createAuthClient,
  emailOTPClient,
  inferAdditionalFields
} from "@startupkit/auth"
import type { auth } from "./auth"

export const authClient = createAuthClient({
  basePath: "/auth",
  plugins: [
    adminClient(),
    emailOTPClient(),
    inferAdditionalFields<typeof auth>()
  ]
})
```

Then wrap your application with the `AuthProvider`:

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

#### Customizing Plugins

Add additional better-auth plugins to customize functionality:

```tsx
import {
  adminClient,
  createAuthClient,
  emailOTPClient,
  inferAdditionalFields
} from "@startupkit/auth"
import { twoFactor } from "better-auth/plugins"
import type { auth } from "./auth"

export const authClient = createAuthClient({
  basePath: "/auth",
  plugins: [
    adminClient(),
    emailOTPClient(),
    inferAdditionalFields<typeof auth>(),
    twoFactor()  // Add 2FA support
  ]
})
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

### Environment Variables

```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Auth Config Options

```ts
interface AuthConfig {
  prisma: PrismaClient
  sendEmail?: (params: { email: string; otp: string }) => Promise<void>
  onUserLogin?: (userId: string) => Promise<void>
  onUserSignup?: (userId: string) => Promise<void>
  additionalUserFields?: Record<string, AdditionalField>
}

interface AdditionalField {
  type: "string" | "number" | "boolean" | "date"
  required?: boolean
  defaultValue?: string | number | boolean | Date
}
```

### Custom User Fields

You can add custom fields to your user model by passing `additionalUserFields`:

```ts
export const auth = createAuth({
  prisma,
  sendEmail: sendVerificationOTP,
  additionalUserFields: {
    companyName: {
      type: "string",
      required: false
    },
    timezone: {
      type: "string",
      required: false
    },
    role: {
      type: "string",
      required: true,
      defaultValue: "user"
    }
  }
})
```

The package includes these default additional fields (which are always available):
- `firstName` (string, optional)
- `lastName` (string, optional)
- `phone` (string, optional)

Your custom fields will be merged with these defaults.

### Session Configuration

Default session settings:
- **Expiration**: 7 days (604,800 seconds)
- **Update Age**: 24 hours (86,400 seconds)

Sessions automatically refresh when the user is active.

You can customize session duration:

```ts
export const auth = createAuth({
  prisma,
  sendEmail: sendVerificationOTP,
  session: {
    expiresIn: 60 * 60 * 24 * 30,  // 30 days
    updateAge: 60 * 60 * 24 * 7     // 7 days
  }
})
```

### Additional User Fields

The package includes additional user fields:

- `firstName` (string, optional)
- `lastName` (string, optional)
- `phone` (string, optional)

## API Reference

### Client Exports

- `AuthProvider` - React context provider for authentication
- `useAuth()` - Hook to access authentication state and methods
- `createBetterAuthClient()` - Factory to create the auth client
- `createAuth()` - Factory to create the server auth instance

### Server Exports

- `createServerUtils(auth)` - Factory to create server utilities

### Types

```ts
interface User {
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

interface Session {
  id: string
  userId: string
  expiresAt: Date
  token: string
  ipAddress?: string
  userAgent?: string
}
```

## License

ISC

