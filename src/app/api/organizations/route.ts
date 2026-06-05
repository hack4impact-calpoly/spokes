import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/db";
import { withApiAuth } from "@/lib/auth";
import { deleteOrganizationData, getExistingOrganizationNames } from "@/lib/organizations";

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

export const DELETE = withApiAuth(
  async (req: NextRequest) => {
    try {
      await connectDB();

      const body = await req.json().catch(() => null);
      const organizationName = typeof body?.organizationName === "string" ? body.organizationName.trim() : "";

      if (!organizationName) {
        return NextResponse.json({ message: "Organization name is required" }, { status: 400 });
      }

      const result = await deleteOrganizationData(organizationName);

      return NextResponse.json(
        {
          message: "Organization data deleted successfully",
          organizationName,
          ...result,
        },
        { status: 200 },
      );
    } catch (error: any) {
      console.error("Failed to delete organization data:", error);

      return NextResponse.json(
        {
          message: "Failed to delete organization data.",
          error: error?.message ?? "Unknown organization deletion error",
        },
        { status: 500 },
      );
    }
  },
  {
    requireAuth: true,
    allowedRoles: ["spokes_admin"],
  },
);
