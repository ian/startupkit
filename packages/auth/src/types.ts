import type { BetterAuthOptions } from "better-auth";
import type { PgColumn, PgTableWithColumns } from "drizzle-orm/pg-core";

export interface AdditionalField {
  type: "string" | "number" | "boolean" | "date"
  required?: boolean
  defaultValue?: string | number | boolean | Date
}

export interface AuthConfig<TAdditionalFields extends Record<string, AdditionalField> = Record<string, AdditionalField>> {
  db: BetterAuthOptions["database"]
  users: PgTableWithColumns<{
    name: string
    schema: string | undefined
    columns: Record<string, PgColumn>
    dialect: string
  }>
  sendEmail: (params: { email: string; otp: string }) => Promise<void>
  onUserLogin?: (userId: string) => Promise<void>
  onUserSignup?: (userId: string) => Promise<void>
  additionalUserFields?: TAdditionalFields
  session?: {
    expiresIn?: number
    updateAge?: number
  }
}
