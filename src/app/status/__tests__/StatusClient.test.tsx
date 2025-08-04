import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import StatusClient from "../StatusClient";
import type { Passenger } from "@/types/passenger-type";

type StatusData = {
  error?: string;
  passenger?: Passenger;
};

const fillForm = (confirmation = "ABC123") =>
  fireEvent.change(screen.getByPlaceholderText(/confirmation number/i), {
    target: { value: confirmation },
  });

describe("StatusClient island", () => {
  it("shows passenger details when the lookup succeeds", async () => {
    const mockPassenger: Passenger = {
      id: 1,
      last_name: "Smith",
      confirmation_number: "ABC123",
      flight_info: { flight_number: "XY99", destination: "NYC" },
      check_in_status: "Checked In",
      document_base64: null,
    };

    const mockAction = jest
      .fn<Promise<StatusData>, [StatusData, FormData]>()
      .mockResolvedValue({ passenger: mockPassenger });

    render(<StatusClient action={mockAction} />);

    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /check status/i }));

    await waitFor(() =>
      expect(screen.getByText(/flight details/i)).toBeInTheDocument()
    );
    expect(screen.getByText(/smith/i)).toBeInTheDocument();
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it("shows an error banner when no booking is found", async () => {
    const mockAction = jest
      .fn<Promise<StatusData>, [StatusData, FormData]>()
      .mockResolvedValue({
        error: "Could not find a booking with that confirmation number.",
      });

    render(<StatusClient action={mockAction} />);

    fillForm("BAD999");
    fireEvent.click(screen.getByRole("button", { name: /check status/i }));

    await waitFor(() =>
      expect(screen.getByText(/could not find a booking/i)).toBeInTheDocument()
    );
    expect(mockAction).toHaveBeenCalledTimes(1);
  });
});
