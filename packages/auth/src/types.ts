export type SessionUser = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
};

export interface SessionData {
  user: SessionUser;
  createdAt: string;
}
