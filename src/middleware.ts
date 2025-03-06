import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // if (isAdminRoute(req)) {
  //   await auth.protect((has) => {
  //     return has({ role: "org:admin" });
  //   });
  // }
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.next();
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  const isFirstSignUp = !user.privateMetadata?.isFirstSignUp;
  console.log("is first sign up:", isFirstSignUp);

  if (!isFirstSignUp) {
    try {
      const cookies = req.headers.get("cookie") || "";
      const baseUrl = process.env.BASE_URL || "http://localhost:3000";
      const response = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookies,
        },
        body: JSON.stringify({
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.primaryEmailAddress?.emailAddress,
        }),
      });

      if (response.ok) {
        console.log("User added via middleware");
        await client.users.updateUserMetadata(userId, {
          privateMetadata: {
            ...user.privateMetadata,
            isFirstSignUp: false,
          },
        });
      } else {
        const errorData = await response.json();
        console.log("user creation failed:", errorData.message);
      }
    } catch (error) {
      console.log("Error in adding user in middleware", error);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
