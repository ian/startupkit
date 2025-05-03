"use client"

import * as Sentry from "@sentry/react"
import type React from "react"
import {
	type Dispatch,
	type SetStateAction,
	useCallback,
	useEffect,
	useRef,
	useState
} from "react"
import { useLocalStorage, useWindowSize } from "usehooks-ts"
import { ALLOWED_FILE_EXTENSIONS } from "../../lib/constants"
import { sanitizeUIMessages } from "../../lib/helpers"
import type {
	ChatRequestOptions,
	CreateMessage,
	UIAttachment,
	UIMessage
} from "../../types"
import { ArrowUpIcon, PaperclipIcon, StopIcon } from "./icons"
import { PreviewAttachment } from "./preview-attachment"
import { toast } from "@repo/ui/components/toast"
import { cn } from "@repo/ui/utils"
import { Button } from "@repo/ui/components/button"
import { Textarea } from "@repo/ui/components/textarea"

const MAX_FILE_SIZE_MB = 5
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

type MinimalEventRepresentation = {
	preventDefault?: () => void
}

export type MultimodalInputSubmitHandler = (
	event?: MinimalEventRepresentation,
	opts?: ChatRequestOptions
) => void

export function MultimodalInput({
	input,
	setInput,
	isLoading,
	stop,
	messages,
	setMessages,
	append,
	onSubmit,
	className
}: {
	chatId: string
	input: string
	setInput: (value: string) => void
	isLoading: boolean
	stop: () => void
	messages: Array<UIMessage>
	setMessages: Dispatch<SetStateAction<Array<UIMessage>>>
	append: (
		message: UIMessage | CreateMessage,
		chatRequestOptions?: ChatRequestOptions
	) => Promise<string | null | undefined>
	onSubmit: MultimodalInputSubmitHandler
	className?: string
}) {
	const [attachments, setAttachments] = useState<Array<UIAttachment>>([])
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const { width } = useWindowSize()

	useEffect(() => {
		if (textareaRef.current) {
			adjustHeight()
		}
	}, [])

	const adjustHeight = useCallback(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto"
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2
				}px`
		}
	}, [])

	const [localStorageInput, setLocalStorageInput] = useLocalStorage("input", "")

	useEffect(() => {
		if (textareaRef.current) {
			const domValue = textareaRef.current.value
			// Prefer DOM value over localStorage to handle hydration
			const finalValue = domValue || localStorageInput || ""
			setInput(finalValue)
			adjustHeight()
		}
	}, [adjustHeight, localStorageInput, setInput])

	useEffect(() => {
		setLocalStorageInput(input)
	}, [input, setLocalStorageInput])

	const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInput(event.target.value)
		adjustHeight()
	}

	const fileInputRef = useRef<HTMLInputElement>(null)
	const [uploadQueue, setUploadQueue] = useState<Array<string>>([])

	const submitForm = useCallback(
		(event: MinimalEventRepresentation) => {
			onSubmit(event, {
				experimental_attachments: attachments
			})

			setAttachments([])
			setLocalStorageInput("")

			if (width && width > 768) {
				textareaRef.current?.focus()
			}
		},
		[attachments, onSubmit, setLocalStorageInput, width]
	)

	const uploadFile = useCallback(async (file: File) => {
		console.debug("Uploading file:", file)
		if (file.size > MAX_FILE_SIZE_BYTES) {
			toast.error(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`)
			return undefined
		}
		const formData = new FormData()
		formData.append("file", file)

		try {
			const response = await fetch("/api/chat/upload", {
				method: "POST",
				body: formData
			})

			if (response.ok) {
				const data = await response.json()
				const { url, filename, pathname, contentType } = data

				return {
					url,
					name: filename,
					contentType
				}
			}
			const { error } = await response.json()
			toast.error(error)
		} catch (error) {
			console.error(error)
			Sentry.captureException(error)
			toast.error("Failed to upload file, please try again!")
		}
	}, [])

	const handleFileChange = useCallback(
		async (files: File[]) => {
			setUploadQueue(files.map((file) => file.name))

			try {
				const uploadPromises = files.map((file) => uploadFile(file))
				const uploadedAttachments = await Promise.all(uploadPromises)
				const successfullyUploadedAttachments = uploadedAttachments.filter(
					(attachment) => attachment !== undefined
				)

				setAttachments((currentAttachments) => [
					...currentAttachments,
					...successfullyUploadedAttachments
				])
			} catch (error) {
				Sentry.captureException(error)
				console.error("Error uploading files!", error)
			} finally {
				setUploadQueue([])
			}
		},
		[uploadFile]
	)

	const handlePaste = useCallback(
		async (event: React.ClipboardEvent) => {
			const clipboardItems = event.clipboardData.items
			const imageItems = Array.from(clipboardItems).filter((item) =>
				item.type.startsWith("image/")
			)

			if (imageItems.length > 0) {
				event.preventDefault()

				const files = imageItems
					.map((item) => {
						const blob = item.getAsFile()
						if (!blob) return null

						const fileExtension = item.type.split("/")[1] || "png"
						const fileName = `pasted-image-${Date.now()}.${fileExtension}`
						return new File([blob], fileName, { type: item.type })
					})
					.filter(Boolean) as File[]

				if (files.length > 0) {
					await handleFileChange(files)
				}
			}
		},
		[handleFileChange]
	)

	return (
		<div className={cn("relative w-full flex flex-col gap-4", className)}>
			{(attachments.length > 0 || uploadQueue.length > 0) && (
				<div className="w-full overflow-x-auto">
					<div
						className="flex flex-row gap-2 pb-2"
						style={{ width: "max-content" }}
					>
						{attachments.map((attachment) => (
							<div className="flex-shrink-0 flex gap-2" key={attachment.url}>
								<PreviewAttachment attachment={attachment} />
							</div>
						))}

						{uploadQueue.map((filename) => (
							<div className="flex-shrink-0 flex gap-2" key={filename}>
								<PreviewAttachment
									attachment={{
										url: "",
										name: filename,
										contentType: ""
									}}
									isUploading={true}
								/>
							</div>
						))}
					</div>
				</div>
			)}

			<Textarea
				ref={textareaRef}
				placeholder="Ask anything..."
				value={input}
				onChange={handleInput}
				onPaste={handlePaste}
				className={cn(
					"min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-xl text-base bg-muted w-full"
				)}
				rows={3}
				autoFocus
				onKeyDown={(event) => {
					if (event.key === "Enter" && !event.shiftKey) {
						event.preventDefault()

						if (isLoading) {
							toast.error("Please wait for the model to finish its response!")
						} else {
							submitForm(event)
						}
					}
				}}
			/>

			{isLoading ? (
				<Button
					className="rounded-full p-1.5 h-fit absolute bottom-2 right-2 m-0.5 border dark:border-zinc-600"
					onClick={(event) => {
						event.preventDefault()
						stop()
						setMessages((messages) => sanitizeUIMessages(messages))
					}}
				>
					<StopIcon size={14} />
				</Button>
			) : (
				<Button
					className="rounded-full p-1.5 h-fit absolute bottom-2 right-2 m-0.5 border dark:border-zinc-600"
					onClick={(event) => {
						event.preventDefault()
						submitForm(event)
					}}
					disabled={input.length === 0 || uploadQueue.length > 0}
				>
					<ArrowUpIcon size={14} />
				</Button>
			)}

			<input
				type="file"
				className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
				ref={fileInputRef}
				multiple
				accept={ALLOWED_FILE_EXTENSIONS.join(",")}
				onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
				tabIndex={-1}
			/>
			<DropzoneOverlay onDrop={handleFileChange} />
			<Button
				className="rounded-full p-1.5 h-fit absolute bottom-2 right-11 m-0.5 dark:border-zinc-700"
				onClick={(event) => {
					event.preventDefault()
					fileInputRef.current?.click()
				}}
				variant="outline"
				disabled={isLoading}
			>
				<PaperclipIcon size={14} />
			</Button>
		</div>
	)
}

export function DropzoneOverlay({
	activeText = "Drop the files here ..",
	onDrop
}: {
	activeText?: string
	onDrop: (files: File[]) => void
}) {
	const [isDragging, setIsDragging] = useState(false)
	const dragCounter = useRef(0)

	const handleDrag = useCallback((event: DragEvent) => {
		event.preventDefault()
		event.stopPropagation()
	}, [])

	const handleDragIn = useCallback((event: DragEvent) => {
		event.preventDefault()
		event.stopPropagation()
		dragCounter.current++
		if (event.dataTransfer?.items && event.dataTransfer.items.length > 0) {
			setIsDragging(true)
		}
	}, [])

	const handleDragOut = useCallback((event: DragEvent) => {
		event.preventDefault()
		event.stopPropagation()
		dragCounter.current--
		if (dragCounter.current > 0) return
		setIsDragging(false)
	}, [])

	const handleDrop = useCallback(
		(event: DragEvent) => {
			event.preventDefault()
			event.stopPropagation()
			setIsDragging(false)
			if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
				dragCounter.current = 0
				onDrop(Array.from(event.dataTransfer.files))
				event.dataTransfer.clearData()
			}
		},
		[onDrop]
	)

	useEffect(() => {
		window.addEventListener("dragenter", handleDragIn)
		window.addEventListener("dragleave", handleDragOut)
		window.addEventListener("dragover", handleDrag)
		window.addEventListener("drop", handleDrop)

		return function cleanUp() {
			window.removeEventListener("dragenter", handleDragIn)
			window.removeEventListener("dragleave", handleDragOut)
			window.removeEventListener("dragover", handleDrag)
			window.removeEventListener("drop", handleDrop)
		}
	})

	if (!isDragging) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur">
			{activeText}
		</div>
	)
}
