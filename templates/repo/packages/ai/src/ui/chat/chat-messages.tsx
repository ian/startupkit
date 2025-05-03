"use client";

import { useScrollToBottom } from "@repo/ui/hooks";
import { memo } from "react";
import type { UIMessage } from "../../types";
import { ChatMessage, ThinkingMessage } from "./chat-message";
import { useChat } from "./chat-provider";

interface ChatMessagesProps {
	messages: UIMessage[];
	isLoading: boolean;
	chatId: string;
}

export const ChatMessages = memo(function ChatMessages({
	messages,
	isLoading,
	chatId,

}: ChatMessagesProps) {
	const [containerRef, endRef] = useScrollToBottom<HTMLDivElement>();
	const { votes } = useChat();

	return (
		<div ref={containerRef} className="flex flex-col gap-8">
			{messages.map((message, index) => (
				<ChatMessage
					key={message.id}
					chatId={chatId}
					message={message}
					isLoading={isLoading && messages.length - 1 === index}
					vote={votes?.find((vote) => vote.messageId === message.id)}
				/>
			))}

			{isLoading &&
				messages.length > 0 &&
				messages[messages.length - 1]?.role === "user" && <ThinkingMessage />}

			<div ref={endRef} className="shrink-0 min-w-[24px] min-h-[24px]" />
		</div>
	);
});
