"use client";
import { useState, FormEvent, useRef, useEffect, useCallback } from "react";
import { Passenger } from "@/types/passenger-type";
import PassengerDetails from "@/components/PassengerDetails";

export default function StatusPage() {
  const [confirmationNumber, setConfirmationNumber] = useState("");
  const [passengerInfo, setPassengerInfo] = useState<Passenger | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleClearInfo = useCallback(() => {
    setPassengerInfo(null);
    setConfirmationNumber("");
  }, []);

  useEffect(() => {
    if (passengerInfo) {
      const timer = setTimeout(() => {
        handleClearInfo();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [handleClearInfo, passengerInfo]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!confirmationNumber) {
      setError("Please enter a confirmation number.");
      return;
    }
    setIsLoading(true);
    setError("");
    setPassengerInfo(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response = await fetch(`/api/status/${confirmationNumber}`, {
        signal: abortController.signal,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch status.");
      }
      setPassengerInfo(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-24">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-white">
          Check-In Status
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="confirmation-number" className="sr-only">
              Confirmation Number
            </label>
            <input
              id="confirmation-number"
              name="confirmationNumber"
              type="text"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Confirmation Number"
              value={confirmationNumber}
              onChange={(e) => {
                setConfirmationNumber(e.target.value);
              }}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {isLoading ? "Checking..." : "Check Status"}
          </button>
        </form>

        {error && (
          <p
            className="mt-4 text-sm text-center text-red-400"
            aria-live="assertive"
          >
            {error}
          </p>
        )}

        {passengerInfo && (
          <div className="mt-6 p-4 border border-gray-600 rounded-lg text-sm">
            <h2 className="text-lg font-semibold text-white mb-2">
              Flight Details
            </h2>
            <PassengerDetails passengerInfo={passengerInfo} />
          </div>
        )}
      </div>
    </main>
  );
}
