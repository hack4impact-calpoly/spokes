"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import AdminEventCard from "@/components/events/EventCard/AdminEventCard";
import { IEvent } from "@/database/eventSchema";
import { twMerge } from "tailwind-merge";
import { Tooltip, useToast } from "@chakra-ui/react";

export default function AdminEvents() {
  const toast = useToast();
  const [incomingEventData, setIncomingEventData] = useState<null | IEvent[]>(null);
  const [approvedEventData, setApprovedEventData] = useState<null | IEvent[]>(null);
  const [rejectedEventData, setRejectedEventData] = useState<null | IEvent[]>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUpdatingEvent, setIsUpdatingEvent] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);
  const [tab, setTab] = useState(1);
  const [sortNewestFirst, setSortNewestFirst] = useState(true);

  const fetchData = async () => {
    try {
      const eventStatuses = ["pending", "approved", "rejected"];
      const responses = await Promise.all(
        eventStatuses.map((status) => fetch(`/api/events?eventStatus=${status}&admin=true`)),
      );

      const failedResponses = responses.filter((res) => !res.ok);
      if (failedResponses.length > 0) {
        console.error("Some event status requests failed");
        return;
      }

      const [incomingData, approvedData, rejectedData] = await Promise.all(responses.map((res) => res.json()));

      setIncomingEventData(incomingData);
      setApprovedEventData(approvedData);
      setRejectedEventData(rejectedData);
    } catch (error) {
      console.error("Error fetching event data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3600000);
    return () => clearInterval(interval);
  }, []);

  const updateEventStatus = async (
    eventId: string,
    status: "approved" | "rejected",
    approvedDate?: Date,
    rejectionMessage?: string,
  ) => {
    try {
      setIsUpdatingEvent(true);

      const response = await fetch(`/api/events/${eventId}`);
      if (!response.ok) throw new Error("Failed to fetch event data");
      const currentEvent: IEvent = await response.json();

      const updateData: Record<string, unknown> = { eventStatus: status };
      if (status === "approved") updateData.approvedDate = approvedDate ?? new Date();
      if (status === "rejected") updateData.rejectionMessage = rejectionMessage;

      const updateResponse = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!updateResponse.ok) throw new Error("Failed to update event status");

      // Remove from all buckets
      setIncomingEventData((prev) => prev?.filter((e) => e._id !== eventId) ?? []);
      setApprovedEventData((prev) => prev?.filter((e) => e._id !== eventId) ?? []);
      setRejectedEventData((prev) => prev?.filter((e) => e._id !== eventId) ?? []);

      if (status === "approved") {
        toast({
          title: "Event Approved",
          description: `Successfully approved "${currentEvent.eventName}"`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        setApprovedEventData((prev) => [...(prev ?? []), { ...currentEvent, eventStatus: "approved" }]);
      } else if (status === "rejected") {
        toast({
          title: "Event Rejected",
          description: `Successfully rejected "${currentEvent.eventName}"`,
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        setRejectedEventData((prev) => [...(prev ?? []), { ...currentEvent, eventStatus: "rejected" }]);
      }
    } catch (error) {
      console.error("Error updating event status:", error);
      toast({
        title: "Error",
        description: "Failed to update event status. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsUpdatingEvent(false);
      setLastUpdateTime(Date.now());
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    const timeSinceLastUpdate = Date.now() - lastUpdateTime;
    if (timeSinceLastUpdate < 2000) {
      await new Promise((resolve) => setTimeout(resolve, 2000 - timeSinceLastUpdate));
    }
    setIsRefreshing(true);
    await fetchData();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const eventList = (events: IEvent[], sortByEventDate = false) => (
    <div className="flex flex-col gap-4">
      {(sortByEventDate
        ? [...events].sort((a, b) => {
            const dateDifference = new Date(a.date).getTime() - new Date(b.date).getTime();
            return sortNewestFirst ? -dateDifference : dateDifference;
          })
        : events
      ).map((event) => (
        <AdminEventCard key={event._id} event={event} onUpdateEvent={updateEventStatus} />
      ))}
    </div>
  );

  return (
    <div className="w-full">
      <div className="mt-[50px] px-8 md:px-16 lg:px-20 flex flex-col gap-8 text-black">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 bg-[#045F87] rounded-full"></div>
          <h1 className="text-3xl font-semibold tracking-tight">Admin Dashboard</h1>
        </div>

        <div className="flex flex-col gap-24 mb-20">
          {/* Pending events */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="font-semibold text-xl sm:text-2xl md:text-3xl">Pending Events</h1>
              <Link
                href="/events/users"
                className="px-4 py-2 bg-[#045F87] text-white rounded-md hover:bg-[#034A6B] transition-colors flex items-center gap-2 w-fit"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="max-[500px]:hidden">Manage Users</span>
              </Link>
            </div>
            {!incomingEventData ? (
              <div className="py-4 px-5 rounded-md bg-[#f7f7f7] text-gray-500 animate-pulse">Loading...</div>
            ) : incomingEventData.length === 0 ? (
              <div className="py-4 px-5 rounded-md bg-[#f7f7f7] text-gray-500">No pending events</div>
            ) : (
              eventList(incomingEventData)
            )}
          </div>

          {/* Approved / Rejected tabs */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-4 sm:gap-8">
                <div
                  className={twMerge(
                    "text-black text-xl sm:text-2xl md:text-3xl font-semibold text-center cursor-pointer select-none",
                    tab === 1 ? "opacity-100" : "opacity-50",
                  )}
                  onClick={() => setTab(1)}
                >
                  <span className="hidden sm:inline">Approved Events</span>
                  <span className="sm:hidden">Approved</span>
                </div>
                <div
                  className={twMerge(
                    "text-black text-xl sm:text-2xl md:text-3xl font-semibold text-center cursor-pointer select-none",
                    tab === 2 ? "opacity-100" : "opacity-50",
                  )}
                  onClick={() => setTab(2)}
                >
                  <span className="hidden sm:inline">Rejected Events</span>
                  <span className="sm:hidden">Rejected</span>
                </div>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSortNewestFirst((current) => !current)}
                  aria-pressed={sortNewestFirst}
                  title={
                    sortNewestFirst ? "Newest first — click for oldest first" : "Oldest first — click for newest first"
                  }
                  className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                  <span>{sortNewestFirst ? "↓" : "↑"}</span>
                  <span>{sortNewestFirst ? "Newest first" : "Oldest first"}</span>
                </button>
                <Tooltip
                  label="Refresh event data"
                  hasArrow
                  placement="top"
                  bg="#2B2B2B"
                  color="white"
                  fontSize="sm"
                  borderRadius="md"
                  padding="2"
                  boxShadow="md"
                  offset={[0, 5]}
                  maxW="220px"
                  openDelay={600}
                >
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing || isUpdatingEvent}
                    className={twMerge(
                      "p-2 hover:bg-gray-100 rounded-full transition-colors group",
                      (isRefreshing || isUpdatingEvent) && "cursor-not-allowed opacity-70",
                    )}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={twMerge(
                        "text-gray-600 transition-transform duration-300 ease-in-out",
                        isRefreshing && "animate-spin-once",
                      )}
                    >
                      <path
                        d="M23 4V10H17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1 20V14H7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3.51 9.00001C3.84797 7.58631 4.53047 6.28871 5.49997 5.20001C6.46947 4.11131 7.70047 3.26141 9.07097 2.71901C10.4415 2.17661 11.9075 1.95681 13.3745 2.07801C14.8415 2.19921 16.2645 2.65821 17.515 3.42001L23 8.00001M1 16L6.485 20.58C7.73547 21.3418 9.15847 21.8008 10.6255 21.922C12.0925 22.0432 13.5585 21.8234 14.929 21.281C16.2995 20.7386 17.5305 19.8887 18.5 18.8C19.4695 17.7113 20.152 16.4137 20.49 15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </Tooltip>
              </div>
            </div>

            {tab === 1 ? (
              !approvedEventData ? (
                <div className="py-4 px-5 rounded-md bg-[#f7f7f7] text-gray-500 animate-pulse">Loading...</div>
              ) : approvedEventData.length === 0 ? (
                <div className="py-4 px-5 rounded-md bg-[#f7f7f7] text-gray-500">No approved events</div>
              ) : (
                eventList(approvedEventData, true)
              )
            ) : !rejectedEventData ? (
              <div className="py-4 px-5 rounded-md bg-[#f7f7f7] text-gray-500 animate-pulse">Loading...</div>
            ) : rejectedEventData.length === 0 ? (
              <div className="py-4 px-5 rounded-md bg-[#f7f7f7] text-gray-500">No rejected events</div>
            ) : (
              eventList(rejectedEventData, true)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
