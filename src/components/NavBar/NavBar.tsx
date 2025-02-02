"use client";
import TopSection from "./TopSection";
import BottomSection from "./BottomSection";
import { useUser } from "@clerk/clerk-react";

type role = "admin" | "user";

export default function NavBar() {
  const { user } = useUser(); // user is either an User object or null

  // Currently, we only have email enabled in Clerk
  // Later, we will need to check the role of the user (admin vs regular user)
  //     using Clerk or MongoDB and pass this as a prop most likely

  // This is a placeholder, but some sort of functionality like this
  const role: role = "admin";
  const isAdmin = role == "admin";

  return (
    <>
      <TopSection user={user} />
      <BottomSection user={user} isAdmin={isAdmin} />
    </>
  );
}
