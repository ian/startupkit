"use client"

import { createContext } from "react"
import type { AnalyticsContextType } from "./types"

export const AnalyticsContext = createContext<AnalyticsContextType>({
    flags: {},
    identify: () => { },
    track: () => { },
    page: () => { },
    reset: () => { }
})

