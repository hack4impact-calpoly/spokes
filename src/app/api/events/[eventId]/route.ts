import connectDB from "@/database/db";
import Event from "@/database/eventSchema";
import { withApiAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

function getEventId(req: NextRequest) {
  return req.nextUrl.pathname.split("/").pop();
}

export const GET = withApiAuth(
  async (req: NextRequest) => {
    try {
      await connectDB();

      const eventId = getEventId(req);
      const event = await Event.findById(eventId);

      if (!event) {
        return NextResponse.json({ message: "Event not found" }, { status: 404 });
      }

      return NextResponse.json(event, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Error fetching event", error }, { status: 500 });
    }
  },
  { requireAuth: false },
);

export const PUT = withApiAuth(
  async (req: NextRequest, { auth }) => {
    try {
      await connectDB();

      const eventId = getEventId(req);
      const eventData = await req.json();

      const existingEvent = await Event.findById(eventId);
      if (!existingEvent) {
        return NextResponse.json({ message: "Event not found" }, { status: 404 });
      }

      if (auth.role === "nonprofit" && existingEvent.createdByUserId !== auth.userId) {
        return NextResponse.json({ message: "Insufficient permissions" }, { status: 403 });
      }

      const updatedEvent = await Event.findByIdAndUpdate(eventId, eventData, { new: true });
      return NextResponse.json({ message: "Event updated successfully", event: updatedEvent });
    } catch (error) {
      return NextResponse.json({ message: "Error updating event", error }, { status: 500 });
    }
  },
  {
    requireAuth: true,
    allowedRoles: ["nonprofit", "spokes_admin"],
  },
);

export const DELETE = withApiAuth(
  async (req: NextRequest, { auth }) => {
    try {
      await connectDB();

      const eventId = getEventId(req);
      const event = await Event.findById(eventId);

      if (!event) {
        return NextResponse.json({ message: "Event not found" }, { status: 404 });
      }

      if (auth.role === "nonprofit" && event.createdByUserId !== auth.userId) {
        return NextResponse.json({ message: "Insufficient permissions" }, { status: 403 });
      }

      await Event.findByIdAndDelete(eventId);
      return NextResponse.json({ message: "Event deleted successfully" }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Error deleting event", error }, { status: 500 });
    }
  },
  {
    requireAuth: true,
    allowedRoles: ["nonprofit", "spokes_admin"],
  },
);
