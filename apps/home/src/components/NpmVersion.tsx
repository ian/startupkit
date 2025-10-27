import React, { useState, useEffect } from "react"

interface NpmVersionProps {
	packageName: string
}

const NpmVersion: React.FC<NpmVersionProps> = ({ packageName }) => {
	const [version, setVersion] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchLatestVersion = async (): Promise<void> => {
			try {
				const response = await fetch(
					`https://registry.npmjs.org/${packageName}/latest`
				)
				if (!response.ok) {
					throw new Error("Network response was not ok")
				}
				const data: { version: string } = await response.json()
				setVersion(data.version)
			} catch (err) {
				setError("Failed to fetch package version")
				console.error("Error fetching package version:", err)
			}
		}

		fetchLatestVersion()
	}, [packageName])

	if (error) {
		return <>{error}</>
	}

	if (!version) {
		return <>@...</>
	}

	return <>@{version}</>
}

export default NpmVersion
