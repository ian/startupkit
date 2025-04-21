"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group"
			closeButton={true}
			toastOptions={{
				classNames: {
					success: "text-green-400",
					error: "text-red-400",
					warning: "text-yellow-400",
					info: "text-blue-400",
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
