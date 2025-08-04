import { revalidatePath } from "next/cache";
import CheckInClient from "./CheckInClient";
import { supabase } from "@/lib/supabaseClient";
import type { Passenger } from "@/types/passenger-type";

/* ---- shape returned to the client component ---- */
type ActionData = {
  message?: string;
  error?: string;
  passenger?: Passenger;
};
/* ------------------------------------------------ */

async function checkIn(
  _prevState: ActionData, // required by useFormState, but not used
  formData: FormData
): Promise<ActionData> {
  "use server";

  const lastName = (formData.get("lastName") as string | null)?.trim() ?? "";
  const confirmationNumber =
    (formData.get("confirmationNumber") as string | null)?.trim() ?? "";
  const file = formData.get("document") as File | null;

  if (!lastName || !confirmationNumber) {
    return { error: "Required fields missing." };
  }

  /* optionally convert the uploaded file to base-64 */
  let documentBase64: string | null = null;
  if (file && file.size) {
    documentBase64 = Buffer.from(await file.arrayBuffer()).toString("base64");
  }

  /* look-up passenger */
  const { data: passenger, error: selectErr } = await supabase
    .from("passengers")
    .select(
      "id, last_name, confirmation_number, flight_info, check_in_status, document_base64"
    )
    .eq("confirmation_number", confirmationNumber)
    .ilike("last_name", lastName)
    .single();

  if (selectErr || !passenger)
    return { error: "Invalid last-name / confirmation #." };

  if (passenger.check_in_status === "Checked In") {
    return { message: "You are already checked-in.", passenger };
  }

  /* update status + save document */
  const { data: updatedPassenger, error: updateErr } = await supabase
    .from("passengers")
    .update({ check_in_status: "Checked In", document_base64: documentBase64 })
    .eq("id", passenger.id)
    .select()
    .single();

  if (updateErr) return { error: updateErr.message };

  revalidatePath("/"); // make sure page revalidates for any SSR usage
  return { message: "Successfully checked-in.", passenger: updatedPassenger };
}

/* ----------- page shell (server component) ----------- */
export default function CheckInPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-24">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-white">
          Airline Check-In
        </h1>

        {/* interactive island that renders the form + feedback */}
        <CheckInClient action={checkIn} />
      </div>
    </main>
  );
}
