import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/db";
import Event from "@/database/eventSchema";
import { withApiAuth } from "@/lib/auth";

export const GET = withApiAuth(
  async (req: NextRequest, { auth }) => {
    try {
      await connectDB();

      const url = new URL(req.url);
      const userId = url.searchParams.get("userId");

      if (!userId) {
        return NextResponse.json({ error: "User ID missing" }, { status: 400 });
      }

      // Only allow users to access their own events
      if (auth.role === "nonprofit" && auth.userId !== userId) {
        return NextResponse.json({ error: "Insufficient permissions to view these events" }, { status: 403 });
      }

      // Query directly by createdByUserId — works for all events regardless of
      // whether they were saved to postedEvents (handles legacy + new events)
      const events = await Event.find({ createdByUserId: userId }).sort({ createdAt: -1 }).lean();

      return NextResponse.json(events);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  },
  {
    requireAuth: true,
    allowedRoles: ["nonprofit", "spokes_admin"],
  },
);
