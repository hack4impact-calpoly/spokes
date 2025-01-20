import connectDB from "@/database/db";
import { NextResponse } from "next/server";
import { IJob } from "@/database/jobSchema";
import Job from "@/database/jobSchema";

/**
 * PUT API route
 * accepts a job object and updates the job in the database
 * @returns {message: string}
 */
export async function PUT(request: Request) {
  await connectDB();
}
