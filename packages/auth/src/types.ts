import type { BetterAuthOptions } from "better-auth";

export interface AdditionalField {
  type: "string" | "number" | "boolean" | "date"
  required?: boolean
  defaultValue?: string | number | boolean | Date
}

export interface AuthConfig {
  prisma: BetterAuthOptions["database"]
  sendEmail?: (params: { email: string; otp: string }) => Promise<void>
  onUserLogin?: (userId: string) => Promise<void>
  onUserSignup?: (userId: string) => Promise<void>
  additionalUserFields?: Record<string, AdditionalField>
  session?: {
    expiresIn?: number
    updateAge?: number
  }
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
