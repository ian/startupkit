import WorkOS, { User } from "@workos-inc/node";

export interface SessionData {
  user: User;
  createdAt: string;
}

// Check for required WorkOS environment variables
function checkRequiredEnvVars() {
  const requiredVars = [
    "WORKOS_API_KEY",
    "WORKOS_CLIENT_ID",
    "WORKOS_REDIRECT_URI",
  ];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      throw new Error(`${varName} is not set`);
    }
  }
}

// Call the check function
checkRequiredEnvVars();

// Initialize the WorkOS client
export const workos = new WorkOS(process.env.WORKOS_API_KEY!);

export function getClientId(): string {
  return process.env.WORKOS_CLIENT_ID!;
}

export function getAuthorizationUrl(): string {
  const redirectUri = process.env.WORKOS_REDIRECT_URI!;

  const authorizationUrl = workos.userManagement.getAuthorizationUrl({
    provider: "authkit",
    clientId: getClientId(),
    redirectUri,
  });

  return authorizationUrl;
}
