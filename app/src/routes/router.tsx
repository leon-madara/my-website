import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../shared/AppLayout";
import { AboutRoute } from "../features/about/AboutRoute";
import { ContactRoute } from "../features/contact/ContactRoute";
import { ContactRebuildRoute } from "../features/contactRebuild/ContactRebuildRoute";
import { DesignProcessRoute } from "../features/designProcess/DesignProcessRoute";
import { HomeRoute } from "../features/home/HomeRoute";
import { PortfolioRoute } from "../features/portfolio/PortfolioRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
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
        path: "contact-rebuild",
        element: <ContactRebuildRoute />
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
