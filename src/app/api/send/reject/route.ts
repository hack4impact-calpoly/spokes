import { RejectJob } from "@/components/EmailTemplates/RejectJob";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/auth";

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = withApiAuth(
  async (req: NextRequest, { auth }) => {
    try {
      const jobData = await req.json();

      if (!jobData.rejectionReason || jobData.rejectionReason.trim() === "") {
        jobData.rejectionReason = "No reason provided.";
      }

      console.log("ATTEMPTING TO SEND: ", jobData.title);

      const { data, error } = await resend.emails.send({
        from: "Spokes Job Board <onboarding@resend.dev>",
        to: [`${jobData.contactEmail}`],
        subject: `Your Job Post for ${jobData.title} Was Rejected`,
        react: RejectJob({
          title: jobData.title,
          organizationName: jobData.organizationName,
          contactName: jobData.contactName,
          rejectionReason: jobData.rejectionReason,
        }),
      });

      if (error) {
        console.error("EMAIL FAILED:", error);
        return NextResponse.json({ error }, { status: 500 });
      }

      console.log("EMAIL SENT!");
      return NextResponse.json({ success: true, data });
    } catch (error) {
      console.log("EMAIL FAILED:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
  },
  {
    requireAuth: true,
    allowedRoles: ["spokes_admin"], // Only admins should be able to reject jobs
  },
);
