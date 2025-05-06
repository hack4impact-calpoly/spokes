import OnboardingPage from "@/components/Onboarding/OnboardingPage";
import { Suspense } from "react";
import { Center, Spinner } from "@chakra-ui/react";

export default function OnboardingParentPage() {
  return (
    <Suspense
      fallback={
        <Center height="100vh">
          <Spinner size="xl" />
        </Center>
      }
    >
      <OnboardingPage />
    </Suspense>
  );
}
