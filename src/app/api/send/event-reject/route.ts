import { RejectEvent } from "@/components/EmailTemplates/RejectEvent";
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

      const eventData = await req.json();

      if (!eventData.rejectionReason || eventData.rejectionReason.trim() === "") {
        eventData.rejectionReason = "No reason provided.";
      }
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { data, error } = await resend.emails.send({
        from: `Spokes Website <${senderEmail}>`,
        to: [`${eventData.contactEmail}`],
        subject: `Your event submission for ${eventData.eventName} was rejected`,
        react: RejectEvent({
          eventName: eventData.eventName,
          organization: eventData.organization,
          contactName: eventData.contactName,
          rejectionReason: eventData.rejectionReason,
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
    allowedRoles: ["spokes_admin"], // Only admins should be able to reject events
  },
);
