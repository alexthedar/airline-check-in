import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  // 1. Check for the Authorization header
  const authHeader = request.headers.get("Authorization");
  const expectedToken = `Bearer ${process.env.ADMIN_SECRET_KEY}`;

  if (authHeader !== expectedToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // 2. If authorized, fetch all passengers
  try {
    const { data: passengers, error } = await supabase
      .from("passengers")
      .select("*")
      .order("created_at", { ascending: false }); // Show newest first

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(passengers);
  } catch (error: any) {
    console.error("Admin API Error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
