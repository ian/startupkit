import { cn } from "@/lib/utils";
import Image from "next/image";

export const Logo = ({ className }: { className?: string }) => {
	return (
		<Image
			alt="StartupKit Logo"
			src="/startupkit-light.svg"
			className={cn("w-auto h-8", className)}
			width={363}
			height={100}
		/>
	);
};
