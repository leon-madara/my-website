import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HomeRoute } from "./HomeRoute";

describe("HomeRoute", () => {
  it("renders the migrated homepage hero content", () => {
    render(
      <MemoryRouter>
        <HomeRoute />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { level: 1, name: /leon madara/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /full stack ai developer/i
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view projects/i })).toHaveAttribute(
      "href",
      "/portfolio"
    );
    expect(screen.getByRole("link", { name: /contact me/i })).toHaveAttribute(
      "href",
      "/contact"
    );
    expect(screen.getByText(/nairobi, kenya/i)).toBeInTheDocument();
  });
});
