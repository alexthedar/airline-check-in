"use client";

import PassengerDetails from "@/components/PassengerDetails";
import type { Passenger } from "@/types/passenger-type";
import { Suspense, useActionState } from "react";

/* ------------- the shape that checkIn returns ------------- */
type ActionData = {
  message?: string;
  error?: string;
  passenger?: Passenger;
};
/* ---------------------------------------------------------- */

const initialState: ActionData = {};

export default function CheckInClient({
  action, // <- we will pass the server function in
}: {
  action: (prev: ActionData, fd: FormData) => Promise<ActionData>;
}) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <>
      {/* ---------- the form ---------- */}
      <form action={formAction} className="mt-8 space-y-6">
        <div className="-space-y-px rounded-md shadow-sm">
          {/* last name */}
          <div>
            <label htmlFor="last-name" className="sr-only">
              Last Name
            </label>
            <input
              id="last-name"
              name="lastName"
              type="text"
              required
              className="appearance-none relative block w-full px-3 py-2 border
                         border-gray-600 bg-gray-700 placeholder-white text-white
                         rounded-t-md sm:text-sm"
              placeholder="Last Name"
            />
          </div>

          {/* confirmation number */}
          <div>
            <label htmlFor="confirmation-number" className="sr-only">
              Confirmation Number
            </label>
            <input
              id="confirmation-number"
              name="confirmationNumber"
              type="text"
              required
              className="appearance-none relative block w-full px-3 py-2 border
                         border-gray-600 bg-gray-700 placeholder-white text-white
                         sm:text-sm"
              placeholder="Confirmation Number"
            />
          </div>
        </div>

        {/* file upload */}
        <div>
          <label
            htmlFor="document-upload"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Upload Document (optional)
          </label>
          <input
            id="document-upload"
            name="document"
            type="file"
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2
                       file:px-4 file:rounded-md file:border-0 file:text-sm
                       file:font-semibold file:bg-indigo-500 file:text-white
                       hover:file:bg-indigo-600"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 text-sm font-medium text-white
                     bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Check In
        </button>
      </form>

      {/* ---------- feedback ---------- */}
      {state.message && (
        <p className="mt-2 text-sm text-center text-green-400">
          {state.message}
        </p>
      )}
      {state.error && (
        <p className="mt-2 text-sm text-center text-red-400">{state.error}</p>
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
