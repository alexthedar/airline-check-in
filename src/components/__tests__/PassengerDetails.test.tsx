import { render, screen } from "@testing-library/react";
import PassengerDetails from "../PassengerDetails"; // Adjust path as needed
import { Passenger } from "@/types/passenger-type";

describe("PassengerDetails Component", () => {
  const mockPassenger: Passenger = {
    id: 1,
    last_name: "Skywalker",
    confirmation_number: "R2D2C3PO",
    flight_info: {
      flight_number: "X-34",
      destination: "Tatooine",
    },
    check_in_status: "Checked In",
    document_url: null,
  };

  it("should render all passenger information", () => {
    render(<PassengerDetails passengerInfo={mockPassenger} />);

    expect(screen.getByText("Skywalker")).toBeInTheDocument();
    expect(screen.getByText("X-34")).toBeInTheDocument();
    expect(screen.getByText("Tatooine")).toBeInTheDocument();
    expect(screen.getByText(/checked in/i)).toBeInTheDocument();
  });

  it('should apply the correct class for "Checked In" status', () => {
    render(<PassengerDetails passengerInfo={mockPassenger} />);
    const statusElement = screen.getByText(/checked in/i);
    expect(statusElement).toHaveClass("text-green-400");
  });

  it('should apply the correct class for "Not yet" status', () => {
    const notCheckedInPassenger = {
      ...mockPassenger,
      check_in_status: "Not yet",
    };
    render(<PassengerDetails passengerInfo={notCheckedInPassenger} />);
    const statusElement = screen.getByText(/not yet/i);
    expect(statusElement).toHaveClass("text-yellow-400");
  });
});
