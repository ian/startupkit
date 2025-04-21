"use client";

import type { Document } from "@local/db";
import {
	formatFileSize,
	formatRelativeDate,
	getFileType,
} from "@local/utils";
import { CheckCircle, CircleX } from "lucide-react";
import { getFileIcon } from "../../lib/files";
import { cn } from "../../lib/utils";
import { Checkbox } from "../checkbox";
import { Spinner } from "../spinner";
import { TableBody, TableCell, TableRow } from "../table";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../tooltip";

export type FileTableDataDocument = Pick<
	Document,
	| "id"
	| "name"
	| "type"
	| "size"
	| "updatedAt"
	| "status"
	| "error"
	| "ragieStatus"
	| "ragieError"
>;

export interface FileTableProps {
	files: FileTableDataDocument[];
	selected: string[];
	onClick?: (doc: FileTableDataDocument) => void;
	onSelect: (doc: FileTableDataDocument) => void;
}

export function FileTableData({
	files,
	selected,
	onClick,
	onSelect,
}: FileTableProps) {
	if (files.length === 0) {
		return (
			<TableBody>
				<TableRow>
					<TableCell colSpan={7} className="text-center">
						No files found
					</TableCell>
				</TableRow>
			</TableBody>
		);
	}

	return (
		<TableBody>
			{files.map((file) => {
				const type = getFileType(file.type);
				const FileIcon = getFileIcon(file.type);
				const checked = selected.includes(file.id);

				return (
					<TableRow key={file.name} className={cn(checked && "bg-muted")} hover>
						<TableCell width="5%">
							<Checkbox
								checked={checked}
								onCheckedChange={() => onSelect(file)}
							/>
						</TableCell>
						<TableCell width="50%" className="grow max-w-[400px] truncate">
							{onClick ? (
								<button
									type="button"
									onClick={() => onClick?.(file)}
									className="hover:underline block truncate"
								>
									{file.name}
								</button>
							) : (
								<p className="truncate">{file.name}</p>
							)}
						</TableCell>
						<TableCell width="10%">
							<span className="flex items-center gap-1 text-sm text-muted-foreground">
								<FileIcon className="size-4 uppercase" />
								{type}
							</span>
						</TableCell>
						<TableCell
							width="15%"
							className="whitespace-nowrap text-sm text-muted-foreground"
						>
							{formatFileSize(file.size)}
						</TableCell>
						<TableCell width="20%" className="whitespace-nowrap">
							{formatRelativeDate(file.updatedAt)}
						</TableCell>
						<TableCell width="5%" className="">
							<Status status={file.status} error={file.error} />
						</TableCell>
					</TableRow>
				);
			})}
		</TableBody>
	);
}

const Status = ({
	status,
	error,
}: { status: string | null; error: string | null }) => {
	if (status === "ready") {
		return <CheckCircle className="size-4 text-green-500" />;
	}

	if (status === "failed") {
		if (error) {
			return (
				<TooltipProvider>
					<Tooltip delayDuration={0}>
						<TooltipTrigger>
							<CircleX className="size-4 text-red-500" />
						</TooltipTrigger>
						<TooltipContent side="left" className="bg-red-500 text-white">
							<p>{error}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			);
		}

		return <CircleX className="size-4 text-red-500" />;
	}

	return <Spinner className="size-4 text-foreground" />;
};
