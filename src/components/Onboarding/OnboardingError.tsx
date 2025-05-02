"use client";

import { Button, Stack, Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";

interface OnboardingErrorProps {
  error: string;
  onRetry: () => void;
  onReturnToJobBoard: () => void;
}

export default function OnboardingError({ error, onRetry, onReturnToJobBoard }: OnboardingErrorProps) {
  return (
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
        <Button onClick={onRetry} colorScheme="blackAlpha" bg="black" _hover={{ bg: "#5E5E5E" }}>
          Try Again
        </Button>
        <Button onClick={onReturnToJobBoard} variant="outline" colorScheme="blackAlpha" textColor="black">
          Return to Job Board
        </Button>
      </Stack>
    </Alert>
  );
}
