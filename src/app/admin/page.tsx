"use client";

import { useState, FormEvent } from "react";

type Passenger = {
  id: number;
  last_name: string;
  confirmation_number: string;
  flight_info: {
    flight_number: string;
    destination: string;
  };
  check_in_status: string;
};

export default function AdminPage() {
  const [secretKey, setSecretKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/passengers", {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });

      if (!response.ok) {
        throw new Error("Invalid secret key or failed to fetch data.");
      }

      const data = await response.json();
      setPassengers(data);
      setIsAuthenticated(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "Checked In" ? "Not yet" : "Checked In";

    // Optimistic UI Update
    const originalPassengers = [...passengers];
    const updatedPassengers = passengers.map((p) =>
      p.id === id ? { ...p, check_in_status: newStatus } : p
    );
    setPassengers(updatedPassengers);

    try {
      const response = await fetch(`/api/admin/passengers/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${secretKey}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        // If the API call fails, revert to the original state
        setPassengers(originalPassengers);
        throw new Error("Failed to update status.");
      }

      // The API call was successful, so the optimistic state is now confirmed.
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      // Revert the UI if there's an error
      setPassengers(originalPassengers);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center text-white">
            Admin Access
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter Secret Key"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {isLoading ? "Authenticating..." : "Login"}
            </button>
            {error && (
              <p className="mt-2 text-sm text-center text-red-400">{error}</p>
            )}
          </form>
        </div>
      </main>
    );
  }

  // ... keep all the code before the final return statement ...

  return (
    <main className="p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-white">
        Passenger Check-In Dashboard
      </h1>

      {/* Card Layout for Mobile (Visible by default, hidden on medium screens and up) */}
      <div className="space-y-4 md:hidden">
        {passengers.map((p) => (
          <div
            key={p.id}
            className="bg-gray-800 p-4 rounded-lg border border-gray-700"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-lg text-white">{p.last_name}</p>
                <p className="text-sm text-gray-400">
                  #{p.confirmation_number}
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  p.check_in_status === "Checked In"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {p.check_in_status}
              </span>
            </div>
            <div className="mt-4 border-t border-gray-700 pt-4 text-sm space-y-2">
              <p>
                <strong className="text-gray-400">Flight:</strong>{" "}
                {p.flight_info.flight_number}
              </p>
              <p>
                <strong className="text-gray-400">Destination:</strong>{" "}
                {p.flight_info.destination}
              </p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => handleStatusUpdate(p.id, p.check_in_status)}
                className="w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Update Status
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Table Layout for Desktop (Hidden by default, visible on medium screens and up) */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-700">
        <table className="min-w-full divide-y-2 divide-gray-700 bg-gray-800 text-sm">
          <thead className="text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-white">Last Name</th>
              <th className="px-4 py-3 font-medium text-white">
                Confirmation #
              </th>
              <th className="px-4 py-3 font-medium text-white">Flight</th>
              <th className="px-4 py-3 font-medium text-white">Destination</th>
              <th className="px-4 py-3 font-medium text-white">Status</th>
              <th className="px-4 py-3 font-medium text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {passengers.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">{p.last_name}</td>
                <td className="px-4 py-3">{p.confirmation_number}</td>
                <td className="px-4 py-3">{p.flight_info.flight_number}</td>
                <td className="px-4 py-3">{p.flight_info.destination}</td>
                <td
                  className={`px-4 py-3 font-medium ${
                    p.check_in_status === "Checked In"
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {p.check_in_status}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleStatusUpdate(p.id, p.check_in_status)}
                    className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
