/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminClient from "../AdminClient";
import type { Passenger } from "@/types/passenger-type";
import type { AdminState } from "../page";

/* ────────── mock table / card so we can click “Update” without real markup ────────── */
jest.mock("@/components/PassengerTable", () => ({
  __esModule: true,
  default: ({ passengers = [], onStatusUpdate }: any) =>
    passengers.length ? (
      <button
        onClick={() =>
          onStatusUpdate(passengers[0].id, passengers[0].check_in_status)
        }
      >
        Update
      </button>
    ) : (
      <div>Passenger Table</div>
    ),
}));

jest.mock("@/components/PassengerCard", () => ({
  __esModule: true,
  default: ({ passenger, onStatusUpdate }: any) =>
    passenger ? (
      <button
        onClick={() => onStatusUpdate(passenger.id, passenger.check_in_status)}
      >
        Update
      </button>
    ) : (
      <div>Passenger Card</div>
    ),
}));

/* -------------------------------------------------------------------------- */
/* helpers                                                                    */
type Action = (prev: AdminState, payload: any) => Promise<AdminState>;

const mockPassengers: Passenger[] = [
  {
    id: 1,
    last_name: "Smith",
    confirmation_number: "ABC123",
    flight_info: { flight_number: "UA456", destination: "NYC" },
    check_in_status: "Checked In",
    document_base64: null,
  },
];

const renderWithActions = (login: Action, toggle: Action) =>
  render(<AdminClient login={login} toggle={toggle} />);

/* -------------------------------------------------------------------------- */
describe("AdminClient", () => {
  it("logs in with secret key and shows dashboard", async () => {
    const loginAction: Action = jest.fn().mockResolvedValue({
      passengers: mockPassengers,
      authenticated: true,
    });
    const toggleAction: Action = jest.fn().mockResolvedValue({
      passengers: mockPassengers,
      authenticated: true,
    });

    renderWithActions(loginAction, toggleAction);

    fireEvent.change(screen.getByPlaceholderText(/enter secret key/i), {
      target: { value: "super-secret" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() =>
      expect(
        screen.getAllByRole("button", { name: /update/i }).length
      ).toBeGreaterThan(0)
    );

    expect(loginAction).toHaveBeenCalledTimes(1);
  });

  it("displays error banner on invalid key", async () => {
    const loginAction: Action = jest
      .fn()
      .mockResolvedValue({ error: "Invalid secret key." });
    const toggleAction: Action = jest.fn().mockResolvedValue({});

    renderWithActions(loginAction, toggleAction);

    fireEvent.change(screen.getByPlaceholderText(/enter secret key/i), {
      target: { value: "bad-key" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() =>
      expect(screen.getByText(/invalid secret key/i)).toBeInTheDocument()
    );
  });

  it("calls toggle action when Update button is clicked", async () => {
    const loginAction: Action = jest.fn().mockResolvedValue({
      passengers: mockPassengers,
      authenticated: true,
    });
    const updated = [{ ...mockPassengers[0], check_in_status: "Not yet" }];
    const toggleAction: Action = jest.fn().mockResolvedValue({
      passengers: updated,
      authenticated: true,
    });

    renderWithActions(loginAction, toggleAction);

    /* login first */
    fireEvent.change(screen.getByPlaceholderText(/enter secret key/i), {
      target: { value: "key" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() =>
      expect(
        screen.getAllByRole("button", { name: /update/i }).length
      ).toBeGreaterThan(0)
    );

    /* click Update */
    fireEvent.click(screen.getAllByRole("button", { name: /update/i })[0]);

    await waitFor(() => expect(toggleAction).toHaveBeenCalledTimes(1));
  });
});
