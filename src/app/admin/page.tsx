import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabaseClient";
import type { Passenger } from "@/types/passenger-type";
import AdminClient from "./AdminClient";

/* ------------ shared return type ------------ */
export type AdminState = {
  error?: string;
  passengers?: Passenger[];
  authenticated?: boolean;
};
/* -------------------------------------------- */

/* ❶ server action: login & fetch passengers */
export async function loginAction(
  _prev: AdminState,
  formData: FormData
): Promise<AdminState> {
  "use server";

  const secret = (formData.get("secret") as string | null)?.trim() ?? "";
  if (secret !== process.env.ADMIN_SECRET_KEY) {
    return { error: "Invalid secret key." };
  }

  const { data: passengers, error } = await supabase
    .from("passengers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { error: error.message };

  return { passengers, authenticated: true };
}

/* ❷ server action: toggle status */
export async function toggleStatusAction(
  prev: AdminState,
  payload: { id: number; current: string }
): Promise<AdminState> {
  "use server";

  const { id, current } = payload;
  const newStatus = current === "Checked In" ? "Not yet" : "Checked In";

  /* update the row */
  const { error } = await supabase
    .from("passengers")
    .update({ check_in_status: newStatus })
    .eq("id", id);

  if (error) return { ...prev, error: error.message };

  /* ensure we have a full, updated list */
  let passengers: Passenger[];

  if (prev.passengers) {
    passengers = prev.passengers.map((p) =>
      p.id === id ? { ...p, check_in_status: newStatus } : p
    );
  } else {
    // second hook’s initial state was empty—fetch afresh
    const { data = [] } = await supabase
      .from("passengers")
      .select("*")
      .order("created_at", { ascending: false });
    passengers = (data ?? []) as Passenger[];
  }

  return { passengers, authenticated: true };
}

export default function AdminPage() {
  return (
    <main className="p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-white">
        Passenger Check-In Dashboard
      </h1>

      {/* client island with both actions */}
      <AdminClient login={loginAction} toggle={toggleStatusAction} />
    </main>
  );
}
