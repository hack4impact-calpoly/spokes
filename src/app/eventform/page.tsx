"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useRadioGroup,
  VStack,
  Spinner,
  Center,
} from "@chakra-ui/react";
import RadioCard from "@/components/RadioCard";
import { IEvent } from "@/database/eventSchema";
import EventConfirmationModal from "@/components/EventModals/EventConfirmationModal";
import EventFailModal from "@/components/EventModals/EventFailModal";

function EventFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [locationType, setLocationType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEvent, setIsLoadingEvent] = useState(false);
  const [eventData, setEventData] = useState<IEvent | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isFailModalOpen, setIsFailModalOpen] = useState(false);
  const eventId = searchParams.get("eventId");

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
      location: formData.get("location") as string,
      locationType: formData.get("locationType") as string,
    };

    try {
      let response: Response;

      if (eventId) {
        response = await fetch(`/api/events/${eventId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        response = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
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
          Event Information
        </Heading>

        {serverError && (
          <div className="mb-4 bg-red-50 p-3 text-sm text-red-700 border border-red-200">{serverError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
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
              <FormLabel>Event Date</FormLabel>
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
              <Input
                id="description"
                name="description"
                type="text"
                placeholder="Enter event description"
                defaultValue={eventData?.description ?? ""}
                required
                bg="#F6F6F6"
                border="0"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Event Location</FormLabel>
              <Input
                id="location"
                name="location"
                type="text"
                placeholder="Enter location"
                defaultValue={eventData?.location ?? ""}
                required
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

            <div className="mt-8 flex justify-center">
              <Button
                type="submit"
                isLoading={isSubmitting}
                loadingText={eventId ? "Updating..." : "Submitting..."}
                disabled={isSubmitting}
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
