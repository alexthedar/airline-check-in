import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  // 1. Authenticate the request
  const authHeader = request.headers.get("Authorization");
  const expectedToken = `Bearer ${process.env.ADMIN_SECRET_KEY}`;

  if (authHeader !== expectedToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // 2. Update the passenger status
  try {
    const { id: passengerId } = await params;

    const { status: newStatus } = await request.json();

    if (!newStatus) {
      return NextResponse.json(
        { message: "New status is required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("passengers")
      .update({ check_in_status: newStatus })
      .eq("id", passengerId)
      .select() // Important: .select() returns the updated row
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Admin Update API Error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
