"use client";
import TopSection from "./TopSection";
import BottomSection from "./BottomSection";
import { useUser } from "@clerk/clerk-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function NavBar() {
  const { user } = useUser(); // user is either an User object or null
  const isNotFoundPage = useNotFoundPage();

  return (
    <>
      <TopSection user={user} hideControls={isNotFoundPage} />
      {!isNotFoundPage && <BottomSection />}
    </>
  );
}

function useNotFoundPage() {
  const pathname = usePathname();
  const [isNotFoundPage, setIsNotFoundPage] = useState(false);

  useEffect(() => {
    const syncNotFoundPage = () => {
      setIsNotFoundPage(document.body.dataset.pageType === "not-found");
    };

    syncNotFoundPage();
    window.addEventListener("spokes:not-found-page-change", syncNotFoundPage);

    return () => {
      window.removeEventListener("spokes:not-found-page-change", syncNotFoundPage);
    };
  }, [pathname]);

  return isNotFoundPage;
}
