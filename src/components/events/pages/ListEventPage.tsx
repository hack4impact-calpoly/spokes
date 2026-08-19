"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Textarea,
  VStack,
  Spinner,
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import { IEvent } from "@/database/eventSchema";
import EventConfirmationModal from "@/components/events/EventModals/EventConfirmationModal";
import EventFailModal from "@/components/events/EventModals/EventFailModal";
import OrganizationSelect from "@/components/ui/OrganizationSelect";
import { getEventInfoLink, getEventLocationLink } from "@/lib/eventLinks";
import {
  EVENT_LOCATION_CITY_OPTIONS,
  EVENT_LOCATION_GENERAL_DESCRIPTIONS,
  EVENT_LOCATION_GENERAL_OPTIONS,
} from "@/lib/eventOptions";

const ensureHttps = (url: string | undefined): string | undefined => {
  if (!url) return url;
  return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
};

function EventFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const { isSignedIn, orgSlug } = useAuth();
  const isSpokesAdmin = orgSlug === "spokes-admin";
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEvent, setIsLoadingEvent] = useState(false);
  const [eventData, setEventData] = useState<IEvent | null>(null);
  const [majorFundraisingEvent, setMajorFundraisingEvent] = useState(false);
  const [eventLocationGeneral, setEventLocationGeneral] = useState("");
  const [eventLocationCity, setEventLocationCity] = useState("");
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isFailModalOpen, setIsFailModalOpen] = useState(false);
  const [createForAnotherOrganization, setCreateForAnotherOrganization] = useState(false);
  const [selectedAdminOrganizationName, setSelectedAdminOrganizationName] = useState("");
  const [formVersion, setFormVersion] = useState(0);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRejectConfirmationOpen, setIsRejectConfirmationOpen] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const eventId = searchParams.get("eventId");
  const returnURL = searchParams.get("returnURL") || "/events/manage";
  const eventInfoLink = getEventInfoLink(eventData);
  const eventLocationLink = getEventLocationLink(eventData);

  // Load existing event if editing
  useEffect(() => {
    if (!eventId) {
      setEventData(null);
      setMajorFundraisingEvent(false);
      setEventLocationGeneral("");
      setEventLocationCity("");
      return;
    }

    const fetchEvent = async () => {
      setIsLoadingEvent(true);
      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) throw new Error("Failed to fetch event");
        const data = await response.json();
        setEventData(data);
        setMajorFundraisingEvent(data.majorFundraisingEvent === true);
        setEventLocationGeneral(data.eventLocationGeneral ?? "");
        setEventLocationCity(data.eventLocationCity ?? "");
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setIsLoadingEvent(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const createAnotherEvent = () => {
    setIsConfirmationModalOpen(false);
    setServerError(null);
    setEventData(null);
    setMajorFundraisingEvent(false);
    setEventLocationGeneral("");
    setEventLocationCity("");
    setCreateForAnotherOrganization(false);
    setSelectedAdminOrganizationName("");
    setFormVersion((current) => current + 1);
    router.push("/events/list");
  };

  const sendNewEventEmail = async (event: IEvent) => {
    try {
      await fetch("/api/send/event-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error("Error sending event notification email:", error);
    }
  };

  const deleteEvent = async () => {
    if (!eventId || isDeleting) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/events/${eventId}`, { method: "DELETE" });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.message || "Failed to delete event");
      }

      toast({
        title: "Event Deleted",
        description: "The event has been removed.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      router.push(returnURL);
    } catch (error) {
      console.error("Error deleting event:", error);
      setServerError(error instanceof Error ? error.message : "Failed to delete event.");
      setIsDeleteConfirmationOpen(false);
      setIsFailModalOpen(true);
    } finally {
      setIsDeleting(false);
    }
  };

  const rejectEvent = async () => {
    if (!eventId || isRejecting) return;

    setIsRejecting(true);
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventStatus: "rejected", rejectionMessage: rejectionReason }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.message || "Failed to reject event");
      }

      if (eventData) {
        await fetch("/api/send/event-reject", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...eventData, rejectionReason }),
        });
      }

      toast({
        title: "Event Rejected",
        description: `Successfully rejected \"${eventData?.eventName ?? "event"}\"`,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      router.push(returnURL);
    } catch (error) {
      console.error("Error rejecting event:", error);
      setServerError(error instanceof Error ? error.message : "Failed to reject event.");
      setIsRejectConfirmationOpen(false);
      setIsFailModalOpen(true);
    } finally {
      setIsRejecting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setServerError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      eventName: formData.get("eventName") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      description: formData.get("description") as string,
      majorFundraisingEvent,
      eventLocationGeneral: formData.get("eventLocationGeneral") as string,
      eventLocationGeneralOther: formData.get("eventLocationGeneralOther") as string,
      eventLocationCity: formData.get("eventLocationCity") as string,
      eventLocationCityOther: formData.get("eventLocationCityOther") as string,
      location: formData.get("location") as string,
      locationLink: ensureHttps((formData.get("locationLink") as string)?.trim()) || "",
      eventLink: ensureHttps((formData.get("eventLink") as string)?.trim()) || "",
      publicContactEmail: formData.get("publicContactEmail") as string,
      publicContactPhoneNumber: formData.get("publicContactPhoneNumber") as string,
      submitterFirstName: formData.get("submitterFirstName") as string,
      submitterLastName: formData.get("submitterLastName") as string,
      submitterEmail: formData.get("submitterEmail") as string,
      submitterPhoneNumber: formData.get("submitterPhoneNumber") as string,
    };

    try {
      if (!majorFundraisingEvent) {
        throw new Error("Please confirm this is one of your organization's major fundraising events of the year.");
      }

      if (isSpokesAdmin && !eventId && createForAnotherOrganization && !selectedAdminOrganizationName) {
        throw new Error("Please select or enter an organization.");
      }

      const eventPayload =
        isSpokesAdmin && !eventId && createForAnotherOrganization
          ? { ...data, organization: selectedAdminOrganizationName }
          : data;

      let response: Response;

      if (eventId) {
        response = await fetch(`/api/events/${eventId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventPayload),
        });
      } else {
        response = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventPayload),
        });
      }

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result?.message || "Failed to submit event");
      }

      const result = await response.json();

      // Send admin notification email for new events
      if (!eventId && result.event) {
        await sendNewEventEmail(result.event);
      }

      setIsConfirmationModalOpen(true);
    } catch (error) {
      console.error("Event submission error:", error);
      setIsFailModalOpen(true);
      setServerError(error instanceof Error ? error.message : "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSignedIn) {
    return (
      <Box mx="auto" p={10} minWidth={{ base: "320px", md: "768px", lg: "1024px" }} maxWidth="1200px">
        <div className="mt-2 mb-2 text-black text-3xl font-semibold">{eventId ? "Edit Event" : "Create New Event"}</div>
        <p className="text-gray-700">Please sign in to {eventId ? "edit" : "create"} an event.</p>
      </Box>
    );
  }

  if (isLoadingEvent) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <>
      <Box mx="auto" p={10} minWidth={{ base: "320px", md: "768px", lg: "1024px" }} maxWidth="1200px">
        <div className="mt-2 mb-2 text-black text-3xl font-semibold">{eventId ? "Edit Event" : "Create New Event"}</div>

        <Heading as="h2" size="md" mb={5}>
          Major Event Listing & Promotion
        </Heading>

        {serverError && (
          <div className="mb-4 bg-red-50 p-3 text-sm text-red-700 border border-red-200">{serverError}</div>
        )}

        <form key={formVersion} onSubmit={handleSubmit}>
          <VStack spacing={4}>
            {isSpokesAdmin && !eventId && (
              <FormControl>
                <Checkbox
                  isChecked={createForAnotherOrganization}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setCreateForAnotherOrganization(checked);
                    if (!checked) {
                      setSelectedAdminOrganizationName("");
                    }
                  }}
                >
                  Create for another organization
                </Checkbox>
              </FormControl>
            )}

            {isSpokesAdmin && !eventId && createForAnotherOrganization && (
              <FormControl isRequired className="w-full sm:max-w-md" alignSelf="flex-start">
                <FormLabel>Organization Name</FormLabel>
                <OrganizationSelect
                  value={selectedAdminOrganizationName}
                  onChange={setSelectedAdminOrganizationName}
                  bg="#F6F6F6"
                  border="0"
                />
              </FormControl>
            )}

            <FormControl isRequired>
              <FormLabel>Event Title</FormLabel>
              <Input
                id="eventName"
                name="eventName"
                type="text"
                placeholder="Enter event title"
                defaultValue={eventData?.eventName ?? ""}
                required
                bg="#F6F6F6"
                border="0"
              />
            </FormControl>

            <FormControl isRequired>
              <Checkbox isChecked={majorFundraisingEvent} onChange={(e) => setMajorFundraisingEvent(e.target.checked)}>
                I confirm that this event is one of our organization&apos;s <strong>major fundraising events</strong> of
                the year.
              </Checkbox>
            </FormControl>

            <Stack w="full" direction={{ base: "column", md: "row" }} spacing={4} align="flex-start">
              <FormControl isRequired>
                <FormLabel>Event Date</FormLabel>
                <p className="mb-2 min-h-10 text-sm text-gray-600">
                  Events should be scheduled a minimum of three months out. The more advance notice, the better.
                </p>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  defaultValue={eventData ? new Date(eventData.date).toISOString().split("T")[0] : ""}
                  required
                  bg="#F6F6F6"
                  border="0"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Event Time (if known)</FormLabel>
                <p className="mb-2 min-h-10 text-sm text-gray-600">Leave blank when the time has not been confirmed.</p>
                <Input
                  id="time"
                  name="time"
                  type="text"
                  placeholder="5:30 - 8:30"
                  defaultValue={eventData?.time ?? ""}
                  bg="#F6F6F6"
                  border="0"
                />
              </FormControl>
            </Stack>

            <FormControl isRequired>
              <FormLabel>Event Description</FormLabel>
              <p className="mb-2 text-sm text-gray-600">
                Please provide a brief description of your event, including its purpose, target audience, and what
                attendees can expect. <strong>Do not include venue, date, or time information here</strong>, as those
                details are collected in separate fields.
              </p>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter event description"
                defaultValue={eventData?.description ?? ""}
                required
                bg="#F6F6F6"
                border="0"
                minH="140px"
              />
            </FormControl>

            <FormControl isRequired className="w-full sm:max-w-md" alignSelf="flex-start">
              <FormLabel>Event Location (General)</FormLabel>
              <p className="mb-2 text-sm text-gray-600">The region in which the event will take place.</p>
              <Select
                id="eventLocationGeneral"
                name="eventLocationGeneral"
                value={eventLocationGeneral}
                onChange={(e) => setEventLocationGeneral(e.target.value)}
                placeholder="Select region"
                required
                bg="#F6F6F6"
                border="0"
              >
                {EVENT_LOCATION_GENERAL_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option === "Other" ? option : `${option}: ${EVENT_LOCATION_GENERAL_DESCRIPTIONS[option]}`}
                  </option>
                ))}
              </Select>
            </FormControl>

            {eventLocationGeneral === "Other" && (
              <FormControl isRequired className="w-full sm:max-w-md" alignSelf="flex-start">
                <FormLabel>Other Region</FormLabel>
                <Input
                  id="eventLocationGeneralOther"
                  name="eventLocationGeneralOther"
                  type="text"
                  placeholder="Enter event region"
                  defaultValue={eventData?.eventLocationGeneralOther ?? ""}
                  required
                  bg="#F6F6F6"
                  border="0"
                />
              </FormControl>
            )}

            <FormControl isRequired className="w-full sm:max-w-md" alignSelf="flex-start">
              <FormLabel>Event Location (City)</FormLabel>
              <p className="mb-2 text-sm text-gray-600">The city in which the event will take place.</p>
              <Select
                id="eventLocationCity"
                name="eventLocationCity"
                value={eventLocationCity}
                onChange={(e) => setEventLocationCity(e.target.value)}
                placeholder="Select city"
                required
                bg="#F6F6F6"
                border="0"
              >
                {EVENT_LOCATION_CITY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </FormControl>

            {eventLocationCity === "Other" && (
              <FormControl isRequired className="w-full sm:max-w-md" alignSelf="flex-start">
                <FormLabel>Other City</FormLabel>
                <Input
                  id="eventLocationCityOther"
                  name="eventLocationCityOther"
                  type="text"
                  placeholder="Enter event city"
                  defaultValue={eventData?.eventLocationCityOther ?? ""}
                  required
                  bg="#F6F6F6"
                  border="0"
                />
              </FormControl>
            )}

            <FormControl>
              <FormLabel>Event Venue (if known)</FormLabel>
              <p className="mb-2 text-sm text-gray-600">
                Ex. Octagon Barn, La Lomita Ranch, Morro Bay Community Center. You may leave this blank until details
                are confirmed.
              </p>
              <Input
                id="location"
                name="location"
                type="text"
                placeholder="Enter venue"
                defaultValue={eventData?.location ?? ""}
                bg="#F6F6F6"
                border="0"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Location or Meeting Link</FormLabel>
              <Input
                id="locationLink"
                name="locationLink"
                type="text"
                placeholder="Google Maps or event location link"
                defaultValue={eventLocationLink ?? ""}
                bg="#F6F6F6"
                border="0"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Event Link (If Available) </FormLabel>
              <Input
                id="eventLink"
                name="eventLink"
                type="text"
                placeholder="Registration page or general event info"
                defaultValue={eventInfoLink ?? ""}
                bg="#F6F6F6"
                border="0"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Public Contact Email</FormLabel>
              <p className="mb-2 text-sm text-gray-600">
                Email address for attendee inquiries. This may appear on your event listing.
              </p>
              <Input
                id="publicContactEmail"
                name="publicContactEmail"
                type="email"
                placeholder="Enter public contact email"
                defaultValue={eventData?.publicContactEmail ?? ""}
                required
                bg="#F6F6F6"
                border="0"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Public Phone Number</FormLabel>
              <p className="mb-2 text-sm text-gray-600">
                Phone number for attendee inquiries. This may appear on your event listing.
              </p>
              <Input
                id="publicContactPhoneNumber"
                name="publicContactPhoneNumber"
                type="tel"
                placeholder="Enter public phone number"
                defaultValue={eventData?.publicContactPhoneNumber ?? ""}
                required
                bg="#F6F6F6"
                border="0"
              />
            </FormControl>

            <Stack w="full" direction={{ base: "column", md: "row" }} spacing={4}>
              <FormControl isRequired>
                <FormLabel>Your First Name</FormLabel>
                <Input
                  id="submitterFirstName"
                  name="submitterFirstName"
                  type="text"
                  placeholder="Enter your first name"
                  defaultValue={eventData?.submitterFirstName ?? ""}
                  required
                  bg="#F6F6F6"
                  border="0"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Your Last Name</FormLabel>
                <Input
                  id="submitterLastName"
                  name="submitterLastName"
                  type="text"
                  placeholder="Enter your last name"
                  defaultValue={eventData?.submitterLastName ?? ""}
                  required
                  bg="#F6F6F6"
                  border="0"
                />
              </FormControl>
            </Stack>

            <FormControl isRequired>
              <FormLabel>Your Email</FormLabel>
              <p className="mb-2 text-sm text-gray-600">
                For questions about this submission only. This will not be displayed publicly.
              </p>
              <Input
                id="submitterEmail"
                name="submitterEmail"
                type="email"
                placeholder="Enter your email"
                defaultValue={eventData?.submitterEmail ?? eventData?.contactEmail ?? ""}
                required
                bg="#F6F6F6"
                border="0"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Your Phone Number</FormLabel>
              <p className="mb-2 text-sm text-gray-600">
                For questions about this submission only. This will not be displayed publicly.
              </p>
              <Input
                id="submitterPhoneNumber"
                name="submitterPhoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                defaultValue={eventData?.submitterPhoneNumber ?? ""}
                required
                bg="#F6F6F6"
                border="0"
              />
            </FormControl>

            {eventId ? (
              <>
                <div className="mt-10 w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                      loadingText="Updating..."
                      disabled={isSubmitting || !majorFundraisingEvent}
                      size="lg"
                      colorScheme="blackAlpha"
                      bg="#045F87"
                      _hover={{ bg: "#2A80A8" }}
                      className="w-full min-w-[120px] sm:w-auto shadow-sm"
                    >
                      Update
                    </Button>
                    {isSpokesAdmin && (
                      <Button
                        type="button"
                        size="lg"
                        colorScheme="blackAlpha"
                        bg="#FFF3E0"
                        color="#C2410C"
                        _hover={{ bg: "#FFE0B2" }}
                        className="w-full min-w-[120px] sm:w-auto shadow-sm"
                        onClick={() => setIsRejectConfirmationOpen(true)}
                      >
                        Reject
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="lg"
                      colorScheme="blackAlpha"
                      bg="#FEE2E2"
                      color="#991B1B"
                      _hover={{ bg: "#FECACA" }}
                      className="w-full min-w-[120px] sm:w-auto shadow-sm"
                      onClick={() => setIsDeleteConfirmationOpen(true)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <Link
                  href={returnURL}
                  className="mt-1 block text-center text-sm text-gray-500 transition-colors duration-200 hover:text-[#045F87]"
                >
                  ← Return to {isSpokesAdmin ? "Admin Dashboard" : "Dashboard"}
                </Link>
              </>
            ) : (
              <div className="mt-8 flex justify-center">
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  loadingText="Submitting..."
                  disabled={isSubmitting || !majorFundraisingEvent}
                  size="lg"
                  colorScheme="blackAlpha"
                  bg="#045F87"
                  _hover={{ bg: "#2A80A8" }}
                  className="w-full sm:w-auto min-w-[200px]"
                >
                  Submit Event
                </Button>
              </div>
            )}
          </VStack>
        </form>
      </Box>

      <EventConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onCreateAnother={createAnotherEvent}
        submittedForReview={!eventId || !isSpokesAdmin}
      />
      <EventFailModal isOpen={isFailModalOpen} onClose={() => setIsFailModalOpen(false)} />
      <Modal isOpen={isDeleteConfirmationOpen} onClose={() => setIsDeleteConfirmationOpen(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton isDisabled={isDeleting} />
          <ModalBody>Are you sure you would like to delete this event?</ModalBody>
          <ModalFooter className="flex flex-wrap justify-end gap-2">
            <Button
              px="10"
              width="120px"
              fontSize="small"
              fontWeight="normal"
              borderColor="black"
              onClick={deleteEvent}
              isLoading={isDeleting}
              loadingText="Deleting..."
              _hover={{ backgroundColor: "red.300" }}
            >
              Delete
            </Button>
            <Button
              px="10"
              width="120px"
              fontSize="small"
              fontWeight="normal"
              borderColor="black"
              onClick={() => setIsDeleteConfirmationOpen(false)}
              isDisabled={isDeleting}
              _hover={{ backgroundColor: "gray.200" }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isRejectConfirmationOpen} onClose={() => setIsRejectConfirmationOpen(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Rejection</ModalHeader>
          <ModalCloseButton isDisabled={isRejecting} />
          <ModalBody>
            Are you sure you would like to reject this event?
            <Textarea
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
              placeholder="Enter reason for rejection..."
              size="sm"
              mt={2}
            />
          </ModalBody>
          <ModalFooter className="flex flex-wrap justify-end gap-2">
            <Button
              px="10"
              width="120px"
              fontSize="small"
              fontWeight="normal"
              borderColor="black"
              onClick={rejectEvent}
              isLoading={isRejecting}
              loadingText="Rejecting..."
              _hover={{ backgroundColor: "orange.300" }}
            >
              Reject
            </Button>
            <Button
              px="10"
              width="120px"
              fontSize="small"
              fontWeight="normal"
              borderColor="black"
              onClick={() => setIsRejectConfirmationOpen(false)}
              isDisabled={isRejecting}
              _hover={{ backgroundColor: "gray.200" }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default function EventFormPage() {
  return (
    <Suspense
      fallback={
        <Center height="100vh">
          <Spinner size="xl" />
        </Center>
      }
    >
      <EventFormContent />
    </Suspense>
  );
}
