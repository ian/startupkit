"use client"

import { createContext } from "react"

export interface AuthContextType<TUser extends Record<string, unknown> = Record<string, unknown>> {
    isAuthenticated: boolean
    isLoading: boolean
    user: TUser | null | undefined
    logout: () => Promise<void>
    sendAuthCode: (email: string) => Promise<void>
    verifyAuthCode: (email: string, code: string) => Promise<void>
    googleAuth: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType<Record<string, unknown>>>({
    isAuthenticated: false,
    isLoading: true,
    user: undefined,
    logout: () => Promise.resolve(),
    sendAuthCode: () => Promise.resolve(),
    verifyAuthCode: () => Promise.resolve(),
    googleAuth: () => Promise.resolve()
})

