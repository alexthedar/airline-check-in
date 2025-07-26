// src/app/api/check-in/route.ts

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lastName, confirmationNumber } = body;

    // Basic validation to make sure we received the data
    if (!lastName || !confirmationNumber) {
      return NextResponse.json(
        { message: "Last name and confirmation number are required." },
        { status: 400 }
      );
    }

    // --- Database logic will go here later ---
    // For now, we'll just log the data and send back a success message.
    console.log("API received:", { lastName, confirmationNumber });

    // This is the successful response the form will receive [cite: 13]
    return NextResponse.json({
      message: `Check-in successful for passenger ${lastName}.`,
      status: "Checked In",
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
