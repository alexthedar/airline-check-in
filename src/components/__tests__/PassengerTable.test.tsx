import { render, screen, fireEvent } from "@testing-library/react";
import PassengerTable from "../PassengerTable";
import type { Passenger } from "@/types/passenger-type";

const passengers: Passenger[] = [
  {
    id: 1,
    last_name: "Smith",
    confirmation_number: "ABC123",
    flight_info: { flight_number: "UA456", destination: "NYC" },
    check_in_status: "Checked In",
    document_base64: "data:application/pdf;base64,abc",
  },
  {
    id: 2,
    last_name: "Jones",
    confirmation_number: "DEF456",
    flight_info: { flight_number: "BA789", destination: "LON" },
    check_in_status: "Not yet",
    document_base64: null,
  },
];

describe("PassengerTable", () => {
  it("renders all rows with correct data", () => {
    render(
      <PassengerTable passengers={passengers} onStatusUpdate={jest.fn()} />
    );

    /* headers */
    expect(screen.getByText(/last name/i)).toBeInTheDocument();
    expect(screen.getByText(/confirmation #/i)).toBeInTheDocument();

    /* rows */
    passengers.forEach((p) => {
      expect(
        screen.getByText(new RegExp(p.last_name, "i"))
      ).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(p.confirmation_number, "i"))
      ).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(p.flight_info.flight_number, "i"))
      ).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(p.flight_info.destination, "i"))
      ).toBeInTheDocument();
    });
  });

  it("invokes onStatusUpdate when Update button is clicked", () => {
    const mockCb = jest.fn();
    render(<PassengerTable passengers={passengers} onStatusUpdate={mockCb} />);

    const updateButtons = screen.getAllByRole("button", { name: /update/i });
    expect(updateButtons).toHaveLength(passengers.length);

    /* click first button */
    fireEvent.click(updateButtons[0]);

    expect(mockCb).toHaveBeenCalledWith(
      passengers[0].id,
      passengers[0].check_in_status
    );
  });
});
