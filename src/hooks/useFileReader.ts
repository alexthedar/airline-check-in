import { useState } from "react";

export function useFileReader() {
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileError, setFileError] = useState("");

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setFileBase64(reader.result as string);
      setFileError("");
    };
    reader.onerror = (err) => {
      setFileError("Failed to read file.");
      console.error(err);
    };
  };

  return { fileBase64, fileError, readFile };
}
