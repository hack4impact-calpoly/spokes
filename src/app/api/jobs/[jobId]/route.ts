import connectDB from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import Job from "@/database/jobSchema";
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

      //Deleting based on _id
      await Job.findByIdAndDelete(jobId);

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

      const requestData = await req.json();
      const { previousStatus, newStatus, isRenewal, ...jobData } = requestData;

      // Handle both cases - with and without status transition data
      const hasStatusTransition = previousStatus !== undefined && newStatus !== undefined;
      console.log("Has Status Transition:", hasStatusTransition);
      if (hasStatusTransition) {
        console.log("Previous Status:", previousStatus);
        console.log("New Status:", newStatus);
      }

      if (!jobId) {
        return NextResponse.json({ message: "Job ID is required" }, { status: 400 });
      }

      // fetch job to check ownership
      const existingJob = await Job.findById(jobId);
      if (!existingJob) {
        return NextResponse.json({ message: "Job not found" }, { status: 404 });
      }

      console.log("Existing Job Status:", existingJob.jobStatus);

      // Check if nonprofit is the owner of the job
      if (auth.role === "nonprofit" && existingJob.userId !== auth.userId) {
        return NextResponse.json({ error: "Insufficient permissions to update this job" }, { status: 403 });
      }

      // Handle job renewal
      if (isRenewal) {
        const updatedJob = await Job.findByIdAndUpdate(
          jobId,
          {
            jobStatus: JobStatus.approved,
            postDate: new Date(),
            approvedDate: new Date(),
            modifiedDate: new Date(),
          },
          { new: true },
        );
        return NextResponse.json({ message: "Job renewed successfully", job: updatedJob });
      }

      const updatedJob = {
        ...jobData,
        jobStatus: hasStatusTransition
          ? auth.role === "nonprofit" || previousStatus === "rejected"
            ? JobStatus.pending
            : newStatus
          : auth.role === "nonprofit"
            ? JobStatus.pending
            : jobData.jobStatus,
        modifiedDate: new Date(),
        rejectionMessage: jobData.rejectionMessage ?? existingJob.rejectionMessage ?? "",
      };
      console.log("Received Job Data:", updatedJob);

      await Job.findByIdAndUpdate(jobId, updatedJob, { new: true });
      return NextResponse.json({ message: "Job updated successfully" });
    } catch (error) {
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
