import { EmailTemplate } from "@/components/EmailTemplate";
import { Resend } from "resend";
import { NextRequest } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const jobData = await request.json();

    const { data, error } = await resend.emails.send({
      from: "SpokesJB <onboarding@resend.dev>",
      to: ["delivered@resend.dev"], // Replace with actual recipient email
      subject: "New Job Posting!",
      react: EmailTemplate({
        jobTitle: jobData.title,
        jobDescription: jobData.description,
        jobLocation: jobData.location,
        jobSalary: jobData.salary || "Not specified",
        organizationName: jobData.organizationName,
        employmentType: jobData.employmentType,
        compensationType: jobData.compensationType,
      }),
    });

    if (error) {
      console.error("❌ EMAIL DIDN'T SEND", error);
      return Response.json({ error }, { status: 500 });
    }

    console.log("✅ EMAIL SENT! ID:", data?.id);
    return Response.json({ success: true, data });
  } catch (error) {
    console.error("❌ EMAIL DIDN'T SEND", error);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
