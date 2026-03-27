export interface ContactCard {
  title: string;
  label: string;
  value: string;
  href: string;
  actionLabel: string;
  copyLabel?: string;
  featured?: boolean;
  variant: "github" | "phone" | "email";
}

export const contactCards: ContactCard[] = [
  {
    title: "GitHub",
    label: "View My Code",
    value: "@leon-madara",
    href: "https://github.com/leon-madara",
    actionLabel: "Visit Profile",
    variant: "github"
  },
  {
    title: "Phone",
    label: "Direct Line",
    value: "+254 704 505 523",
    href: "tel:+2547045050523",
    actionLabel: "Call Now",
    copyLabel: "Copy",
    variant: "phone"
  },
  {
    title: "Email",
    label: "Primary Contact",
    value: "leon.madara@outlook.com",
    href: "mailto:leon.madara@outlook.com",
    actionLabel: "Send Email",
    copyLabel: "Copy",
    featured: true,
    variant: "email"
  }
];

export const faqItems = [
  {
    question: "What's your typical response time?",
    answer:
      "I typically respond to emails within 24 hours during weekdays. For urgent matters, a direct call is the fastest way to reach me."
  },
  {
    question: "What types of projects do you take on?",
    answer:
      "I specialize in full-stack product development with a focus on AI integration, web applications, and custom software. My core stack includes React, TypeScript, Node.js, Python, and modern frontend systems."
  },
  {
    question: "Do you work with international clients?",
    answer:
      "Yes. I work with clients globally and plan communication around time zones using a mix of async updates and live working sessions."
  },
  {
    question: "How do we get started?",
    answer:
      "Send a short brief through the contact form or email me directly. From there we can schedule a discovery call, align on scope and timeline, and move into a practical proposal."
  }
];

export const projectTypeOptions = [
  { value: "", label: "Select Project Type" },
  { value: "web-development", label: "Web Development" },
  { value: "ai-integration", label: "AI Integration" },
  { value: "consultation", label: "Consultation" },
  { value: "other", label: "Other" }
];

export const formBadges = [
  "Discovery Call",
  "Product Blueprint",
  "Launch Support"
];

export const panelTags = [
  "Web Apps",
  "AI Solutions",
  "SaaS Products",
  "Custom Software"
] as const;
