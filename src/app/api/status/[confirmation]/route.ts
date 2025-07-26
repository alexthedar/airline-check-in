import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(
  request: Request,
  { params }: { params: { confirmation: string } }
) {
  try {
    const { confirmation: confirmationNumber } = await params;

    if (!confirmationNumber) {
      return NextResponse.json(
        { message: "Confirmation number is required." },
        { status: 400 }
      );
    }

    const { data: passenger, error } = await supabase
      .from("passengers")
      .select("last_name, flight_info, check_in_status")
      .eq("confirmation_number", confirmationNumber)
      .single();

    if (error || !passenger) {
      return NextResponse.json(
        { message: "Could not find a booking with that confirmation number." },
        { status: 404 }
      );
    }

    return NextResponse.json(passenger);
  } catch (error: unknown) {
    console.error("Status API Error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
