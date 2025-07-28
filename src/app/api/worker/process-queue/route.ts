import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: job, error: selectError } = await supabase
      .from("job_queue")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(1)
      .single();

    if (selectError) {
      return NextResponse.json({ message: "No pending jobs to process." });
    }

    console.log(`Processing job ${job.id}: ${job.job_type}`);
    console.log(`-> Payload:`, job.payload);
    console.log("-> Gate notification sent (simulation).");

    const { error: updateError } = await supabase
      .from("job_queue")
      .update({ status: "completed" })
      .eq("id", job.id);

    if (updateError) {
      throw new Error(`Failed to update job status: ${updateError.message}`);
    }

    return NextResponse.json({
      message: `Successfully processed job ${job.id}.`,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Worker error:", error.message);
    } else {
      console.error("Worker error:", error);
    }
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
