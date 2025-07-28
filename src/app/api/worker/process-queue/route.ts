import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const batchSize = 10;
    let totalProcessed = 0;

    while (true) {
      const { data: jobs, error: selectError } = await supabase
        .from("job_queue")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: true })
        .limit(batchSize);

      if (selectError || !jobs || jobs.length === 0) {
        break;
      }

      jobs.forEach((job) => {
        console.log(`Processing job ${job.id}: ${job.job_type}`);
        console.log(`-> Payload:`, job.payload);
        console.log("-> Gate notification sent (simulation).");
      });

      const jobIds = jobs.map((job) => job.id);
      const { error: updateError } = await supabase
        .from("job_queue")
        .update({ status: "completed" })
        .in("id", jobIds);

      if (updateError) {
        throw new Error(
          `Failed to update job statuses: ${updateError.message}`
        );
      }

      totalProcessed += jobs.length;
    }

    return NextResponse.json({
      message: `Successfully processed ${totalProcessed} job(s).`,
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
