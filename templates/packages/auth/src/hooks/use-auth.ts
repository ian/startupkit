"use client"

import { useAuth as useStartupKitAuth } from "@startupkit/auth"
import type { User } from "../types"

interface UseAuthReturn {
	isAuthenticated: boolean
	isLoading: boolean
	user: User | null | undefined
	logout: () => Promise<void>
	sendAuthCode: (email: string) => Promise<void>
	verifyAuthCode: (email: string, otp: string) => Promise<void>
	googleAuth: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
	return useStartupKitAuth() as UseAuthReturn
}

