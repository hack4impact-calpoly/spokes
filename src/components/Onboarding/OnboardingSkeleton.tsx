"use client";

import { Box, VStack, Skeleton, SkeletonText, Stack, SkeletonCircle } from "@chakra-ui/react";

export default function OnboardingSkeleton() {
  return (
    <VStack spacing={6} align="stretch">
      {/* Logo */}
      <Box className="flex justify-center">
        <SkeletonCircle size="14" />
      </Box>

      {/* Heading */}
      <Skeleton height="32px" width="60%" mx="auto" />

      {/* Description text */}
      <SkeletonText noOfLines={2} spacing="4" />

      {/* Organization Name field */}
      <Box>
        <Skeleton height="20px" width="40%" mb="2" />
        <Skeleton height="40px" width="100%" />
      </Box>

      {/* Membership Status field */}
      <Box>
        <Skeleton height="20px" width="50%" mb="2" />
        <Stack direction="column" spacing={4}>
          <Skeleton height="24px" width="100%" />
          <Skeleton height="24px" width="100%" />
        </Stack>
      </Box>

      {/* Submit button */}
      <Skeleton height="48px" width="100%" mt={4} />
    </VStack>
  );
}
