"use client";

import { useEffect, useMemo, useState } from "react";
import EventCard from "@/components/events/EventCard";
import { getAllEvents } from "@/services/events";
import type { EventRecord } from "@/types/event";

const FAVORITES_STORAGE_KEY = "favoriteEventIds";

type EventsTab = "all" | "favorites";

function filterEvents(
  events: EventRecord[],
  dateFilter: string,
  categoryFilter: string,
  locationFilter: string,
): EventRecord[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return events.filter((event) => {
    if (categoryFilter && event.category?.toLowerCase() !== categoryFilter.toLowerCase()) {
      return false;
    }

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
  const [categoryFilter, setCategoryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [favoriteEventIds, setFavoriteEventIds] = useState<string[]>([]);
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
    const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!storedFavorites) {
      return;
    }

    try {
      const parsed = JSON.parse(storedFavorites);
      if (Array.isArray(parsed)) {
        setFavoriteEventIds(parsed.filter((id): id is string => typeof id === "string"));
      }
    } catch {
      setFavoriteEventIds([]);
    }
  }, []);

  const filteredEvents = useMemo(
    () => filterEvents(events, dateFilter, categoryFilter, locationFilter),
    [events, dateFilter, categoryFilter, locationFilter],
  );

  const favoriteEventIdSet = useMemo(() => new Set(favoriteEventIds), [favoriteEventIds]);
  const topLocations = useMemo(() => getTopLocations(events), [events]);

  const displayedEvents = useMemo(() => {
    if (activeTab === "favorites") {
      return filteredEvents.filter((event) => event.id && favoriteEventIdSet.has(event.id));
    }

    return filteredEvents;
  }, [activeTab, favoriteEventIdSet, filteredEvents]);

  const hasActiveFilters = Boolean(dateFilter || categoryFilter || locationFilter);

  const handleToggleFavorite = (eventId?: string) => {
    if (!eventId) {
      return;
    }

    setFavoriteEventIds((prev) => {
      const next = prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId];
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clearFilters = () => {
    setDateFilter("");
    setCategoryFilter("");
    setLocationFilter("");
  };

  return (
    <main className="page-main">
      <div className="page-content page-content--no-padding">
        <section className="page-hero page-hero--compact">
          <h1>Events</h1>
          <p>Browse nonprofit events. Use filters and favorite events to view them later.</p>
        </section>

        <div className="events-layout">
          <aside className="filter-sidebar" aria-label="Filter events">
            <h2 className="filter-sidebar-title">Filters</h2>

            <div className="filter-sidebar-group">
              <label>Date</label>
              <div className="flex flex-col gap-0.5">
                {[
                  { value: "", label: "All dates" },
                  { value: "today", label: "Today" },
                  { value: "week", label: "This week" },
                  { value: "month", label: "This month" },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    className={`filter-location-option ${dateFilter === value ? "active" : ""}`}
                    onClick={() => setDateFilter(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-sidebar-group">
              <label>Category</label>
              <div className="flex flex-col gap-0.5">
                {[
                  { value: "", label: "All categories" },
                  { value: "volunteer", label: "Volunteer" },
                  { value: "fundraiser", label: "Fundraiser" },
                  { value: "workshop", label: "Workshop" },
                  { value: "community", label: "Community" },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    className={`filter-location-option ${categoryFilter === value ? "active" : ""}`}
                    onClick={() => setCategoryFilter(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-sidebar-group">
              <label>Location</label>
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  className={`filter-location-option ${locationFilter === "" ? "active" : ""}`}
                  onClick={() => setLocationFilter("")}
                >
                  All locations
                </button>

                {(showAllLocations ? topLocations : topLocations.slice(0, 5)).map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    className={`filter-location-option ${locationFilter === loc ? "active" : ""}`}
                    onClick={() => setLocationFilter(locationFilter === loc ? "" : loc)}
                  >
                    {loc}
                  </button>
                ))}

                {topLocations.length > 5 && (
                  <button
                    type="button"
                    className="filter-location-view-more"
                    onClick={() => setShowAllLocations((prev) => !prev)}
                  >
                    {showAllLocations ? "View less" : `View more (${topLocations.length - 5} more)`}
                  </button>
                )}
              </div>
            </div>

            <button
              type="button"
              className="filter-sidebar-clear"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              aria-label="Clear all filters"
            >
              Clear filters
            </button>
          </aside>

          <div className="events-main">
            <div className="mb-4 flex items-center gap-2">
              <button
                type="button"
                className={`filter-location-option !w-auto ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                All Events
              </button>
              <button
                type="button"
                className={`filter-location-option !w-auto ${activeTab === "favorites" ? "active" : ""}`}
                onClick={() => setActiveTab("favorites")}
              >
                Favorites
              </button>
            </div>

            {isLoading ? (
              <p className="events-empty">Loading events...</p>
            ) : loadError ? (
              <p className="events-empty">{loadError}</p>
            ) : displayedEvents.length > 0 ? (
              <ul className="events-list" aria-label="Events list">
                {displayedEvents.map((event) => (
                  <li key={event.id ?? `${event.eventName}-${event.date.toISOString()}`} className="events-list-item">
                    <EventCard
                      event={event}
                      isFavorite={event.id ? favoriteEventIdSet.has(event.id) : false}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  </li>
                ))}
              </ul>
            ) : events.length === 0 ? (
              <p className="events-empty">No events available.</p>
            ) : activeTab === "favorites" ? (
              <p className="events-empty">No favorite events match your filters.</p>
            ) : (
              <p className="events-empty">No events match your filters.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
