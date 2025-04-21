"use client";

import { Check } from "lucide-react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { type UseUploadQueueProps, useUploadQueue } from "../../hooks";
import { cn } from "../../lib/utils";
import { Button, type ButtonProps } from "../button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../dialog";

interface UploaderContextValue {
	addToQueue: (files: File[]) => void;
	queue: Array<{
		id: string;
		name: string;
		status: "queued" | "uploading" | "success" | "error";
		progress: number;
	}>;
	isUploadComplete: boolean;
	reset: () => void;
}

const UploaderContext = createContext<UploaderContextValue | null>(null);

function useUploaderContext() {
	const context = useContext(UploaderContext);
	if (!context) {
		throw new Error("Uploader components must be used within an Uploader");
	}
	return context;
}

export type UploaderProps = {
	className?: string;
	children: React.ReactNode;
} & UseUploadQueueProps;

/**
 * Main uploader component that provides upload queue functionality
 * @param props - Component props
 * @param props.className - Optional CSS class name
 * @param props.children - Child components
 */
export function Uploader({ className, children, ...hookProps }: UploaderProps) {
	const uploadQueue = useUploadQueue(hookProps);
	const { queue, isUploadComplete, reset } = uploadQueue;

	useEffect(() => {
		const completedFiles = queue.filter(
			(file) => file.status === "success",
		).length;

		if (isUploadComplete) {
			reset();
			toast.success(
				`${completedFiles} ${completedFiles === 1 ? "file" : "files"} uploaded`,
			);
		}
	}, [isUploadComplete, queue, reset]);

	return (
		<UploaderContext.Provider value={uploadQueue}>
			<div className={className}>{children}</div>
			{(queue.length > 0 || isUploadComplete) && <UploaderQueue />}
		</UploaderContext.Provider>
	);
}

/**
 * Overlay component that handles file drag and drop events
 * See https://github.com/react-dropzone/react-dropzone/issues/753#issuecomment-774782919 for inspiration.
 * @param props - Component props
 * @param props.children - Child components
 */
export function UploaderOverlay({
	activeText = "Drop the files here ..",
}: {
	activeText?: string;
}) {
	const { addToQueue } = useUploaderContext();
	const [isDragging, setIsDragging] = useState(false);
	const dragCounter = useRef(0);

	const handleDrag = useCallback((event: DragEvent) => {
		event.preventDefault();
		event.stopPropagation();
	}, []);

	const handleDragIn = useCallback((event: DragEvent) => {
		event.preventDefault();
		event.stopPropagation();
		dragCounter.current++;
		if (event.dataTransfer?.items && event.dataTransfer.items.length > 0) {
			setIsDragging(true);
		}
	}, []);

	const handleDragOut = useCallback((event: DragEvent) => {
		event.preventDefault();
		event.stopPropagation();
		dragCounter.current--;
		if (dragCounter.current > 0) return;
		setIsDragging(false);
	}, []);

	const handleDrop = useCallback(
		(event: DragEvent) => {
			event.preventDefault();
			event.stopPropagation();
			setIsDragging(false);
			if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
				dragCounter.current = 0;
				addToQueue(Array.from(event.dataTransfer.files));
				event.dataTransfer.clearData();
			}
		},
		[addToQueue],
	);

	useEffect(() => {
		window.addEventListener("dragenter", handleDragIn);
		window.addEventListener("dragleave", handleDragOut);
		window.addEventListener("dragover", handleDrag);
		window.addEventListener("drop", handleDrop);

		return function cleanUp() {
			window.removeEventListener("dragenter", handleDragIn);
			window.removeEventListener("dragleave", handleDragOut);
			window.removeEventListener("dragover", handleDrag);
			window.removeEventListener("drop", handleDrop);
		};
	});

	if (!isDragging) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur">
			{activeText}
		</div>
	);
}

export interface UploaderButtonProps extends ButtonProps {
	children: React.ReactNode;
}

/**
 * Button component that triggers file selection dialog
 * @param props - Component props extending ButtonProps
 * @param props.children - Child components
 */
export function UploaderButton({ children, ...props }: UploaderButtonProps) {
	const { addToQueue } = useUploaderContext();
	const inputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files || []);
		if (files.length > 0) {
			addToQueue(files);
			if (inputRef.current) inputRef.current.value = "";
		}
	};

	return (
		<Button {...props} onClick={() => inputRef.current?.click()}>
			<input
				type="file"
				ref={inputRef}
				onChange={handleFileChange}
				className="hidden"
				multiple
			/>
			{children}
		</Button>
	);
}

interface DropzoneProps {
	className?: string;
	disabled?: boolean;
	activeText?: React.ReactNode;
	defaultText?: React.ReactNode;
	disabledText?: React.ReactNode;
}

/**
 * Dropzone component for drag and drop file uploads
 * @param props - Component props
 * @param props.className - Optional CSS class name
 * @param props.disabled - Whether the dropzone is disabled
 * @param props.activeText - Text shown when dragging files
 * @param props.defaultText - Default text shown
 * @param props.disabledText - Text shown when disabled
 */
export function UploaderDropzone({
	className,
	disabled,
	activeText = "Drop the files here ..",
	defaultText = "Drag 'n' drop some files here, or click to select files",
	disabledText = "Dropzone is disabled",
}: Omit<DropzoneProps, "onFilesDrop">) {
	const { addToQueue } = useUploaderContext();

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			addToQueue(acceptedFiles);
		},
		[addToQueue],
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		disabled,
		onDrop,
	});

	return (
		<div
			{...getRootProps()}
			className={cn(
				"p-10 border-2 border-dashed rounded-lg text-center cursor-pointer",
				isDragActive ? "border-primary/50 bg-muted" : "border-gray-300",
				disabled && "opacity-50 cursor-not-allowed",
				className,
			)}
		>
			<input {...getInputProps()} />

			{disabled ? (
				<p>{disabledText}</p>
			) : isDragActive ? (
				<p>{activeText}</p>
			) : (
				<p>{defaultText}</p>
			)}
		</div>
	);
}

/**
 * Queue component that displays upload progress
 * Shows a fixed position queue with upload status and progress bars
 */
function UploaderQueue() {
	const { queue, isUploadComplete } = useUploaderContext();
	const [isOpen, setIsOpen] = useState(false);

	const completedFiles = queue.filter(
		(file) => file.status === "success",
	).length;

	useEffect(() => {
		setIsOpen(queue.length > 0);
	}, [queue]);

	return (
		<Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
			<DialogContent closeable={false}>
				<DialogHeader>
					<DialogTitle className="text-lg text-center">
						{isUploadComplete
							? `${completedFiles} ${completedFiles === 1 ? "file" : "files"} uploaded`
							: "Upload Queue"}
					</DialogTitle>
				</DialogHeader>

				<div className="max-h-60 overflow-y-auto">
					{queue.map((file) => (
						<div key={file.id} className="px-4 py-2 border-b last:border-b-0">
							<div className="flex items-center gap-2">
								<div className="flex-1 min-w-0">
									<div className="flex justify-between items-center">
										<span className="text-sm truncate">{file.name}</span>
										{file.status === "success" && (
											<Check className="h-4 w-4 text-green-500 flex-shrink-0" />
										)}
									</div>
									<div className="mt-1 h-1 bg-muted rounded-full overflow-hidden">
										<div
											className={`h-full transition-all duration-300 ${
												file.status === "error" ? "bg-red-500" : "bg-blue-500"
											}`}
											style={{ width: `${file.progress}%` }}
										/>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
}
