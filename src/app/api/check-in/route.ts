import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lastName, confirmationNumber } = body;

    if (!lastName || !confirmationNumber) {
      return NextResponse.json(
        { message: "Last name and confirmation number are required." },
        { status: 400 }
      );
    }

    // Find the passenger in the database
    const { data: passenger, error: selectError } = await supabase
      .from("passengers")
      .select("*")
      .eq("confirmation_number", confirmationNumber)
      .ilike("last_name", lastName) // ilike is case-insensitive
      .single(); // Expects only one result

    if (selectError || !passenger) {
      return NextResponse.json(
        { message: "Invalid confirmation number or last name." },
        { status: 404 } // 404 Not Found is more appropriate
      );
    }

    // Check if passenger is already checked in
    if (passenger.check_in_status === "Checked In") {
      return NextResponse.json(
        { message: "You have already checked in for this flight." },
        { status: 409 } // 409 Conflict
      );
    }

    // Update the passenger's status to "Checked In"
    const { error: updateError } = await supabase
      .from("passengers")
      .update({ check_in_status: "Checked In" })
      .eq("id", passenger.id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return NextResponse.json({
      message: `Successfully checked in for passenger ${passenger.last_name}.`,
      status: "Checked In",
    });
  } catch (error: unknown) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
