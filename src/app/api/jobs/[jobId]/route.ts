import connectDB from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import Job from "@/database/jobSchema";

export async function DELETE(_request: NextRequest, { params }: { params: { jobId: string } }) {
  try {
    await connectDB();
    const { jobId } = params;

    //Requires id
    if (!jobId) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    //Deleting based on _id
    const result = await Job.findByIdAndDelete(jobId);

    //if id not found
    if (!result) {
      return NextResponse.json({ error: "ID not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred while deleting" }, { status: 500 });
  }
}
