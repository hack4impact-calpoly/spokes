"use client";
import { useState, useEffect } from "react";
import ChakraCarousel from "@/components/ChakraCarousel/carousel";
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
            <h1 className="font-semibold text-xl sm:text-2xl md:text-3xl">Pending Events</h1>
            {!incomingEventData ? (
              <div className="py-4 px-5 rounded-md bg-[#f7f7f7] text-gray-500 animate-pulse">Loading...</div>
            ) : incomingEventData.length === 0 ? (
              <div className="py-4 px-5 rounded-md bg-[#f7f7f7] text-gray-500">No pending events</div>
            ) : (
              <ChakraCarousel gap={20}>
                {incomingEventData.map((event) => (
                  <AdminEventCard key={event._id} event={event} onUpdateEvent={updateEventStatus} />
                ))}
              </ChakraCarousel>
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

            {tab === 1 ? (
              !approvedEventData ? (
                <div className="py-4 px-5 rounded-md bg-[#f7f7f7] text-gray-500 animate-pulse">Loading...</div>
              ) : approvedEventData.length === 0 ? (
                <div className="py-4 px-5 rounded-md bg-[#f7f7f7] text-gray-500">No approved events</div>
              ) : (
                <ChakraCarousel gap={20}>
                  {approvedEventData.map((event) => (
                    <AdminEventCard key={event._id} event={event} onUpdateEvent={updateEventStatus} />
                  ))}
                </ChakraCarousel>
              )
            ) : !rejectedEventData ? (
              <div className="py-4 px-5 rounded-md bg-[#f7f7f7] text-gray-500 animate-pulse">Loading...</div>
            ) : rejectedEventData.length === 0 ? (
              <div className="py-4 px-5 rounded-md bg-[#f7f7f7] text-gray-500">No rejected events</div>
            ) : (
              <ChakraCarousel gap={20}>
                {rejectedEventData.map((event) => (
                  <AdminEventCard key={event._id} event={event} onUpdateEvent={updateEventStatus} />
                ))}
              </ChakraCarousel>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
