"use client";

import { Box, VStack, Skeleton, SkeletonText, Stack } from "@chakra-ui/react";

export default function OnboardingSkeleton() {
  return (
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
  );
}
