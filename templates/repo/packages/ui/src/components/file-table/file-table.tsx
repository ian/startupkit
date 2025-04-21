"use client";

import type { FileType } from "@local/utils";
import { RefreshCw, Search, Trash, X } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import { useDebouncedCallback } from "use-debounce";
import { cn } from "../../lib/utils";
import { useAlert } from "../../providers";
import { Button } from "../button";
import { Input } from "../input/input";
import { Spinner } from "../spinner";
import { Table } from "../table";
import { Tabs, TabsList, TabsTrigger } from "../tabs";
import { FileTableData, type FileTableDataDocument } from "./file-table-data";
import { FileTableHeader } from "./file-table-header";
import { FileTableSkeleton } from "./file-table-skeleton";

export type { FileTableDataDocument };

export type FileTableFetcherProps = {
	fileType?: FileType;
	search?: string;
};

export interface FileTableProps {
	className?: string;
	fetcher: (props: FileTableFetcherProps) => Promise<FileTableDataDocument[]>;
	mutateKey: string;
	onClick?: (file: FileTableDataDocument) => void;
	onDelete?: (ids: string[]) => void;
	onRefresh?: (ids: string[]) => void;
}

export function FileTable({
	className,
	fetcher,
	mutateKey,
	onClick,
	onDelete,
	onRefresh,
}: FileTableProps) {
	const { confirm } = useAlert();

	const [fileType, setFileType] = useState<"all" | FileType>("all");
	const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
	const [search, setSearch] = useState("");

	const { data: files = [], isLoading } = useSWR<FileTableDataDocument[]>(
		`${mutateKey}?fileType=${fileType}&search=${search}`,
		{
			fetcher: () =>
				fetcher({
					fileType: fileType === "all" ? undefined : fileType,
					search,
				}),
			refreshInterval: 1000 * 5,
			fallbackData: [],
		},
	);

	const isDisabled = files.length === 0;
	const isSelectAll = !isDisabled && selectedFiles.length === files.length;

	const handleSelectFile = useCallback((id: string) => {
		setSelectedFiles((prev) =>
			prev.includes(id) ? prev.filter((_id) => _id !== id) : [...prev, id],
		);
	}, []);

	const handleSelectAll = useCallback(() => {
		isSelectAll
			? setSelectedFiles([])
			: setSelectedFiles(files.map((file) => file.id));
	}, [files, isSelectAll]);

	const handleDelete = useCallback(async () => {
		const confirmed = await confirm(
			"Are you sure you want to delete these files?",
		);
		if (confirmed) {
			onDelete?.(selectedFiles);
			setSelectedFiles([]);
			toast.success(`Deleting ${selectedFiles.length} files`);
			mutate((key) => typeof key === "string" && key.startsWith(mutateKey));
		}
	}, [confirm, onDelete, mutateKey, selectedFiles]);

	const handleRefresh = useCallback(async () => {
		onRefresh?.(selectedFiles);
		setSelectedFiles([]);
		toast.success(`Refreshing ${selectedFiles.length} files`);
		mutate((key) => typeof key === "string" && key.startsWith(mutateKey));
	}, [onRefresh, mutateKey, selectedFiles]);

	return (
		<div className={cn("space-y-4 w-full overflow-x-auto", className)}>
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 md:gap-10">
				{selectedFiles.length > 0 ? (
					<div className="flex items-center gap-2">
						{onDelete ? (
							<Button
								variant="destructive"
								size="sm"
								onClick={() => handleDelete?.()}
							>
								<Trash className="mr-2 h-4 w-4" />
								Delete
							</Button>
						) : null}
						{onRefresh ? (
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleRefresh?.()}
							>
								<RefreshCw className="mr-2 h-4 w-4" />
								Resync
							</Button>
						) : null}
					</div>
				) : (
					<Tabs
						defaultValue={fileType}
						className="w-full sm:w-auto"
						onValueChange={(tab) => setFileType(tab as FileType)}
					>
						<TabsList>
							<TabsTrigger value="all">All Files</TabsTrigger>
							<TabsTrigger value="pdf">PDFs</TabsTrigger>
							<TabsTrigger value="data">Data</TabsTrigger>
							<TabsTrigger value="image">Images</TabsTrigger>
							<TabsTrigger value="text">Text</TabsTrigger>
						</TabsList>
					</Tabs>
				)}
				<DebouncedSearchInput loading={isLoading} onChange={setSearch} />
			</div>
			<Table className="-mx-4">
				<FileTableHeader
					checked={isSelectAll}
					disabled={isDisabled}
					onCheckedChange={handleSelectAll}
				/>
				{isLoading ? (
					<FileTableSkeleton count={5} />
				) : (
					<FileTableData
						files={files}
						selected={selectedFiles}
						onSelect={(file) => handleSelectFile(file.id)}
						onClick={onClick}
					/>
				)}
			</Table>
		</div>
	);
}

const DebouncedSearchInput = ({
	loading,
	onChange,
}: {
	loading?: boolean;
	onChange: (value: string) => void;
}) => {
	const debouncedChange = useDebouncedCallback(onChange, 500);
	const [value, setValue] = useState("");

	const rightIcon = loading ? (
		<Spinner className="size-4" />
	) : value.length > 0 ? (
		<button
			type="button"
			onClick={() => {
				setValue("");
				onChange("");
			}}
		>
			<X className="size-4" />
		</button>
	) : null;

	return (
		<Input
			placeholder="Search documents..."
			className="w-full md:max-w-[200px]"
			leftIcon={<Search className="size-4" />}
			rightIcon={rightIcon}
			value={value}
			onChange={(e) => {
				setValue(e.target.value);
				debouncedChange(e.target.value);
			}}
		/>
	);
};
