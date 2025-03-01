"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Center } from "@chakra-ui/react";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // make POST request to add user to database
    async function addUser() {
      try {
        const response = await fetch("/api/users", { method: "POST" });
        if (response.ok) {
          console.log("User added to MongoDB");
          router.push("/jobs");
        } else {
          const errData = await response.json();

          if (response.status === 400 && errData.message === "User already exists") {
            router.push("/jobs");
          } else {
            console.error("Failed to add user to MongoDB");
          }
        }
      } catch (error) {
        console.error("Error adding user to MongoDB", error);
      }
    }
    addUser();
  }, [router]);

  return (
    <Center minH="100vh" fontSize="lg" fontWeight="medium">
      Setting up your account ...
    </Center>
  );
}
