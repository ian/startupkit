import { getFileType } from "@local/utils";
import {
	FileImageIcon,
	FileSpreadsheet,
	FileText,
	type LucideIcon,
} from "lucide-react";

export function getFileIcon(mimeType: string): LucideIcon {
	const type = getFileType(mimeType);

	switch (type) {
		case "data":
			return FileSpreadsheet;
		case "text":
		case "pdf":
			return FileText;
		case "image":
			return FileImageIcon;

		// I'd like to support these
		// case "video":
		// 	return FileVideoIcon;
		// case "audio":
		// 	return FileAudioIcon;
		// case "folder":
		// 	return FolderIcon;

		default:
			return FileText;
	}
}
