import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/db";
import User from "@/database/userSchema";
import Job from "@/database/jobSchema";
import { withApiAuth } from "@/lib/auth";

export const GET = withApiAuth(
  async (req: NextRequest, { auth }) => {
    try {
      await connectDB();

      const url = new URL(req.url);
      const userId = url.searchParams.get("userId");

      if (!userId) {
        return NextResponse.json({ error: "User ID missing" }, { status: 400 });
      }

      // Only allow users to access their own jobs
      if (auth.role === "nonprofit" && auth.userId !== userId) {
        return NextResponse.json({ error: "Insufficient permissions to view these jobs" }, { status: 403 });
      }

      const mongoUser = await User.findById(userId);
      if (!mongoUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const jobIds = mongoUser.postedJobs || [];
      const jobs = await Job.find({ _id: { $in: jobIds } }).lean();

      return NextResponse.json(jobs);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
  {
    requireAuth: true,
    allowedRoles: ["nonprofit", "spokes_admin"],
  },
);
