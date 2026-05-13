import connectDB from "@/database/db";
import Event from "@/database/eventSchema";
import User from "@/database/userSchema";
import { withApiAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const requiredFields = [
  "eventName",
  "date",
  "time",
  "location",
  "locationType",
  "category",
  "description",
  "organization",
];

function validateEventPayload(payload: Record<string, unknown>) {
  const missingFields = requiredFields.filter((field) => {
    const value = payload[field];
    return typeof value !== "string" || value.trim().length === 0;
  });

  if (missingFields.length > 0) {
    return `Missing required fields: ${missingFields.join(", ")}`;
  }

  if (Number.isNaN(new Date(payload.date as string).getTime())) {
    return "date must be a valid date string.";
  }

  if (payload.locationType !== "remote" && payload.locationType !== "in-person") {
    return "locationType must be either remote or in-person.";
  }

  return null;
}

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

      const newEvent = await Event.create({
        ...eventData,
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
