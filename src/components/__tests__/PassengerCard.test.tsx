import { render, screen, fireEvent } from "@testing-library/react";
import PassengerCard from "../PassengerCard"; // Adjust path as needed
import { Passenger } from "@/types/passenger-type";

describe("PassengerCard Component", () => {
  const mockOnStatusUpdate = jest.fn();

  const mockPassenger: Passenger = {
    id: 101,
    last_name: "Solo",
    confirmation_number: "FALCON1",
    flight_info: {
      flight_number: "YT-1300",
      destination: "Kessel Run",
    },
    check_in_status: "Checked In",
    document_url: "http://example.com/passport.pdf",
  };

  beforeEach(() => {
    mockOnStatusUpdate.mockClear();
  });

  it("should render all passenger details correctly", () => {
    render(
      <PassengerCard
        passenger={mockPassenger}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    expect(screen.getByText("Solo")).toBeInTheDocument();
    expect(screen.getByText("#FALCON1")).toBeInTheDocument();

    expect(screen.getByText("YT-1300")).toBeInTheDocument();
    expect(screen.getByText("Kessel Run")).toBeInTheDocument();

    expect(screen.getByText("Checked In")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /view file/i })).toHaveAttribute(
      "href",
      mockPassenger.document_url
    );
  });

  it("should not render the document link if document_url is null", () => {
    const passengerWithoutDoc = { ...mockPassenger, document_url: null };

    render(
      <PassengerCard
        passenger={passengerWithoutDoc}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    const link = screen.queryByRole("link", { name: /view file/i });
    expect(link).not.toBeInTheDocument();
  });

  it("should call onStatusUpdate with the correct arguments when the button is clicked", () => {
    render(
      <PassengerCard
        passenger={mockPassenger}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    const updateButton = screen.getByRole("button", { name: /update status/i });
    fireEvent.click(updateButton);

    expect(mockOnStatusUpdate).toHaveBeenCalledTimes(1);
    expect(mockOnStatusUpdate).toHaveBeenCalledWith(
      mockPassenger.id,
      mockPassenger.check_in_status
    );
  });
});
