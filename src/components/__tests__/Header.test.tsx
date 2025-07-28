import { render, screen, within } from "@testing-library/react";
import Header from "../Header";

describe("Header Component", () => {
  it("should render the main title link", () => {
    render(<Header />);
    const titleLink = screen.getByRole("link", { name: /airline check-in/i });
    expect(titleLink).toBeInTheDocument();
    expect(titleLink).toHaveAttribute("href", "/");
  });

  it("should render navigation links", () => {
    render(<Header />);

    const nav = screen.getByLabelText("main-nav");

    const checkInLink = within(nav).getByRole("link", { name: /check-in/i });
    expect(checkInLink).toBeInTheDocument();

    const statusLink = within(nav).getByRole("link", { name: /check status/i });
    expect(statusLink).toBeInTheDocument();

    const adminLink = within(nav).getByRole("link", { name: /admin/i });
    expect(adminLink).toBeInTheDocument();
  });
});
