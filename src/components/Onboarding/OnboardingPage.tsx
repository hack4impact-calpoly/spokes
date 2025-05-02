"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useUser, useSession } from "@clerk/nextjs";
import { Box, Heading, useToast } from "@chakra-ui/react";
import OnboardingForm from "@/components/Onboarding/OnboardingForm";
import OnboardingError from "@/components/Onboarding/OnboardingError";
import OnboardingSkeleton from "@/components/Onboarding/OnboardingSkeleton";

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const { session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Box className="w-full max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
          <OnboardingSkeleton />
        </Box>
      </div>
    );
  }

  if (!user) {
    router.push("/sign-in");
    return null;
  }

  const handleSubmit = async (formData: { paidMember: string; organizationName: string }) => {
    setIsSubmitting(true);
    setError(null);

    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || (typeof window !== "undefined" ? window.location.origin : "");
    const url = `${baseUrl}/api/users`;

    try {
      const response = await fetch(url, {
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
        await session?.reload();

        toast({
          title: "Profile completed!",
          description: "Your profile has been successfully updated.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        console.log("returnUrl", returnUrl);
        router.push(returnUrl);
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
      <Box className="w-full max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
        <Heading as="h1" size="lg" textAlign="center" mb={6}>
          Complete Your Profile
        </Heading>

        {error ? (
          <OnboardingError error={error} onRetry={handleRetry} onReturnToJobBoard={handleReturnToJobBoard} />
        ) : (
          <OnboardingForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        )}
      </Box>
    </div>
  );
}
