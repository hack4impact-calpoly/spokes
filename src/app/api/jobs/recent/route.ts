import connectDB from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import Job from "@/database/jobSchema";
import { ObjectId } from "mongodb";
import { withApiAuth } from "@/lib/auth";

export const POST = withApiAuth(
  async (req: NextRequest) => {
    try {
      await connectDB();
      const { rawJobIdArray } = await req.json();

      console.log(rawJobIdArray);

      const jobIdArray = rawJobIdArray.map((id: string) => new ObjectId(id));

      const recentJobs = await Job.find({ _id: { $in: jobIdArray } });
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
