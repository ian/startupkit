"use client"

import type { UseChatOptions } from "@ai-sdk/react"
import { ChatCore } from "./chat-core"
import { ChatProvider, type ChatBindings } from "./chat-provider"
import { LightboxProvider } from "./lightbox-provider"
import { Agent } from "../../agents"

export type { ChatBindings }

export type ChatProps = UseChatOptions & {
	className?: string
	id: string
	bindings: ChatBindings
	template?: Agent
}

/**
 * Renders the chat interface with context providers for lightbox and chat state.
 *
 * Wraps the core chat UI with necessary providers, enabling features such as media lightboxing and chat state management.
 */
export function Chat({ bindings, ...chatProps }: ChatProps) {
	return (
		<LightboxProvider>
			<ChatProvider chatId={chatProps.id} bindings={bindings}>
				<ChatCore {...chatProps} />
			</ChatProvider>
		</LightboxProvider>
	)
}
