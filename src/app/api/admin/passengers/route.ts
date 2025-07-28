import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const expectedToken = `Bearer ${process.env.ADMIN_SECRET_KEY}`;

  if (authHeader !== expectedToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: passengers, error } = await supabase
      .from("passengers")
      .select("*")
      .order("created_at", { ascending: false });
    console.log("🚀 ~ GET ~ data:", passengers);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(passengers);
  } catch (error: unknown) {
    console.error("Admin API Error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
