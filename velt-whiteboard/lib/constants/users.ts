export type User = {
  userId: string;
  name: string;
  email: string;
  photoUrl?: string;
  organizationId: string;
};

export const USERS: Record<string, User> = {
  ALEX: {
    userId: "alex-001",
    name: "Alex Johnson",
    email: "alex@example.com",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    organizationId: "velt-app-001"
  },
  BOB: {
    userId: "bob-002",
    name: "Bob Smith",
    email: "bob@example.com",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    organizationId: "velt-app-001"
  },
} as const;

export const DEFAULT_USER = USERS.ALEX;
