import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getAuthWithRole } from "@/lib/auth";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isOnboardingRoute = createRouteMatcher(["/onboarding"]);
const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
const isPublicApiRoute = createRouteMatcher([
  "/api/webhooks(.*)",
  "/api/users(.*)",
  "/api/organizations(.*)",
  "/api/jobs(.*)",
  "/api/events(.*)",
]);
const isPublicPageRoute = createRouteMatcher(["/jobs", "/events(.*)"]);

async function hasCompletedMongoProfile(req: Request, userId: string) {
  try {
    const userProfileUrl = new URL(`/api/users/${userId}`, req.url);
    const response = await fetch(userProfileUrl, {
      headers: {
        cookie: req.headers.get("cookie") ?? "",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return false;
    }

    const userProfile = await response.json();
    return typeof userProfile.organizationName === "string" && userProfile.organizationName.trim().length > 0;
  } catch (error) {
    console.error("Failed to verify user profile:", error);
    return false;
  }
}

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgSlug } = await auth();
  const { role } = getAuthWithRole({ userId, orgSlug });

  // Auth routes and public APIs handle their own access rules.
  if (isPublicApiRoute(req) || isAuthRoute(req)) {
    return NextResponse.next();
  }

  if (!userId) {
    if (isPublicPageRoute(req) || isOnboardingRoute(req)) {
      return NextResponse.next();
    }

    const signInUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }

  const onboardingComplete = await hasCompletedMongoProfile(req, userId);

  // if user hasn't completed onboarding and isn't on the onboarding page, redirect them
  if (!onboardingComplete && !isOnboardingRoute(req)) {
    const onboardingUrl = new URL("/onboarding", req.url);
    const returnPath = new URL(req.url).pathname;
    onboardingUrl.searchParams.set("returnUrl", returnPath);
    return NextResponse.redirect(onboardingUrl);
  }

  // if user has completed onboarding but is trying to access the onboarding page, redirect to dashboard
  if (onboardingComplete && isOnboardingRoute(req)) {
    const dashboardUrl = new URL("/", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // if user trying to access admin, and is not spokes_admin
  if (isAdminRoute(req) && !(role === "spokes_admin")) {
    const jobUrl = new URL("/jobs", req.url);
    return NextResponse.redirect(jobUrl);
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
