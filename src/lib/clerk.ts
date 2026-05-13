import { clerkClient } from "@clerk/nextjs/server";

/**
 * Updates a user's public metadata in Clerk
 * @param userId The Clerk user ID
 * @param metadata The metadata to update
 * @returns A promise that resolves when the update is complete
 */
export async function updateUserMetadata(userId: string, metadata: Record<string, any>) {
  const client = await clerkClient();

  await client.users.updateUserMetadata(userId, {
    publicMetadata: metadata,
  });
}
