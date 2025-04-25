"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
  Skeleton,
  SkeletonText,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
} from "@chakra-ui/react";

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const toast = useToast();
  const [formData, setFormData] = useState({
    paidMember: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Box className="w-full max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
          <VStack spacing={6} align="stretch">
            <Skeleton height="40px" width="80%" mx="auto" />
            <SkeletonText mt="4" noOfLines={2} spacing="4" />

            <Box>
              <Skeleton height="24px" width="60%" mb="4" />
              <Stack direction="column" spacing={4}>
                <Skeleton height="24px" width="100%" />
                <Skeleton height="24px" width="100%" />
              </Stack>
            </Box>

            <Skeleton height="48px" width="100%" mt={4} />
          </VStack>
        </Box>
      </div>
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
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/api/users", {
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
        toast({
          title: "Profile completed!",
          description: "Your profile has been successfully updated.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        router.push("/");
      } else {
        const error = await response.json();
        setError("We couldn't complete your profile at this time. Please try again or return to the job board.");
        console.error("Failed to complete onboarding:", error);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again or return to the job board.");
      console.error("Error during onboarding:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setError(null);
  };

  const handleReturnToJobBoard = () => {
    router.push("/");
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <Box className="w-full max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <VStack spacing={6} align="stretch">
          <Heading as="h1" size="lg" textAlign="center">
            Complete Your Profile
          </Heading>

          {error ? (
            <Alert
              status="error"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              height="200px"
              borderRadius="md"
              bg="transparent"
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                Oops! Something went wrong
              </AlertTitle>
              <AlertDescription maxWidth="sm">{error}</AlertDescription>
              <Stack direction="row" spacing={4} mt={4}>
                <Button onClick={handleRetry} colorScheme="blackAlpha" bg="black" _hover={{ bg: "#5E5E5E" }}>
                  Try Again
                </Button>
                <Button onClick={handleReturnToJobBoard} variant="outline" colorScheme="blackAlpha" textColor="black">
                  Return to Job Board
                </Button>
              </Stack>
            </Alert>
          ) : (
            <>
              <Text>Please verify your membership status with Spokes to complete your profile.</Text>

              <form onSubmit={handleSubmit}>
                <FormControl isRequired mb={6}>
                  <FormLabel fontWeight="medium">Are you a paid member of Spokes?</FormLabel>
                  <RadioGroup onChange={handleChange} value={formData.paidMember} name="paidMember">
                    <Stack direction="column" spacing={4}>
                      <Radio
                        value="true"
                        bg="#F6F6F6"
                        _checked={{
                          bg: "#BDEABD",
                          borderColor: "#BDEABD",
                        }}
                      >
                        Yes, I am a paid member
                      </Radio>
                      <Radio
                        value="false"
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
            </>
          )}
        </VStack>
      </Box>
    </div>
  );
}
