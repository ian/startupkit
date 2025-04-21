import "server-only";
import { type Prisma, prisma } from "./index";

export async function saveMessages({
	messages,
}: { messages: Prisma.MessageCreateManyInput[] }) {
	try {
		return await prisma.message.createMany({
			data: messages,
		});
	} catch (error) {
		console.error("Failed to save messages in database", error);
		throw error;
	}
}

export async function getMessagesByChatId({ id }: { id: string }) {
	try {
		return await prisma.message.findMany({
			where: { chatId: id },
			orderBy: { createdAt: "asc" },
		});
	} catch (error) {
		console.error("Failed to get messages by chat id from database", error);
		throw error;
	}
}

export async function saveDocument({
	id,
	title,
	content,
	userId,
}: {
	id: string;
	title: string;
	content: string;
	userId: string;
}) {
	try {
		return await prisma.upload.create({
			data: {
				id,
				title,
				content,
				userId,
				createdAt: new Date(),
			},
		});
	} catch (error) {
		console.error("Failed to save document in database");
		throw error;
	}
}

export async function getDocumentsById({ id }: { id: string }) {
	try {
		return await prisma.upload.findMany({
			where: { id },
			orderBy: { createdAt: "asc" },
		});
	} catch (error) {
		console.error("Failed to get document by id from database");
		throw error;
	}
}

export async function getDocumentById({ id }: { id: string }) {
	try {
		return await prisma.upload.findFirst({
			where: { id },
			orderBy: { createdAt: "desc" },
		});
	} catch (error) {
		console.error("Failed to get document by id from database");
		throw error;
	}
}
