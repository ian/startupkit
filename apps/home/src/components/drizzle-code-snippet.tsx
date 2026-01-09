function TwoslashToken({
	children,
	typeContent
}: {
	children: React.ReactNode
	typeContent: React.ReactNode
}) {
	return (
		<span className="group relative inline cursor-help">
			{children}
			<span className="pointer-events-none absolute left-0 bottom-full mb-2 z-50 hidden group-hover:block">
				<span className="block bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-xs font-mono shadow-xl whitespace-pre text-left">
					{typeContent}
				</span>
				<span className="absolute left-4 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-zinc-700" />
			</span>
		</span>
	)
}

export function DrizzleCodeSnippet() {
	return (
		<code className="text-zinc-300">
			<span className="text-purple-400">const</span>{" "}
			<TwoslashToken
				typeContent={
					<>
						<span className="text-purple-400">const</span>{" "}
						<span className="text-cyan-400">user</span>
						<span className="text-zinc-400">:</span>{" "}
						<span className="text-green-400">User</span>{" "}
						<span className="text-zinc-400">|</span>{" "}
						<span className="text-orange-400">undefined</span>
					</>
				}
			>
				<span className="text-zinc-100 border-b border-dashed border-zinc-600">
					user
				</span>
			</TwoslashToken>
			<span className="text-zinc-100"> = </span>
			<span className="text-purple-400">await</span>{" "}
			<TwoslashToken
				typeContent={
					<>
						<span className="text-purple-400">const</span>{" "}
						<span className="text-cyan-400">db</span>
						<span className="text-zinc-400">:</span>{" "}
						<span className="text-green-400">DrizzleDB</span>
						<span className="text-zinc-400">&lt;</span>
						<span className="text-purple-400">typeof</span>{" "}
						<span className="text-cyan-400">schema</span>
						<span className="text-zinc-400">&gt;</span>
					</>
				}
			>
				<span className="text-zinc-100 border-b border-dashed border-zinc-600">
					db
				</span>
			</TwoslashToken>
			<span className="text-zinc-100">.</span>
			<TwoslashToken
				typeContent={
					<>
						<span className="text-cyan-400">query</span>
						<span className="text-zinc-400">:</span>{" "}
						<span className="text-green-400">DrizzleRelationalQuery</span>
					</>
				}
			>
				<span className="text-zinc-100 border-b border-dashed border-zinc-600">
					query
				</span>
			</TwoslashToken>
			<span className="text-zinc-100">.</span>
			<TwoslashToken
				typeContent={
					<>
						<span className="text-cyan-400">users</span>
						<span className="text-zinc-400">:</span>{" "}
						<span className="text-green-400">UsersRelations</span>
					</>
				}
			>
				<span className="text-zinc-100 border-b border-dashed border-zinc-600">
					users
				</span>
			</TwoslashToken>
			<span className="text-zinc-100">.</span>
			<TwoslashToken
				typeContent={
					<>
						<span className="text-yellow-400">findFirst</span>
						<span className="text-zinc-400">(</span>
						<span className="text-cyan-400">config</span>
						<span className="text-zinc-400">?:</span>{" "}
						<span className="text-green-400">FindFirstConfig</span>
						<span className="text-zinc-400">&lt;</span>
						<span className="text-green-400">User</span>
						<span className="text-zinc-400">&gt;</span>
						<span className="text-zinc-400">)</span>
						<span className="text-zinc-400">:</span>{" "}
						<span className="text-green-400">Promise</span>
						<span className="text-zinc-400">&lt;</span>
						<span className="text-green-400">User</span>{" "}
						<span className="text-zinc-400">|</span>{" "}
						<span className="text-orange-400">undefined</span>
						<span className="text-zinc-400">&gt;</span>
					</>
				}
			>
				<span className="text-yellow-400 border-b border-dashed border-zinc-600">
					findFirst
				</span>
			</TwoslashToken>
			<span className="text-zinc-100">()</span>
		</code>
	)
}
