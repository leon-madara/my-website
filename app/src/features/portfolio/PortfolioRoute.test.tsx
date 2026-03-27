import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { PortfolioRoute } from "./PortfolioRoute";

function renderPortfolioRoute(initialEntry: string) {
  const router = createMemoryRouter(
    [
      {
        path: "/portfolio",
        element: <PortfolioRoute />
      },
      {
        path: "/portfolio/:projectSlug",
        element: <PortfolioRoute />
      }
    ],
    {
      initialEntries: [initialEntry]
    }
  );

  render(<RouterProvider router={router} />);
  return router;
}

describe("PortfolioRoute", () => {
  it("renders the landing page and lets the user switch project previews", async () => {
    renderPortfolioRoute("/portfolio");

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          level: 1,
          name: /portfolio case studies, now routed in react/i
        })
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("tab", {
        name: /03edumanage sms/i
      })
    );

    expect(screen.getAllByText(/edumanage sms/i)[0]).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /open case study/i
      })
    ).toHaveAttribute("href", "/portfolio/edumanage#crisis");
  });

  it("renders a tabbed case study from deep-link query params", async () => {
    renderPortfolioRoute("/portfolio/eastleigh?section=impact&page=metrics");

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /eastleigh turf flow/i
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /results & metrics/i
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/page load/i)).toBeInTheDocument();
  });

  it("normalizes invalid tabbed-case-study params back to the first valid page", async () => {
    const router = renderPortfolioRoute(
      "/portfolio/legit-logistics?section=nope&page=missing"
    );

    await waitFor(() => {
      expect(router.state.location.search).toContain("section=details");
      expect(router.state.location.search).toContain("page=overview");
    });

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /overview/i
      })
    ).toBeInTheDocument();
  });

  it("renders the EduManage long-form route with chapter navigation", async () => {
    renderPortfolioRoute("/portfolio/edumanage#crisis");

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /edumanage sms/i
      })
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", {
        name: /the crisis/i
      })
    ).toHaveLength(2);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /the crisis/i
      })
    ).toBeInTheDocument();
  });
});
