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

describe("CheckInClient island", () => {
  it("renders success banner when server action resolves successfully", async () => {
    const mockAction = jest
      .fn<Promise<ActionData>, [ActionData, FormData]>()
      .mockResolvedValue({ message: "Successfully checked-in." });

    render(<CheckInClient action={mockAction} />);

    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /check/i }));

    await waitFor(() =>
      expect(screen.getByText(/successfully checked-in\./i)).toBeInTheDocument()
    );

    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it("renders error banner when server action returns an error", async () => {
    const mockAction = jest
      .fn<Promise<ActionData>, [ActionData, FormData]>()
      .mockResolvedValue({ error: "You are already checked-in." });

    render(<CheckInClient action={mockAction} />);

    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /check/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/you are already checked-in\./i)
      ).toBeInTheDocument()
    );

    expect(mockAction).toHaveBeenCalledTimes(1);
  });
});
