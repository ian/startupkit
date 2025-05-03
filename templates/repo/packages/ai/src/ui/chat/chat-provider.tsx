"use client";

import type { Vote } from "@repo/db";
import {
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useState,
} from "react";
import useSWR, { mutate } from "swr";

interface ChatContextType {
	messages: ChatMessage[];
	addMessage: (message: ChatMessage) => void;
	clearMessages: () => void;
	isLoading: boolean;
	setIsLoading: (loading: boolean) => void;
	addVote: (params: {
		chatId: string;
		messageId: string;
		type: "up" | "down";
	}) => Promise<Vote>;
	votes: Vote[] | undefined;
}

interface ChatMessage {
	id: string;
	content: string;
	role: "user" | "assistant";
	timestamp: Date;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export type ChatBindings = {
	loadVotes: (chatId: string) => Promise<Vote[]>;
	addVote: (params: {
		chatId: string;
		messageId: string;
		type: "up" | "down";
	}) => Promise<Vote>;
};

interface ChatProviderProps {
	children: ReactNode;
	chatId: string;
	bindings: ChatBindings;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({
	children,
	chatId,
	bindings,
}) => {
	const url = `/api/vote?chatId=${chatId}`;
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const { data: votes } = useSWR<Array<Vote>>(url, () =>
		bindings.loadVotes(chatId),
	);

	const addMessage = (message: ChatMessage) => {
		setMessages((prev) => [...prev, message]);
	};

	const clearMessages = () => {
		setMessages([]);
	};

	const addVote = useCallback(
		async ({
			chatId,
			messageId,
			type,
		}: { chatId: string; messageId: string; type: "up" | "down" }) => {
			const newVote: Vote = {
				chatId,
				messageId,
				isUpvoted: type === "up",
				createdAt: new Date(),
				unread: true,
			};

			await bindings.addVote({ chatId, messageId, type });

			// Optimistically update the local data
			mutate(
				url,
				(currentVotes: Vote[] | undefined) => {
					if (!currentVotes) return [newVote];
					const votesWithoutCurrent = currentVotes.filter(
						(vote) => vote.messageId !== messageId,
					);
					return [...votesWithoutCurrent, newVote];
				},
				false,
			);

			return newVote;
		},
		[bindings.addVote, url],
	);

	const value = {
		messages,
		addMessage,
		clearMessages,
		isLoading,
		setIsLoading,
		addVote,
		votes,
	};

	return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextType => {
	const context = useContext(ChatContext);
	if (context === undefined) {
		throw new Error("useChat must be used within a ChatProvider");
	}
	return context;
};
