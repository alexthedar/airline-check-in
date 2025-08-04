"use client";

import { useActionState, startTransition } from "react";
import PassengerTable from "@/components/PassengerTable";
import PassengerCard from "@/components/PassengerCard";
import type { Passenger } from "@/types/passenger-type";
import type { AdminState } from "./page"; // same type used in page.tsx

/* -------------------------------------------------- */
/*  Initial empty state                               */
const initialState: AdminState = {};
/* -------------------------------------------------- */

export default function AdminClient({
  login, // server action for login + fetch
  toggle, // server action for toggling status
}: {
  login: (prev: AdminState, formData: FormData) => Promise<AdminState>;
  toggle: (
    prev: AdminState,
    payload: { id: number; current: string }
  ) => Promise<AdminState>;
}) {
  /* 1️⃣  run login action / fetch passengers */
  const [state, loginAction] = useActionState(login, initialState);

  /* 2️⃣  run toggle action (shares same state object) */
  const [dashState, toggleAction] = useActionState(toggle, state);

  /* choose the freshest state after either action */
  const view = dashState.authenticated ? dashState : state;

  /* ------------  unauthenticated view  ------------ */
  if (!view.authenticated) {
    return (
      <form action={loginAction} className="space-y-4 max-w-sm">
        <input
          type="password"
          name="secret"
          placeholder="Enter Secret Key"
          required
          className="w-full px-3 py-2 border bg-gray-700 text-white rounded-md"
        />
        <button
          type="submit"
          className="w-full py-2 px-4 text-sm font-medium text-white bg-indigo-600 rounded-md"
        >
          {view.error ? "Retry" : "Login"}
        </button>

        {view.error && (
          <p className="text-red-400 text-sm text-center mt-2">{view.error}</p>
        )}
      </form>
    );
  }

  /* helper to invoke the toggle server-action inside a transition */
  const handleToggle = (id: number, current: string) => {
    startTransition(() => toggleAction({ id, current }));
  };

  const passengers: Passenger[] = view.passengers ?? [];

  /* ------------  dashboard view  ------------ */
  return (
    <>
      {/* Mobile – card layout */}
      <div className="space-y-4 md:hidden">
        {passengers.map((p) => (
          <PassengerCard
            key={p.id}
            passenger={p}
            onStatusUpdate={handleToggle}
          />
        ))}
      </div>

      {/* Desktop – table layout */}
      <PassengerTable passengers={passengers} onStatusUpdate={handleToggle} />

      {view.error && (
        <p className="text-red-400 text-sm text-center mt-4">{view.error}</p>
      )}
    </>
  );
}
