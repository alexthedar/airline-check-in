import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import StatusPage from "../page";

describe("StatusPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch and display passenger info on successful request", async () => {
    const mockFetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        last_name: "Doe",
        flight_info: { flight_number: "XY123", destination: "London" },
        check_in_status: "Not yet",
      }),
    });
    global.fetch = mockFetch;

    render(<StatusPage />);

    fireEvent.change(screen.getByPlaceholderText("Confirmation Number"), {
      target: { value: "DEF456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /check status/i }));

    await waitFor(() => {
      expect(screen.getByText("Doe")).toBeInTheDocument();
      expect(screen.getByText("XY123")).toBeInTheDocument();
      expect(screen.getByText("London")).toBeInTheDocument();
      expect(screen.getByText(/not yet/i)).toBeInTheDocument();
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/status/DEF456",
        expect.objectContaining({
          signal: expect.any(Object),
        })
      );
    });
  });

  it("should display an error message on a failed request", async () => {
    const mockFetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Invalid confirmation number." }),
    });
    global.fetch = mockFetch;

    render(<StatusPage />);

    fireEvent.change(screen.getByPlaceholderText("Confirmation Number"), {
      target: { value: "INVALID" },
    });
    fireEvent.click(screen.getByRole("button", { name: /check status/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Invalid confirmation number.")
      ).toBeInTheDocument();
    });
  });
});
