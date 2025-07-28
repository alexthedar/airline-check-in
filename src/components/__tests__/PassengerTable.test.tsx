import { render, screen } from "@testing-library/react";
import PassengerTable from "../PassengerTable";
import { Passenger } from "@/types/passenger-type";

describe("PassengerTable Component", () => {
  const mockOnStatusUpdate = jest.fn();
  const mockPassengers: Passenger[] = [
    {
      id: 1,
      last_name: "Skywalker",
      confirmation_number: "R2D2",
      flight_info: { flight_number: "X-WING", destination: "Dagobah" },
      check_in_status: "Checked In",
      document_url: null,
    },
    {
      id: 2,
      last_name: "Vader",
      confirmation_number: "DS-1",
      flight_info: { flight_number: "TIE", destination: "Death Star" },
      check_in_status: "Not yet",
      document_url: null,
    },
  ];

  it("should render the correct table headers", () => {
    render(
      <PassengerTable passengers={[]} onStatusUpdate={mockOnStatusUpdate} />
    );

    expect(screen.getByText("Last Name")).toBeInTheDocument();
    expect(screen.getByText("Confirmation #")).toBeInTheDocument();
    expect(screen.getByText("Flight")).toBeInTheDocument();
    expect(screen.getByText("Destination")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Document")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("should render a row for each passenger in the list", () => {
    render(
      <PassengerTable
        passengers={mockPassengers}
        onStatusUpdate={mockOnStatusUpdate}
      />
    );

    const rows = screen.getAllByRole("row"); // Use role to find table rows

    expect(rows).toHaveLength(mockPassengers.length + 1); // +1 for the header row
  });

  it("should render nothing in the body if the passengers list is empty", () => {
    render(
      <PassengerTable passengers={[]} onStatusUpdate={mockOnStatusUpdate} />
    );

    const rows = screen.queryAllByRole("row");
    expect(rows).toHaveLength(1); // Only the header row should be present
  });
});
