import React from "react";
import { Passenger } from "@/types/passenger-type"; // Assuming Passenger type is used

type PassengerDetailsProps = {
  passengerInfo: Passenger;
};

const PassengerDetails: React.FC<PassengerDetailsProps> = ({
  passengerInfo,
}) => {
  return (
    <>
      <p>
        <strong className="text-gray-400">Passenger:</strong>{" "}
        {passengerInfo.last_name}
      </p>
      <p>
        <strong className="text-gray-400">Flight:</strong>{" "}
        {passengerInfo.flight_info.flight_number}
      </p>
      <p>
        <strong className="text-gray-400">Destination:</strong>{" "}
        {passengerInfo.flight_info.destination}
      </p>
      <p>
        <strong className="text-gray-400">Status:</strong>
        <span
          className={
            passengerInfo.check_in_status === "Checked In"
              ? "text-green-400"
              : "text-yellow-400"
          }
        >
          {` ${passengerInfo.check_in_status}`}
        </span>
      </p>
    </>
  );
};

export default PassengerDetails;
