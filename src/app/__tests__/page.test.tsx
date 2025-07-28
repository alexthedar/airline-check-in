import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CheckInPage from "../page";

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockClear();
});

describe("CheckInPage", () => {
  it("should allow a user to fill out the form and submit", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: "Check-in successful!" }),
    });

    render(<CheckInPage />);

    const lastNameInput = screen.getByPlaceholderText(/last name/i);
    const confirmationInput =
      screen.getByPlaceholderText(/confirmation number/i);
    const checkInButton = screen.getByRole("button", { name: /check in/i });

    fireEvent.change(lastNameInput, { target: { value: "Smith" } });
    fireEvent.change(confirmationInput, { target: { value: "ABC123" } });

    fireEvent.click(checkInButton);

    await waitFor(() => {
      expect(screen.getByText(/check-in successful!/i)).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/check-in", expect.any(Object));
  });

  it("should display an error message if the API call fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: "Invalid confirmation number." }),
    });

    render(<CheckInPage />);

    fireEvent.change(screen.getByPlaceholderText(/last name/i), {
      target: { value: "Smith" },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirmation number/i), {
      target: { value: "ABC123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /check in/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/invalid confirmation number./i)
      ).toBeInTheDocument();
    });
  });
});
