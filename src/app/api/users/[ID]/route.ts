import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/db";
import User from "@/database/userSchema"; // Import your User model

// Connect to the database before handling requests
connectDB();

export async function GET() {
  try {
    const users = await User.find();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching users", error }, { status: 500 });
  }
}
