import type { BetterAuthOptions } from "better-auth";

export interface AuthConfig {
  prisma: BetterAuthOptions["database"]
  sendEmail?: (params: { email: string; otp: string }) => Promise<void>
  onUserLogin?: (userId: string) => Promise<void>
  onUserSignup?: (userId: string) => Promise<void>
}

export interface User {
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

export interface Session {
  id: string
  userId: string
  expiresAt: Date
  token: string
  ipAddress?: string
  userAgent?: string
}
