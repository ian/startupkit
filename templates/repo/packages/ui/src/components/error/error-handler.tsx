"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import React, { Suspense, useEffect } from "react"
import { toast } from "sonner"

/**
 * Enables suspense handling for error notifications by rendering {@link ErrorHandlerComponent} within a React Suspense boundary.
 *
 * @returns The suspense-wrapped error handler component.
 */
export function ErrorHandler() {
	return (
		<Suspense fallback={null}>
			<ErrorHandlerComponent />
		</Suspense>
	)
}

const ErrorHandlerComponent: React.FC = () => {
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
