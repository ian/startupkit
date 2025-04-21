"use client"

import { createContext } from "react"
import type { User } from "../types"

type AuthContextType = {
	isAuthenticated: boolean
	isLoading: boolean
	user: User | null | undefined
	logout: () => Promise<void>
	sendAuthCode: (email: string) => Promise<void>
	verifyAuthCode: (email: string, code: string) => Promise<void>
	googleAuth: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
	isAuthenticated: false,
	isLoading: true,
	user: undefined,
	logout: () => Promise.resolve(),
	sendAuthCode: () => Promise.resolve(),
	verifyAuthCode: () => Promise.resolve(),
	googleAuth: () => Promise.resolve()
})
