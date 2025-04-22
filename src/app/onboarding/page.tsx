"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Box, Button, FormControl, FormLabel, Heading, Radio, RadioGroup, Stack, Text, VStack } from "@chakra-ui/react";

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState({
    paidMember: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoaded) {
    return (
      <Box className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <Text>Loading...</Text>
      </Box>
    );
  }

  if (!user) {
    router.push("/sign-in");
    return null;
  }

  const handleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, paidMember: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Update user in your database
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.emailAddresses[0].emailAddress,
          ...formData,
        }),
      });

      if (response.ok) {
        router.push("/");
      } else {
        const error = await response.json();
        console.error("Failed to complete onboarding:", error);
        alert("Failed to complete onboarding. Please try again.");
      }
    } catch (error) {
      console.error("Error during onboarding:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <Box className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <VStack spacing={6} align="stretch">
          <Heading as="h1" size="lg" textAlign="center">
            Complete Your Profile
          </Heading>

          <Text>Please verify your membership status with Spokes to complete your profile.</Text>

          <form onSubmit={handleSubmit}>
            <FormControl isRequired mb={6}>
              <FormLabel fontWeight="medium">Are you a paid member of Spokes?</FormLabel>
              <RadioGroup onChange={handleChange} value={formData.paidMember} name="paidMember">
                <Stack direction="column" spacing={4}>
                  <Radio
                    value="yes"
                    bg="#F6F6F6"
                    _checked={{
                      bg: "#BDEABD",
                      borderColor: "#BDEABD",
                    }}
                  >
                    Yes, I am a paid member
                  </Radio>
                  <Radio
                    value="no"
                    bg="#F6F6F6"
                    _checked={{
                      bg: "#F8B1B8",
                      borderColor: "#F8B1B8",
                    }}
                  >
                    No, I am not a paid member
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <Button
              type="submit"
              disabled={isSubmitting || !formData.paidMember}
              isLoading={isSubmitting}
              loadingText="Submitting..."
              w="full"
              colorScheme="blackAlpha"
              bg="black"
              _hover={{ bg: "#5E5E5E" }}
              size="lg"
              mt={4}
            >
              Complete Profile
            </Button>
          </form>
        </VStack>
      </Box>
    </div>
  );
}
