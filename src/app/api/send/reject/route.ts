import { RejectionEmailTemplate } from "@/components/RejectEmailTemplate";
import { Resend } from "resend";
import { NextRequest } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const jobData = await request.json();

    if (!jobData.rejectionReason || jobData.rejectionReason.trim() === "") {
      jobData.rejectionReason = "No reason provided.";
    }

    console.log("ATTEMPTING TO SEND: ", jobData.title);

    const { data, error } = await resend.emails.send({
      from: "Spokes Job Board <onboarding@resend.dev>",
      to: `${jobData.contactEmail}`,
      subject: `Your Job Post for ${jobData.title} Was Rejected`,
      react: RejectionEmailTemplate({
        title: jobData.title,
        organizationName: jobData.organizationName,
        contactName: jobData.contactName,
        rejectionReason: jobData.rejectionReason,
      }),
    });

    if (error) {
      console.error("EMAIL FAILED:", error);
      return Response.json({ error }, { status: 500 });
    }

    console.log("EMAIL SENT!");
    return Response.json({ success: true, data });
  } catch (error) {
    console.log("EMAIL FAILED:", error);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
