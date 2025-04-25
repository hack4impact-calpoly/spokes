import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import connectDB from "@/database/db";
import User from "@/database/userSchema"; // Import your User model
import { updateUserMetadata } from "@/lib/clerk";
// Connect to the database before handling requests

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { userId, firstName, lastName, email, paidMember } = await req.json();
    if (!userId || !email) {
      return NextResponse.json({ message: "Missing user data" }, { status: 400 });
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
      paidMember: paidMember,
    });
    await newUser.save();

    // Update Clerk user metadata
    await updateUserMetadata(userId, {
      onboardingComplete: true,
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to connect user to database.", error }, { status: 500 });
  }
}
