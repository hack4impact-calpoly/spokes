import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavBarLinkProps {
  title: string;
  href: string;
  onClick?: () => void;
}

export default function NavBarLink({ title, href, onClick }: NavBarLinkProps) {
  const pathname = usePathname();

  const isDashboardRoot = href === "/jobsDashboard" || href === "/eventsDashboard";
  const isAdminLink = href.endsWith("/admin");
  const isUsersInSameDashboard =
    isAdminLink &&
    ((href.startsWith("/jobsDashboard") && pathname?.startsWith("/jobsDashboard/users")) ||
      (href.startsWith("/eventsDashboard") && pathname?.startsWith("/eventsDashboard/users")));
  const isActive = isDashboardRoot ? pathname === href : pathname?.startsWith(href) || isUsersInSameDashboard;

  return (
    <Link
      href={href}
      className={`font-medium text-center w-1/2 sm:w-max py-5 sm:py-7 px-5 border-y-4 border-[#2B2B2B] hover:border-b-[#C3412E] ${isActive ? "border-b-[#C3412E]" : ""}`}
      onClick={onClick}
    >
      {title}
    </Link>
  );
}
