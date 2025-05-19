import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/db";
import User from "@/database/userSchema"; // Import your User model

export async function GET(req: NextRequest) {
  try {
    await connectDB(); // Connect to MongoDB
    const id = req.nextUrl.pathname.split("/").pop(); // Fetch the user ID from params

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

export async function PATCH(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    await connectDB();

    // Extract the userId from the route parameters
    const id = params;

    // Extract the newAdminStatus from the request body
    const { isadmin: newAdminStatus } = await req.json(); // Renamed for clarity
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

    user.isadmin = newAdminStatus;
    await user.save();

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    console.error("Error updating user admin status:", error); // Log the error for debugging
    return NextResponse.json({ message: "Failed to update user admin status", error: error.message }, { status: 500 });
  }
}
