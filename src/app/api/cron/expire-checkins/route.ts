import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// This tells Vercel to cache the response for 1 day,
// preventing it from being run too often by accident.
export const revalidate = 86400;

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = new Date().toISOString().slice(0, 10); // Format as YYYY-MM-DD

    // Find passengers whose travel date is in the past
    // and whose status is not already expired.
    const { data: passengersToExpire, error: selectError } = await supabase
      .from("passengers")
      .select("id")
      .lt("travel_date", today)
      .neq("check_in_status", "Expired");

    if (selectError) {
      throw new Error(`Failed to query for passengers: ${selectError.message}`);
    }

    if (passengersToExpire.length === 0) {
      return NextResponse.json({ message: "No check-ins to expire." });
    }

    const idsToExpire = passengersToExpire.map((p) => p.id);

    // Update the status of the found passengers to "Expired"
    const { error: updateError } = await supabase
      .from("passengers")
      .update({ check_in_status: "Expired" })
      .in("id", idsToExpire);

    if (updateError) {
      throw new Error(`Failed to update statuses: ${updateError.message}`);
    }

    return NextResponse.json({
      message: `Successfully expired ${passengersToExpire.length} check-in(s).`,
    });
  } catch (error: unknown) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
