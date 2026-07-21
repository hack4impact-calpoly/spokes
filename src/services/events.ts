import { normalizeEvent } from "@/lib/utils";
import type { EventApiRecord, EventRecord } from "@/types/event";

export async function getAllEvents(): Promise<EventRecord[]> {
  const response = await fetch("/api/events", { headers: { Accept: "application/json" } });

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(result?.error || result?.message || "Failed to fetch events");
  }

  const events: EventApiRecord[] = await response.json();
  return events.map(normalizeEvent);
}

export async function getEventById(id: string): Promise<EventRecord> {
  const response = await fetch(`/api/events/${encodeURIComponent(id)}`, { headers: { Accept: "application/json" } });

  if (!response.ok) {
    throw new Error("Failed to fetch event");
  }

  const event: EventApiRecord = await response.json();
  return normalizeEvent(event);
}

export async function createEvent(data: unknown): Promise<EventRecord> {
  const response = await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to create event");
  }

  return normalizeEvent(result.event ?? result);
}
