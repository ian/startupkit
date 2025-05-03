"use client";

import { cn } from "@repo/ui/utils";
import { useCopyToClipboard } from "usehooks-ts";
import type { UIMessage } from "../../types";
import type { Vote } from "@repo/db";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@repo/ui/components/tooltip";
import { getMessageIdFromAnnotations } from "../../lib/helpers";
import { useChat } from "./chat-provider";
import { CopyIcon, ThumbDownIcon, ThumbUpIcon } from "./icons";
import { Button } from "@repo/ui/components/button";
import { toast } from "@repo/ui/components/toast";

export function MessageActions({
	chatId,
	message,
	vote,
	isLoading,
}: {
	chatId: string;
	message: UIMessage;
	vote: Vote | undefined;
	isLoading: boolean;
}) {
	const { addVote, votes } = useChat()
	const [_, copyToClipboard] = useCopyToClipboard();

	if (isLoading) return null;
	if (message.role === "user") return null;
	if (message.toolInvocations && message.toolInvocations.length > 0)
		return null;

	return (
		<TooltipProvider delayDuration={0}>
			<div className="flex flex-row gap-2">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							className="py-1 px-2 h-fit text-muted-foreground"
							variant="outline"
							onClick={async () => {
								await copyToClipboard(message.content as string);
								toast.success("Copied to clipboard!");
							}}
						>
							<CopyIcon />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Copy</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							className={
								cn(
									"py-1 px-2 h-fit text-muted-foreground !pointer-events-auto",
									vote?.isUpvoted && "text-success bg-success/10",
								)
							}
							disabled={vote?.isUpvoted}
							variant="outline"
							onClick={async () => {
								const messageId = getMessageIdFromAnnotations(message);

								const upvotePromise = addVote({
									chatId,
									messageId,
									type: "up",
								});

								toast.promise(upvotePromise, {
									loading: "Upvoting Response...",
									success: "Upvoted Response!",
									error: "Failed to upvote response.",
								});
							}}
						>
							<ThumbUpIcon />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Upvote Response</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							className={
								cn(
									"py-1 px-2 h-fit text-muted-foreground !pointer-events-auto",
									vote && !vote.isUpvoted && "text-destructive bg-destructive/10",
								)
							}
							variant="outline"
							disabled={vote && !vote.isUpvoted}
							onClick={async () => {
								const messageId = getMessageIdFromAnnotations(
									message as UIMessage,
								);
								const downvotePromise = addVote({
									chatId,
									messageId,
									type: "down",
								});

								toast.promise(downvotePromise, {
									loading: "Downvoting Response...",
									success: "Downvoted Response!",
									error: "Failed to downvote response.",
								});
							}}
						>
							<ThumbDownIcon />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Downvote Response</TooltipContent>
				</Tooltip>
			</div>
		</TooltipProvider>
	);
}
