import { getUser } from "@startupkit/auth/server";

export default async function HomePage() {
	const { user } = await getUser();

	return (
		<div className="h-full flex flex-col items-center justify-center">
			<>
				<h2 className="text-2xl font-bold">
					Welcome back{user?.firstName && `, ${user?.firstName}`}
				</h2>
				<p>You are now authenticated into the application</p>
			</>
		</div>
	);
}
