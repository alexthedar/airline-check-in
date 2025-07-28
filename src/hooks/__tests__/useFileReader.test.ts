import { renderHook, act, waitFor } from "@testing-library/react";
import { useFileReader } from "../useFileReader";

const mockFileReader = {
  readAsDataURL: jest.fn(),
  onload: jest.fn(),
  onerror: jest.fn(),
  result: "",
};

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .spyOn(global, "FileReader")
    .mockImplementation(() => mockFileReader as unknown as FileReader);
});

describe("useFileReader Hook", () => {
  it("should successfully read a file and set the base64 state", async () => {
    const { result } = renderHook(() => useFileReader());
    const mockFile = new File(["hello"], "hello.png", { type: "image/png" });
    const mockBase64Result = "data:image/png;base64,aGVsbG8=";

    act(() => {
      result.current.readFile(mockFile);
    });

    act(() => {
      mockFileReader.result = mockBase64Result;
      mockFileReader.onload();
    });

    await waitFor(() => {
      expect(result.current.fileBase64).toBe(mockBase64Result);
      expect(result.current.fileError).toBe("");
    });
  });

  it("should handle a file read error", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { result } = renderHook(() => useFileReader());
    const mockFile = new File(["test"], "test.txt");

    act(() => {
      result.current.readFile(mockFile);
    });

    act(() => {
      mockFileReader.onerror(new Error("Test error"));
    });

    await waitFor(() => {
      expect(result.current.fileError).toBe("Failed to read file.");
    });

    consoleErrorSpy.mockRestore();
  });
});
