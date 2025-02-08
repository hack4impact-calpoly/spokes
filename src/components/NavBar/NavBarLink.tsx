import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavBarLinkProps {
  title: string;
  href: string;
}

export default function NavBarLink({ title, href }: NavBarLinkProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname?.startsWith(path);

  return (
    <Link
      href={href}
      className={`font-medium text-center w-1/2 sm:w-max py-5 sm:py-7 px-5 border-y-4 border-[#2B2B2B] hover:border-b-[#C3412E] ${isActive(`/${href}`) ? "border-b-[#C3412E]" : ""}`}
    >
      {title}
    </Link>
  );
}
