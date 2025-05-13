import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getAuthWithRole } from "@/lib/auth";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isOnboardingRoute = createRouteMatcher(["/onboarding"]);
const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
const isPublicRoute = createRouteMatcher(["/api/webhooks(.*)", "/api/users(.*)", "/jobs", "/api/jobs(.*)"]);
const isNonprofitRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // if (isAdminRoute(req)) {
  //   await auth.protect((has) => {
  //     return has({ role: "org:admin" });
  //   });
  // }

  const { userId, orgSlug } = await auth();
  const { role } = getAuthWithRole({ userId, orgSlug });

  // if not signed in or on a public route, proceed normally
  if (isPublicRoute(req) || isAuthRoute(req)) {
    return NextResponse.next();
  }

  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  const onboardingComplete = user.publicMetadata?.onboardingComplete === true;

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
