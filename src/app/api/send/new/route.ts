import { NewJob } from "@/components/EmailTemplates/NewJob";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/auth";

const resend = new Resend(process.env.RESEND_API_KEY);
const adminEmail = process.env.ADMIN_EMAIL || "";
const adminURL = process.env.NEXT_PUBLIC_ADMIN_URL || "/admin";
const senderEmail = process.env.SENDER_EMAIL || "<onboarding@resend.dev>";

export const POST = withApiAuth(
  async (req: NextRequest, { auth }) => {
    try {
      const jobData = await req.json();

      const { data, error } = await resend.emails.send({
        from: `Spokes Job Board ${senderEmail}`,
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
          adminURL: adminURL,
        }),
      });
      if (error) {
        return NextResponse.json({ error }, { status: 500 });
      }
      return NextResponse.json({ success: true, data });
    } catch (error) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
  },
  {
    requireAuth: true,
    allowedRoles: ["nonprofit", "spokes_admin"],
  },
);
