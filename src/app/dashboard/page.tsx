import { getMongoUser } from "@/lib/getMongoUser";
import { UserInterface } from "@/database/userSchema";
import { auth } from "@clerk/nextjs/server";
import DashboardPage from "./DashboardPage";

export default async function DashboardServerPage() {
  const authData = await auth();
  const { userId } = authData;

  let organizationName = "Your Organization";
  let paidMember = false;
  if (userId) {
    try {
      const response = await getMongoUser(userId);
      const data = await response.json();
      if (response.status === 200) {
        const user: UserInterface = data;
        organizationName = user.organizationName as string;
        paidMember = user.paidMember as boolean;
      }
    } catch (error) {
      console.error("Error fetching MongoDB user:", error);
    }
  }

  return <DashboardPage organizationName={organizationName} membershipStatus={paidMember} />;
}
