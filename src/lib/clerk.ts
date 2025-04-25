import { clerkClient } from "@clerk/nextjs/server";

/**
 * Updates a user's public metadata in Clerk
 * @param userId The Clerk user ID
 * @param metadata The metadata to update
 * @returns A promise that resolves when the update is complete
 */
export async function updateUserMetadata(userId: string, metadata: Record<string, any>) {
  try {
    const client = await clerkClient();

    await client.users.updateUserMetadata(userId, {
      publicMetadata: metadata,
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating user metadata:", error);
    return { success: false, error };
  }
}
