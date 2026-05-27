import type { EventRecord } from "@/types/event";
import EventCard from "@/components/events/EventCard";

export default function EventGrid({ events }: { events: EventRecord[] }) {
  if (events.length === 0) {
    return <p className="events-empty">No events available.</p>;
  }

  return (
    <ul className="events-list" aria-label="Events list">
      {events.map((event) => (
        <li
          key={event.id ?? event._id ?? `${event.eventName}-${event.date.toISOString()}`}
          className="events-list-item"
        >
          <EventCard event={event} />
        </li>
      ))}
    </ul>
  );
}
