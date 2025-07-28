"use client";

import { useState, FormEvent } from "react";
import PassengerTable from "@/components/PassengerTable";
import PassengerCard from "@/components/PassengerCard";
import { Passenger } from "@/types/passenger-type";

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
      const response = await fetch("/api/admin/passengers/", {
        headers: { Authorization: `Bearer ${secretKey}` },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Invalid secret key.");
        } else {
          throw new Error("Failed to fetch data.");
        }
      }

      const data = await response.json();
      setPassengers(data);
      setIsAuthenticated(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleStatusUpdate = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "Checked In" ? "Not yet" : "Checked In";

    const originalPassengers = [...passengers];
    const updatedPassengers = passengers.map((p) =>
      p.id === id ? { ...p, check_in_status: newStatus } : p
    );
    setPassengers(updatedPassengers);

    try {
      await fetch(`/api/admin/passengers/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${secretKey}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
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

  return (
    <main className="p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-white">
        Passenger Check-In Dashboard
      </h1>

      {/* Card Layout for Mobile */}
      <div className="space-y-4 md:hidden">
        {passengers.map((p) => (
          <PassengerCard
            key={p.id}
            passenger={p}
            onStatusUpdate={handleStatusUpdate}
          />
        ))}
      </div>

      {/* Table Layout for Desktop */}
      <PassengerTable
        passengers={passengers}
        onStatusUpdate={handleStatusUpdate}
      />
    </main>
  );
}
