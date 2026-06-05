"use client";
import { useState, useEffect } from "react";
import { IEvent } from "@/database/eventSchema";
import EventStatusBadge from "@/components/events/EventCard/EventStatusBadge";
import JobCardModal from "@/components/jobs/JobCard/JobCardModal";
import ActionButton from "@/components/jobs/JobCard/ActionButton";
import JobPostedDate from "@/components/jobs/JobCard/JobPostedDate";
import { getEventInfoLink, getEventLocationLink } from "@/lib/eventLinks";
import { useToast } from "@chakra-ui/react";

interface AdminEventCardProps {
  event: IEvent;
  innerRef?: (node?: Element | null | undefined) => void;
  onUpdateEvent?: (
    eventId: string,
    status: "approved" | "rejected",
    approvedDate?: Date,
    rejectionReason?: string,
  ) => void;
}

export default function AdminEventCard({ event, onUpdateEvent, innerRef }: AdminEventCardProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<"approve" | "reject" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isNewIndicatorDismissed, setIsNewIndicatorDismissed] = useState(false);
  const [isLoading, setIsLoading] = useState<"approve" | "reject" | null>(null);
  const toast = useToast();

  useEffect(() => {
    const dismissedState = localStorage.getItem(`new-event-indicator-${event._id}`);
    if (dismissedState === "true") {
      setIsNewIndicatorDismissed(true);
    }
  }, [event._id]);

  const dismissNewIndicator = () => {
    if (!isNewIndicatorDismissed) {
      setIsNewIndicatorDismissed(true);
      localStorage.setItem(`new-event-indicator-${event._id}`, "true");
    }
  };

  const openModal = (action: "approve" | "reject") => {
    dismissNewIndicator();
    setSelectedAction(action);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAction(null);
  };

  const handleConfirm = async () => {
    if (selectedAction === "reject") {
      setIsLoading("reject");
      await sendRejectionEmail(event, rejectionReason);
      if (onUpdateEvent) {
        await onUpdateEvent(event._id, "rejected", new Date(), rejectionReason);
      }
    } else if (selectedAction === "approve") {
      setIsLoading("approve");
      if (onUpdateEvent) {
        await onUpdateEvent(event._id, "approved", new Date());
      }
    }
    setIsLoading(null);
    closeModal();
  };

  async function sendRejectionEmail(event: IEvent, reason: string) {
    try {
      const emailResponse = await fetch(`/api/send/event-reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...event, rejectionReason: reason }),
      });
      if (!emailResponse.ok) {
        console.error("Failed to send rejection email");
      }
    } catch (error) {
      console.error("Failed to send rejection email:", error);
    }
  }

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const eventInfoLink = getEventInfoLink(event);
  const eventLocationLink = getEventLocationLink(event);
  const hasEventLinks = Boolean(eventInfoLink || eventLocationLink);

  return (
    <div className="w-full h-full" ref={innerRef}>
      <div className="relative bg-[#f7f7f7] rounded-3xl px-8 py-5 shadow-sm h-full flex flex-col">
        {/* New indicator dot */}
        {new Date(event.createdAt ?? event.date).getTime() > Date.now() - 24 * 60 * 60 * 1000 &&
          !isNewIndicatorDismissed && (
            <div
              className="absolute top-0 right-0 cursor-pointer"
              onClick={dismissNewIndicator}
              title="Dismiss new indicator"
            >
              <div className="w-3 h-3 bg-[#045F87] rounded-full shadow-sm"></div>
            </div>
          )}

        <div className="flex justify-between mb-5">
          <EventStatusBadge eventStatus={event.eventStatus} />
        </div>

        {/* Event name + org */}
        <div className="text-lg font-semibold text-black mb-1">{event.eventName}</div>
        <div className="text-sm text-gray-600 mb-1">{event.organization}</div>

        {/* Date / time / location */}
        <div className="text-sm text-gray-600 mb-1">
          <span className="font-medium">Date:</span> {formattedDate}
        </div>
        <div className="text-sm text-gray-600 mb-1">
          <span className="font-medium">Time:</span> {event.time}
        </div>
        <div className="text-sm text-gray-600 mb-1">
          <span className="font-medium">Location:</span> {event.location}
        </div>
        <div className="text-sm text-gray-600 mb-3">
          <span className="font-medium">Type:</span> {event.locationType === "in-person" ? "In-Person" : "Remote"}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 mb-4 line-clamp-3">{event.description}</p>

        {hasEventLinks && (
          <div className="mb-4 flex flex-col gap-2 text-sm">
            {eventInfoLink && (
              <a
                href={eventInfoLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-9 items-center justify-center rounded-md border border-black px-3 text-center font-medium text-black transition-colors hover:bg-gray-50"
              >
                See More
              </a>
            )}
            {eventLocationLink && (
              <a
                href={eventLocationLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-9 items-center justify-center rounded-md border border-black bg-black px-3 text-center font-medium text-white transition-colors hover:bg-gray-800"
              >
                {event.locationType === "remote" ? "Join Meeting" : "View Location"}
              </a>
            )}
          </div>
        )}

        <div className="flex-grow" />

        {/* Contact + action buttons */}
        <div className="flex flex-wrap justify-between flex-row min-[1000px]:gap-4 gap-2 items-center">
          <div className="text-sm text-gray-500">{event.contactEmail}</div>

          <div className="flex flex-wrap gap-2 min-[1000px]:mt-0 mt-5">
            {event.eventStatus === "pending" && (
              <>
                <ActionButton
                  action="approve"
                  isLoading={isLoading === "approve"}
                  onClick={() => openModal("approve")}
                />
                <ActionButton action="reject" isLoading={isLoading === "reject"} onClick={() => openModal("reject")} />
              </>
            )}
          </div>
        </div>

        <div className="mt-5">
          <JobPostedDate date={event.createdAt ?? event.date} />
        </div>
      </div>

      {selectedAction && isModalOpen && (
        <JobCardModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={handleConfirm}
          action={selectedAction}
          rejectionReason={selectedAction === "reject" ? rejectionReason : undefined}
          setRejectionReason={selectedAction === "reject" ? setRejectionReason : undefined}
          isLoading={isLoading !== null}
        />
      )}
    </div>
  );
}
