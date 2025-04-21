import { cn } from "../../lib/utils";
import { Checkbox } from "../checkbox";
import { TableHead, TableHeader, TableRow } from "../table";

export function FileTableHeader({
	checked,
	disabled,
	onCheckedChange,
}: {
	checked?: boolean;
	disabled?: boolean;
	onCheckedChange?: () => void;
}) {
	return (
		<TableHeader>
			<TableRow className={cn(checked && "bg-muted")}>
				<TableHead className="w-12">
					<Checkbox
						disabled={disabled}
						checked={checked}
						onCheckedChange={onCheckedChange}
					/>
				</TableHead>
				<TableHead>File name</TableHead>
				<TableHead>Type</TableHead>
				<TableHead>Size</TableHead>
				<TableHead>Updated</TableHead>
				<TableHead className="w-12" />
			</TableRow>
		</TableHeader>
	);
}
