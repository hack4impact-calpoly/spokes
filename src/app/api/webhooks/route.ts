import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent, clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  const client = await clerkClient();

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("Missing webhook secret", { status: 500 });
  }

  const payload = await req.text();
  const webhook = new Webhook(secret);

  let event: WebhookEvent;

  try {
    event = webhook.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    return new Response("Invalid signature", { status: 400 });
  }

  // handle user creation events
  if (event.type === "user.created") {
    const { id, first_name, last_name, email_addresses } = event.data;
    const primaryEmail = email_addresses?.[0]?.email_address;

    // Validate required data before making the request
    if (!id || !primaryEmail) {
      console.error("Missing required user data:", { id, primaryEmail });
      return new Response("Missing required user data", { status: 400 });
    }

    try {
      // Set a flag in Clerk user metadata to indicate onboarding is needed
      await client.users.updateUserMetadata(id, {
        publicMetadata: {
          onboardingComplete: false,
        },
      });

      // Create minimal user in db
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: id,
          firstName: first_name || "",
          lastName: last_name || "",
          email: primaryEmail,
          onboardingComplete: false,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to create user (${response.status}):`, errorText);
        return new Response(`Failed to create user: ${errorText}`, { status: 500 });
      }

      return new Response("User created successfully", { status: 200 });
    } catch (error) {
      console.error("Error creating user:", error);
      return new Response("Internal server error", { status: 500 });
    }
  }

  return new Response("Webhook received", { status: 200 });
}
