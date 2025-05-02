import { auth, currentUser } from "@clerk/nextjs/server";
import { error } from "console";

type Role = "job_seeker" | "nonprofit" | "spokes_admin";

interface AuthWithRole {
  userId: string | null;
  role: Role;
}

export async function getAuthWithRole(): Promise<AuthWithRole> {
  const session = auth();
  //job-seekers will not be authenticated
  if (!session || !(await session).userId) {
    console.log("No user found, assigning job_seeker role");
    return { userId: null, role: "job_seeker" };
  }

  const userId = (await session).userId;
  const user = await currentUser();

  // No user logged in, default to job_seeker
  if (!userId || !user) {
    console.log("No user found, assigning job_seeker role");
    return { userId: null, role: "job_seeker" };
  }

  // Check if user is part of spokes-admin organization
  const isSpokesAdmin = (user as any).organizationMemberships?.some(
    (membership: { organization: { slug: string } }) => membership.organization.slug === "spokes-admin",
  );
  if (isSpokesAdmin) {
    console.log(`User ${userId} is a spokes_admin`);
    return { userId, role: "spokes_admin" };
  }

  // Default to nonprofit for logged-in users who aren't admins
  console.log(`User ${userId} is a nonprofit`);
  return { userId, role: "nonprofit" };
}
