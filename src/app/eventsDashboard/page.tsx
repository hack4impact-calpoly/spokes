import { redirect } from "next/navigation";

export default function EventsDashboardRootPage() {
  redirect("/eventsDashboard/events");
}
