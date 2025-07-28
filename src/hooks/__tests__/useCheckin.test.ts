import { renderHook, act, waitFor } from "@testing-library/react";
import { useCheckIn } from "../useCheckIn";

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockClear();
});

describe("useCheckIn Hook", () => {
  it("should handle a successful check-in", async () => {
    const mockPassengerData = { id: 1, last_name: "Smith" };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          message: "Success!",
          passenger: mockPassengerData,
        }),
    });

    const { result } = renderHook(() => useCheckIn());

    let checkInResult;
    await act(async () => {
      checkInResult = await result.current.checkIn(
        "Smith",
        "ABC123",
        null,
        undefined
      );
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.message).toBe("Success!");
    expect(result.current.error).toBe("");
    expect(checkInResult).toEqual(mockPassengerData);
  });

  it("should handle a failed check-in", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: "Invalid credentials." }),
    });

    const { result } = renderHook(() => useCheckIn());

    let checkInResult;
    await act(async () => {
      checkInResult = await result.current.checkIn(
        "Wrong",
        "Name",
        null,
        undefined
      );
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("Invalid credentials.");
    expect(result.current.message).toBe("");
    expect(checkInResult).toBeNull();
  });

  it("should set loading state correctly", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: "Success!" }),
    });

    const { result } = renderHook(() => useCheckIn());

    act(() => {
      result.current.checkIn("Smith", "ABC123", null, undefined);
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });
});
