"use client";
import TopSection from "./TopSection";
import BottomSection from "./BottomSection";
import { useUser } from "@clerk/clerk-react";

export default function NavBar() {
  const { user } = useUser(); // user is either an User object or null
  return (
    <>
      <TopSection user={user} />
      <BottomSection />
    </>
  );
}
