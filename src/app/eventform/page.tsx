"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/services/events";
import { useAuth } from "@clerk/nextjs";
import { Box, Button, FormControl, FormLabel, Heading, Input, Stack, useRadioGroup, VStack } from "@chakra-ui/react";
import RadioCard from "@/components/RadioCard";

export default function EventFormPage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [locationType, setLocationType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const locationTypeColorMapping = {
    Remote: "#F8B1B8",
    "In-Person": "#C6D3FF",
  };

  const locationTypeOptions = ["Remote", "In-Person"];

  const { getRootProps: getLocationTypeRootProps, getRadioProps: getLocationTypeRadioProps } = useRadioGroup({
    name: "locationType",
    onChange: (value) => setLocationType(value),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }

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
      await createEvent(data);
      router.push("/events");
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSignedIn) {
    return (
      <Box mx="auto" p={10} minWidth={{ base: "320px", md: "768px", lg: "1024px" }} maxWidth="1200px">
        <div className="mt-2 mb-2 text-black text-3xl font-semibold">Create New Event</div>
        <p className="text-gray-700">Please sign in to create an event.</p>
      </Box>
    );
  }

  return (
    <Box mx="auto" p={10} minWidth={{ base: "320px", md: "768px", lg: "1024px" }} maxWidth="1200px">
      <div className="mt-2 mb-2 text-black text-3xl font-semibold">Create New Event</div>

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
              placeholder="Enter your response"
              required
              bg="#F6F6F6"
              border="0"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Event Date</FormLabel>
            <Stack w="full" direction={{ base: "column", md: "row" }} spacing={4}>
              <Input id="date" name="date" type="date" required bg="#F6F6F6" border="0" />
              <Input id="time" name="time" type="text" placeholder="5:30 - 8:30" required bg="#F6F6F6" border="0" />
            </Stack>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Event Description</FormLabel>
            <Input
              id="description"
              name="description"
              type="text"
              placeholder="Enter your response"
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
              placeholder="Enter your response"
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
              loadingText="Submitting..."
              disabled={isSubmitting}
              size="lg"
              colorScheme="blackAlpha"
              bg="#045F87"
              _hover={{ bg: "#2A80A8" }}
              className="w-full sm:w-auto min-w-[200px]"
            >
              Submit
            </Button>
          </div>
        </VStack>
      </form>
    </Box>
  );
}
