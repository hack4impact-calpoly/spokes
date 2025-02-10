import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/db";
import User from "@/database/userSchema"; // Import your User model

// Ensure DB connection
connectDB();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id; // Fetch the user ID from params

    // Validate ID
    if (!id) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
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
}
