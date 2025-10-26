"use client"

import { useContext } from "react"
import { AnalyticsContext } from "./context"

export function useFlag<TFlags extends Record<string, unknown>, TFlagName extends keyof TFlags>(
    name: TFlagName
) {
    const context = useContext(AnalyticsContext)

    if (!context) {
        return null
    }

    return context.flags[name as string] as TFlags[TFlagName]
}

