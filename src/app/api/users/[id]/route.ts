import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/db";
import User from "@/database/userSchema"; // Import your User model
import { withApiAuth } from "@/lib/auth";

export const GET = withApiAuth(
  async (req: NextRequest, { auth }) => {
    try {
      await connectDB(); // Connect to MongoDB
      const id = req.nextUrl.pathname.split("/").pop(); // Fetch the user ID from params

      // Validate ID
      if (!id) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
      }

      // Only allow users to access their own data
      if (auth.role === "nonprofit" && auth.userId !== id) {
        return NextResponse.json({ error: "Insufficient permissions to view this user" }, { status: 403 });
      }

      // Find user by ID
      const user = await User.findById(id);

      // If user not found, return 404
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      return NextResponse.json(user, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Error fetching user", error }, { status: 500 });
    }
  },
  {
    requireAuth: true,
    allowedRoles: ["nonprofit", "spokes_admin"],
  },
);
