"use client";
import TopSection from "./TopSection";
import BottomSection from "./BottomSection";
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";

type role = "admin" | "user";

export default function NavBar() {
  const [page, setPage] = useState<string>("Job Board");

  // Currently, we only have email enabled in Clerk
  // Later, we will need to check the role of the user (admin vs regular user)
  //     using Clerk or MongoDB and pass this as a prop most likely

  const { user } = useUser(); // user is either an User object or null

  // This is a placeholder, but some sort of functionality like this
  const role: role = "admin";
  const isAdmin = role == "admin";
  return (
    <>
      <TopSection setPage={setPage} user={user} />
      <BottomSection page={page} setPage={setPage} user={user} isAdmin={isAdmin} />
    </>
  );
}
