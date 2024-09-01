"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@startupkit/auth";
import type React from "react";
import { useForm } from "react-hook-form";

interface AccountForm {
	firstName?: string;
	lastName?: string;
	email: string;
	avatarUrl?: string;
}

const Account: React.FC = () => {
	const { user } = useAuth();
	const { register, handleSubmit } = useForm<AccountForm>({
		defaultValues: {
			firstName: user?.firstName ?? undefined,
			lastName: user?.lastName ?? undefined,
			email: user?.email || "",
		},
	});

	const onSubmit = (data: AccountForm) => {
		// Handle form submission (e.g., API call)
	};

	return (
		<div className="space-y-4">
			<h1 className="text-xl font-medium">Account Settings</h1>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
				<Input {...register("firstName")} placeholder="First Name" />
				<Input {...register("lastName")} placeholder="Last Name" />
				<Input {...register("email")} placeholder="Email" required />
				<Button type="submit">Save Changes</Button>
			</form>
		</div>
	);
};

export default Account;
