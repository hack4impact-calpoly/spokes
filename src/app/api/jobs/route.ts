import connectDB from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import Job from "@/database/jobSchema";
import User from "@/database/userSchema";
import { withApiAuth } from "@/lib/auth";
import { getThirtyDaysAgo } from "@/lib/utils";

// no filters: GET /api/jobs?page=1&limit=10
// filter by employment type: GET /api/jobs?employmentType=full-time&employment=part-time
// combine filters w/ pagination: GET /api/jobs?employmentType=full-time&compensationType=paid&page=2&limit=10
export const GET = withApiAuth(
  async (req: NextRequest) => {
    try {
      await connectDB();

      const { searchParams } = new URL(req.url);
      const isAdminRequest = searchParams.get("admin") === "true";

      // Only apply pagination for non-admin requests
      const page = isAdminRequest ? 1 : Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
      const limit = isAdminRequest ? 0 : Math.max(parseInt(searchParams.get("limit") || "10", 10), 1);
      const skip = isAdminRequest ? 0 : (page - 1) * limit; // This will always be >= 0

      // Filter parameters
      const employmentFilters = searchParams.getAll("employmentType");
      const compensationFilters = searchParams.getAll("compensationType");
      const industryFilters = searchParams.getAll("organizationIndustry");
      const statusFilter = searchParams.get("jobStatus");

      // Build the filter object dynamically
      const filter: any = {};

      if (employmentFilters.length > 0) {
        filter.employmentType = {
          $in: employmentFilters,
        };
      }

      if (compensationFilters.length > 0) {
        filter.compensationType = {
          $in: compensationFilters.includes("null")
            ? [...compensationFilters.filter((c) => c !== "null"), null]
            : compensationFilters,
        };
      }

      if (industryFilters.length > 0) {
        filter.organizationIndustry = {
          $in: industryFilters,
        };
      }

      if (statusFilter) {
        filter.jobStatus = {
          $in: statusFilter,
        };
      }

      // Fetch jobs with filters, sorting, and pagination
      const jobs = await Job.find(filter)
        .sort({
          memberJob: -1, // true → 1, false → 0; so true's first
          postDate: -1,
        })
        .skip(skip)
        .limit(limit);

      return new NextResponse(JSON.stringify(jobs), {
        status: 200,
        headers: {
          // cache settings: keep response fresh for 7s, then serve stale data for up to 1s while revalidating in the background
          "Cache-Control": "max-age=7, stale-while-revalidate=1",
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      return NextResponse.json(error, { status: 500 });
    }
  },
  {
    // No auth required for GET
    requireAuth: false,
  },
);

export const POST = withApiAuth(
  async (req: NextRequest, { auth }) => {
    try {
      await connectDB();
      const jobData = await req.json();
      console.log("Job data", jobData);
      if (
        !jobData ||
        !jobData.organizationName ||
        !jobData.organizationIndustry ||
        !jobData.title ||
        !jobData.postDate ||
        !jobData.employmentType ||
        !jobData.jobStatus ||
        !jobData.detailURL
      ) {
        return NextResponse.json({ message: "Invalid job input" }, { status: 400 });
      }

      // Get the user from the database
      const mongoUser = await User.findById(auth.userId);
      if (!mongoUser) {
        return NextResponse.json({ message: "User not found in DB" }, { status: 404 });
      }

      const newJob = await Job.create({
        userId: auth.userId, // Set the userId from the auth context
        memberJob: mongoUser.paidMember, // Set memberJob based on user's paid member status
        ...jobData,
        applyNowURL: jobData.applyNowURL || "",
      });

      mongoUser.postedJobs.push(newJob._id);
      await mongoUser.save();

      return NextResponse.json({ message: "Job posted succesfully!", job: newJob }, { status: 201 });
    } catch (error: any) {
      return NextResponse.json({ message: "Could not submit job ", error }, { status: 500 });
    }
  },
  {
    requireAuth: true,
    allowedRoles: ["nonprofit", "spokes_admin"],
  },
);
