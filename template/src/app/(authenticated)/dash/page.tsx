import NextLink from "next/link";
import { SignInButton } from "@/components/app/SignInButton";
import { getUser } from "@/auth/server";

export default async function HomePage() {
  const { isAuthenticated, user } = await getUser();

  return (
    <div className="flex flex-col items-center justify-center">
      {isAuthenticated ? (
        <>
          <h2 className="text-2xl font-bold">
            Welcome back{user?.firstName && `, ${user?.firstName}`}
          </h2>
          <p>You are now authenticated into the application</p>
          <div className="flex space-x-2">
            <NextLink href="/account">View account</NextLink>
            <SignInButton />
          </div>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold">Welcome to Startupkit</h2>
          <p>Sign in to view your account details</p>
          <SignInButton />
        </>
      )}
    </div>
  );
}
