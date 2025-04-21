"use client";

import { Checkbox } from "../checkbox";
import { Skeleton } from "../skeleton";
import { TableBody, TableCell, TableRow } from "../table";

interface FileTableSkeletonProps {
	count: number;
}

export function FileTableSkeleton({ count }: FileTableSkeletonProps) {
	return (
		<TableBody>
			{new Array(count).fill(null).map((_, i) => {
				return (
					<TableRow key={`TableRow-skeleton-${i.toString()}`}>
						<TableCell width="5%">
							<Checkbox disabled />
						</TableCell>
						<TableCell width="50%">
							<Skeleton className="h-4 w-full" />
						</TableCell>
						<TableCell width="10%">
							<Skeleton className="h-4 w-full" />
						</TableCell>
						<TableCell
							width="15%"
							className="whitespace-nowrap text-sm text-muted-foreground"
						>
							<Skeleton className="h-4 w-full" />
						</TableCell>
						<TableCell width="20%" className="whitespace-nowrap">
							<Skeleton className="h-4 w-full" />
						</TableCell>
						<TableCell width="5%" className="min-w-12">
							<Skeleton className="h-4 w-full" />
						</TableCell>
					</TableRow>
				);
			})}
		</TableBody>
	);
}
