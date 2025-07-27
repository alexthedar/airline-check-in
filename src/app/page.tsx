/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, FormEvent } from "react";

export default function CheckInPage() {
  const [lastName, setLastName] = useState("");
  const [confirmationNumber, setConfirmationNumber] = useState("");
  // State will now hold the base64 string of the file
  const [documentBase64, setDocumentBase64] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setDocumentBase64(reader.result as string);
    };
    reader.onerror = (err) => {
      setError("Failed to read file.");
      console.error(err);
    };
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lastName,
          confirmationNumber,
          documentBase64, // Send the base64 string
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setMessage(data.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-24">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-white">
          Airline Check-In
        </h1>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Last Name and Confirmation Inputs (no changes here) */}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="last-name" className="sr-only">
                Last Name
              </label>
              <input
                id="last-name"
                name="lastName"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirmation-number" className="sr-only">
                Confirmation Number
              </label>
              <input
                id="confirmation-number"
                name="confirmationNumber"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Confirmation Number"
                value={confirmationNumber}
                onChange={(e) => setConfirmationNumber(e.target.value)}
              />
            </div>
          </div>

          {/* New File Input */}
          <div>
            <label
              htmlFor="document-upload"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Upload Document (e.g., Passport)
            </label>
            <input
              id="document-upload"
              name="document"
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {isLoading ? "Checking In..." : "Check In"}
            </button>
          </div>
        </form>
        {message && (
          <p className="mt-2 text-sm text-center text-green-400">{message}</p>
        )}
        {error && (
          <p className="mt-2 text-sm text-center text-red-400">{error}</p>
        )}
      </div>
    </main>
  );
}
