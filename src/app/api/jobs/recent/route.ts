import connectDB from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import Job from "@/database/jobSchema";
import { ObjectId } from "mongodb";
import { withApiAuth } from "@/lib/auth";
import { getThirtyDaysAgo } from "@/lib/utils";

export const POST = withApiAuth(
  async (req: NextRequest) => {
    try {
      await connectDB();
      const { rawJobIdArray } = await req.json();

      if (!Array.isArray(rawJobIdArray)) {
        return NextResponse.json({ message: "Invalid recent jobs input." }, { status: 400 });
      }

      const jobIdArray = rawJobIdArray
        .filter((id): id is string => typeof id === "string" && ObjectId.isValid(id))
        .map((id) => new ObjectId(id));

      const recentJobs = await Job.find({
        _id: { $in: jobIdArray },
        jobStatus: "approved",
        approvedDate: { $gte: getThirtyDaysAgo() },
      });
      return NextResponse.json(recentJobs, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Failed to get recent jobs." }, { status: 500 });
    }
  },
  {
    // Auth is not required for viewing recent jobs
    requireAuth: false,
  },
);
