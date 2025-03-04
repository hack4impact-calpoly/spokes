import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
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

  try {
    const cookies = req.headers.get("cookie") || "";
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies,
      },
    });
  } catch (error) {
    console.log("Error in adding user in middleware", error);
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
