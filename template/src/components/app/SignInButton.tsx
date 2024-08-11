import { getAuthorizationUrl } from "@/auth/client";
import { clearSession, getUser } from "../../auth/server";

export async function SignInButton() {
  const { isAuthenticated } = await getUser();
  const authorizationUrl = getAuthorizationUrl();

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

  return <a href={authorizationUrl}>Sign In</a>;
}
