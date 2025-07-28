import { useState } from "react";

export function useCheckIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const checkIn = async (
    lastName: string,
    confirmationNumber: string,
    documentBase64: string | null,
    signal: AbortSignal | undefined
  ) => {
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
          documentBase64,
        }),
        signal,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setMessage("This passenger is already checked in.");
        } else {
          throw new Error(data.message);
        }
      } else {
        setMessage(data.message);
        return data.passenger;
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { checkIn, isLoading, message, error, setMessage };
}
