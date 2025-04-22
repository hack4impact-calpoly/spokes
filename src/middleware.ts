import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isOnboardingRoute = createRouteMatcher(["/onboarding"]);
const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
const isPublicRoute = createRouteMatcher(["/api/webhooks(.*)", "/api/users(.*)", "/jobs", "/"]);

export default clerkMiddleware(async (auth, req) => {
  // if (isAdminRoute(req)) {
  //   await auth.protect((has) => {
  //     return has({ role: "org:admin" });
  //   });
  // }

  const { userId } = await auth();

  // If not signed in or on a public route, proceed normally
  if (!userId || isPublicRoute(req) || isAuthRoute(req)) {
    return NextResponse.next();
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  // Check if user has completed onboarding
  const onboardingComplete = user.publicMetadata?.onboardingComplete === true;

  // If user hasn't completed onboarding and isn't on the onboarding page, redirect them
  if (!onboardingComplete && !isOnboardingRoute(req)) {
    const onboardingUrl = new URL("/onboarding", req.url);
    return NextResponse.redirect(onboardingUrl);
  }

  // If user has completed onboarding but is trying to access the onboarding page, redirect to dashboard
  if (onboardingComplete && isOnboardingRoute(req)) {
    const dashboardUrl = new URL("/", req.url);
    return NextResponse.redirect(dashboardUrl);
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
