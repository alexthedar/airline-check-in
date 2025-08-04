import { revalidatePath } from "next/cache";
import StatusClient from "./StatusClient";
import { supabase } from "@/lib/supabaseClient";
import type { Passenger } from "@/types/passenger-type";

type StatusData = {
  error?: string;
  passenger?: Passenger;
};
async function getStatus(
  prev: StatusData, // required by useActionState
  formData: FormData
): Promise<StatusData> {
  "use server";
  const confirmation =
    (formData.get("confirmation") as string | null)?.trim() ?? "";
  if (!confirmation) return { error: "Please enter a confirmation number." };
  const { data: passenger, error } = await supabase
    .from("passengers")
    .select(
      "id, last_name, confirmation_number, flight_info, check_in_status, document_base64"
    )
    .eq("confirmation_number", confirmation)
    .single();
  if (error || !passenger) {
    return { error: "Could not find a booking with that confirmation number." };
  }
  revalidatePath("/status");
  return { passenger };
}
export default function StatusPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-24">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-white">
          Check-In Status
        </h1>

        <StatusClient action={getStatus} />
      </div>
    </main>
  );
}
