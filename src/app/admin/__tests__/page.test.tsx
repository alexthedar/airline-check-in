/* eslint-disable react/display-name */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminPage from "../page";
import { Passenger } from "@/types/passenger-type";

jest.mock("@/components/PassengerTable", () => () => (
  <div>Passenger Table</div>
));
jest.mock("@/components/PassengerCard", () => () => <div>Passenger Card</div>);

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockClear();
});

describe("AdminPage", () => {
  it("should require a secret key and then display the dashboard on successful login", async () => {
    const mockPassengers: Passenger[] = [
      {
        id: 1,
        last_name: "Smith",
        confirmation_number: "ABC123",
        flight_info: { flight_number: "UA456", destination: "New York" },
        check_in_status: "Checked In",
        document_url: null,
      },
    ];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPassengers),
    });

    render(<AdminPage />);

    expect(screen.getByText(/admin access/i)).toBeInTheDocument();
    const secretKeyInput = screen.getByPlaceholderText(/enter secret key/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(secretKeyInput, { target: { value: "test-key" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(
        screen.getByText(/passenger check-in dashboard/i)
      ).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/admin/passengers/", {
      headers: { Authorization: "Bearer test-key" },
    });

    expect(screen.getByText("Passenger Table")).toBeInTheDocument();
  });

  it("should show an error message on invalid secret key", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ message: "Invalid secret key." }),
    });

    render(<AdminPage />);

    fireEvent.change(screen.getByPlaceholderText(/enter secret key/i), {
      target: { value: "wrong-key" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid secret key/i)).toBeInTheDocument();
    });
  });
});
