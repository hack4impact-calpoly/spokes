import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/auth";
import { Resend } from "resend";
import { UpdatedJob } from "@/components/EmailTemplates/UpdatedJob";
import { getJobsAdminUrl } from "@/lib/url";

const adminEmail = process.env.ADMIN_EMAIL || "";
const senderEmail = process.env.SENDER_EMAIL || "onboarding@resend.dev";

export const POST = withApiAuth(
  async (req: NextRequest) => {
    try {
      if (!process.env.RESEND_API_KEY) {
        return NextResponse.json({ error: "Email service is not configured" }, { status: 500 });
      }

      const jobData = await req.json();

      // Validate required fields
      if (!jobData.title || !jobData.organizationName) {
        return NextResponse.json({ error: "Missing required job data" }, { status: 400 });
      }

      const resend = new Resend(process.env.RESEND_API_KEY);
      const { data, error } = await resend.emails.send({
        from: `Spokes Job Board <${senderEmail}>`,
        to: [adminEmail],
        subject: `${jobData.organizationName} updated a job and is pending approval`,
        react: UpdatedJob({
          title: jobData.title,
          jobDescription: jobData.jobDescription || "No description provided",
          organizationName: jobData.organizationName,
          organizationIndustry: jobData.organizationIndustry || [],
          employmentType: jobData.employmentType || "Unknown",
          compensationType: jobData.compensationType || "None",
          contactName: jobData.contactName || "Not provided",
          contactEmail: jobData.contactEmail || "Not provided",
          detailURL: jobData.detailURL,
          applyNowURL: jobData.applyNowURL,
          adminURL: getJobsAdminUrl(),
        }),
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, data });
    } catch (error: any) {
      return NextResponse.json({ error: "Failed to send email: " + error.message }, { status: 500 });
    }
  },
  {
    requireAuth: true,
    allowedRoles: ["nonprofit", "spokes_admin"],
  },
);
