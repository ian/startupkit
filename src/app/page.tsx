import NextLink from "next/link";
import { SignInButton } from "../components/SignInButton";
import { getUser } from "../auth";

export default async function HomePage() {
  const { isAuthenticated, user } = await getUser();

  return (
    <div className="flex flex-col items-center justify-center">
      {isAuthenticated ? (
        <>
          <h2>Welcome back{user?.firstName && `, ${user?.firstName}`}</h2>
          <p>You are now authenticated into the application</p>
          <div className="flex space-x-2">
            <NextLink href="/account">View account</NextLink>
            <SignInButton large />
          </div>
        </>
      ) : (
        <>
          <h2>AuthKit authentication example</h2>
          <p>Sign in to view your account details</p>
          <SignInButton large />
        </>
      )}
    </div>
  );
}
