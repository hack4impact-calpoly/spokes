import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminUsersPage from "@/components/users/AdminUsersPage";
import { getAuthWithRole } from "@/lib/auth";

export default async function EventsUsersPage() {
  const { userId, orgSlug } = await auth();
  const authWithRole = getAuthWithRole({ userId, orgSlug });

  if (authWithRole.role !== "spokes_admin") {
    redirect("/events");
  }

  return <AdminUsersPage backHref="/events/admin" backLabel="Manage Events" />;
}
