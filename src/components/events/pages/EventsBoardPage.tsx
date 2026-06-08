"use client";

import { useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Checkbox } from "@/components/ui/Checkbox";
import EventCard from "@/components/events/EventCard";
import { getAllEvents } from "@/services/events";
import type { EventRecord } from "@/types/event";
import {
  EVENT_LOCATION_CITY_OPTIONS,
  EVENT_LOCATION_GENERAL_OPTIONS,
  EVENT_LOCATION_GENERAL_DESCRIPTIONS,
} from "@/lib/eventOptions";

const RECENT_EVENTS_STORAGE_KEY = "myEvents";

type EventsTab = "all" | "past" | "recent";

function getEventId(event: EventRecord): string | undefined {
  return event.id ?? event._id;
}

function getEventMonthYearValue(event: EventRecord): string {
  const eventDate = new Date(event.date);
  const year = eventDate.getUTCFullYear();
  const month = String(eventDate.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function getMonthYearLabel(monthYear: string): string {
  const [year, month] = monthYear.split("-");
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, 1));
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

function filterEvents(
  events: EventRecord[],
  selectedLocationGeneral: string[],
  cityFilter: string,
  monthYearFilter: string,
): EventRecord[] {
  return events.filter((event) => {
    if (selectedLocationGeneral.length > 0 && !selectedLocationGeneral.includes(event.eventLocationGeneral ?? "")) {
      return false;
    }

    if (cityFilter && event.eventLocationCity !== cityFilter) {
      return false;
    }

    if (monthYearFilter && getEventMonthYearValue(event) !== monthYearFilter) {
      return false;
    }

    return true;
  });
}

function getMonthYearOptions(events: EventRecord[]): string[] {
  const monthYears = new Set(events.map(getEventMonthYearValue));
  return [...monthYears].sort();
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedLocationGeneral, setSelectedLocationGeneral] = useState<string[]>([]);
  const [cityFilter, setCityFilter] = useState("");
  const [monthYearFilter, setMonthYearFilter] = useState("");
  const [recentEventIds, setRecentEventIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<EventsTab>("all");
  const [sortAscending, setSortAscending] = useState(true);

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
    () => filterEvents(events, selectedLocationGeneral, cityFilter, monthYearFilter),
    [events, selectedLocationGeneral, cityFilter, monthYearFilter],
  );

  const recentEventIdSet = useMemo(() => new Set(recentEventIds), [recentEventIds]);
  const monthYearOptions = useMemo(() => getMonthYearOptions(events), [events]);

  const displayedEvents = useMemo(() => {
    const now = new Date();
    // Compare using UTC midnight to avoid timezone shifts
    const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

    if (activeTab === "recent") {
      const recent = filteredEvents.filter((event) => {
        const eventId = getEventId(event);
        return eventId ? recentEventIdSet.has(eventId) : false;
      });
      return recent.sort((a, b) => {
        const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
        return sortAscending ? diff : -diff;
      });
    }

    if (activeTab === "past") {
      const past = filteredEvents.filter((event) => {
        const d = new Date(event.date);
        const eventUTC = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
        return eventUTC < todayUTC;
      });
      // Default for past: most recently past first (descending). Toggle flips it.
      return past.sort((a, b) => {
        const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
        return sortAscending ? diff : -diff;
      });
    }

    // "all" tab = upcoming (today and future), soonest first by default
    const upcoming = filteredEvents.filter((event) => {
      const d = new Date(event.date);
      const eventUTC = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
      return eventUTC >= todayUTC;
    });
    return upcoming.sort((a, b) => {
      const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
      return sortAscending ? diff : -diff;
    });
  }, [activeTab, filteredEvents, recentEventIdSet, sortAscending]);

  const [monthSelectOpen, setMonthSelectOpen] = useState(false);
  const [citySelectOpen, setCitySelectOpen] = useState(false);

  const hasActiveFilters = Boolean(selectedLocationGeneral.length > 0 || cityFilter || monthYearFilter);

  const toggleLocationGeneral = (locationGeneral: string) => {
    setSelectedLocationGeneral((current) =>
      current.includes(locationGeneral)
        ? current.filter((selected) => selected !== locationGeneral)
        : [...current, locationGeneral],
    );
  };

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
    setSelectedLocationGeneral([]);
    setCityFilter("");
    setMonthYearFilter("");
  };

  const eventKey = (event: EventRecord) => event.id ?? event._id ?? `${event.eventName}-${event.date.toISOString()}`;

  return (
    <div className="w-full flex flex-col pb-10">
      <div className="mt-[50px] px-8 md:px-16 lg:px-20 flex flex-col lg:flex-row gap-16 lg:gap-8 grow">
        <aside className="flex flex-col gap-4 lg:gap-6 lg:max-w-[400px] lg:shrink-0" aria-label="Filter events">
          <div className="text-black font-semibold text-xl sm:text-2xl md:text-3xl select-none lg:sticky lg:top-[110px]">
            Filters
          </div>

          <div className="sticky top-[155px]">
            <div className="bg-[#F7F7F7] px-6 py-5 rounded flex flex-col gap-4 min-w-[270] md:flex-row md:gap-8 lg:flex-col lg:gap-4">
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
                <select
                  value={monthYearFilter}
                  onChange={(event) => setMonthYearFilter(event.target.value)}
                  onFocus={() => setMonthSelectOpen(true)}
                  onBlur={() => setMonthSelectOpen(false)}
                  className={twMerge(
                    "h-10 w-full rounded-md px-3 text-sm text-black bg-[#F7F7F7] outline-none appearance-none cursor-pointer transition-colors",
                    monthSelectOpen ? "bg-gray-200" : "hover:bg-gray-200",
                  )}
                >
                  <option value="" style={{ backgroundColor: "#F7F7F7" }}>
                    All months
                  </option>
                  {monthYearOptions.map((monthYear) => (
                    <option key={monthYear} value={monthYear} style={{ backgroundColor: "#F7F7F7" }}>
                      {getMonthYearLabel(monthYear)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="mb-2 text-lg font-semibold text-black select-none">Location Region</div>
                <div className="flex flex-col gap-1.5">
                  {EVENT_LOCATION_GENERAL_OPTIONS.map((loc) => (
                    <label
                      key={loc}
                      className={twMerge(
                        "flex items-start gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-colors",
                        selectedLocationGeneral.includes(loc) ? "bg-gray-200" : "hover:bg-gray-200",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={selectedLocationGeneral.includes(loc)}
                        onChange={() => toggleLocationGeneral(loc)}
                        className="mt-0.5 shrink-0 appearance-none size-[15px] border-[1.5px] border-black rounded outline-none cursor-pointer checked:bg-black checked:border-black"
                      />
                      <span className="text-sm text-black leading-snug select-none">
                        {loc === "Other" ? (
                          loc
                        ) : (
                          <>
                            <strong>{loc}</strong>
                            {`: ${EVENT_LOCATION_GENERAL_DESCRIPTIONS[loc]}`}
                          </>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-1 text-lg font-semibold text-black select-none">City</div>
                <select
                  value={cityFilter}
                  onChange={(event) => setCityFilter(event.target.value)}
                  onFocus={() => setCitySelectOpen(true)}
                  onBlur={() => setCitySelectOpen(false)}
                  className={twMerge(
                    "h-10 w-full rounded-md px-3 text-sm text-black bg-[#F7F7F7] outline-none appearance-none cursor-pointer transition-colors",
                    citySelectOpen ? "bg-gray-200" : "hover:bg-gray-200",
                  )}
                >
                  <option value="" style={{ backgroundColor: "#F7F7F7" }}>
                    All cities
                  </option>
                  {EVENT_LOCATION_CITY_OPTIONS.map((city) => (
                    <option key={city} value={city} style={{ backgroundColor: "#F7F7F7" }}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex flex-col w-full gap-4 lg:gap-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex gap-6 flex-wrap">
              <div
                className={twMerge(
                  "text-black text-xl sm:text-2xl md:text-3xl font-semibold cursor-pointer select-none",
                  activeTab === "all" ? "opacity-100" : "opacity-50",
                )}
                onClick={() => {
                  setActiveTab("all");
                  setSortAscending(true);
                }}
              >
                Upcoming Events
              </div>
              <div
                className={twMerge(
                  "text-black text-xl sm:text-2xl md:text-3xl font-semibold cursor-pointer select-none",
                  activeTab === "past" ? "opacity-100" : "opacity-50",
                )}
                onClick={() => {
                  setActiveTab("past");
                  setSortAscending(true);
                }}
              >
                Past Events
              </div>
              <div
                className={twMerge(
                  "text-black text-xl sm:text-2xl md:text-3xl font-semibold cursor-pointer select-none",
                  activeTab === "recent" ? "opacity-100" : "opacity-50",
                )}
                onClick={() => {
                  setActiveTab("recent");
                  setSortAscending(true);
                }}
              >
                Recently Viewed
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSortAscending((prev) => !prev)}
              title={sortAscending ? "Sorted ascending — click to reverse" : "Sorted descending — click to reverse"}
              className="ml-auto flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors select-none"
            >
              <span>{sortAscending ? "↑" : "↓"}</span>
              <span>{sortAscending ? "Earliest first" : "Latest first"}</span>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {isLoading ? (
              <EventBoardMessage title="Loading events" message="Events will appear here shortly." />
            ) : loadError ? (
              <EventBoardMessage title="Unable to load events" message={loadError} />
            ) : displayedEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-7" aria-label="Events list">
                {displayedEvents.map((event) => (
                  <EventCard key={eventKey(event)} event={event} onEventView={addToRecentEvents} />
                ))}
              </div>
            ) : events.length === 0 ? (
              <EventBoardMessage title="No Events Found" message="There are no events available at the moment." />
            ) : activeTab === "recent" ? (
              <EventBoardMessage
                title="No Recently Viewed Events"
                message="Events you view will appear here. Try opening an event from Upcoming Events."
              />
            ) : activeTab === "past" ? (
              <EventBoardMessage
                title="No Past Events Found"
                message="We couldn't find any past events matching your criteria. Try adjusting your filters."
              />
            ) : (
              <EventBoardMessage
                title="No Upcoming Events Found"
                message="We couldn't find any upcoming events matching your criteria. Try adjusting your filters or check back later for new events."
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
