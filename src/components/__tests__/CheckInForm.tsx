import { render, screen, fireEvent } from "@testing-library/react";
import CheckInForm from "../CheckInForm";
import React from "react";

jest.mock("../TextInput", () => {
  // eslint-disable-next-line react/display-name
  return (props: React.ComponentProps<"input">) => <input {...props} />;
});

describe("CheckInForm Component", () => {
  const mockSetLastName = jest.fn();
  const mockSetConfirmationNumber = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockHandleFileChange = jest.fn();

  const defaultProps = {
    lastName: "",
    setLastName: mockSetLastName,
    confirmationNumber: "",
    setConfirmationNumber: mockSetConfirmationNumber,
    handleSubmit: mockHandleSubmit,
    handleFileChange: mockHandleFileChange,
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all form fields and the submit button", () => {
    render(<CheckInForm {...defaultProps} />);

    expect(screen.getByPlaceholderText(/last name/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/confirmation number/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/upload document/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /check in/i })
    ).toBeInTheDocument();
  });

  it("calls setLastName when the last name input is changed", () => {
    render(<CheckInForm {...defaultProps} />);
    const input = screen.getByPlaceholderText(/last name/i);
    fireEvent.change(input, { target: { value: "Smith" } });
    expect(mockSetLastName).toHaveBeenCalledWith("Smith");
  });

  it("calls setConfirmationNumber when the confirmation number input is changed", () => {
    render(<CheckInForm {...defaultProps} />);
    const input = screen.getByPlaceholderText(/confirmation number/i);
    fireEvent.change(input, { target: { value: "ABC123" } });
    expect(mockSetConfirmationNumber).toHaveBeenCalledWith("ABC123");
  });

  it("calls handleFileChange when a file is selected", () => {
    render(<CheckInForm {...defaultProps} />);
    const input = screen.getByLabelText(/upload document/i);
    const file = new File(["dummy content"], "test.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(input, { target: { files: [file] } });
    expect(mockHandleFileChange).toHaveBeenCalled();
  });

  it("calls handleSubmit when the form is submitted", () => {
    render(<CheckInForm {...defaultProps} />);
    const form = screen
      .getByRole("button", { name: /check in/i })
      .closest("form");
    if (form) {
      fireEvent.submit(form);
    }
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it("disables the button and shows loading text when isLoading is true", () => {
    render(<CheckInForm {...defaultProps} isLoading={true} />);
    const button = screen.getByRole("button", { name: /checking in.../i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });
});
