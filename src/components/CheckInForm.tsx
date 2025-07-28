import React, { FormEvent } from "react";
import TextInput from "./TextInput";

type CheckInFormProps = {
  lastName: string;
  setLastName: (value: string) => void;
  confirmationNumber: string;
  setConfirmationNumber: (value: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
};

const CheckInForm: React.FC<CheckInFormProps> = ({
  lastName,
  setLastName,
  confirmationNumber,
  setConfirmationNumber,
  handleSubmit,
  handleFileChange,
  isLoading,
}) => {
  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="last-name" className="sr-only">
            Last Name
          </label>
          <TextInput
            id="last-name"
            name="lastName"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmation-number" className="sr-only">
            Confirmation Number
          </label>
          <TextInput
            id="confirmation-number"
            name="confirmationNumber"
            type="text"
            placeholder="Confirmation Number"
            value={confirmationNumber}
            onChange={(e) => setConfirmationNumber(e.target.value)}
            required
          />
        </div>
      </div>
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
  );
};

export default CheckInForm;
