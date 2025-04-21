"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

/** Represents a file in the upload queue with its metadata and status */
interface UploadFile {
	file: File;
	id: string;
	name: string;
	status: "queued" | "uploading" | "success" | "error";
	progress: number;
}

const DEFAULT_MAX_CONCURRENT_UPLOADS = 3;

export interface UseUploadQueueProps {
	autoProcess?: boolean;
	concurrency?: number;
	onUpload: (file: File) => Promise<void>;
	onUploadComplete?: (file: UploadFile) => void;
}

/**
 * Hook for managing a queue of file uploads with concurrent upload limiting
 * @param onUpload - Function to handle the upload of a single file
 * @param onUploadComplete - Optional callback triggered when a file upload completes
 * @returns Object containing queue state and management functions
 */
export function useUploadQueue({
	autoProcess = true,
	concurrency = DEFAULT_MAX_CONCURRENT_UPLOADS,
	onUpload,
	onUploadComplete,
}: UseUploadQueueProps) {
	const [queue, setQueue] = useState<UploadFile[]>([]);

	/**
	 * Adds multiple files to the upload queue
	 * @param files - Array of files to be added to the queue
	 */
	const addToQueue = useCallback((files: File[]) => {
		const newFiles = files.map((file) => ({
			file,
			id: Math.random().toString(36).substr(2, 9),
			name: file.name,
			status: "queued" as const,
			progress: 0,
		}));
		setQueue((prevQueue) => [...prevQueue, ...newFiles]);
	}, []);

	/**
	 * Processes the queue, handling up to MAX_CONCURRENT_UPLOADS simultaneously
	 */
	const processQueue = useCallback(async () => {
		const uploading = queue.filter((file) => file.status === "uploading");
		const queued = queue.filter((file) => file.status === "queued");

		while (uploading.length < concurrency && queued.length > 0) {
			const fileToUpload = queued.shift();

			if (!fileToUpload) continue;

			setQueue((prevQueue) =>
				prevQueue.map((file) =>
					file.id === fileToUpload.id ? { ...file, status: "uploading" } : file,
				),
			);

			try {
				await onUpload(fileToUpload.file);
				onUploadComplete?.(fileToUpload);
				setQueue((prevQueue) =>
					prevQueue.map((file) =>
						file.id === fileToUpload.id
							? { ...file, status: "success", progress: 100 }
							: file,
					),
				);
			} catch (error) {
				setQueue((prevQueue) =>
					prevQueue.map((file) =>
						file.id === fileToUpload.id ? { ...file, status: "error" } : file,
					),
				);
			}

			uploading.push(fileToUpload);
		}
	}, [concurrency, queue, onUpload, onUploadComplete]);

	/**
	 * Removes a file from the queue by its ID
	 * @param id - Unique identifier of the file to remove
	 */
	const removeFromQueue = useCallback((id: string) => {
		setQueue((prevQueue) => prevQueue.filter((file) => file.id !== id));
	}, []);

	/**
	 * Resets the queue to its initial empty state
	 */
	const reset = useCallback(() => {
		setQueue([]);
	}, []);

	/**
	 * Indicates whether any files in the queue are currently uploading
	 */
	const isUploading = useMemo(() => {
		return (
			queue.length > 0 && queue.some((file) => file.status === "uploading")
		);
	}, [queue]);

	/**
	 * Indicates whether all files in the queue have completed (success or error)
	 */
	const isUploadComplete = useMemo(() => {
		return (
			queue.length > 0 &&
			queue.every(
				(file) => file.status === "success" || file.status === "error",
			)
		);
	}, [queue]);

	/**
	 * Processes the queue when a file is added to it
	 */
	useEffect(() => {
		if (!autoProcess) return;
		if (queue.some((file) => file.status === "queued")) {
			processQueue();
		}
	}, [autoProcess, queue, processQueue]);

	return {
		queue,
		addToQueue,
		processQueue,
		removeFromQueue,
		isUploading,
		isUploadComplete,
		reset,
	};
}
