/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";
import PassengerCard from "../PassengerCard";
import type { Passenger } from "@/types/passenger-type";

const basePassenger: Passenger = {
  id: 1,
  last_name: "Smith",
  confirmation_number: "ABC123",
  flight_info: { flight_number: "UA456", destination: "NYC" },
  check_in_status: "Checked In",
  document_base64: "https://example.com/doc.pdf",
};

const renderCard = (passenger: Passenger, cb = jest.fn()) =>
  render(<PassengerCard passenger={passenger} onStatusUpdate={cb} />);

describe("PassengerCard", () => {
  it("renders passenger details and document link", () => {
    renderCard(basePassenger);

    expect(screen.getByText(/smith/i)).toBeInTheDocument();
    expect(screen.getByText(/ua456/i)).toBeInTheDocument();
    expect(screen.getByText(/nyc/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view file/i })).toHaveAttribute(
      "href",
      basePassenger.document_base64
    );
  });

  it("calls onStatusUpdate when Update Status button clicked", () => {
    const mockCb = jest.fn();
    renderCard({ ...basePassenger, document_base64: null }, mockCb);

    fireEvent.click(screen.getByRole("button", { name: /update status/i }));

    expect(mockCb).toHaveBeenCalledWith(
      basePassenger.id,
      basePassenger.check_in_status
    );
  });
});
