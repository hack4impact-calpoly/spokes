import { NextResponse } from "next/server";
import connectDB from "@/database/db";
import User from "@/database/userSchema";
import { withApiAuth } from "@/lib/auth";

export const GET = withApiAuth(
  async () => {
    try {
      await connectDB();

      const organizationNames = await User.distinct("organizationName", {
        organizationName: { $exists: true, $type: "string", $ne: "" },
      });

      const organizations = Array.from(
        new Map(
          organizationNames
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
