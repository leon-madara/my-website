import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { ThemeProvider } from "../theme/ThemeProvider";

describe("ThemeToggle", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.body.className = "";
    document.documentElement.removeAttribute("data-theme");
  });

  it("renders the scenic landscape toggle as the shared React default", () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <ThemeToggle />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByTestId("react-theme-toggle").tagName.toLowerCase()).toBe(
      "theme-toggle-landscape"
    );
  });

  it("syncs the React theme provider when the landscape toggle emits theme-changed", () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <ThemeToggle />
        </MemoryRouter>
      </ThemeProvider>
    );

    const toggle = screen.getByTestId("react-theme-toggle");

    act(() => {
      toggle.dispatchEvent(
        new CustomEvent("theme-changed", {
          bubbles: true,
          detail: { theme: "night" }
        })
      );
    });

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.body.classList.contains("dark-theme")).toBe(true);
    expect(window.localStorage.getItem("theme")).toBe("night");
  });
});
