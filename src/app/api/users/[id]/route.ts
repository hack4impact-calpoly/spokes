import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/db";
import User from "@/database/userSchema"; // Import your User model
import { withApiAuth } from "@/lib/auth";
import Job from "@/database/jobSchema";
import Event from "@/database/eventSchema";
import { resolveOrganizationName } from "@/lib/organizations";

export const GET = withApiAuth(
  async (req: NextRequest, { auth }) => {
    try {
      await connectDB(); // Connect to MongoDB
      const id = req.nextUrl.pathname.split("/").pop(); // Fetch the user ID from params

      // Validate ID
      if (!id) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
      }

      // Only allow users to access their own data
      if (auth.role === "nonprofit" && auth.userId !== id) {
        return NextResponse.json({ error: "Insufficient permissions to view this user" }, { status: 403 });
      }

      // Find user by ID
      const user = await User.findById(id);

      // If user not found, return 404
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      return NextResponse.json(user, { status: 200 });
    } catch (error: any) {
      console.error("Error fetching user:", error);

      return NextResponse.json(
        { message: "Error fetching user", error: error?.message ?? "Unknown user fetch error" },
        { status: 500 },
      );
    }
  },
  {
    requireAuth: true,
    allowedRoles: ["nonprofit", "spokes_admin"],
  },
);

export const PATCH = withApiAuth(
  async (req: NextRequest, { auth }) => {
    try {
      await connectDB();

      // Extract the userId from the route parameters
      const id = req.nextUrl.pathname.split("/").pop();

      const body = await req.json();
      const hasPaidMemberUpdate = typeof body?.paidMember === "boolean";
      const hasOrganizationUpdate = typeof body?.organizationName === "string";

      // Validate ID
      if (!id) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
      }

      if (!hasPaidMemberUpdate && !hasOrganizationUpdate) {
        return NextResponse.json({ message: "No valid user fields provided" }, { status: 400 });
      }

      // Find user by ID
      const user = await User.findById(id);

      // If user not found, return 404
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      if (hasPaidMemberUpdate) {
        user.paidMember = body.paidMember;
      }

      if (hasOrganizationUpdate) {
        const organizationName = body.organizationName.trim();

        if (!organizationName) {
          return NextResponse.json({ message: "Organization name is required" }, { status: 400 });
        }

        const canonicalOrganizationName = await resolveOrganizationName(organizationName);
        user.organizationName = canonicalOrganizationName;

        await Promise.all([
          Job.updateMany({ userId: id }, { $set: { organizationName: canonicalOrganizationName } }),
          Event.updateMany({ createdByUserId: id }, { $set: { organization: canonicalOrganizationName } }),
        ]);
      }

      await user.save();

      if (hasPaidMemberUpdate) {
        await Job.updateMany({ _id: { $in: user.postedJobs } }, { $set: { memberJob: body.paidMember } });
      }

      return NextResponse.json(user, { status: 200 });
    } catch (error: any) {
      console.error("Error updating user admin status:", error); // Log the error for debugging
      return NextResponse.json(
        { message: "Failed to update user admin status", error: error.message },
        { status: 500 },
      );
    }
  },
  {
    requireAuth: true,
    allowedRoles: ["spokes_admin"],
  },
);

export const DELETE = withApiAuth(
  async (req: NextRequest) => {
    try {
      await connectDB();

      const id = req.nextUrl.pathname.split("/").pop();

      if (!id) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
      }

      const user = await User.findById(id);

      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      const [jobs, events] = await Promise.all([
        Job.deleteMany({ userId: id }),
        Event.deleteMany({ createdByUserId: id }),
      ]);

      await User.findByIdAndDelete(id);

      return NextResponse.json(
        {
          message: "User deleted successfully",
          jobsDeleted: jobs.deletedCount ?? 0,
          eventsDeleted: events.deletedCount ?? 0,
        },
        { status: 200 },
      );
    } catch (error: any) {
      console.error("Error deleting user:", error);

      return NextResponse.json(
        { message: "Failed to delete user", error: error?.message ?? "Unknown user deletion error" },
        { status: 500 },
      );
    }
  },
  {
    requireAuth: true,
    allowedRoles: ["spokes_admin"],
  },
);
