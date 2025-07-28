import React from "react";
import { Passenger } from "@/types/passenger-type";

type PassengerTableProps = {
  passengers: Passenger[];
  onStatusUpdate: (id: number, currentStatus: string) => void;
};

const PassengerTableRow = React.memo(
  ({
    passenger: p,
    onStatusUpdate,
  }: {
    passenger: Passenger;
    onStatusUpdate: (id: number, currentStatus: string) => void;
  }) => {
    return (
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
          {p.document_url ? (
            <a
              href={p.document_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:underline"
            >
              View
            </a>
          ) : (
            <span className="text-gray-500">None</span>
          )}
        </td>
        <td className="px-4 py-3">
          <button
            onClick={() => onStatusUpdate(p.id, p.check_in_status)}
            className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Update
          </button>
        </td>
      </tr>
    );
  }
);

PassengerTableRow.displayName = "PassengerTableRow";

export default function PassengerTable({
  passengers,
  onStatusUpdate,
}: PassengerTableProps) {
  return (
    <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-700">
      <table className="min-w-full divide-y-2 divide-gray-700 bg-gray-800 text-sm">
        <thead className="text-left">
          <tr>
            <th className="px-4 py-3 font-medium text-white">Last Name</th>
            <th className="px-4 py-3 font-medium text-white">Confirmation #</th>
            <th className="px-4 py-3 font-medium text-white">Flight</th>
            <th className="px-4 py-3 font-medium text-white">Destination</th>
            <th className="px-4 py-3 font-medium text-white">Status</th>
            <th className="px-4 py-3 font-medium text-white">Document</th>
            <th className="px-4 py-3 font-medium text-white">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {passengers.map((p) => (
            <PassengerTableRow
              key={p.id}
              passenger={p}
              onStatusUpdate={onStatusUpdate}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
