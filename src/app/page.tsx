"use client";

import { useCheckIn } from "@/hooks/useCheckIn";
import { useFileReader } from "@/hooks/useFileReader";
import { useState, FormEvent, useRef, useEffect } from "react";
import PassengerDetails from "@/components/PassengerDetails";
import { Passenger } from "@/types/passenger-type";
import CheckInForm from "@/components/CheckInForm";

export default function CheckInPage() {
  const [lastName, setLastName] = useState("");
  const [confirmationNumber, setConfirmationNumber] = useState("");
  const { checkIn, isLoading, message, error, setMessage } = useCheckIn();
  const { fileBase64, fileError, readFile } = useFileReader();
  const [passengerInfo, setPassengerInfo] = useState<Passenger | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (passengerInfo) {
      const timer = setTimeout(() => {
        handleClearInfo();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [passengerInfo, setMessage]);

  const handleClearInfo = () => {
    setPassengerInfo(null);
    setMessage("");
    setLastName("");
    setConfirmationNumber("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const passengerData = await checkIn(
      lastName,
      confirmationNumber,
      fileBase64,
      abortController.signal
    );

    if (passengerData) {
      setPassengerInfo(passengerData);
    } else {
      setLastName("");
      setConfirmationNumber("");
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear the file input
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      readFile(file);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-24">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-white">
          Airline Check-In
        </h1>
        <CheckInForm
          lastName={lastName}
          setLastName={setLastName}
          confirmationNumber={confirmationNumber}
          setConfirmationNumber={setConfirmationNumber}
          handleSubmit={handleSubmit}
          handleFileChange={handleFileChange}
          isLoading={isLoading}
          fileInputRef={fileInputRef}
        />
        {message && (
          <p className="mt-2 text-sm text-center text-green-400">{message}</p>
        )}
        {passengerInfo && (
          <div
            className={`mt-6 p-4 border border-gray-600 rounded-lg text-sm fade-out ${
              !passengerInfo ? "hidden" : ""
            }`}
          >
            <h2 className="text-lg font-semibold text-white mb-2">
              Flight Details
            </h2>
            <PassengerDetails passengerInfo={passengerInfo} />
          </div>
        )}
        {(error || fileError) && (
          <p className="mt-2 text-sm text-center text-red-400">{error}</p>
        )}
      </div>
    </main>
  );
}
