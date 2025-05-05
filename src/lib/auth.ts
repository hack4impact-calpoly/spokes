import { auth } from "@clerk/nextjs/server";

type Role = "job_seeker" | "nonprofit" | "spokes_admin";

interface AuthWithRole {
  userId: string | null;
  role: Role;
}

/**
 * Determines the user's role based on their authentication status and organization membership.
 * - Unauthenticated users are assigned the "job_seeker" role
 * - Users in the "spokes-admin" organization are assigned the "spokes_admin" role
 * - Authenticated users not in the "spokes-admin" organization are assigned the "nonprofit" role
 *
 * @returns {Promise<AuthWithRole>} Object containing userId and role
 */
export async function getAuthWithRole(): Promise<AuthWithRole> {
  const session = await auth();

  // unauthenticated users
  if (!session?.userId) {
    return { userId: null, role: "job_seeker" };
  }

  const { userId, orgSlug } = session;

  // check if user is part of spokes-admin organization
  if (orgSlug === "spokes-admin") {
    return { userId, role: "spokes_admin" };
  }

  // all other authenticated users are considered nonprofits
  return { userId, role: "nonprofit" };
}
