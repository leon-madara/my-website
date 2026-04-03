import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AboutRoute } from "./AboutRoute";

describe("AboutRoute", () => {
  it("renders the rebuilt about page sections and key actions", () => {
    render(
      <MemoryRouter>
        <AboutRoute />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { level: 2, name: /about\s*me/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /lion illustration representing leon madara/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /professional\s*experience/i
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /certifications/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /start a project/i })).toHaveAttribute(
      "href",
      "/contact"
    );
    expect(
      screen.getByRole("link", { name: /verify google data analytics certificate/i })
    ).toHaveAttribute(
      "href",
      "https://www.coursera.org/professional-certificates/google-data-analytics"
    );
  });
});
