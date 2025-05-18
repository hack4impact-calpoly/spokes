import connectDB from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import Job from "@/database/jobSchema";
import { IJob } from "@/database/jobSchema";
import { withApiAuth } from "@/lib/auth";
import { JobStatus } from "@/database/jobSchema";

export const DELETE = withApiAuth(
  async (req: NextRequest, { auth }) => {
    try {
      await connectDB();
      const jobId = req.nextUrl.pathname.split("/").pop();

      //Requires id
      if (!jobId) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
      }

      // Fetch the job to check ownership
      const job = await Job.findById(jobId);
      if (!job) {
        return NextResponse.json({ error: "ID not found" }, { status: 404 });
      }

      // owners can only delete their own jobs
      if (auth.role === "nonprofit" && job.userId !== auth.userId) {
        return NextResponse.json({ error: "Insufficient permissions to delete this job" }, { status: 403 });
      }

      const updatedJob = {
        ...job,
        modifiedDate: new Date(),
        jobStatus: auth.role === "nonprofit" ? JobStatus.pending : job.jobStatus,
      };

      // update job
      await Job.findByIdAndUpdate(jobId, updatedJob, { new: true });

      return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "An error occurred while deleting" }, { status: 500 });
    }
  },
  {
    requireAuth: true,
    allowedRoles: ["nonprofit", "spokes_admin"],
  },
);

export const PUT = withApiAuth(
  async (req: NextRequest, { auth }) => {
    try {
      await connectDB();
      const jobId = req.nextUrl.pathname.split("/").pop();

      const job: IJob = await req.json();
      const updatedJob = {
        ...job,
        modifiedDate: new Date(),
      };
      console.log("Received Job Data:", updatedJob);

      if (!jobId) {
        return NextResponse.json({ message: "Job ID is required" }, { status: 400 });
      }

      if (!job.jobStatus) {
        return NextResponse.json({ message: "Job status is required" }, { status: 400 });
      }

      // fetch job to check ownership
      const existingJob = await Job.findById(jobId);
      if (!existingJob) {
        return NextResponse.json({ message: "Job not found" }, { status: 404 });
      }

      // Check if nonprofit is the owner of the job
      if (auth.role === "nonprofit" && existingJob.userId !== auth.userId) {
        return NextResponse.json({ error: "Insufficient permissions to update this job" }, { status: 403 });
      }

      await Job.findByIdAndUpdate(jobId, updatedJob, { new: true });
      return NextResponse.json({ message: "Job updated successfully" });
    } catch (error: any) {
      console.error("PUT Error:", error);
      return NextResponse.json({ message: "Error updating job: ", error }, { status: 500 });
    }
  },
  {
    requireAuth: true,
    allowedRoles: ["nonprofit", "spokes_admin"],
  },
);

export const GET = withApiAuth(
  async (req: NextRequest) => {
    try {
      await connectDB();
      const jobId = req.nextUrl.pathname.split("/").pop();

      console.log("Received jobId:", jobId);

      const job = await Job.findById(jobId);

      if (!job) {
        return NextResponse.json({ message: "Job not found" }, { status: 404 });
      }

      return NextResponse.json(job, { status: 200 });
    } catch (error) {
      console.error("GET Error:", error);
      return NextResponse.json({ message: "Error fetching job" }, { status: 500 });
    }
  },
  {
    // No auth required for GET
    requireAuth: false,
  },
);
