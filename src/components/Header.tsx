import NextLink from "next/link";
import { SignInButton } from "./SignInButton";

export const Header = () => {
  return (
    <header className="flex justify-between m-5">
      <div className="flex space-x-2">
        <NextLink href="/">Home</NextLink>
        <NextLink href="/account">Account</NextLink>
      </div>

      <SignInButton />
    </header>
  );
};
