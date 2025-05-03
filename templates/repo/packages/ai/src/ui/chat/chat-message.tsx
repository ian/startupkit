"use client"

import type { Vote } from "@repo/db"
import { Markdown } from "@repo/ui/components/markdown"
import { motion } from "framer-motion"
import { BotMessageSquare } from "lucide-react"
import { useCallback } from "react"
import { ALLOWED_IMAGE_MIME_TYPES } from "../../lib/constants"
import type { UIMessage } from "../../types"
import { MessageActions } from "./chat-message-actions"
import { SparklesIcon } from "./icons"
import { useLightbox } from "./lightbox-provider"
import { PreviewAttachment } from "./preview-attachment"
import { Tool } from "../tools"
import { cn } from "@repo/ui/utils"

export const ChatMessage = ({
	chatId,
	message,
	vote,
	isLoading
}: {
	chatId: string
	message: UIMessage
	vote: Vote | undefined
	isLoading: boolean
}) => {
	const { openLightbox } = useLightbox()

	const handleMediaClick = useCallback(
		({
			url,
			contentType
		}: {
			url: string
			contentType?: string
		}) => {
			if (contentType && ALLOWED_IMAGE_MIME_TYPES.has(contentType)) {
				const imageUrls =
					message.experimental_attachments
						?.filter((attachment) =>
							attachment.contentType?.startsWith("image/")
						)
						.map((attachment) => attachment.url) ?? []
				const index = imageUrls.indexOf(url)
				openLightbox(imageUrls, index)
			} else {
				// Link right to the file
				window.open(url, "_blank")
			}
		},
		[message, openLightbox]
	)

	if (message.content === "" && !message.toolInvocations?.length) {
		return null
	}

	return (
		<motion.div
			className="w-full mx-auto max-w-3xl group/message"
			initial={{ y: 5, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			data-role={message.role}
		>
			{message.experimental_attachments && (
				<div className="flex flex-row gap-2 justify-end mb-2">
					{message.experimental_attachments.map((attachment) => (
						<PreviewAttachment
							onClick={() => handleMediaClick(attachment)}
							key={attachment.url}
							attachment={attachment}
						/>
					))}
				</div>
			)}

			<div
				className={cn(
					"flex flex-col gap-4 group-data-[role=user]/message:bg-primary group-data-[role=user]/message:text-primary-foreground group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl"
				)}
			>
				{message.content ? (
					<div className="flex flex-col gap-2 w-full">
						<Message
							chatId={chatId}
							message={message}
							vote={vote}
							isLoading={isLoading}
							sparkle={message.role === "assistant"}
						>
							<Markdown>{message.content as string}</Markdown>
						</Message>
					</div>
				) : null}

				{!isLoading && message.toolInvocations &&
					message.toolInvocations.length > 0 &&
					message.toolInvocations.map((toolInvocation) => (
						<Tool key={toolInvocation.toolCallId} {...toolInvocation} />
					))}

			</div>
		</motion.div>
	)
}

export const ThinkingMessage = () => {
	const role = "assistant"

	return (
		<motion.div
			className="w-full mx-auto max-w-3xl px-4 group/message "
			initial={{ y: 5, opacity: 0 }}
			animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
			data-role={role}
		>
			<div
				className={cn(
					"flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl",
					{
						"group-data-[role=user]/message:bg-muted": true
					}
				)}
			>
				<div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
					<SparklesIcon size={14} />
				</div>

				<div className="flex flex-col gap-2 w-full">
					<div className="flex flex-col gap-4 text-muted-foreground">
						Thinking...
					</div>
				</div>
			</div>
		</motion.div>
	)
}

const WithSparkle = ({
	children,
	sparkle
}: { children: React.ReactNode; sparkle?: boolean }) => {
	return (
		<div className="flex gap-4 group-data-[role=user]/message:bg-primary group-data-[role=user]/message:text-primary-foreground group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl">
			{sparkle ? (
				<div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
					<BotMessageSquare size={20} />
				</div>
			) : null}

			<div className="grow">{children}</div>
		</div>
	)
}

const Message = ({
	children,
	chatId,
	message,
	vote,
	isLoading,
	sparkle
}: {
	children: React.ReactNode
	chatId: string
	message: UIMessage
	vote: Vote | undefined
	isLoading: boolean
	sparkle?: boolean
}) => {
	return (
		<WithSparkle sparkle={sparkle}>
			<div className="flex flex-col justify-center gap-2 w-full">
				{children}

				<MessageActions
					chatId={chatId}
					message={message}
					vote={vote}
					isLoading={isLoading}
				/>
			</div>
		</WithSparkle>
	)
}
