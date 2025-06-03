import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/db";
import User from "@/database/userSchema";
import { updateUserMetadata } from "@/lib/clerk";
import { withApiAuth } from "@/lib/auth";

// Connect to the database before handling requests

export const POST = withApiAuth(
  async (req: NextRequest) => {
    try {
      await connectDB();

      const { userId, firstName, lastName, email, paidMember, organizationName } = await req.json();
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
        postedJobs: [],
        paidMember: paidMember,
        organizationName: organizationName,
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
  },
  {
    requireAuth: true,
    // Allow any authenticated user to create their profile
  },
);

export const GET = withApiAuth(
  async () => {
    try {
      await connectDB();

      const users = await User.find({});
      return NextResponse.json(users, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Failed to fetch users from database.", error }, { status: 500 });
    }
  },
  {
    requireAuth: true,
    allowedRoles: ["spokes_admin"],
  },
);
