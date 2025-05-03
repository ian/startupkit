"use client"

import { type UseChatOptions, useChat as useVercelChat } from "@ai-sdk/react"
import { ScrollArea } from "@repo/ui/components/scroll-area"
import { cn } from "@repo/ui/utils"
import {
	type Dispatch,
	type SetStateAction,
	useCallback,
	useRef,
	useState
} from "react"
import { randomUUID } from "@repo/utils"
import type { UIMessage } from "../../types"
import { ChatMessages } from "./chat-messages"
import {
	MultimodalInput,
	type MultimodalInputSubmitHandler
} from "./multimodal-input"
import { ChatNullState, type ChatNullStatePrompt } from "./null-state"
import { Agent } from "../../agents"

export type ChatProps = UseChatOptions & {
	className?: string
	id: string
	template?: Agent
}

/**
 * Renders a chat interface with multimodal input, message display, and support for agent-based templates.
 *
 * Displays a null state prompt when there are no messages, allowing users to select an agent template and start a conversation. Once messages exist, shows the chat history and input area for ongoing interaction.
 *
 * @param className - Optional CSS class for custom styling.
 * @param template - Optional initial agent template to use for the chat session.
 * @param chatProps - Additional chat configuration and state props.
 */
export function ChatCore({
	className,
	template: initialTemplate,
	...chatProps
}: ChatProps) {
	const { id } = chatProps
	const scrollAreaRef = useRef<HTMLDivElement>(null)
	const [template, setTemplate] = useState<Agent | undefined>(initialTemplate)

	const chat = useVercelChat(chatProps)

	const handleSubmit: MultimodalInputSubmitHandler = useCallback(
		(event, opts) => {
			chat.handleSubmit(event, {
				...opts,
				body: {
					...opts?.body,
					template
				}
			})
		},
		[chat, template]
	)

	const handleNullStateClick = useCallback(
		({ template, text }: ChatNullStatePrompt) => {
			setTemplate(template)

			chat.setMessages([
				{
					id: randomUUID(),
					role: "user",
					content: text
				}
			])

			chat.handleSubmit(undefined, {
				allowEmptySubmit: true,
				body: {
					template
				}
			})
		},
		[chat]
	)

	if (chat.messages.length === 0) {
		return (
			<div
				className={cn(
					"flex flex-col h-full justify-center items-center md:mx-auto md:max-w-3xl gap-5",
					className
				)}
			>
				<ChatNullState onClick={handleNullStateClick} />
				<MultimodalInput
					chatId={id}
					input={chat.input}
					setInput={chat.setInput}
					onSubmit={handleSubmit}
					isLoading={chat.isLoading}
					messages={chat.messages}
					setMessages={
						chat.setMessages as Dispatch<SetStateAction<UIMessage[]>>
					}
					append={chat.append}
					stop={chat.stop}
				/>
			</div>
		)
	}

	return (
		<div className={cn("flex flex-col h-full mx-auto", className)}>
			<div className="flex-grow overflow-hidden">
				<ScrollArea className="h-full" ref={scrollAreaRef}>
					<ChatMessages
						chatId={id}
						messages={chat.messages}
						isLoading={chat.isLoading}
					/>
				</ScrollArea>
			</div>
			<footer className="">
				<form className="flex mx-auto md:max-w-3xl">
					<MultimodalInput
						chatId={id}
						input={chat.input}
						setInput={chat.setInput}
						onSubmit={handleSubmit}
						isLoading={chat.isLoading}
						messages={chat.messages}
						setMessages={
							chat.setMessages as Dispatch<SetStateAction<UIMessage[]>>
						}
						append={chat.append}
						stop={chat.stop}
					/>
				</form>
			</footer>
		</div>
	)
}
