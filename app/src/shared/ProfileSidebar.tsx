import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { sidebarStats, socialLinks } from "./siteData";

export function ProfileSidebar() {
  const location = useLocation();
  const [isFollowing, setIsFollowing] = useState(false);

  const isVisible = useMemo(
    () => location.pathname === "/" || location.pathname === "/contact",
    [location.pathname]
  );

  if (!isVisible) {
    return null;
  }

  return (
    <aside
      aria-label="Profile and social links"
      className="pill-sidebar"
      role="complementary"
    >
      <header className="sidebar-header">
        <button
          aria-label="Follow Leon Madara"
          aria-pressed={isFollowing}
          className="sidebar-follow-button"
          onClick={() => setIsFollowing((current) => !current)}
          type="button"
        >
          <span>{isFollowing ? "Following" : "Follow"}</span>
          <svg
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isFollowing ? (
              <path
                d="M5 13l4 4L19 7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            ) : (
              <path
                d="M12 4v16m8-8H4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </button>

        <div className="profile-section">
          <img
            alt="Leon Madara"
            className="profile-photo"
            src="/images/Leon.jpg"
          />
        </div>

        <div
          aria-label="Experience level"
          className="experience-bar"
          role="group"
        >
          <span aria-hidden="true" className="exp-label">
            exp.
          </span>
          <div
            aria-label="Experience: 65%"
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={65}
            className="progress-bar"
            role="progressbar"
          />
          <span className="sr-only">Experience level: 65%</span>
        </div>
      </header>

      <div className="identity-section">
        <h2 className="sidebar-name">Leon Madara</h2>
        <p className="sidebar-title">
          Full Stack AI Developer from Nairobi, Kenya. Building innovative
          solutions with modern web technologies.
        </p>
      </div>

      <div className="stats-section" role="list">
        {sidebarStats.map((stat) => (
          <div className="stat-item" key={stat.label} role="listitem">
            <span className="stat-number">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>

      <nav aria-label="Social media links" className="social-nav">
        <ul className="social-icons-list">
          {socialLinks.map((social) => {
            const Icon = social.icon;

            return (
              <li className="social-icon-item" key={social.title}>
                <a
                  aria-label={social.title}
                  className="social-icon-link"
                  href={social.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon aria-hidden="true" className="social-icon" />
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
