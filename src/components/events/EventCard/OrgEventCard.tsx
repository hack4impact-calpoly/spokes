"use client";
import { twMerge } from "tailwind-merge";
import { ComponentProps, forwardRef, useState } from "react";
import { IEvent } from "@/database/eventSchema";
import EventStatusBadge from "@/components/events/EventCard/EventStatusBadge";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { FiEdit, FiMessageSquare } from "react-icons/fi";
import { useRouter } from "next/navigation";

export interface OrgEventCardProps extends ComponentProps<"div"> {
  className?: string;
  event: IEvent;
}

export const OrgEventCard = forwardRef<HTMLDivElement, OrgEventCardProps>(
  ({ children, className, event, ...props }, ref) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();

    const eventDate = new Date(event.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const eventRegion =
      event.eventLocationGeneral === "Other" ? event.eventLocationGeneralOther : event.eventLocationGeneral;
    const eventCity = event.eventLocationCity === "Other" ? event.eventLocationCityOther : event.eventLocationCity;

    function handleEditButton(e: React.MouseEvent<HTMLButtonElement>) {
      e.preventDefault();
      router.push(`/events/list?eventId=${event._id}&returnURL=/events/manage`);
    }

    return (
      <>
        <div
          ref={ref}
          className={twMerge(
            "w-full flex flex-col gap-2 sm:gap-3 py-3 sm:py-4 px-3 sm:px-5 rounded-md bg-[#f7f7f7]",
            className,
          )}
          {...props}
        >
          <div className="w-full h-fit flex flex-row items-center gap-2">
            <div className="text-base sm:text-lg font-semibold truncate flex-1">{event.eventName}</div>
            <EventStatusBadge eventStatus={event.eventStatus} className="flex-shrink-0" />
          </div>

          <div className="text-sm text-gray-500">
            {[eventDate, event.time || "Time TBD", event.location || "Location TBD"].join(" · ")}
          </div>
          {(eventCity || eventRegion) && (
            <div className="text-sm text-gray-500">{[eventCity, eventRegion].filter(Boolean).join(", ")}</div>
          )}

          <div className="w-full h-fit flex flex-col items-start gap-2 md:flex-row md:items-center">
            <div className="flex flex-row items-center justify-between w-full">
              <div className="text-sm text-gray-600 truncate max-w-[60%]">{event.organization}</div>
              <div className="flex flex-row items-center gap-2">
                {event.eventStatus === "rejected" && (
                  <Button
                    variant="outline"
                    colorScheme="blue"
                    size={{ base: "xs", md: "sm" }}
                    onClick={onOpen}
                    className="flex flex-row items-center gap-1 sm:gap-2"
                  >
                    <FiMessageSquare className="text-sm sm:text-base" />
                    <span className="hidden sm:inline">View Feedback</span>
                    <span className="sm:hidden">Feedback</span>
                  </Button>
                )}
                <Button
                  aria-label="Edit Event"
                  size={{ base: "xs", md: "sm" }}
                  borderColor="black"
                  onClick={handleEditButton}
                  className="flex flex-row items-center gap-1 sm:gap-2"
                >
                  <FiEdit className="text-sm sm:text-base" />
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Rejection feedback modal */}
        <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "lg" }} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader fontWeight="bold">Event Feedback</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="flex flex-col gap-4">
                <div className="text-lg text-black font-semibold">Reason for Rejection:</div>
                <Text className="text-sm text-gray-800 font-normal bg-gray-100 px-2 py-3 rounded-md">
                  {event.rejectionMessage || "No feedback provided."}
                </Text>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleEditButton} size="sm">
                Edit Event
              </Button>
              <Button variant="ghost" onClick={onClose} size="sm">
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  },
);

OrgEventCard.displayName = "OrgEventCard";
