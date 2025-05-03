export const LoaderIcon = ({ size = 16 }: { size?: number }) => {
	return (
		<svg
			height={size}
			strokeLinejoin="round"
			viewBox="0 0 16 16"
			width={size}
			style={{ color: "currentcolor" }}
		>
			<title>Loading</title>
			<g clipPath="url(#clip0_2393_1490)">
				<path d="M8 0V4" stroke="currentColor" strokeWidth="1.5" />
				<path
					opacity="0.5"
					d="M8 16V12"
					stroke="currentColor"
					strokeWidth="1.5"
				/>
				<path
					opacity="0.9"
					d="M3.29773 1.52783L5.64887 4.7639"
					stroke="currentColor"
					strokeWidth="1.5"
				/>
				<path
					opacity="0.1"
					d="M12.7023 1.52783L10.3511 4.7639"
					stroke="currentColor"
					strokeWidth="1.5"
				/>
				<path
					opacity="0.4"
					d="M12.7023 14.472L10.3511 11.236"
					stroke="currentColor"
					strokeWidth="1.5"
				/>
				<path
					opacity="0.6"
					d="M3.29773 14.472L5.64887 11.236"
					stroke="currentColor"
					strokeWidth="1.5"
				/>
				<path
					opacity="0.2"
					d="M15.6085 5.52783L11.8043 6.7639"
					stroke="currentColor"
					strokeWidth="1.5"
				/>
				<path
					opacity="0.7"
					d="M0.391602 10.472L4.19583 9.23598"
					stroke="currentColor"
					strokeWidth="1.5"
				/>
				<path
					opacity="0.3"
					d="M15.6085 10.4722L11.8043 9.2361"
					stroke="currentColor"
					strokeWidth="1.5"
				/>
				<path
					opacity="0.8"
					d="M0.391602 5.52783L4.19583 6.7639"
					stroke="currentColor"
					strokeWidth="1.5"
				/>
			</g>
			<defs>
				<clipPath id="clip0_2393_1490">
					<rect width="16" height="16" fill="white" />
				</clipPath>
			</defs>
		</svg>
	);
};

export const CopyIcon = ({ size = 16 }: { size?: number }) => (
	<svg
		height={size}
		strokeLinejoin="round"
		viewBox="0 0 16 16"
		width={size}
		style={{ color: "currentcolor" }}
	>
		<title>Copy</title>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M2.75 0.5C1.7835 0.5 1 1.2835 1 2.25V9.75C1 10.7165 1.7835 11.5 2.75 11.5H3.75H4.5V10H3.75H2.75C2.61193 10 2.5 9.88807 2.5 9.75V2.25C2.5 2.11193 2.61193 2 2.75 2H8.25C8.38807 2 8.5 2.11193 8.5 2.25V3H10V2.25C10 1.2835 9.2165 0.5 8.25 0.5H2.75ZM7.75 4.5C6.7835 4.5 6 5.2835 6 6.25V13.75C6 14.7165 6.7835 15.5 7.75 15.5H13.25C14.2165 15.5 15 14.7165 15 13.75V6.25C15 5.2835 14.2165 4.5 13.25 4.5H7.75ZM7.5 6.25C7.5 6.11193 7.61193 6 7.75 6H13.25C13.3881 6 13.5 6.11193 13.5 6.25V13.75C13.5 13.8881 13.3881 14 13.25 14H7.75C7.61193 14 7.5 13.8881 7.5 13.75V6.25Z"
			fill="currentColor"
		/>
	</svg>
);

export const ThumbUpIcon = ({ size = 16 }: { size?: number }) => (
	<svg
		height={size}
		strokeLinejoin="round"
		viewBox="0 0 16 16"
		width={size}
		style={{ color: "currentcolor" }}
	>
		<title>Upvote</title>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M6.89531 2.23972C6.72984 2.12153 6.5 2.23981 6.5 2.44315V5.25001C6.5 6.21651 5.7165 7.00001 4.75 7.00001H2.5V13.5H12.1884C12.762 13.5 13.262 13.1096 13.4011 12.5532L14.4011 8.55318C14.5984 7.76425 14.0017 7.00001 13.1884 7.00001H9.25H8.5V6.25001V3.51458C8.5 3.43384 8.46101 3.35807 8.39531 3.31114L6.89531 2.23972ZM5 2.44315C5 1.01975 6.6089 0.191779 7.76717 1.01912L9.26717 2.09054C9.72706 2.41904 10 2.94941 10 3.51458V5.50001H13.1884C14.9775 5.50001 16.2903 7.18133 15.8563 8.91698L14.8563 12.917C14.5503 14.1412 13.4503 15 12.1884 15H1.75H1V14.25V6.25001V5.50001H1.75H4.75C4.88807 5.50001 5 5.38808 5 5.25001V2.44315Z"
			fill="currentColor"
		/>
	</svg>
);

export const ThumbDownIcon = ({ size = 16 }: { size?: number }) => (
	<svg
		height={size}
		strokeLinejoin="round"
		viewBox="0 0 16 16"
		width={size}
		style={{ color: "currentcolor" }}
	>
		<title>Downvote</title>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M6.89531 13.7603C6.72984 13.8785 6.5 13.7602 6.5 13.5569V10.75C6.5 9.7835 5.7165 9 4.75 9H2.5V2.5H12.1884C12.762 2.5 13.262 2.89037 13.4011 3.44683L14.4011 7.44683C14.5984 8.23576 14.0017 9 13.1884 9H9.25H8.5V9.75V12.4854C8.5 12.5662 8.46101 12.6419 8.39531 12.6889L6.89531 13.7603ZM5 13.5569C5 14.9803 6.6089 15.8082 7.76717 14.9809L9.26717 13.9095C9.72706 13.581 10 13.0506 10 12.4854V10.5H13.1884C14.9775 10.5 16.2903 8.81868 15.8563 7.08303L14.8563 3.08303C14.5503 1.85882 13.4503 1 12.1884 1H1.75H1V1.75V9.75V10.5H1.75H4.75C4.88807 10.5 5 10.6119 5 10.75V13.5569Z"
			fill="currentColor"
		/>
	</svg>
);

export const SparklesIcon = ({ size = 16 }: { size?: number }) => (
	<svg
		height={size}
		strokeLinejoin="round"
		viewBox="0 0 16 16"
		width={size}
		style={{ color: "currentcolor" }}
	>
		<title>Sparkles</title>
		<path
			d="M2.5 0.5V0H3.5V0.5C3.5 1.60457 4.39543 2.5 5.5 2.5H6V3V3.5H5.5C4.39543 3.5 3.5 4.39543 3.5 5.5V6H3H2.5V5.5C2.5 4.39543 1.60457 3.5 0.5 3.5H0V3V2.5H0.5C1.60457 2.5 2.5 1.60457 2.5 0.5Z"
			fill="currentColor"
		/>
		<path
			d="M14.5 4.5V5H13.5V4.5C13.5 3.94772 13.0523 3.5 12.5 3.5H12V3V2.5H12.5C13.0523 2.5 13.5 2.05228 13.5 1.5V1H14H14.5V1.5C14.5 2.05228 14.9477 2.5 15.5 2.5H16V3V3.5H15.5C14.9477 3.5 14.5 3.94772 14.5 4.5Z"
			fill="currentColor"
		/>
		<path
			d="M8.40706 4.92939L8.5 4H9.5L9.59294 4.92939C9.82973 7.29734 11.7027 9.17027 14.0706 9.40706L15 9.5V10.5L14.0706 10.5929C11.7027 10.8297 9.82973 12.7027 9.59294 15.0706L9.5 16H8.5L8.40706 15.0706C8.17027 12.7027 6.29734 10.8297 3.92939 10.5929L3 10.5V9.5L3.92939 9.40706C6.29734 9.17027 8.17027 7.29734 8.40706 4.92939Z"
			fill="currentColor"
		/>
	</svg>
);

export const ArrowUpIcon = ({ size = 16 }: { size?: number }) => {
	return (
		<svg
			height={size}
			strokeLinejoin="round"
			viewBox="0 0 16 16"
			width={size}
			style={{ color: "currentcolor" }}
		>
			<title>Arrow Up</title>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M8.70711 1.39644C8.31659 1.00592 7.68342 1.00592 7.2929 1.39644L2.21968 6.46966L1.68935 6.99999L2.75001 8.06065L3.28034 7.53032L7.25001 3.56065V14.25V15H8.75001V14.25V3.56065L12.7197 7.53032L13.25 8.06065L14.3107 6.99999L13.7803 6.46966L8.70711 1.39644Z"
				fill="currentColor"
			/>
		</svg>
	);
};

export const PaperclipIcon = ({ size = 16 }: { size?: number }) => {
	return (
		<svg
			height={size}
			strokeLinejoin="round"
			viewBox="0 0 16 16"
			width={size}
			style={{ color: "currentcolor" }}
			className="-rotate-45"
		>
			<title>Paperclip</title>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M10.8591 1.70735C10.3257 1.70735 9.81417 1.91925 9.437 2.29643L3.19455 8.53886C2.56246 9.17095 2.20735 10.0282 2.20735 10.9222C2.20735 11.8161 2.56246 12.6734 3.19455 13.3055C3.82665 13.9376 4.68395 14.2927 5.57786 14.2927C6.47178 14.2927 7.32908 13.9376 7.96117 13.3055L14.2036 7.06304L14.7038 6.56287L15.7041 7.56321L15.204 8.06337L8.96151 14.3058C8.06411 15.2032 6.84698 15.7074 5.57786 15.7074C4.30875 15.7074 3.09162 15.2032 2.19422 14.3058C1.29682 13.4084 0.792664 12.1913 0.792664 10.9222C0.792664 9.65305 1.29682 8.43592 2.19422 7.53852L8.43666 1.29609C9.07914 0.653606 9.95054 0.292664 10.8591 0.292664C11.7678 0.292664 12.6392 0.653606 13.2816 1.29609C13.9241 1.93857 14.2851 2.80997 14.2851 3.71857C14.2851 4.62718 13.9241 5.49858 13.2816 6.14106L13.2814 6.14133L7.0324 12.3835C7.03231 12.3836 7.03222 12.3837 7.03213 12.3838C6.64459 12.7712 6.11905 12.9888 5.57107 12.9888C5.02297 12.9888 4.49731 12.7711 4.10974 12.3835C3.72217 11.9959 3.50444 11.4703 3.50444 10.9222C3.50444 10.3741 3.72217 9.8484 4.10974 9.46084L4.11004 9.46054L9.877 3.70039L10.3775 3.20051L11.3772 4.20144L10.8767 4.70131L5.11008 10.4612C5.11005 10.4612 5.11003 10.4612 5.11 10.4613C4.98779 10.5835 4.91913 10.7493 4.91913 10.9222C4.91913 11.0951 4.98782 11.2609 5.11008 11.3832C5.23234 11.5054 5.39817 11.5741 5.57107 11.5741C5.74398 11.5741 5.9098 11.5054 6.03206 11.3832L6.03233 11.3829L12.2813 5.14072C12.2814 5.14063 12.2815 5.14054 12.2816 5.14045C12.6586 4.7633 12.8704 4.25185 12.8704 3.71857C12.8704 3.18516 12.6585 2.6736 12.2813 2.29643C11.9041 1.91925 11.3926 1.70735 10.8591 1.70735Z"
				fill="currentColor"
			/>
		</svg>
	);
};

export const StopIcon = ({ size = 16 }: { size?: number }) => {
	return (
		<svg
			height={size}
			viewBox="0 0 16 16"
			width={size}
			style={{ color: "currentcolor" }}
		>
			<title>Stop</title>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M3 3H13V13H3V3Z"
				fill="currentColor"
			/>
		</svg>
	);
};
