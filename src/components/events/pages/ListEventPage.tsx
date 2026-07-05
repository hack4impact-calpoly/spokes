"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
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
  useRadioGroup,
  VStack,
  Spinner,
  Center,
} from "@chakra-ui/react";
import RadioCard from "@/components/ui/RadioCard";
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
  const { isSignedIn, orgSlug } = useAuth();
  const isSpokesAdmin = orgSlug === "spokes-admin";
  const [serverError, setServerError] = useState<string | null>(null);
  const [locationType, setLocationType] = useState("");
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
  const eventId = searchParams.get("eventId");
  const eventInfoLink = getEventInfoLink(eventData);
  const eventLocationLink = getEventLocationLink(eventData);

  const locationTypeColorMapping = {
    Remote: "#F8B1B8",
    "In-Person": "#C6D3FF",
  };

  const locationTypeOptions = ["Remote", "In-Person"];

  const { getRootProps: getLocationTypeRootProps, getRadioProps: getLocationTypeRadioProps } = useRadioGroup({
    name: "locationType",
    onChange: (value) => setLocationType(value),
  });

  // Load existing event if editing
  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      setIsLoadingEvent(true);
      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) throw new Error("Failed to fetch event");
        const data = await response.json();
        setEventData(data);
        setLocationType(data.locationType);
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
      locationType: formData.get("locationType") as string,
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

        <form onSubmit={handleSubmit}>
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

            <FormControl isRequired>
              <FormLabel>Event Date</FormLabel>
              <p className="mb-2 text-sm text-gray-600">
                Events should be scheduled a minimum of three months out. The more advance notice, the better.
              </p>
              <Stack w="full" direction={{ base: "column", md: "row" }} spacing={4}>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  defaultValue={eventData ? new Date(eventData.date).toISOString().split("T")[0] : ""}
                  required
                  bg="#F6F6F6"
                  border="0"
                />
                <Input
                  id="time"
                  name="time"
                  type="text"
                  placeholder="5:30 - 8:30"
                  defaultValue={eventData?.time ?? ""}
                  required
                  bg="#F6F6F6"
                  border="0"
                />
              </Stack>
            </FormControl>

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

            <FormControl isRequired>
              <FormLabel>Event Venue</FormLabel>
              <p className="mb-2 text-sm text-gray-600">
                Ex. Octagon Barn, La Lomita Ranch, Morro Bay Community Center.
              </p>
              <Input
                id="location"
                name="location"
                type="text"
                placeholder="Enter venue"
                defaultValue={eventData?.location ?? ""}
                required
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
                placeholder="Google Maps or remote meeting link"
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
              <FormLabel>Location Type</FormLabel>
              <Stack direction={{ base: "column", md: "row" }} spacing={2} {...getLocationTypeRootProps()}>
                {locationTypeOptions.map((value) => {
                  const radio = getLocationTypeRadioProps({ value: value.toLowerCase() });
                  return (
                    <RadioCard
                      key={value}
                      value={value.toLowerCase()}
                      {...radio}
                      isChecked={locationType === value.toLowerCase()}
                      checkedColor={locationTypeColorMapping[value as keyof typeof locationTypeColorMapping]}
                    >
                      {value}
                    </RadioCard>
                  );
                })}
              </Stack>
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

            <div className="mt-8 flex justify-center">
              <Button
                type="submit"
                isLoading={isSubmitting}
                loadingText={eventId ? "Updating..." : "Submitting..."}
                disabled={isSubmitting || !majorFundraisingEvent}
                size="lg"
                colorScheme="blackAlpha"
                bg="#045F87"
                _hover={{ bg: "#2A80A8" }}
                className="w-full sm:w-auto min-w-[200px]"
              >
                {eventId ? "Update Event" : "Submit Event"}
              </Button>
            </div>
          </VStack>
        </form>
      </Box>

      <EventConfirmationModal isOpen={isConfirmationModalOpen} onClose={() => setIsConfirmationModalOpen(false)} />
      <EventFailModal isOpen={isFailModalOpen} onClose={() => setIsFailModalOpen(false)} />
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
