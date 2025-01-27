"use client";
import TopSection from "./TopSection";
import BottomSection from "./BottomSection";
import { useState } from "react";

export default function NavBar() {
  const [page, setPage] = useState<string>("Job Board");

  return (
    <>
      <TopSection setPage={setPage} />
      <BottomSection page={page} setPage={setPage} />
    </>
  );
}
