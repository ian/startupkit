"use client";

import * as React from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "../components/alert-dialog";

interface AlertContextType {
	confirm: (message: string) => Promise<boolean>;
}

const AlertContext = React.createContext<AlertContextType | undefined>(
	undefined,
);

export function useAlert() {
	const context = React.useContext(AlertContext);
	if (!context) throw new Error("useAlert must be used within AlertProvider");
	return context;
}

export function AlertProvider({ children }: { children: React.ReactNode }) {
	const [message, setMessage] = React.useState<string | null>(null);
	const resolveRef = React.useRef<(value: boolean) => void>(null);

	const confirm = React.useCallback((message: string) => {
		setMessage(message);
		return new Promise<boolean>((resolve) => {
			resolveRef.current = resolve;
		});
	}, []);

	const handleConfirm = React.useCallback(() => {
		resolveRef.current?.(true);
		setMessage(null);
	}, []);

	const handleCancel = React.useCallback(() => {
		resolveRef.current?.(false);
		setMessage(null);
	}, []);

	return (
		<AlertContext.Provider value={{ confirm }}>
			{children}

			<AlertDialog
				open={!!message}
				onOpenChange={() => message && handleCancel()}
			>
				<AlertDialogContent className="max-w-md">
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>{message}</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleConfirm}>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</AlertContext.Provider>
	);
}
