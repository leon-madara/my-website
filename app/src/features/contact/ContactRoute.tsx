import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import "./contact.css";
import {
  contactCards,
  faqItems,
  formBadges,
  panelTags,
  projectTypeOptions
} from "./contactContent";

interface FormValues {
  name: string;
  email: string;
  projectType: string;
  message: string;
}

interface ToastState {
  type: "success" | "error";
  message: string;
}

const initialValues: FormValues = {
  name: "",
  email: "",
  projectType: "",
  message: ""
};

function formatNairobiTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Africa/Nairobi"
  }).format(date);
}

function getAvailability(now: Date) {
  const nairobi = new Date(
    now.toLocaleString("en-US", { timeZone: "Africa/Nairobi" })
  );
  const day = nairobi.getDay();
  const hour = nairobi.getHours();
  const workingDay = day >= 1 && day <= 5;
  const workingHour = hour >= 9 && hour < 18;

  if (workingDay && workingHour) {
    return {
      heading: "Currently Available",
      detail: "Usually replies same day"
    };
  }

  return {
    heading: "Replies Next Business Window",
    detail: "Best reach time: 9 AM - 6 PM EAT"
  };
}

function validateField(name: keyof FormValues, value: string) {
  const trimmed = value.trim();

  switch (name) {
    case "name":
      if (!trimmed) {
        return "Name is required";
      }
      if (trimmed.length < 2) {
        return "Name must be at least 2 characters";
      }
      if (!/^[a-zA-Z\s]+$/.test(trimmed)) {
        return "Name can only contain letters and spaces";
      }
      return "";
    case "email":
      if (!trimmed) {
        return "Email is required";
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        return "Please enter a valid email address";
      }
      return "";
    case "projectType":
      if (!trimmed) {
        return "Please select a project type";
      }
      return "";
    case "message":
      if (!trimmed) {
        return "Message is required";
      }
      if (trimmed.length < 10) {
        return "Message must be at least 10 characters";
      }
      if (trimmed.length > 1000) {
        return "Message must not exceed 1000 characters";
      }
      return "";
    default:
      return "";
  }
}

async function copyText(value: string) {
  const cleanValue = value.trim();

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(cleanValue);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = cleanValue;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export function ContactRoute() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Record<keyof FormValues, string>>({
    name: "",
    email: "",
    projectType: "",
    message: ""
  });
  const [touched, setTouched] = useState<Record<keyof FormValues, boolean>>({
    name: false,
    email: false,
    projectType: false,
    message: false
  });
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => formatNairobiTime(new Date()));
  const availability = useMemo(() => getAvailability(new Date()), [currentTime]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentTime(formatNairobiTime(new Date()));
    }, 60_000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setToast(null);
    }, 4000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [toast]);

  const handleChange =
    (field: keyof FormValues) =>
    (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const nextValue = event.target.value;
      setValues((current) => ({ ...current, [field]: nextValue }));

      if (touched[field]) {
        setErrors((current) => ({
          ...current,
          [field]: validateField(field, nextValue)
        }));
      }
    };

  const handleBlur = (field: keyof FormValues) => () => {
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors((current) => ({
      ...current,
      [field]: validateField(field, values[field])
    }));
  };

  const handleCopy = async (value: string, successMessage: string) => {
    try {
      await copyText(value);
      setToast({ type: "success", message: successMessage });
    } catch {
      setToast({ type: "error", message: "Failed to copy to clipboard" });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = {
      name: validateField("name", values.name),
      email: validateField("email", values.email),
      projectType: validateField("projectType", values.projectType),
      message: validateField("message", values.message)
    };

    setTouched({
      name: true,
      email: true,
      projectType: true,
      message: true
    });
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      setToast({ type: "error", message: "Please fix the errors in the form" });
      return;
    }

    setIsSubmitting(true);
    setShowSuccess(false);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 1600));
      setValues(initialValues);
      setTouched({
        name: false,
        email: false,
        projectType: false,
        message: false
      });
      setErrors({
        name: "",
        email: "",
        projectType: "",
        message: ""
      });
      setShowSuccess(true);
      setToast({ type: "success", message: "Message sent successfully!" });
    } catch {
      setToast({ type: "error", message: "Failed to send message. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-content page-content--contact">
      <main className="contact-container">
        <section className="contact-hero-section" id="hero">
          <div className="hero-background">
            <div className="animated-gradient" />
            <div aria-hidden="true" className="floating-shapes">
              <div className="shape shape-1" />
              <div className="shape shape-2" />
              <div className="shape shape-3" />
              <div className="shape shape-4" />
            </div>
          </div>

          <div className="contact-hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                <span className="title-line">Let&apos;s Build</span>
                <span className="title-line kenyan-gradient">
                  Something Amazing
                </span>
              </h1>
              <p className="hero-description">
                Based in Nairobi, Kenya. Ready to collaborate on your next big
                idea.
              </p>
            </div>

            <div className="hero-cta">
              <a className="cta-button primary" href="#contact-cards">
                <span>Get In Touch</span>
              </a>
              <a className="cta-button secondary" href="#faq">
                <span>View FAQ</span>
              </a>
            </div>
          </div>
        </section>

        <section className="contact-cards-section" id="contact-cards">
          <div className="section-header section-header--visible">
            <h2 className="section-title">Reach Out</h2>
            <p className="section-subtitle">
              Choose your preferred method of communication
            </p>
          </div>

          <div className="cards-grid">
            {contactCards.map((card) => (
              <article
                className={
                  card.featured
                    ? `contact-card ${card.variant}-card featured-card visible`
                    : `contact-card ${card.variant}-card visible`
                }
                key={card.title}
              >
                <div className="card-header">
                  <div className="card-icon">{card.title.slice(0, 2).toUpperCase()}</div>
                  <h3 className="card-title">{card.title}</h3>
                </div>
                <div className={card.featured ? "card-body featured-body" : "card-body"}>
                  <div className={card.featured ? "featured-content" : undefined}>
                    <div className={card.featured ? "featured-info" : undefined}>
                      {card.featured ? (
                        <div className="availability-badge">
                          <span className="status-dot" />
                          <span className="status-text">{availability.heading}</span>
                        </div>
                      ) : null}
                      <p className="card-label">{card.label}</p>
                      <p className="card-value">{card.value}</p>
                    </div>

                    <div className="card-actions">
                      {"copyLabel" in card ? (
                        <button
                          className="action-btn copy-btn"
                          onClick={() =>
                            handleCopy(
                              card.value,
                              card.title === "Email"
                                ? "Email copied to clipboard!"
                                : "Phone number copied to clipboard!"
                            )
                          }
                          type="button"
                        >
                          <span>{card.copyLabel}</span>
                        </button>
                      ) : null}
                      <a
                        className="action-btn primary-btn"
                        href={card.href}
                        rel="noopener noreferrer"
                        target={card.href.startsWith("http") ? "_blank" : undefined}
                      >
                        <span>{card.actionLabel}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="contact-form-section" id="contact-form">
          <div className="section-header section-header--visible">
            <h2 className="section-title">Send a Message</h2>
            <p className="section-subtitle">
              Fill out the form below and I&apos;ll get back to you within 24
              hours
            </p>
          </div>

          <div className="form-container">
            <div className="form-shell">
              <aside className="form-insight-panel" aria-label="Services and what to expect">
                <p className="panel-kicker">What I Offer</p>
                <h3 className="panel-title">
                  Full-service product development, start to finish
                </h3>
                <p className="panel-copy">
                  From initial design concepts in Figma to a fully built
                  product, I handle every step of development. I build from
                  scratch, with quality and affordability in mind.
                </p>
                <div className="panel-stats" role="list">
                  <div className="panel-stat" role="listitem">
                    <span className="stat-label">I&apos;ll Get Back</span>
                    <span className="stat-value">Within 24 hrs</span>
                    <span className="stat-subtext">On weekdays</span>
                  </div>
                  <div className="panel-stat" role="listitem">
                    <span className="stat-label">Available For</span>
                    <span className="stat-value">2 projects</span>
                    <span className="stat-subtext">Q1 2026</span>
                  </div>
                </div>
                <ul className="panel-list">
                  <li>Figma design concepts and prototypes</li>
                  <li>Custom development built from scratch</li>
                  <li>Affordable rates tailored to your budget</li>
                </ul>
                <div aria-label="What I build" className="panel-tags">
                  {panelTags.map((tag) => (
                    <span className="panel-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </aside>

              <div className="contact-form-wrapper">
                {!showSuccess ? (
                  <form className="contact-form visible" onSubmit={handleSubmit} noValidate>
                    <div aria-hidden="true" className="form-badge-row">
                      {formBadges.map((badge) => (
                        <span className="form-badge" key={badge}>
                          {badge}
                        </span>
                      ))}
                    </div>

                    <div className="form-grid">
                      <div
                        className={`form-group${errors.name ? " has-error" : touched.name ? " has-success" : ""}`}
                      >
                        <input
                          id="name"
                          name="name"
                          onBlur={handleBlur("name")}
                          onChange={handleChange("name")}
                          required
                          value={values.name}
                        />
                        <label htmlFor="name">Your Name</label>
                        <span className="form-error" role="alert">
                          {errors.name}
                        </span>
                      </div>

                      <div
                        className={`form-group${errors.email ? " has-error" : touched.email ? " has-success" : ""}`}
                      >
                        <input
                          id="email"
                          name="email"
                          onBlur={handleBlur("email")}
                          onChange={handleChange("email")}
                          required
                          type="email"
                          value={values.email}
                        />
                        <label htmlFor="email">Email Address</label>
                        <span className="form-error" role="alert">
                          {errors.email}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`form-group${errors.projectType ? " has-error" : touched.projectType ? " has-success" : ""}`}
                    >
                      <select
                        id="project-type"
                        name="project-type"
                        onBlur={handleBlur("projectType")}
                        onChange={handleChange("projectType")}
                        required
                        value={values.projectType}
                      >
                        {projectTypeOptions.map((option) => (
                          <option key={option.value || "placeholder"} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="project-type">Project Type</label>
                      <span className="form-error" role="alert">
                        {errors.projectType}
                      </span>
                    </div>

                    <div
                      className={`form-group${errors.message ? " has-error" : touched.message ? " has-success" : ""}`}
                    >
                      <textarea
                        id="message"
                        name="message"
                        onBlur={handleBlur("message")}
                        onChange={handleChange("message")}
                        required
                        rows={5}
                        value={values.message}
                      />
                      <label htmlFor="message">Your Message</label>
                      <span className="form-error" role="alert">
                        {errors.message}
                      </span>
                    </div>

                    <div className="form-meta-grid">
                      <div className="meta-card">
                        <p className="meta-label">Typical engagement</p>
                        <p className="meta-value">4-12 weeks</p>
                        <span className="meta-subtext">Strategy to shipping</span>
                      </div>
                      <div className="meta-card">
                        <p className="meta-label">Collaboration style</p>
                        <p className="meta-value">Async + Live</p>
                        <span className="meta-subtext">Slack · Figma · Linear</span>
                      </div>
                    </div>

                    <button className={`btn-submit${isSubmitting ? " loading" : ""}`} disabled={isSubmitting} type="submit">
                      <span className="btn-text">
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </span>
                      <span aria-hidden="true" className="loading-spinner" />
                    </button>
                  </form>
                ) : (
                  <div className="form-success show" role="alert">
                    <div className="form-success-icon">OK</div>
                    <h3>Message Sent Successfully!</h3>
                    <p>
                      Thank you for reaching out. I&apos;ll get back to you
                      within 24 hours.
                    </p>
                  </div>
                )}

                <div className="calendar-option visible">
                  <p className="calendar-text">Prefer to schedule a call instead?</p>
                  <button className="btn-calendar" type="button">
                    <span>Schedule a Meeting</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="location-section" id="location">
          <div className="location-grid">
            <article className="location-card visible">
              <div className="location-icon">KE</div>
              <h3 className="location-title">Location</h3>
              <p className="location-value">Nairobi, Kenya</p>
              <p className="location-detail">East Africa</p>
            </article>

            <article className="location-card visible">
              <div className="location-icon">TZ</div>
              <h3 className="location-title">Current Time</h3>
              <p className="location-value">{currentTime}</p>
              <p className="location-detail">East Africa Time (EAT)</p>
            </article>

            <article className="location-card visible">
              <div className="location-icon">ON</div>
              <h3 className="location-title">Availability</h3>
              <p className="location-value">
                <span className="availability-status">
                  <span className="status-indicator" />
                  <span className="status-message">{availability.heading}</span>
                </span>
              </p>
              <p className="location-detail">{availability.detail}</p>
            </article>
          </div>
        </section>

        <section className="faq-section" id="faq">
          <div className="section-header section-header--visible">
            <h2 className="section-title">Frequently Asked</h2>
            <p className="section-subtitle">
              Common questions about working together
            </p>
          </div>

          <div className="faq-container">
            {faqItems.map((item) => (
              <details className="faq-item visible" key={item.question}>
                <summary className="faq-question">
                  <span>{item.question}</span>
                  <span aria-hidden="true" className="faq-icon">
                    v
                  </span>
                </summary>
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      </main>

      {toast ? (
        <div className={`toast show ${toast.type}`} role="alert">
          <div className="toast-icon" />
          <span className="toast-message">{toast.message}</span>
        </div>
      ) : null}
    </div>
  );
}
