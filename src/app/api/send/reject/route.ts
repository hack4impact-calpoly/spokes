import { RejectJob } from "@/components/EmailTemplates/RejectJob";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/auth";

const senderEmail = process.env.SENDER_EMAIL || "onboarding@resend.dev";

export const POST = withApiAuth(
  async (req: NextRequest) => {
    try {
      if (!process.env.RESEND_API_KEY) {
        return NextResponse.json({ error: "Email service is not configured" }, { status: 500 });
      }

      const jobData = await req.json();

      if (!jobData.rejectionReason || jobData.rejectionReason.trim() === "") {
        jobData.rejectionReason = "No reason provided.";
      }
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { data, error } = await resend.emails.send({
        from: `Spokes Job Board <${senderEmail}>`,
        to: [`${jobData.contactEmail}`],
        subject: `Your job post for ${jobData.title} was rejected`,
        react: RejectJob({
          title: jobData.title,
          organizationName: jobData.organizationName,
          contactName: jobData.contactName,
          rejectionReason: jobData.rejectionReason,
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
    allowedRoles: ["spokes_admin"], // Only admins should be able to reject jobs
  },
);
