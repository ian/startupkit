// import { User } from "@workos-inc/node";
import { type User } from "@prisma/client";

export interface SessionData {
  user: User;
  createdAt: string;
}
