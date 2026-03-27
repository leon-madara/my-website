import { useLocation } from "react-router-dom";

export function SiteFooter() {
  const location = useLocation();
  const isContact = location.pathname === "/contact";

  if (location.pathname.startsWith("/portfolio")) {
    return null;
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">
          {isContact
            ? "© 2024 Leon Madara. Built with passion in Nairobi, Kenya."
            : "© 2024 Leon Madara. All rights reserved."}
        </p>
      </div>
    </footer>
  );
}
