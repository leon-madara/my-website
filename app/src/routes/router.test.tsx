import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppLayout } from "../shared/AppLayout";
import { ThemeProvider } from "../theme/ThemeProvider";

describe("AppLayout", () => {
  it("renders the primary migration routes", () => {
    render(
      <ThemeProvider>
        <MemoryRouter initialEntries={["/"]}>
          <AppLayout />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getAllByRole("link", { name: /^home$/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /about/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /contact/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /portfolio/i }).length).toBeGreaterThan(0);
  });

  it("shows the profile sidebar on the home route", () => {
    render(
      <ThemeProvider>
        <MemoryRouter initialEntries={["/"]}>
          <AppLayout />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(
      screen.getByRole("complementary", { name: /profile and social links/i })
    ).toBeInTheDocument();
  });

  it("renders the simple theme toggle on about", () => {
    render(
      <ThemeProvider>
        <MemoryRouter initialEntries={["/about"]}>
          <AppLayout />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(
      screen.getByRole("button", { name: /toggle dark mode/i })
    ).toBeInTheDocument();
  });
});
