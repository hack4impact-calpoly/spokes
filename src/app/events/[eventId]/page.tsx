import Link from "next/link";
import connectDB from "@/database/db";
import Event, { EventStatus, type IEvent } from "@/database/eventSchema";
import { getEventInfoLink, getEventLocationLink } from "@/lib/eventLinks";
import { formatDate } from "@/lib/utils";

type EventPageProps = {
  params: {
    eventId: string;
  };
};

export default async function EventPage({ params }: EventPageProps) {
  await connectDB();

  const event = (await Event.findOne({
    _id: params.eventId,
    eventStatus: EventStatus.approved,
  }).lean()) as IEvent | null;

  if (!event) {
    return (
      <main className="page-main">
        <div className="page-content">
          <h1>Event not found</h1>
          <Link href="/events">Back to Events</Link>
        </div>
      </main>
    );
  }

  const eventInfoLink = getEventInfoLink(event);
  const eventLocationLink = getEventLocationLink(event);
  const eventRegion =
    event.eventLocationGeneral === "Other" ? event.eventLocationGeneralOther : event.eventLocationGeneral;
  const eventCity = event.eventLocationCity === "Other" ? event.eventLocationCityOther : event.eventLocationCity;

  return (
    <main className="page-main">
      <div className="page-content page-content--narrow">
        <Link href="/events" className="event-detail-back">
          Back to Events
        </Link>
        <article className="event-detail">
          <h1 className="event-detail-title">{event.eventName}</h1>
          <p className="event-detail-org">{event.organization}</p>
          <div className="event-detail-meta">
            <p>
              <strong>Date:</strong> {formatDate(event.date)}
            </p>
            <p>
              <strong>Time:</strong> {event.time}
            </p>
            <p>
              <strong>Location:</strong> {event.location}
            </p>
            {(eventCity || eventRegion) && (
              <p>
                <strong>Area:</strong> {[eventCity, eventRegion].filter(Boolean).join(", ")}
              </p>
            )}
            {(event.publicContactEmail || event.publicContactPhoneNumber) && (
              <p>
                <strong>Public Contact:</strong>{" "}
                {[event.publicContactEmail, event.publicContactPhoneNumber].filter(Boolean).join(" | ")}
              </p>
            )}
          </div>
          <p className="event-detail-description">{event.description}</p>
          {(eventInfoLink || eventLocationLink) && (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {eventInfoLink && (
                <a
                  href={eventInfoLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-10 items-center justify-center rounded-md border border-black px-4 text-black"
                >
                  See More
                </a>
              )}
              {eventLocationLink && (
                <a
                  href={eventLocationLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-10 items-center justify-center rounded-md border border-black bg-black px-4 text-white"
                >
                  Location Link
                </a>
              )}
            </div>
          )}
        </article>
      </div>
    </main>
  );
}
