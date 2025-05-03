import { truncate } from "@repo/utils"
import { FileText } from "lucide-react"
import {
	ALLOWED_DATA_MIME_TYPES,
	ALLOWED_DOCUMENT_MIME_TYPES,
	ALLOWED_IMAGE_MIME_TYPES,
	ALLOWED_TEXT_MIME_TYPES
} from "../../lib/constants"
import { LoaderIcon } from "./icons"
import { UIAttachment } from "../../types"

export const PreviewAttachment = ({
	attachment,
	isUploading = false,
	onClick
}: {
	attachment: UIAttachment
	isUploading?: boolean
	onClick?: () => void
}) => {
	const { name } = attachment

	return (
		<div className="flex flex-col gap-2">
			<div className="w-40 aspect-video bg-muted rounded-md relative flex flex-col items-center justify-center">
				<Media attachment={attachment} onClick={onClick} />

				{isUploading && (
					<div className="animate-spin absolute text-zinc-500">
						<LoaderIcon />
					</div>
				)}
			</div>
		</div>
	)
}

const Media = ({
	attachment,
	onClick
}: {
	attachment: UIAttachment
	onClick?: () => void
}) => {
	const { name, url, contentType } = attachment

	if (!contentType) {
		return <div className="bg-red-500" />
	}

	switch (true) {
		case ALLOWED_DATA_MIME_TYPES.has(contentType):
			return (
				<button
					type="button"
					key={url}
					onClick={onClick}
					className="flex flex-col items-center justify-center gap-2 text-muted-foreground"
				>
					<FileText className="size-8" />
					<p className="text-xs">{truncate(getFileName(url), 20)}</p>
				</button>
			)

		case ALLOWED_DOCUMENT_MIME_TYPES.has(contentType):
			return (
				<button
					type="button"
					key={url}
					onClick={onClick}
					className="flex flex-col items-center justify-center gap-2 text-muted-foreground"
				>
					<FileText className="size-8" />
					<p className="text-xs">{truncate(getFileName(url), 20)}</p>
				</button>
			)

		case ALLOWED_IMAGE_MIME_TYPES.has(contentType):
			return (
				<button type="button" key={url} onClick={onClick}>
					<img
						src={url}
						alt={name ?? "An image attachment"}
						className="rounded-md size-full object-cover hover:scale-105 transition-all"
					/>
				</button>
			)

		case ALLOWED_TEXT_MIME_TYPES.has(contentType):
			return (
				<button
					type="button"
					key={url}
					onClick={onClick}
					className="flex flex-col items-center justify-center gap-2 text-muted-foreground"
				>
					<FileText className="size-8" />
					<p className="text-xs">{truncate(getFileName(url), 20)}</p>
				</button>
			)

		default:
			return <div className="bg-red-500" />
	}
}

function getFileName(url: string) {
	const urlObj = new URL(url)
	const pathname = urlObj.pathname
	const filename = pathname.split("/").pop()

	return filename ?? ""
}
