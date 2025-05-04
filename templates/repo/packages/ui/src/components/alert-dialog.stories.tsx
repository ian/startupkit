import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "./alert-dialog";

const meta: Meta<typeof AlertDialog> = {
	title: "UI/AlertDialog",
	component: AlertDialog,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AlertDialog>;

export const Destructive: Story = {
	render: () => (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="destructive">Delete Files</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Selected Files</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete these files? This action cannot be
						undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Keep Files</AlertDialogCancel>
					<AlertDialogAction>Yes, Delete</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
};
