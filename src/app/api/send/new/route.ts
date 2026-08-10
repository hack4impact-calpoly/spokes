import { NewJob } from "@/components/EmailTemplates/NewJob";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/auth";
import { getJobsAdminUrl } from "@/lib/url";

const adminEmail = process.env.ADMIN_EMAIL || "";
const senderEmail = process.env.SENDER_EMAIL || "onboarding@resend.dev";

export const POST = withApiAuth(
  async (req: NextRequest) => {
    try {
      if (!process.env.RESEND_API_KEY) {
        return NextResponse.json({ error: "Email service is not configured" }, { status: 500 });
      }

      if (!adminEmail) {
        return NextResponse.json({ error: "ADMIN_EMAIL is not configured" }, { status: 500 });
      }

      const jobData = await req.json();

      const resend = new Resend(process.env.RESEND_API_KEY);
      const { data, error } = await resend.emails.send({
        from: `Spokes Website <${senderEmail}>`,
        to: [adminEmail],
        subject: `${jobData.organizationName} submitted a job and is pending approval...`,
        react: NewJob({
          title: jobData.title,
          jobDescription: jobData.jobDescription,
          organizationName: jobData.organizationName,
          organizationIndustry: jobData.organizationIndustry,
          employmentType: jobData.employmentType,
          compensationType: jobData.compensationType ?? "None",
          contactName: jobData.contactName,
          contactEmail: jobData.contactEmail,
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
      return NextResponse.json({ error: error?.message || "Failed to send email" }, { status: 500 });
    }
  },
  {
    requireAuth: true,
    allowedRoles: ["nonprofit", "spokes_admin"],
  },
);
