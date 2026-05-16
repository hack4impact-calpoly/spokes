import connectDB from "@/database/db";
import Event from "@/database/eventSchema";
import User from "@/database/userSchema";
import { withApiAuth } from "@/lib/auth";
import { sanitizeEventPayload, validateEventPayload } from "@/lib/events";
import { NextRequest, NextResponse } from "next/server";

export const GET = withApiAuth(
  async () => {
    try {
      await connectDB();

      const events = await Event.find({}).sort({ date: 1 });
      return NextResponse.json(events, { status: 200 });
    } catch (error: any) {
      console.error("Failed to fetch events:", error);

      return NextResponse.json(
        { message: "Failed to fetch events", error: error?.message ?? "Unknown events error" },
        { status: 500 },
      );
    }
  },
  { requireAuth: false },
);

export const POST = withApiAuth(
  async (req: NextRequest, { auth }) => {
    try {
      await connectDB();

      const eventData = await req.json();
      if (!eventData || typeof eventData !== "object") {
        return NextResponse.json({ message: "Invalid event input" }, { status: 400 });
      }

      const validationError = validateEventPayload(eventData);
      if (validationError) {
        return NextResponse.json({ message: validationError }, { status: 400 });
      }

      const mongoUser = await User.findById(auth.userId);
      if (!mongoUser) {
        return NextResponse.json({ message: "User not found in DB" }, { status: 404 });
      }

      if (!mongoUser.organizationName) {
        return NextResponse.json({ message: "User organization is required to create an event" }, { status: 400 });
      }

      const sanitizedEventData = sanitizeEventPayload(eventData);

      const newEvent = await Event.create({
        ...sanitizedEventData,
        organization: mongoUser.organizationName,
        createdByUserId: auth.userId,
      });

      return NextResponse.json({ message: "Event created successfully", event: newEvent }, { status: 201 });
    } catch (error: any) {
      console.error("Could not create event:", error);

      return NextResponse.json(
        { message: "Could not create event", error: error?.message ?? "Unknown event creation error" },
        { status: 500 },
      );
    }
  },
  {
    requireAuth: true,
    allowedRoles: ["nonprofit", "spokes_admin"],
  },
);
