import connectDB from "@/database/db";
import User from "@/database/userSchema";
import { NextResponse } from "next/server";

// Server-side function to fetch user by Clerk ID
export async function getMongoUser(clerkId: string) {
  try {
    await connectDB();

    const user = await User.findById(clerkId).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user by Clerk ID:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
