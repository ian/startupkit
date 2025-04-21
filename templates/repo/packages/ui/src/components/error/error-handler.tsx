"use client"

import { toast } from "@local/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import React, { Suspense, useEffect } from "react"

function ErrorHandlerContent() {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const error = searchParams.get("error")

	useEffect(() => {
		if (error) {
			toast.error(error, {
				richColors: true
			})

			// Create new search params without the error parameter
			const newParams = new URLSearchParams(searchParams.toString())
			newParams.delete("error")

			// Redirect to the same path without the error param
			const queryString = newParams.toString()
			const newPath = queryString ? `${pathname}?${queryString}` : pathname
			router.replace(newPath)
		}
	}, [error, pathname, router, searchParams])

	return null
}

export function ErrorHandler() {
	return (
		<Suspense fallback={null}>
			<ErrorHandlerContent />
		</Suspense>
	)
}
