import { clearSession, getAuthorizationUrl, getUser } from "../auth";

export async function SignInButton({ large }: { large?: boolean }) {
  const { isAuthenticated } = await getUser();
  const authorizationUrl = await getAuthorizationUrl();

  if (isAuthenticated) {
    return (
      <div className="flex gap-3">
        <form
          action={async () => {
            "use server";
            await clearSession();
          }}
        >
          <button type="submit">Sign Out</button>
        </form>
      </div>
    );
  }

  return <a href={authorizationUrl}>Sign In {large && "with AuthKit"}</a>;
}
