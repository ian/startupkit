'use client';

import { useAuth } from '@repo/auth';
import { Button } from '@repo/ui/components/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
	const { logout } = useAuth();
	const router = useRouter();

	async function handleLogout() {
		await logout();
		router.push('/');
	}

	return (
		<Button onClick={handleLogout} variant="outline" size="sm">
			<LogOut className="mr-2 h-4 w-4" />
			Logout
		</Button>
	);
}

