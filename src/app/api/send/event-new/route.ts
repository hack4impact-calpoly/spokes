import { NewEvent } from "@/components/EmailTemplates/NewEvent";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/auth";
import { getEventsAdminUrl } from "@/lib/url";

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

      const eventData = await req.json();

      const resend = new Resend(process.env.RESEND_API_KEY);
      const { data, error } = await resend.emails.send({
        from: `Spokes Website <${senderEmail}>`,
        to: [adminEmail],
        subject: `${eventData.organization} submitted an event and is pending approval...`,
        react: NewEvent({
          eventName: eventData.eventName,
          description: eventData.description,
          organization: eventData.organization,
          date: new Date(eventData.date).toLocaleDateString(),
          time: eventData.time || "TBD",
          location: eventData.location || "TBD",
          contactName: eventData.contactName,
          contactEmail: eventData.contactEmail,
          adminURL: getEventsAdminUrl(),
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
