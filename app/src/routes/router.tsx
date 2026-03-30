import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../shared/AppLayout";
import { RouteErrorBoundary } from "../shared/RouteErrorBoundary";
import { AboutRoute } from "../features/about/AboutRoute";
import { ContactRoute } from "../features/contact/ContactRoute";
import { DesignProcessRoute } from "../features/designProcess/DesignProcessRoute";
import { HomeRoute } from "../features/home/HomeRoute";
import { PortfolioRoute } from "../features/portfolio/PortfolioRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomeRoute />
      },
      {
        path: "about",
        element: <AboutRoute />
      },
      {
        path: "design-process",
        element: <DesignProcessRoute />
      },
      {
        path: "contact",
        element: <ContactRoute />
      },
      {
        path: "portfolio",
        element: <PortfolioRoute />
      },
      {
        path: "portfolio/:projectSlug",
        element: <PortfolioRoute />
      }
    ]
  }
]);
