import { render, screen, fireEvent } from "@testing-library/react";
import TextInput from "../TextInput";

describe("TextInput Component", () => {
  const mockOnChange = jest.fn();

  const defaultProps = {
    id: "test-input",
    name: "testInput",
    type: "text",
    placeholder: "Enter text here",
    value: "Initial value",
    onChange: mockOnChange,
    required: true,
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders with the correct attributes", () => {
    render(<TextInput {...defaultProps} />);

    const inputElement = screen.getByPlaceholderText("Enter text here");

    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute("id", defaultProps.id);
    expect(inputElement).toHaveAttribute("name", defaultProps.name);
    expect(inputElement).toHaveAttribute("type", defaultProps.type);
    expect(inputElement).toHaveValue(defaultProps.value);
    expect(inputElement).toBeRequired();
  });

  it("calls the onChange handler when the user types", () => {
    render(<TextInput {...defaultProps} />);

    const inputElement = screen.getByPlaceholderText("Enter text here");

    fireEvent.change(inputElement, { target: { value: "new text" } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });
});
