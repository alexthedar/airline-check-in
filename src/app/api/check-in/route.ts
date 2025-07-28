/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lastName, confirmationNumber, documentBase64 } = body;

    if (!lastName || !confirmationNumber) {
      return NextResponse.json(
        { message: "Required fields missing." },
        { status: 400 }
      );
    }

    // Find the passenger
    const { data: passenger, error: selectError } = await supabase
      .from("passengers")
      .select("id, check_in_status")
      .eq("confirmation_number", confirmationNumber)
      .ilike("last_name", lastName)
      .single();

    if (selectError || !passenger) {
      return NextResponse.json(
        { message: "Invalid credentials." },
        { status: 404 }
      );
    }

    // Update passenger status and add the document string
    const { data: updatedPassenger, error: updateError } = await supabase
      .from("passengers")
      .update({
        check_in_status: "Checked In",
        document_base64: documentBase64,
      })
      .eq("id", passenger.id)
      .select() // Add this to return the updated row
      .single(); // Add this because we expect one record back

    if (updateError) throw new Error(updateError.message);

    // --- Add this block to create a new job ---
    const { error: jobError } = await supabase.from("job_queue").insert({
      job_type: "GATE_NOTIFICATION",
      payload: { confirmation_number: confirmationNumber },
    });

    if (jobError) {
      // Log this error but don't fail the whole check-in process
      console.error("Failed to create background job:", jobError.message);
    }
    // ------------------------------------------

    return NextResponse.json({
      message: `Successfully checked in.`,
      passenger: updatedPassenger,
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
