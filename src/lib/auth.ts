import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export type Role = "job_seeker" | "nonprofit" | "spokes_admin";

export interface AuthWithRole {
  userId: string | null;
  role: Role;
}

export interface ApiAuthOptions {
  allowedRoles?: Role[];
  requireAuth?: boolean;
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
  const isSpokesAdmin = orgSlug === "spokes-admin";

  if (isSpokesAdmin) {
    console.log("User is", orgSlug);
    return { userId, role: "spokes_admin" };
  }

  // Default to nonprofit for logged-in users who aren't admins
  console.log(`User ${userId} is a nonprofit`);
  return { userId, role: "nonprofit" };
}

export function withApiAuth(
  handler: (req: NextRequest, context: { params?: any; auth: AuthWithRole }) => Promise<NextResponse>,
  options: ApiAuthOptions = {},
) {
  return async (req: NextRequest, context: { params?: any } = {}) => {
    const { userId, orgSlug } = await auth();
    const authWithRole = getAuthWithRole({ userId, orgSlug });

    // Check if authentication is required and the user is not authenticated
    if (options.requireAuth && !authWithRole.userId) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    // Check if the user has the required role
    if (options.allowedRoles && options.allowedRoles.length > 0 && authWithRole.userId) {
      if (!options.allowedRoles.includes(authWithRole.role)) {
        return NextResponse.json({ message: "Insufficient permissions" }, { status: 403 });
      }
    }
    return handler(req, { ...context, auth: authWithRole });
  };
}
