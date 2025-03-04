import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import connectDB from "@/database/db";
import User from "@/database/userSchema"; // Import your User model

// Connect to the database before handling requests

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "No user id." }, { status: 401 });
    }

    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    if (!clerkUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { firstName, lastName } = clerkUser;
    const email = clerkUser.primaryEmailAddress?.emailAddress || clerkUser.emailAddresses?.[0]?.emailAddress;
    if (!email) {
      return NextResponse.json({ message: "No email" }, { status: 404 });
    }

    const name = `${firstName ?? ""} ${lastName ?? ""}`.trim();

    // Check if user already exists
    const existingUser = await User.findById(userId);
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Create new user
    const newUser = new User({
      _id: userId,
      name,
      email: email,
      isadmin: false,
      postedJobs: [],
    });
    await newUser.save();
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to connect user to database.", error }, { status: 500 });
  }
}
