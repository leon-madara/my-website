import type {
  AboutHeroContent,
  AboutIntroContent,
  CertificationItem,
  EducationItem,
  ExperienceItem,
  ExpertiseItem,
  ProjectItem,
  SkillCategory
} from "./about.types";

export const aboutHeroContent: AboutHeroContent = {
  eyebrow: "About",
  name: "Leon Madara",
  imageSrc: "/images/lion1.PNG",
  imageAlt: "Lion illustration representing Leon Madara"
};

export const aboutIntroContent: AboutIntroContent = {
  eyebrow: "About Me",
  summary:
    "Full Stack AI Developer & Designer with over a decade of hands-on experience across data, product, and interface work. I bring analytical rigour and sharp interface instincts to every build — from interactive dashboards to full-stack AI-integrated web products."
};

export const expertiseItems: ExpertiseItem[] = [
  {
    title: "Web Design & Development",
    description:
      "Combining analytical rigor with intuitive design. I build responsive websites and dashboards using modern code while keeping accessibility and user-centered layouts in focus.",
    tags: [
      "React",
      "Tailwind CSS",
      "JavaScript",
      "Figma",
      "Adobe XD",
      "UI/UX",
      "Accessibility"
    ],
    featured: true,
    icon: "💻"
  },
  {
    title: "UI/UX Design",
    description:
      "Designing interfaces in Figma and Adobe XD with an emphasis on clarity, accessibility, and easy-to-use flows.",
    icon: "🎨"
  },
  {
    title: "Data Analysis",
    description:
      "Designing visual reports with PowerBI, Tableau, and SQL to help teams make informed decisions.",
    icon: "📊"
  }
];

export const skillCategories: SkillCategory[] = [
  {
    title: "Data Tools",
    tags: ["SQL", "Excel", "SPSS", "PowerBI", "Tableau", "Metabase", "Looker"]
  },
  {
    title: "Web Development",
    tags: ["HTML5", "CSS3", "JavaScript", "React", "Tailwind CSS", "Git", "Vite"]
  },
  {
    title: "UI/UX Design",
    tags: ["Figma", "Adobe XD", "Prototyping", "Usability Testing", "Accessibility"]
  },
  {
    title: "Other",
    tags: ["Python", "Responsive Design", "Google Analytics", "Problem-Solving"]
  }
];

export const experienceItems: ExperienceItem[] = [
  {
    role: "analyst",
    date: "2015 - 2018",
    title: "Junior Analyst",
    location: "Mumias Sugar Company - Kakamega County, Mumias Town",
    chips: ["BI", "SQL", "Automation"],
    highlights: [
      "Analyzed operational and financial data to support strategic planning and day-to-day decisions.",
      "Built dashboards and visual reports in PowerBI, Tableau, and Looker for stakeholder visibility.",
      "Automated recurring analysis tasks with SQL and Excel to reduce manual reporting overhead.",
      "Partnered with cross-functional teams to improve data accuracy and dashboard usability."
    ],
    links: [{ label: "See relevant work", to: "/portfolio" }]
  },
  {
    role: "freelance",
    date: "2019 - 2024",
    title: "Freelance Web Developer & UX Designer",
    location: "Remote / Contract-Based",
    chips: ["React", "UI/UX", "Analytics"],
    highlights: [
      "Built responsive websites and dashboards using HTML, CSS, JavaScript, React, and Tailwind CSS.",
      "Designed UI systems in Figma and Adobe XD with a focus on clarity, accessibility, and usability.",
      "Integrated analytics tools such as Google Analytics and Metabase to support iteration and optimization.",
      "Delivered intuitive, data-rich user experiences for startups and SMEs.",
      "Collaborated with stakeholders to scope requirements, ship milestones, and refine features through feedback."
    ],
    links: [{ label: "View projects", to: "/portfolio" }]
  },
  {
    role: "company",
    date: "July 2024 - Present",
    title: "Code by Leon",
    subtitle: "Visual Web Experiences for Growing Businesses",
    location: "Nairobi, Kenya / Remote",
    chips: ["Product design", "Full-stack builds", "Business growth"],
    highlights: [
      "Founded Code by Leon to build visual, high-performing websites and web apps for growth-focused businesses.",
      "Delivered end-to-end engagements across discovery, UX, development, and launch with clear handoff documentation.",
      "Built modern React and TypeScript solutions designed for performance, accessibility, and maintainability.",
      "Designed interfaces that balance brand, clarity, and conversion across mobile and desktop.",
      "Implemented analytics-ready foundations to support iteration, measurement, and continuous improvement.",
      "Partnered with clients to turn ideas into shippable roadmaps and reliable releases."
    ],
    links: [
      { label: "Explore case studies", to: "/portfolio" },
      { label: "Start a project", to: "/contact" }
    ]
  }
];

export const educationItems: EducationItem[] = [
  {
    degree: "Bachelor of Science in Computer Science",
    institution: "University of Nairobi",
    honors: "Second Upper Class Honors",
    years: "2009 - 2013",
    icon: "🎓"
  },
  {
    degree: "High School Education",
    institution: "Booker Academy",
    years: "2005 - 2008",
    icon: "📚"
  }
];

export const projectItems: ProjectItem[] = [
  {
    title: "Data Dashboards",
    description:
      "Built and deployed real-time dashboards for business clients to visualize KPIs with Tableau and Metabase.",
    tags: ["Tableau", "Metabase", "Data Viz"],
    icon: "📊"
  },
  {
    title: "UX Audit & Redesign",
    description:
      "Redesigned a logistics dashboard for mobile responsiveness and smoother user flows.",
    tags: ["Figma", "UX Research", "Responsive"],
    icon: "🎨"
  },
  {
    title: "React Portfolio Website",
    description:
      "Created a personal website showcasing work in web development, UI/UX, and data analysis.",
    tags: ["React", "CSS", "JavaScript"],
    icon: "💻"
  }
];

export const certificationItems: CertificationItem[] = [
  {
    title: "Google Data Analytics Certificate",
    issuer: "Google - Professional Certificate",
    issuerLabel: "Google",
    badge: "Verified",
    badgeVariant: "verified",
    years: "2022 - 2023",
    metrics: [
      { value: "180+", label: "Hours" },
      { value: "8", label: "Courses" }
    ],
    skills: ["SQL", "R Programming", "Tableau", "Data Analysis"],
    topics: [
      "Data cleaning and preparation",
      "Data visualization and dashboards",
      "Statistical analysis"
    ],
    verifyHref:
      "https://www.coursera.org/professional-certificates/google-data-analytics"
  },
  {
    title: "Responsive Web Design",
    issuer: "freeCodeCamp - Certification",
    issuerLabel: "freeCodeCamp",
    badge: "In Progress",
    badgeVariant: "progress",
    years: "Ongoing",
    metrics: [
      { value: "300+", label: "Hours" },
      { value: "85%", label: "Complete" }
    ],
    skills: ["HTML5", "CSS3", "Accessibility", "Flexbox/Grid"],
    topics: [
      "Responsive design principles",
      "CSS Grid and Flexbox layouts",
      "Web accessibility standards"
    ],
    verifyHref:
      "https://www.freecodecamp.org/certification/leon-madara/responsive-web-design",
    viewHref: "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
    viewLabel: "View Course"
  },
  {
    title: "Meta Front-End Developer",
    issuer: "Meta - Professional Certificate",
    issuerLabel: "Meta",
    badge: "Verified",
    badgeVariant: "verified",
    years: "2023 - 2024",
    metrics: [
      { value: "200+", label: "Hours" },
      { value: "9", label: "Courses" }
    ],
    skills: ["React", "JavaScript", "UI/UX", "Version Control"],
    topics: [
      "React components and hooks",
      "Advanced JavaScript concepts",
      "UI/UX design principles"
    ],
    verifyHref:
      "https://www.coursera.org/professional-certificates/meta-front-end-developer"
  },
  {
    title: "Google UX Design Professional Certificate",
    issuer: "Google - Professional Certificate",
    issuerLabel: "Google",
    badge: "Verified",
    badgeVariant: "verified",
    years: "2023 - 2024",
    metrics: [
      { value: "200+", label: "Hours" },
      { value: "7", label: "Courses" }
    ],
    skills: ["Figma", "Prototyping", "UX Research", "Wireframing"],
    topics: [
      "User research and testing",
      "Prototyping and wireframing",
      "Design systems and accessibility"
    ],
    verifyHref:
      "https://www.coursera.org/professional-certificates/google-ux-design"
  }
];
