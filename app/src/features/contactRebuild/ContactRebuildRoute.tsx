import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import styles from "./contactRebuild.module.css";
import {
  contactCards,
  faqItems,
  formBadges,
  panelTags,
  projectTypeOptions
} from "./contactRebuildContent";
import { getAvailability } from "./availability";
import { copyTextToClipboard } from "./clipboard";
import {
  ContactFormField,
  ContactFormValues,
  initialContactFormValues,
  validateContactField,
  validateContactForm
} from "./formValidation";
import { useInView } from "./useInView";
import { useToast } from "./useToast";
import { useZonedClock } from "./useZonedClock";

function fieldErrorId(field: ContactFormField) {
  return `contact-rebuild-${field}-error`;
}

export function ContactRebuildRoute() {
  const { toast, showToast } = useToast(4000);
  const [announcement, setAnnouncement] = useState("");

  const currentTime = useZonedClock({ timeZone: "Africa/Nairobi" });
  const availability = useMemo(() => getAvailability(new Date()), [currentTime]);

  const [values, setValues] = useState<ContactFormValues>(initialContactFormValues);
  const [touched, setTouched] = useState<Record<ContactFormField, boolean>>({
    name: false,
    email: false,
    projectType: false,
    message: false
  });
  const [errors, setErrors] = useState<Record<ContactFormField, string>>({
    name: "",
    email: "",
    projectType: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const heroReveal = useInView<HTMLElement>({ once: true, rootMargin: "-10% 0px -10% 0px" });
  const cardsReveal = useInView<HTMLElement>();
  const formReveal = useInView<HTMLElement>();
  const locationReveal = useInView<HTMLElement>();
  const faqReveal = useInView<HTMLElement>();

  const handleChange =
    (field: ContactFormField) =>
    (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const nextValue = event.target.value;
      setValues((current) => ({ ...current, [field]: nextValue }));

      if (touched[field]) {
        setErrors((current) => ({ ...current, [field]: validateContactField(field, nextValue) }));
      }
    };

  const handleBlur = (field: ContactFormField) => () => {
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors((current) => ({ ...current, [field]: validateContactField(field, values[field]) }));
  };

  const handleCopy = async (value: string, successMessage: string) => {
    try {
      await copyTextToClipboard(value);
      showToast({ type: "success", message: successMessage });
      setAnnouncement(successMessage);
      window.setTimeout(() => setAnnouncement(""), 1000);
    } catch {
      showToast({ type: "error", message: "Failed to copy to clipboard" });
    }
  };

  const handleCalendarClick = () => {
    showToast({ type: "success", message: "Scheduling link coming soon." });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowSuccess(false);

    const nextErrors = validateContactForm(values);
    setTouched({ name: true, email: true, projectType: true, message: true });
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      showToast({ type: "error", message: "Please fix the errors in the form" });
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 1600));
      setValues(initialContactFormValues);
      setTouched({ name: false, email: false, projectType: false, message: false });
      setErrors({ name: "", email: "", projectType: "", message: "" });
      setShowSuccess(true);
      showToast({ type: "success", message: "Message sent successfully!" });
    } catch {
      showToast({ type: "error", message: "Failed to send message. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className="sr-only" aria-atomic="true" aria-live="polite">
          {announcement}
        </div>

        <section
          className={styles.hero}
          data-visible={heroReveal.isVisible}
          id="hero"
          ref={heroReveal.ref}
        >
          <div className={styles.heroBackground} aria-hidden="true">
            <div className={styles.animatedGradient} />
            <div className={styles.floatingShapes}>
              <div className={`${styles.shape} ${styles.shape1}`} />
              <div className={`${styles.shape} ${styles.shape2}`} />
              <div className={`${styles.shape} ${styles.shape3}`} />
              <div className={`${styles.shape} ${styles.shape4}`} />
            </div>
          </div>

          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>
                <span className={styles.titleLine}>Let&apos;s Build</span>
                <span className={`${styles.titleLine} kenyan-gradient`}>Something Amazing</span>
              </h1>
              <p className={styles.heroDescription}>
                Based in Nairobi, Kenya. Ready to collaborate on your next big idea.
              </p>
            </div>

            <div className={styles.heroCtas}>
              <a className={`${styles.ctaButton} ${styles.ctaPrimary}`} href="#contact-cards">
                <span>Get In Touch</span>
              </a>
              <a className={`${styles.ctaButton} ${styles.ctaSecondary}`} href="#faq">
                <span>View FAQ</span>
              </a>
            </div>
          </div>
        </section>

        <section
          className={styles.section}
          data-visible={cardsReveal.isVisible}
          id="contact-cards"
          ref={cardsReveal.ref}
        >
          <header className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Reach Out</h2>
            <p className={styles.sectionSubtitle}>
              Choose your preferred method of communication
            </p>
          </header>

          <div className={styles.cardsGrid}>
            {contactCards.map((card) => (
              <article
                className={[
                  styles.card,
                  styles[`cardVariant_${card.variant}`],
                  card.featured ? styles.cardFeatured : ""
                ].filter(Boolean).join(" ")}
                key={card.title}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon} aria-hidden="true">
                    {card.title.slice(0, 2).toUpperCase()}
                  </div>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardValueBlock}>
                    {card.featured ? (
                      <div className={styles.availabilityBadge}>
                        <span className={styles.statusDot} aria-hidden="true" />
                        <span className={styles.statusText}>{availability.heading}</span>
                      </div>
                    ) : null}
                    <p className={styles.cardLabel}>{card.label}</p>
                    <p className={styles.cardValue}>{card.value}</p>
                  </div>

                  <div className={styles.cardActions}>
                    {card.copyLabel ? (
                      <button
                        className={`${styles.actionBtn} ${styles.copyBtn}`}
                        onClick={() =>
                          handleCopy(
                            card.value,
                            card.variant === "email"
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
                      className={`${styles.actionBtn} ${styles.primaryBtn}`}
                      href={card.href}
                      rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      target={card.href.startsWith("http") ? "_blank" : undefined}
                    >
                      <span>{card.actionLabel}</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className={styles.section}
          data-visible={formReveal.isVisible}
          id="contact-form"
          ref={formReveal.ref}
        >
          <header className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Send a Message</h2>
            <p className={styles.sectionSubtitle}>
              Fill out the form below and I&apos;ll get back to you within 24 hours
            </p>
          </header>

          <div className={styles.formShell}>
            <aside className={styles.insightPanel} aria-label="Services and what to expect">
              <p className={styles.panelKicker}>What I Offer</p>
              <h3 className={styles.panelTitle}>Full-service product development, start to finish</h3>
              <p className={styles.panelCopy}>
                From initial design concepts in Figma to a fully built product, I handle every step
                of development. I build from scratch, with quality and affordability in mind.
              </p>
              <div className={styles.panelStats} role="list">
                <div className={styles.panelStat} role="listitem">
                  <span className={styles.statLabel}>I&apos;ll Get Back</span>
                  <span className={styles.statValue}>Within 24 hrs</span>
                  <span className={styles.statSubtext}>On weekdays</span>
                </div>
                <div className={styles.panelStat} role="listitem">
                  <span className={styles.statLabel}>Available For</span>
                  <span className={styles.statValue}>2 projects</span>
                  <span className={styles.statSubtext}>Q1 2026</span>
                </div>
              </div>
              <ul className={styles.panelList}>
                <li>Figma design concepts and prototypes</li>
                <li>Custom development built from scratch</li>
                <li>Affordable rates tailored to your budget</li>
              </ul>
              <div className={styles.panelTags} aria-label="What I build">
                {panelTags.map((tag) => (
                  <span className={styles.panelTag} key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </aside>

            <div className={styles.formColumn}>
              {!showSuccess ? (
                <form className={styles.contactForm} noValidate onSubmit={handleSubmit}>
                  <div className={styles.formBadges} aria-hidden="true">
                    {formBadges.map((badge) => (
                      <span className={styles.formBadge} key={badge}>
                        {badge}
                      </span>
                    ))}
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <input
                        aria-errormessage={fieldErrorId("name")}
                        aria-invalid={Boolean(errors.name)}
                        id="name"
                        name="name"
                        onBlur={handleBlur("name")}
                        onChange={handleChange("name")}
                        placeholder=" "
                        required
                        value={values.name}
                      />
                      <label htmlFor="name">Your Name</label>
                      <span className={styles.formError} id={fieldErrorId("name")} aria-live="polite">
                        {errors.name}
                      </span>
                    </div>

                    <div className={styles.formGroup}>
                      <input
                        aria-errormessage={fieldErrorId("email")}
                        aria-invalid={Boolean(errors.email)}
                        id="email"
                        name="email"
                        onBlur={handleBlur("email")}
                        onChange={handleChange("email")}
                        placeholder=" "
                        required
                        type="email"
                        value={values.email}
                      />
                      <label htmlFor="email">Email Address</label>
                      <span className={styles.formError} id={fieldErrorId("email")} aria-live="polite">
                        {errors.email}
                      </span>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <select
                      aria-errormessage={fieldErrorId("projectType")}
                      aria-invalid={Boolean(errors.projectType)}
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
                    <span
                      className={styles.formError}
                      id={fieldErrorId("projectType")}
                      aria-live="polite"
                    >
                      {errors.projectType}
                    </span>
                  </div>

                  <div className={styles.formGroup}>
                    <textarea
                      aria-errormessage={fieldErrorId("message")}
                      aria-invalid={Boolean(errors.message)}
                      id="message"
                      name="message"
                      onBlur={handleBlur("message")}
                      onChange={handleChange("message")}
                      placeholder=" "
                      required
                      rows={5}
                      value={values.message}
                    />
                    <label htmlFor="message">Your Message</label>
                    <span className={styles.formError} id={fieldErrorId("message")} aria-live="polite">
                      {errors.message}
                    </span>
                  </div>

                  <div className={styles.formMetaGrid}>
                    <div className={styles.metaCard}>
                      <p className={styles.metaLabel}>Typical engagement</p>
                      <p className={styles.metaValue}>4-12 weeks</p>
                      <span className={styles.metaSubtext}>Strategy to shipping</span>
                    </div>
                    <div className={styles.metaCard}>
                      <p className={styles.metaLabel}>Collaboration style</p>
                      <p className={styles.metaValue}>Async + Live</p>
                      <span className={styles.metaSubtext}>Slack · Figma · Linear</span>
                    </div>
                  </div>

                  <button className={styles.submitBtn} disabled={isSubmitting} type="submit">
                    <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                  </button>
                </form>
              ) : (
                <div className={styles.formSuccess} role="status">
                  <h3>Message Sent Successfully!</h3>
                  <p>Thank you for reaching out. I&apos;ll get back to you within 24 hours.</p>
                </div>
              )}

              <div className={styles.calendarOption}>
                <p className={styles.calendarText}>Prefer to schedule a call instead?</p>
                <button className={styles.calendarBtn} onClick={handleCalendarClick} type="button">
                  <span>Schedule a Meeting</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section
          className={styles.section}
          data-visible={locationReveal.isVisible}
          id="location"
          ref={locationReveal.ref}
        >
          <div className={styles.locationGrid}>
            <article className={styles.locationCard}>
              <div className={styles.locationIcon} aria-hidden="true">
                KE
              </div>
              <h3 className={styles.locationTitle}>Location</h3>
              <p className={styles.locationValue}>Nairobi, Kenya</p>
              <p className={styles.locationDetail}>East Africa</p>
            </article>

            <article className={styles.locationCard}>
              <div className={styles.locationIcon} aria-hidden="true">
                TZ
              </div>
              <h3 className={styles.locationTitle}>Current Time</h3>
              <p className={styles.locationValue}>{currentTime}</p>
              <p className={styles.locationDetail}>East Africa Time (EAT)</p>
            </article>

            <article className={styles.locationCard}>
              <div className={styles.locationIcon} aria-hidden="true">
                ON
              </div>
              <h3 className={styles.locationTitle}>Availability</h3>
              <p className={styles.locationValue}>
                <span className={styles.availabilityStatus}>
                  <span className={styles.statusIndicator} aria-hidden="true" />
                  <span className={styles.statusMessage}>{availability.heading}</span>
                </span>
              </p>
              <p className={styles.locationDetail}>{availability.detail}</p>
            </article>
          </div>
        </section>

        <section
          className={styles.section}
          data-visible={faqReveal.isVisible}
          id="faq"
          ref={faqReveal.ref}
        >
          <header className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Frequently Asked</h2>
            <p className={styles.sectionSubtitle}>Common questions about working together</p>
          </header>

          <div className={styles.faqList}>
            {faqItems.map((item) => (
              <details className={styles.faqItem} key={item.question}>
                <summary className={styles.faqSummary}>
                  <span>{item.question}</span>
                  <span className={styles.faqIcon} aria-hidden="true">
                    v
                  </span>
                </summary>
                <div className={styles.faqAnswer}>
                  <p>{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        <div className={styles.toastHost}>
          {toast ? (
            <div
              aria-live={toast.type === "error" ? "assertive" : "polite"}
              role={toast.type === "error" ? "alert" : "status"}
            >
              {toast.message}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
