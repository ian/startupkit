import {
	type CoreAssistantMessage,
	type CoreToolMessage,
	type Message as UIMessage,
	convertToCoreMessages
} from "ai"

import type { UIAttachment } from "../types"

// import type { UIMessage } from "@ai-sdk/ui-utils";
import type { Message as DBMessage } from "@repo/db"
import type { CoreMessage, ToolInvocation } from "ai"
import { getMimeType } from "@repo/utils"

/**
 * Adds a tool message to the chat by updating corresponding tool invocations with results.
 *
 * @param {Object} params - The parameters object
 * @param {CoreToolMessage} params.toolMessage - The tool message to add
 * @param {Array<UIMessage>} params.messages - The current chat messages
 * @returns {Array<UIMessage>} Updated array of chat messages
 */
function addToolMessageToChat({
	toolMessage,
	messages
}: {
	toolMessage: CoreToolMessage
	messages: Array<UIMessage>
}): Array<UIMessage> {
	return messages.map((message) => {
		if (message.toolInvocations) {
			return {
				...message,
				toolInvocations: message.toolInvocations.map((toolInvocation) => {
					const toolResult = toolMessage.content.find(
						(tool) => tool.toolCallId === toolInvocation.toolCallId
					)

					if (toolResult) {
						return {
							...toolInvocation,
							state: "result",
							result: toolResult.result
						}
					}

					return toolInvocation
				})
			}
		}

		return message
	})
}

/**
 * Converts an array of database messages into UI message format for rendering.
 *
 * For each database message, extracts text content, attachments (such as images or files), and tool invocations, organizing them into the structure expected by the UI. Tool messages update existing UI messages with tool results.
 *
 * @returns An array of UI messages with extracted content, attachments, and tool invocations.
 */
export function convertToUIMessages(
	messages: Array<DBMessage>
): Array<UIMessage> {
	return messages.reduce((chatMessages: Array<UIMessage>, message) => {
		if (message.role === "tool") {
			return addToolMessageToChat({
				toolMessage: message as unknown as CoreToolMessage,
				messages: chatMessages
			})
		}

		let textContent = ""
		const experimental_attachments: UIAttachment[] = []
		const toolInvocations: Array<ToolInvocation> = []

		if (typeof message.content === "string") {
			textContent = message.content
		} else if (Array.isArray(message.content)) {
			for (const el of message.content) {
				const content = el as Record<string, string>

				if (content?.type === "text") {
					textContent += content.text
				} else if (content.type === "file") {
					if (!content.data) {
						continue
					}

					experimental_attachments.push({
						url: content.data,
						contentType: content.mimeType
					})
				} else if (content.type === "image") {
					if (!content.image) {
						continue
					}

					experimental_attachments.push({
						url: content.image,
						// TODO: How to get the content type?
						// contentType: "image/",
						contentType: getMimeType(content.image) || "image/"
						// type: "image",
					})
				} else if (content.type === "tool-call") {
					toolInvocations.push({
						state: "call",
						toolCallId: content.toolCallId as string,
						toolName: content.toolName as string,
						args: content.args
					})
				}
			}
		}

		chatMessages.push({
			id: message.id,
			role: message.role as UIMessage["role"],
			content: textContent,
			experimental_attachments,
			toolInvocations
		} as UIMessage)

		return chatMessages
	}, [])
}

/**
 * Retrieves the message ID either from annotations or falls back to the message's ID.
 *
 * @param {UIMessage} message - The message to extract ID from
 * @returns {string} The message ID
 */
export function getMessageIdFromAnnotations(message: UIMessage) {
	if (!message.annotations) return message.id

	const [annotation] = message.annotations
	if (!annotation) return message.id

	return annotation.messageIdFromServer
}

type ResponseMessageWithoutId = CoreToolMessage | CoreAssistantMessage
type ResponseMessage = ResponseMessageWithoutId & { id: string }

/**
 * Sanitizes response messages by filtering out invalid tool calls and empty content.
 *
 * @param {Array<CoreToolMessage | CoreAssistantMessage>} messages - Array of tool or assistant messages
 * @returns {Array<CoreToolMessage | CoreAssistantMessage>} Filtered array of messages
 */
export function sanitizeResponseMessages({
	messages,
	reasoning
}: {
	messages: Array<ResponseMessage>
	reasoning: string | undefined
}) {
	const toolResultIds: Array<string> = []

	for (const message of messages) {
		if (message.role === "tool") {
			for (const content of message.content) {
				if (content.type === "tool-result") {
					toolResultIds.push(content.toolCallId)
				}
			}
		}
	}

	const messagesBySanitizedContent = messages.map((message) => {
		if (message.role !== "assistant") return message

		if (typeof message.content === "string") return message

		const sanitizedContent = message.content.filter((content) =>
			content.type === "tool-call"
				? toolResultIds.includes(content.toolCallId)
				: content.type === "text"
					? content.text.length > 0
					: true
		)

		if (reasoning) {
			sanitizedContent.push({ type: "reasoning", reasoning })
		}

		return {
			...message,
			content: sanitizedContent
		}
	})

	return messagesBySanitizedContent.filter(
		(message) => message.content.length > 0
	)
}

/**
 * Sanitizes the tool invocations in the given array of UI messages.
 *
 * @param {Array<UIMessage>} messages - The array of UI messages to sanitize.
 * @returns {Array<UIMessage>} - The sanitized array of UI messages.
 */
export function sanitizeUIMessages(
	messages: Array<UIMessage>
): Array<UIMessage> {
	const messagesBySanitizedToolInvocations = messages.map((message) => {
		if (message.role !== "assistant") return message

		if (!message.toolInvocations) return message

		const toolResultIds: Array<string> = []

		for (const toolInvocation of message.toolInvocations) {
			if (toolInvocation.state === "result") {
				toolResultIds.push(toolInvocation.toolCallId)
			}
		}

		const sanitizedToolInvocations = message.toolInvocations.filter(
			(toolInvocation) =>
				toolInvocation.state === "result" ||
				toolResultIds.includes(toolInvocation.toolCallId)
		)

		return {
			...message,
			toolInvocations: sanitizedToolInvocations
		}
	})

	return messagesBySanitizedToolInvocations.filter(
		(message) =>
			message.content.length > 0 ||
			(message.toolInvocations && message.toolInvocations.length > 0)
	)
}

/**
 * Splits and processes an array of UI messages to extract the latest user message and core messages.
 *
 * @param {Array<UIMessage>} allMessages - Array of UI messages to process
 * @returns {{ messages: Array<UIMessage>, coreMessages: Array<CoreMessage>, userMessage: CoreMessage }} Object containing:
 *   - messages: Filtered UI messages with non-empty content
 *   - coreMessages: Messages converted to core format
 *   - userMessage: The most recent user message
 * @throws {Error} When no user message is found
 */
export const splitMessages = (allMessages: Array<UIMessage>) => {
	const messages = allMessages.filter((m) => m.content !== "")
	const compatibleMessages = messages.map((m) => ({
		...m,
		parts: m.parts?.filter((p) => p.type !== "source") ?? []
	}))
	const coreMessages: CoreMessage[] = convertToCoreMessages(compatibleMessages)
	const userMessage = coreMessages
		.filter((message) => message.role === "user")
		.at(-1)

	if (!userMessage) {
		throw new Error("No user message found")
	}

	return { messages, coreMessages, userMessage }
}
