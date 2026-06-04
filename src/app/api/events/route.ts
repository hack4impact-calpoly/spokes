import connectDB from "@/database/db";
import Event from "@/database/eventSchema";
import User from "@/database/userSchema";
import { withApiAuth } from "@/lib/auth";
import { sanitizeEventPayload, validateEventPayload } from "@/lib/events";
import { resolveOrganizationName } from "@/lib/organizations";
import { NextRequest, NextResponse } from "next/server";

export const GET = withApiAuth(
  async (req: NextRequest) => {
    try {
      await connectDB();

      const { searchParams } = new URL(req.url);
      const isAdminRequest = searchParams.get("admin") === "true";
      const statusFilter = searchParams.get("eventStatus");

      // Build the filter object
      const filter: any = {};

      if (statusFilter) {
        filter.eventStatus = statusFilter;
      } else if (!isAdminRequest) {
        // Non-admin requests only see approved events
        filter.eventStatus = "approved";
      }

      const sort: any = { date: 1 };

      if (statusFilter === "approved") {
        sort.approvedDate = -1;
      } else {
        sort.createdAt = -1;
      }

      const events = await Event.find(filter).sort(sort);
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

      const requestedOrganizationName = typeof eventData.organization === "string" ? eventData.organization.trim() : "";
      const userOrganizationName =
        typeof mongoUser.organizationName === "string" ? mongoUser.organizationName.trim() : "";
      const organization =
        auth.role === "spokes_admin" && requestedOrganizationName
          ? await resolveOrganizationName(requestedOrganizationName)
          : userOrganizationName;

      if (!organization) {
        return NextResponse.json({ message: "User organization is required to create an event" }, { status: 400 });
      }

      const sanitizedEventData = sanitizeEventPayload(eventData);
      const eventSignature = {
        createdByUserId: auth.userId,
        organization,
        date: new Date(sanitizedEventData.date),
        eventName: sanitizedEventData.eventName,
        time: sanitizedEventData.time,
        location: sanitizedEventData.location,
      };

      const newEvent = await Event.findOneAndUpdate(
        eventSignature,
        {
          $setOnInsert: {
            ...sanitizedEventData,
            organization,
            createdByUserId: auth.userId,
            eventStatus: "pending",
            contactName: mongoUser.firstName || "",
            contactEmail: mongoUser.email || "",
          },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      );

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
