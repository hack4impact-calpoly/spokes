import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/db";
import User from "@/database/userSchema"; // Import your User model

// Connect to the database before handling requests

export async function POST(req: NextRequest) {
  try {
    console.log("jhd");
    connectDB();
    const { name, email, isadmin } = await req.json();

    // Validate request body
    if (!name || !email || isadmin === undefined) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Create new user
    const newUser = await new User({ name, email, isadmin }).save();
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to create user", error }, { status: 500 });
  }
}

//test

//   {
//     "name": "test",
//     "email": "test@gmail.com",
//     "isadmin": true
//   }
