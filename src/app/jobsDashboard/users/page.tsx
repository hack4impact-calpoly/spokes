import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminUsersPage from "@/components/users/AdminUsersPage";
import { getAuthWithRole } from "@/lib/auth";

export default async function JobsDashboardUsersPage() {
  const { userId, orgSlug } = await auth();
  const authWithRole = getAuthWithRole({ userId, orgSlug });

  if (authWithRole.role !== "spokes_admin") {
    redirect("/jobsDashboard/jobs");
  }

  return <AdminUsersPage backHref="/jobsDashboard/admin" backLabel="Manage Jobs" />;
}
