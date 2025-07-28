import { Passenger } from "@/types/passenger-type";
import React from "react";

type PassengerCardProps = {
  passenger: Passenger;
  onStatusUpdate: (id: number, currentStatus: string) => void;
};

const PassengerCard = React.memo(
  ({ passenger: p, onStatusUpdate }: PassengerCardProps) => {
    return (
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-bold text-lg text-white">{p.last_name}</p>
            <p className="text-sm text-gray-400">#{p.confirmation_number}</p>
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
          {p.document_url && (
            <p>
              <strong className="text-gray-400">Document:</strong>{" "}
              <a
                href={p.document_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline"
              >
                View File
              </a>
            </p>
          )}
        </div>
        <div className="mt-4">
          <button
            onClick={() => onStatusUpdate(p.id, p.check_in_status)}
            className="w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Update Status
          </button>
        </div>
      </div>
    );
  }
);

PassengerCard.displayName = "PassengerCard";

export default PassengerCard;
