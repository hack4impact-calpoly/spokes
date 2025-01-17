"use client";
import Navbar from "@/components/Navbar";
import { Checkbox } from "@/components/Checkbox";
import { FilterCard } from "@/components/FilterCard";

export default function Jobs() {
  return (
    <div className="w-full h-full">
      <Navbar></Navbar>
      <div className="mt-20 px-20">
        <div className="inline-block">
          <div className="text-black font-semibold text-3xl mb-4">Filters</div>
          <div>
            <FilterCard></FilterCard>
          </div>
        </div>
        <div className="inline-block"></div>
      </div>
    </div>
  );
}
