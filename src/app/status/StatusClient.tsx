"use client";

import { Suspense, useActionState } from "react";
import PassengerDetails from "@/components/PassengerDetails";
import type { Passenger } from "@/types/passenger-type";

/* matches the object page.tsx returns */
type StatusData = {
  error?: string;
  passenger?: Passenger;
};

const initialState: StatusData = {};

export default function StatusClient({
  action,
}: {
  action: (prev: StatusData, fd: FormData) => Promise<StatusData>;
}) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <>
      <form action={formAction} className="space-y-4">
        <input
          id="confirmation-number"
          name="confirmation"
          type="text"
          required
          placeholder="Confirmation Number"
          className="appearance-none relative block w-full px-3 py-2 border
                     border-gray-600 bg-gray-700 placeholder-gray-400 text-white
                     rounded-md sm:text-sm"
        />
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 text-sm font-medium
                     rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Check Status
        </button>
      </form>

      {state.error && (
        <p className="mt-4 text-sm text-center text-red-400">{state.error}</p>
      )}

      {state.passenger && (
        <Suspense fallback={<h3>Loading...</h3>}>
          <div className="mt-6 p-4 border border-gray-600 rounded-lg text-sm">
            <h2 className="text-lg font-semibold text-white mb-2">
              Flight Details
            </h2>
            <PassengerDetails passengerInfo={state.passenger} />
          </div>
        </Suspense>
      )}
    </>
  );
}
