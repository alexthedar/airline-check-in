import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CheckInClient from "../CheckInClient";
import type { Passenger } from "@/types/passenger-type";

type ActionData = {
  message?: string;
  error?: string;
  passenger?: Passenger;
};

const fillForm = () => {
  fireEvent.change(screen.getByPlaceholderText(/last name/i), {
    target: { value: "Smith" },
  });
  fireEvent.change(screen.getByPlaceholderText(/confirmation number/i), {
    target: { value: "ABC123" },
  });
};

/* -------------------------------------------------------------------------- */
describe("Check-In client island", () => {
  it("shows the success banner when the action succeeds", async () => {
    const mockAction = jest
      .fn<Promise<ActionData>, [ActionData, FormData]>()
      .mockResolvedValue({
        message: "Successfully checked-in.",
      });

    render(<CheckInClient action={mockAction} />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /check in/i }));

    await waitFor(() =>
      expect(screen.getByText(/successfully checked-in./i)).toBeInTheDocument()
    );
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it("shows the error banner when the action returns an error", async () => {
    const mockAction = jest
      .fn<Promise<ActionData>, [ActionData, FormData]>()
      .mockResolvedValue({
        error: "Invalid confirmation number.",
      });

    render(<CheckInClient action={mockAction} />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /check in/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/invalid confirmation number./i)
      ).toBeInTheDocument()
    );
    expect(mockAction).toHaveBeenCalledTimes(1);
  });
});
