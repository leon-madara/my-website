import { render, screen, waitFor } from "@testing-library/react";
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
  it("renders the workspace-style portfolio index with project toggles", async () => {
    renderPortfolioRoute("/portfolio");

    expect(
      screen.getByRole("link", {
        name: /02\s*legit logistics/i
      })
    ).toHaveAttribute("href", "/portfolio/legit-logistics?section=details&page=overview");
    expect(
      screen.getByRole("link", {
        name: /03\s*edumanage/i
      })
    ).toHaveAttribute("href", "/portfolio/edumanage#crisis");
    expect(
      screen.queryByRole("heading", {
        level: 1,
        name: /portfolio case studies, now routed in react/i
      })
    ).not.toBeInTheDocument();
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /eastleigh turf flow/i
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /overview/i
      })
    ).toBeInTheDocument();
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
        level: 2,
        name: /results/i
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/professional e-commerce experience/i)
    ).toBeInTheDocument();
  });

  it("renders the default workspace project from index-route query params", async () => {
    renderPortfolioRoute("/portfolio?section=impact&page=metrics");

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /eastleigh turf flow/i
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /results/i
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/professional e-commerce experience/i)
    ).toBeInTheDocument();
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
        level: 2,
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
