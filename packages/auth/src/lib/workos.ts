import WorkOS, { User } from "@workos-inc/node";

export const workos = new WorkOS(process.env.WORKOS_API_KEY!);

export function getClientId(): string {
  return process.env.WORKOS_CLIENT_ID!;
}
