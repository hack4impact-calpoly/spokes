import { NextResponse } from "next/server";
import connectDB from "@/database/db";
import User from "@/database/userSchema";
import Event from "@/database/eventSchema";
import { withApiAuth } from "@/lib/auth";
import { use } from "react";

export const GET = withApiAuth(
  async () => {
    try {
      await connectDB();

      const userOrgs = await User.distinct("organizationName", {
        organizationName: { $exists: true, $type: "string", $ne: "" },
      });

      const eventOrgs = await Event.distinct("organizationName", {
        organizationName: { $exists: true, $type: "string", $ne: "" },
      });

      const organizations = Array.from(
        new Map(
          [...userOrgs, ...eventOrgs]
            .map((organizationName) => organizationName.trim())
            .filter(Boolean)
            .map((organizationName) => [organizationName.toLowerCase(), organizationName]),
        ).values(),
      ).sort((a, b) => a.localeCompare(b));

      return NextResponse.json({ organizations }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Failed to fetch organizations.", error }, { status: 500 });
    }
  },
  {
    requireAuth: true,
    allowedRoles: ["nonprofit", "spokes_admin"],
  },
);
