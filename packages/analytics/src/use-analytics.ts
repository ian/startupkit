"use client"

import { useContext } from "react"
import { AnalyticsContext } from "./context"

export function useAnalytics() {
	return useContext(AnalyticsContext)
}
