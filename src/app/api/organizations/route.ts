import { NextResponse } from "next/server";
import connectDB from "@/database/db";
import { withApiAuth } from "@/lib/auth";
import { getExistingOrganizationNames } from "@/lib/organizations";

export const GET = withApiAuth(
  async () => {
    try {
      await connectDB();

      const organizations = await getExistingOrganizationNames();

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
