import { NavLink, useLocation } from "react-router-dom";
import { siteRoutes } from "./siteData";

export function MobileBottomNav() {
  const location = useLocation();

  if (location.pathname.startsWith("/portfolio")) {
    return null;
  }

  return (
    <nav aria-label="Mobile navigation" className="mobile-bottom-nav">
      {siteRoutes.map((route) => {
        const Icon = route.icon;

        return (
          <NavLink
            className={({ isActive }) =>
              isActive ? "mobile-nav-item active" : "mobile-nav-item"
            }
            end={route.path === "/"}
            key={route.path}
            to={route.path}
          >
            <Icon aria-hidden="true" strokeWidth="2" />
            <span className="sr-only">{route.title}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
