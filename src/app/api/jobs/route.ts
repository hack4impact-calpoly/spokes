import connectDB from "@/database/db";
import { NextRequest, NextResponse } from "next/server";
import jobSchema from "@/database/jobSchema";

export async function DELETE(_request: NextRequest, { params }: { params: { _id: string } }) {
  try {
    await connectDB();
    const id = params._id;

    //Requires id
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    //Deleting based on _id
    const result = await jobSchema.findByIdAndDelete(id);

    //if id not found
    if (!result) {
      return NextResponse.json({ error: "ID not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred while deleting" }, { status: 500 });
  }
}
