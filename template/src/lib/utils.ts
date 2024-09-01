import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Pauses execution for the specified number of milliseconds.
 * @param ms The number of milliseconds to pause.
 * @returns A Promise that resolves after the specified delay.
 */
export const pause = (ms: number): Promise<void> => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};
