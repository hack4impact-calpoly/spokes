import { EmailTemplate } from "@/components/EmailTemplate";
import { Resend } from "resend";
import { NextRequest } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const jobData = await request.json();

    // console logs can be removed in the future
    console.log("📧 ATTEMPTING TO SEND: ", jobData.title);

    const { data, error } = await resend.emails.send({
      from: "Spokes Job Board <onboarding@resend.dev>", // replace with our email
      to: [""], // replace with michael
      subject: `${jobData.organizationName} submitted a job and is pending approval...`,
      react: EmailTemplate({
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
      return Response.json({ error }, { status: 500 });
    }

    console.log("✅ EMAIL SENT! ID:", data?.id);
    return Response.json({ success: true, data });
  } catch (error) {
    console.error("❌ EMAIL FAILED:", error);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
