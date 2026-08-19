import { formatDate } from "@/lib/utils";
import { getEventInfoLink, getEventLocationLink } from "@/lib/eventLinks";
import type { EventRecord } from "@/types/event";

type EventCardProps = {
  event: EventRecord;
  onEventView?: (event: EventRecord) => void;
};

export default function EventCard({ event, onEventView }: EventCardProps) {
  const month = event.date.toLocaleString("en-US", { month: "short", timeZone: "UTC" }).toUpperCase();
  const day = event.date.getUTCDate();
  const year = event.date.getUTCFullYear();
  const eventInfoLink = getEventInfoLink(event);
  const eventLocationLink = getEventLocationLink(event);
  const eventRegion =
    event.eventLocationGeneral === "Other" ? event.eventLocationGeneralOther : event.eventLocationGeneral;
  const eventCity = event.eventLocationCity === "Other" ? event.eventLocationCityOther : event.eventLocationCity;
  const hasActionLinks = Boolean(eventLocationLink || eventInfoLink);
  const actionLinkClassName = eventLocationLink && eventInfoLink ? "lg:w-[50%] w-full" : "w-full";

  const handleEventLinkClick = () => {
    onEventView?.(event);
  };

  return (
    <div className="max-w-[100%]">
      <div className="bg-[#f7f7f7] rounded-md px-8 pt-5 pb-2 shadow-sm h-full flex flex-col">
        <div className="flex gap-4 items-start">
          <div className="flex flex-col items-center justify-center bg-white rounded-md px-3 py-2 min-w-[60px] text-center flex-shrink-0 border border-gray-200">
            <span className="text-xs font-semibold text-gray-500 uppercase">{month}</span>
            <span className="text-2xl font-bold text-black leading-tight">{day}</span>
            <span className="text-xs text-gray-500">{year}</span>
          </div>

          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-1 min-w-0">
                <h3 className="text-xl text-black font-bold leading-snug">{event.eventName}</h3>
                <p className="text-base text-gray-500 font-medium leading-snug">{event.organization}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-1.5">
              <p className="flex items-center gap-1.5 text-base text-gray-500">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="flex-shrink-0"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {formatDate(event.date)}
              </p>
              <p className="flex items-center gap-1.5 text-base text-gray-500">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="flex-shrink-0"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {event.time || "Time TBD"}
              </p>
              <p className="flex items-center gap-1.5 text-base text-gray-500">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="flex-shrink-0"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {event.location || "Location TBD"}
              </p>
              {(eventCity || eventRegion) && (
                <p className="text-base text-gray-500">{[eventCity, eventRegion].filter(Boolean).join(", ")}</p>
              )}
              {event.publicContactEmail && (
                <p className="flex items-center gap-1.5 text-base text-gray-500">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="flex-shrink-0"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <a href={`mailto:${event.publicContactEmail}`} className="hover:underline">
                    {event.publicContactEmail}
                  </a>
                </p>
              )}
              {event.publicContactPhoneNumber && (
                <p className="flex items-center gap-1.5 text-base text-gray-500">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="flex-shrink-0"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.94a16 16 0 0 0 6.06 6.06l1.21-1.21a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <a href={`tel:${event.publicContactPhoneNumber}`} className="hover:underline">
                    {event.publicContactPhoneNumber}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>

        {event.description && (
          <p className="mt-5 text-base text-gray-700 leading-relaxed line-clamp-2">{event.description}</p>
        )}

        <div className="flex-grow"></div>

        {hasActionLinks && (
          <div className="flex lg:flex-row flex-col gap-4 mt-5 mb-5">
            {eventInfoLink && (
              <a
                href={eventInfoLink}
                target="_blank"
                rel="noreferrer"
                onClick={handleEventLinkClick}
                className={`${actionLinkClassName} inline-flex min-h-10 items-center justify-center rounded-md border border-black px-4 text-center font-normal text-black transition-colors hover:bg-gray-50`}
              >
                See More
              </a>
            )}
            {eventLocationLink && (
              <a
                href={eventLocationLink}
                target="_blank"
                rel="noreferrer"
                onClick={handleEventLinkClick}
                className={`${actionLinkClassName} inline-flex min-h-10 items-center justify-center rounded-md border border-black bg-black px-4 text-center font-normal text-white transition-colors hover:bg-gray-800`}
              >
                Location Link
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
