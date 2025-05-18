import { NewJob } from "@/components/EmailTemplates/NewJob";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/auth";

const resend = new Resend(process.env.RESEND_API_KEY);
const adminEmail = process.env.ADMIN_EMAIL || "";

export const POST = withApiAuth(
  async (req: NextRequest, { auth }) => {
    try {
      const jobData = await req.json();

      // console logs can be removed in the future
      console.log("📧 ATTEMPTING TO SEND: ", jobData.title);

      const { data, error } = await resend.emails.send({
        from: "Spokes Job Board <onboarding@resend.dev>",
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
          contactPhone: jobData.contactPhone,
          contactEmail: jobData.contactEmail,
          detailURL: jobData.detailURL,
          applyNowURL: jobData.applyNowURL,
        }),
      });
      if (error) {
        console.error("❌ EMAIL FAILED:", error);
        return NextResponse.json({ error }, { status: 500 });
      }

      console.log("✅ EMAIL SENT! ID:", data?.id);
      return NextResponse.json({ success: true, data });
    } catch (error) {
      console.error("❌ EMAIL FAILED:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
  },
  {
    requireAuth: true,
    allowedRoles: ["nonprofit", "spokes_admin"],
  },
);
