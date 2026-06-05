import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminUsersPage from "@/components/users/AdminUsersPage";
import { getAuthWithRole } from "@/lib/auth";

export default async function EventsDashboardUsersPage() {
  const { userId, orgSlug } = await auth();
  const authWithRole = getAuthWithRole({ userId, orgSlug });

  if (authWithRole.role !== "spokes_admin") {
    redirect("/eventsDashboard/events");
  }

  return <AdminUsersPage backHref="/eventsDashboard/admin" backLabel="Manage Events" />;
}
