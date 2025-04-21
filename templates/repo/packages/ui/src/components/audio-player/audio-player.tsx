"use client"

import { type VariantProps, cva } from "class-variance-authority"
import { Pause, Play, RotateCcw } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { cn } from "../../lib/utils"
import { Button } from "../button"

const audioPlayerVariants = cva("rounded-full transition-all duration-300", {
	variants: {
		size: {
			sm: "h-8 w-8",
			md: "h-12 w-12",
			lg: "h-16 w-16"
		}
	},
	defaultVariants: {
		size: "md"
	}
})

interface AudioPlayerProps extends VariantProps<typeof audioPlayerVariants> {
	audioUrl: string
	className?: string
}

export function AudioPlayer({ audioUrl, size, className }: AudioPlayerProps) {
	const [isPlaying, setIsPlaying] = useState(false)
	const [isEnded, setIsEnded] = useState(false)
	const audioRef = useRef<HTMLAudioElement | null>(null)

	useEffect(() => {
		// Create audio element
		audioRef.current = new Audio(audioUrl)

		// Set up event listeners
		const handleEnded = () => {
			setIsPlaying(false)
			setIsEnded(true)
		}

		const handlePlay = () => {
			setIsPlaying(true)
		}

		const handlePause = () => {
			setIsPlaying(false)
		}

		audioRef.current.addEventListener("ended", handleEnded)
		audioRef.current.addEventListener("play", handlePlay)
		audioRef.current.addEventListener("pause", handlePause)

		// Clean up
		return () => {
			if (audioRef.current) {
				audioRef.current.pause()
				audioRef.current.removeEventListener("ended", handleEnded)
				audioRef.current.removeEventListener("play", handlePlay)
				audioRef.current.removeEventListener("pause", handlePause)
			}
		}
	}, [audioUrl])

	const togglePlayPause = () => {
		if (!audioRef.current) return

		if (isEnded) {
			// Reset and play from beginning
			audioRef.current.currentTime = 0
			audioRef.current.play()
			setIsEnded(false)
		} else if (isPlaying) {
			audioRef.current.pause()
		} else {
			audioRef.current.play()
		}
	}

	// Determine icon size based on button size
	const getIconSize = () => {
		switch (size) {
			case "sm":
				return "h-4 w-4"
			case "lg":
				return "h-8 w-8"
			default:
				return "h-6 w-6"
		}
	}

	const iconSize = getIconSize()

	return (
		<Button
			onClick={togglePlayPause}
			variant="outline"
			size="icon"
			className={cn(audioPlayerVariants({ size }), className)}
			aria-label={isPlaying ? "Pause" : isEnded ? "Replay" : "Play"}
		>
			{isPlaying ? (
				<Pause className={iconSize} />
			) : isEnded ? (
				<RotateCcw className={iconSize} />
			) : (
				<Play className={`${iconSize} ml-0.5`} />
			)}
		</Button>
	)
}
