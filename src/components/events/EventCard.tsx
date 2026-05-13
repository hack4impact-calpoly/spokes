import { formatDate } from "@/lib/utils";
import type { EventRecord } from "@/types/event";
import { EventModal } from "./EventModal";
import { FaStar } from "react-icons/fa";
import { FiStar } from "react-icons/fi";

type EventCardProps = {
  event: EventRecord;
  isFavorite?: boolean;
  onToggleFavorite?: (eventId?: string) => void;
};

export default function EventCard({ event, isFavorite = false, onToggleFavorite }: EventCardProps) {
  const favoriteLabel = isFavorite ? "Remove from favorites" : "Add to favorites";
  const month = event.date.toLocaleString("en-US", { month: "short", timeZone: "UTC" }).toUpperCase();
  const day = event.date.getUTCDate();
  const year = event.date.getUTCFullYear();

  return (
    <div className="event-card">
      <EventModal event={event}>
        <div className="flex gap-4 items-start cursor-pointer">
          <div className="flex flex-col items-center justify-center bg-blue-100 rounded-lg px-3 py-2 min-w-[60px] text-center flex-shrink-0">
            <span className="text-xs font-semibold text-blue-500 uppercase tracking-wide">{month}</span>
            <span className="text-2xl font-bold text-blue-700 leading-tight">{day}</span>
            <span className="text-xs text-blue-500">{year}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="event-card-title">{event.eventName}</h3>
                <span className="event-card-category">{event.category}</span>
              </div>
              {onToggleFavorite && (
                <button
                  type="button"
                  aria-label={favoriteLabel}
                  className={`flex-shrink-0 text-xl leading-none transition-colors ${
                    isFavorite ? "text-yellow-400" : "text-gray-300 hover:text-yellow-400"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleFavorite(event.id);
                  }}
                >
                  {isFavorite ? <FaStar aria-hidden="true" /> : <FiStar aria-hidden="true" />}
                </button>
              )}
            </div>

            <div className="mt-2 space-y-1">
              <p className="flex items-center gap-1.5 text-sm text-gray-500">
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
              {event.time && (
                <p className="flex items-center gap-1.5 text-sm text-gray-500">
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
                  {event.time}
                </p>
              )}
              {event.location && (
                <p className="flex items-center gap-1.5 text-sm text-gray-500">
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
                  {event.location}
                </p>
              )}
              {event.description && <p className="event-card-description mt-1">{event.description}</p>}
            </div>
          </div>
        </div>
      </EventModal>
    </div>
  );
}
