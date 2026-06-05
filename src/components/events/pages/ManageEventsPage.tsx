"use client";
import { IEvent } from "@/database/eventSchema";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { OrgEventCard } from "@/components/events/EventCard/OrgEventCard";
import OrgCardSkeleton from "@/components/jobs/JobCard/OrgCardSkeleton";

export default function EventsDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [userEvents, setUserEvents] = useState<IEvent[]>([]);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/userevents?userId=${user?.id}`);
        const events = await res.json();
        if (!res.ok) throw new Error(events.error || "Failed to fetch events");
        setUserEvents(events);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && user) {
      fetchData();
    }
  }, [user, isLoaded]);

  if (loading) {
    return (
      <div className="w-full">
        <div className="mt-[50px] px-8 md:px-16 lg:px-20 flex flex-col gap-16 text-black">
          <div className="flex flex-col gap-24 mb-20">
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-[#045F87] rounded-full"></div>
                <h1 className="text-3xl font-semibold tracking-tight">Event Dashboard</h1>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col mb-12">
                  <div className="text-2xl font-semibold mb-4">Live Events</div>
                  <OrgCardSkeleton count={2} type="multi" />
                </div>
                <div className="flex flex-col mb-12">
                  <div className="text-2xl font-semibold mb-4">Pending Events</div>
                  <OrgCardSkeleton count={1} type="single" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (userEvents.length === 0) {
    return (
      <div className="w-full">
        <div className="mt-[50px] px-8 md:px-16 lg:px-20 flex flex-col gap-16 text-black">
          <div className="flex flex-col gap-24 mb-20">
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-[#045F87] rounded-full"></div>
                <h1 className="text-3xl font-semibold tracking-tight">Event Dashboard</h1>
              </div>
              <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <div className="max-w-2xl mx-auto">
                  <div className="mb-8">
                    <svg
                      className="w-24 h-24 mx-auto text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Events Yet</h2>
                  <p className="text-gray-600 mb-8">
                    Start engaging your community by posting your first event. Share what your organization is doing and
                    invite people to join.
                  </p>
                  <Link
                    href="/events/list"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#045F87] hover:bg-[#034a6b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#045F87] transition-colors duration-200"
                  >
                    Post Your First Event
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const liveEvents = userEvents.filter((e) => e.eventStatus === "approved");
  const pendingEvents = userEvents.filter((e) => e.eventStatus === "pending" || e.eventStatus === "rejected");

  return (
    <div className="w-full">
      <div className="mt-[50px] px-8 md:px-16 lg:px-20 flex flex-col gap-16 text-black">
        <div className="flex flex-col gap-24 mb-20">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-[#045F87] rounded-full"></div>
              <h1 className="text-3xl font-semibold tracking-tight">Event Dashboard</h1>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col mb-12">
                <div className="text-2xl font-semibold mb-4">Live Events</div>
                <div className="flex flex-col gap-4">
                  {liveEvents.length > 0 ? (
                    liveEvents.map((event, index) => <OrgEventCard key={index} event={event} />)
                  ) : (
                    <div className="py-4 px-5 rounded-md bg-[#f7f7f7] text-gray-500">No live events available</div>
                  )}
                </div>
              </div>
              <div className="flex flex-col mb-12">
                <div className="text-2xl font-semibold mb-4">Pending Events</div>
                <div className="flex flex-col gap-4">
                  {pendingEvents.length > 0 ? (
                    pendingEvents.map((event, index) => <OrgEventCard key={index} event={event} />)
                  ) : (
                    <div className="py-4 px-5 rounded-md bg-[#f7f7f7] text-gray-500">No pending events available</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
