"use client";

import { useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Checkbox } from "@/components/Checkbox";
import EventCard from "@/components/events/EventCard";
import { getAllEvents } from "@/services/events";
import type { EventRecord } from "@/types/event";

const RECENT_EVENTS_STORAGE_KEY = "myEvents";

type EventsTab = "all" | "recent";

function getEventId(event: EventRecord): string | undefined {
  return event.id ?? event._id;
}

function filterEvents(events: EventRecord[], dateFilter: string, locationFilter: string): EventRecord[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return events.filter((event) => {
    if (locationFilter && event.location !== locationFilter) {
      return false;
    }

    if (!dateFilter) {
      return true;
    }

    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);

    if (dateFilter === "today") {
      return eventDate.getTime() === today.getTime();
    }

    if (dateFilter === "week") {
      const weekFromNow = new Date(today);
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      return eventDate >= today && eventDate <= weekFromNow;
    }

    if (dateFilter === "month") {
      const monthFromNow = new Date(today);
      monthFromNow.setMonth(monthFromNow.getMonth() + 1);
      return eventDate >= today && eventDate <= monthFromNow;
    }

    return true;
  });
}

function getTopLocations(events: EventRecord[]): string[] {
  const counts = new Map<string, number>();

  for (const event of events) {
    const location = event.location?.trim();
    if (!location) continue;
    counts.set(location, (counts.get(location) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => {
      if (b[1] !== a[1]) {
        return b[1] - a[1];
      }
      return a[0].localeCompare(b[0]);
    })
    .map(([location]) => location);
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [recentEventIds, setRecentEventIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<EventsTab>("all");
  const [showAllLocations, setShowAllLocations] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadEvents() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const response = await getAllEvents();

        if (!isCancelled) {
          setEvents(response);
        }
      } catch (error) {
        console.error("Error loading events:", error);
        if (!isCancelled) {
          setEvents([]);
          setLoadError("Failed to load events.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadEvents();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    const storedRecentEvents = localStorage.getItem(RECENT_EVENTS_STORAGE_KEY);
    if (!storedRecentEvents) {
      return;
    }

    try {
      const parsed = JSON.parse(storedRecentEvents);
      if (Array.isArray(parsed)) {
        setRecentEventIds(parsed.filter((id): id is string => typeof id === "string"));
      }
    } catch {
      setRecentEventIds([]);
    }
  }, []);

  const filteredEvents = useMemo(
    () => filterEvents(events, dateFilter, locationFilter),
    [events, dateFilter, locationFilter],
  );

  const recentEventIdSet = useMemo(() => new Set(recentEventIds), [recentEventIds]);
  const topLocations = useMemo(() => getTopLocations(events), [events]);

  const displayedEvents = useMemo(() => {
    if (activeTab === "recent") {
      return filteredEvents.filter((event) => {
        const eventId = getEventId(event);
        return eventId ? recentEventIdSet.has(eventId) : false;
      });
    }

    return filteredEvents;
  }, [activeTab, filteredEvents, recentEventIdSet]);

  const hasActiveFilters = Boolean(dateFilter || locationFilter);

  const addToRecentEvents = (event: EventRecord) => {
    const eventId = getEventId(event);
    if (!eventId) {
      return;
    }

    setRecentEventIds((prev) => {
      if (prev.includes(eventId)) {
        return prev;
      }

      const next = [...prev, eventId];
      localStorage.setItem(RECENT_EVENTS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clearFilters = () => {
    setDateFilter("");
    setLocationFilter("");
  };

  const eventKey = (event: EventRecord) => event.id ?? event._id ?? `${event.eventName}-${event.date.toISOString()}`;

  return (
    <div className="w-full flex flex-col pb-10">
      <div className="mt-[50px] px-8 md:px-16 lg:px-20 flex flex-col lg:flex-row gap-16 lg:gap-8 grow">
        <aside className="flex flex-col gap-4 lg:gap-6" aria-label="Filter events">
          <div className="text-black font-semibold text-xl sm:text-2xl md:text-3xl select-none lg:sticky lg:top-[110px]">
            Filters
          </div>

          <div className="sticky top-[155px]">
            <div className="bg-[#F7F7F7] px-6 py-5 rounded flex flex-col gap-4 min-w-[270px] md:flex-row md:gap-8 lg:flex-col lg:gap-4">
              <div>
                <div className="flex justify-between">
                  <div className="mb-1 text-lg font-semibold text-black select-none">Date</div>
                  <button
                    type="button"
                    onClick={clearFilters}
                    disabled={!hasActiveFilters}
                    className="text-md font-medium px-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-all duration-200 mb-1 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-col gap-[2px]">
                  {[
                    { value: "today", label: "Today" },
                    { value: "week", label: "This week" },
                    { value: "month", label: "This month" },
                  ].map(({ value, label }) => (
                    <Checkbox
                      key={value}
                      label={label}
                      checked={dateFilter === value}
                      changeHandler={() => setDateFilter(dateFilter === value ? "" : value)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-1 text-lg font-semibold text-black select-none">Location</div>
                <div className="flex flex-col gap-[2px]">
                  {(showAllLocations ? topLocations : topLocations.slice(0, 5)).map((loc) => (
                    <Checkbox
                      key={loc}
                      label={loc}
                      checked={locationFilter === loc}
                      changeHandler={() => setLocationFilter(locationFilter === loc ? "" : loc)}
                    />
                  ))}

                  {topLocations.length > 5 && (
                    <button
                      type="button"
                      className="mt-1 w-fit text-sm font-medium text-gray-600 hover:text-gray-800 hover:underline"
                      onClick={() => setShowAllLocations((prev) => !prev)}
                    >
                      {showAllLocations ? "View less" : `View more (${topLocations.length - 5} more)`}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex flex-col w-full gap-4 lg:gap-6">
          <div className="flex items-center justify-between max-[500px]:flex-col max-[500px]:items-stretch">
            <div className="flex gap-8 max-[500px]:justify-center max-[500px]:gap-4">
              <div
                className={twMerge(
                  "text-black text-xl sm:text-2xl md:text-3xl font-semibold cursor-pointer select-none",
                  activeTab === "all" ? "opacity-100" : "opacity-50",
                )}
                onClick={() => setActiveTab("all")}
              >
                All Events
              </div>
              <div
                className={twMerge(
                  "text-black text-xl sm:text-2xl md:text-3xl font-semibold cursor-pointer select-none",
                  activeTab === "recent" ? "opacity-100" : "opacity-50",
                )}
                onClick={() => setActiveTab("recent")}
              >
                Recently Viewed
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {isLoading ? (
              <EventBoardMessage title="Loading events" message="Events will appear here shortly." />
            ) : loadError ? (
              <EventBoardMessage title="Unable to load events" message={loadError} />
            ) : displayedEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7" aria-label="Events list">
                {displayedEvents.map((event) => (
                  <EventCard key={eventKey(event)} event={event} onEventView={addToRecentEvents} />
                ))}
              </div>
            ) : events.length === 0 ? (
              <EventBoardMessage title="No Events Found" message="There are no events available at the moment." />
            ) : activeTab === "recent" ? (
              <EventBoardMessage
                title="No Recently Viewed Events"
                message="Events you view will appear here. Try opening an event from All Events."
              />
            ) : (
              <EventBoardMessage
                title="No Events Found"
                message="We couldn't find any events matching your criteria. Try adjusting your filters or check back later for new events."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EventBoardMessage({ title, message }: { title: string; message: string }) {
  return (
    <div className="grow flex flex-col gap-4 justify-center justify-self-center items-center min-h-[400px] p-8 rounded-lg">
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-gray-400"
      >
        <path
          d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <p className="text-base text-center text-gray-600 max-w-md">{message}</p>
    </div>
  );
}
