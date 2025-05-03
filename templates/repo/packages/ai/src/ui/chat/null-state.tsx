import { motion } from "framer-motion"
import { Building2, MessageSquare } from "lucide-react"
import { Agent } from "../../agents"

export type ChatNullStatePrompt = {
	icon: React.ReactNode
	title: string
	desc: string
	text: string
	template?: Agent
}

/**
 * Renders the chat interface's welcome screen with selectable prompt options.
 *
 * Displays a welcome message and a grid of suggested prompts for the user to choose from. When a prompt is selected, the provided {@link onClick} handler is called with the chosen prompt.
 *
 * @param onClick - Callback invoked when a prompt is selected, receiving the chosen {@link ChatNullStatePrompt}.
 */
export function ChatNullState({
	onClick
}: {
	onClick: (prompt: ChatNullStatePrompt) => void
}) {
	return (
		<div className="w-full mx-auto gap-8 flex flex-col">
			<div className="text-center">
				<h2 className="text-gray-500 text-lg md:text-3xl mb-1 md:mb-2">
					Welcome to BrokerBot,
				</h2>
				<h1 className="text-xl md:text-4xl font-bold">
					How can I help you today?
				</h1>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{prompts.map((prompt, index) => (
					<motion.div
						key={`suggested-action-${prompt.title}-${index}`}
						className="w-full"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
						transition={{ delay: 0.05 * index }}
					>
						<button
							type="button"
							className="bg-muted hover:bg-card transition-all duration-100 hover:scale-[102%] w-full p-6 rounded-2xl shadow-sm hover:shadow-xl text-left group"
							onClick={() => onClick(prompt)}
						>
							<div className="mb-4 hidden md:block">
								<div className="inline-block p-3 rounded-2xl bg-muted text-gray-600 group-hover:bg-blue-500/10 group-hover:text-blue-600 transition-colors duration-200">
									{prompt.icon}
								</div>
							</div>
							<div>
								<h3 className="md:text-xl font-semibold mb-1">
									{prompt.title}
								</h3>
								<p className="text-gray-500 text-sm">{prompt.desc}</p>
							</div>
						</button>
					</motion.div>
				))}
			</div>
		</div>
	)
}

const prompts: ChatNullStatePrompt[] = [
	{
		icon: <Building2 className="h-8 w-8 stroke-[1.5]" />,
		title: "Marketing Package for a New Listing",
		desc: "Let’s craft a powerful marketing package for your new listing.",
		text: "I want your help to create a marketing package for a new listing ...",
		template: "marketing"
	},
	{
		icon: <MessageSquare className="h-8 w-8 stroke-[1.5]" />,
		title: "Practice Scripts & Objection Handlers",
		desc: "I can reference top sales training materials and coaching scripts to provide precise guidance.",
		template: "practice",
		text: "I want your help to practice scripts and objection handlers ..."
	}
]
