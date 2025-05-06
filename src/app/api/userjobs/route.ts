import { NextResponse } from "next/server";
import connectDB from "@/database/db";
import User from "@/database/userSchema";
import Job from "@/database/jobSchema";

export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "User ID missing" }, { status: 400 });
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
}
