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

    const { data: updatedPassenger, error: updateError } = await supabase
      .from("passengers")
      .update({
        check_in_status: "Checked In",
        document_base64: documentBase64,
      })
      .eq("id", passenger.id)
      .select()
      .single();

    if (updateError) throw new Error(updateError.message);

    const { error: jobError } = await supabase.from("job_queue").insert({
      job_type: "GATE_NOTIFICATION",
      payload: { confirmation_number: confirmationNumber },
    });

    if (jobError) {
      console.error("Failed to create background job:", jobError.message);
    }

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
