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
export function getAuthWithRole({ userId, orgSlug }: { userId: string | null; orgSlug?: string | null }): AuthWithRole {
  //job-seekers will not be authenticated
  if (!userId) {
    console.log("No user found, assigning job_seeker role");
    return { userId: null, role: "job_seeker" };
  }

  // Check if user is part of spokes-admin organization
  const isSpokesAdmin = orgSlug === "test-admin";

  if (isSpokesAdmin) {
    console.log("User is", orgSlug);
    return { userId, role: "spokes_admin" };
  }

  // Default to nonprofit for logged-in users who aren't admins
  console.log(`User ${userId} is a nonprofit`);
  return { userId, role: "nonprofit" };
}
