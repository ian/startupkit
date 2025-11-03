"use client"

import { createContext } from "react"
import type { AnalyticsContextType } from "./types"

export const AnalyticsContext = createContext<
	AnalyticsContextType<Record<string, unknown>, Record<string, unknown>>
>({
	flags: {},
	identify: () => {},
	track: () => {},
	page: () => {},
	reset: () => {}
})
