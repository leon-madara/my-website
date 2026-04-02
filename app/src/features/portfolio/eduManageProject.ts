import { LegacyAccordionCaseStudyProject } from "./portfolio.types";

export const eduManageProject: LegacyAccordionCaseStudyProject = {
  template: "legacy-accordion-case-study",
  slug: "edumanage",
  badge: "03",
  title: "EduManage SMS",
  tagline: "AI-powered automated timetable generator for Kenyan secondary schools.",
  status: "Production-Ready",
  timeline: "3 months",
  role: "Full Stack Developer",
  techStack: [
    "React 18",
    "TypeScript",
    "FastAPI",
    "PostgreSQL",
    "Docker",
    "NumPy/Pandas"
  ],
  links: {
    github: "https://github.com/leon-madara/school-management-system/"
  },
  hero: {
    eyebrow: "Case Study 03",
    intro:
      "EduManage SMS tackles a high-stakes scheduling problem inside Kenyan secondary schools, combining domain research, constraint-solving, and product design into one production-ready system."
  },
  seo: {
    title: "EduManage SMS | Leon Madara",
    description:
      "Long-form case study covering the education problem space, algorithm decisions, architecture, and measured impact behind EduManage SMS.",
    keywords: ["EduManage", "portfolio", "education", "FastAPI", "CSP"]
  },
  preview: {
    summary:
      "A long-form case study about solving CBC timetabling with a constraint-based engine, real regulatory rules, and a product designed for school administrators.",
    highlights: [
      "45-second timetable generation",
      "100% TSC compliance",
      "Constraint satisfaction engine",
      "Full-stack product delivery"
    ]
  },
  sections: [
    {
      id: "crisis",
      label: "The Crisis",
      number: "01",
      pages: [
        {
          id: "overview",
          title: "The Crisis",
          body: [
            "Kenyan secondary schools implementing CBC face a scheduling crisis that manual spreadsheets cannot absorb cleanly anymore.",
            "Administrators can spend weeks building timetables by hand, only to discover conflicts that trigger another round of revisions. The cost is time, stress, fairness, and regulatory risk.",
            "Teachers worry about workload compliance, students lose access to preferred electives, and specialized facilities remain underused when the schedule cannot keep pace with the complexity."
          ]
        }
      ]
    },
    {
      id: "complexity",
      label: "Why It Is Hard",
      number: "02",
      pages: [
        {
          id: "constraints",
          title: "Why It Is Hard",
          body: [
            "This is a constraint-satisfaction problem, not just a tedious spreadsheet exercise.",
            "CBC elective choices create a combinatorial explosion. Students, teachers, rooms, periods, and regulatory rules all interact, and changing one variable sends ripple effects through the entire schedule.",
            "Hard constraints cannot be violated at all, while soft constraints still matter for the final usability of the timetable. That makes the search space both huge and unforgiving."
          ]
        },
        {
          id: "hard-soft",
          title: "Hard vs Soft Constraints",
          body: [
            "Hard constraints must always hold: no double-booked teachers, no overlapping rooms, students cannot be scheduled into two classes at once, and TSC workload rules must be respected.",
            "Soft constraints optimize the result: morning priority for core subjects, workload balance, elective satisfaction, efficient lab utilization, and reduced movement between buildings."
          ]
        }
      ]
    },
    {
      id: "approach",
      label: "The Approach",
      number: "03",
      pages: [
        {
          id: "strategy",
          title: "Strategy",
          body: [
            "The technical strategy was chosen to satisfy real-world constraints, not to chase fashionable tooling.",
            "Constraint satisfaction was the right fit because the system had to guarantee valid timetables, not merely approximate them. Regulatory failure was not an acceptable outcome.",
            "The rest of the stack followed the same logic: async backend behavior for long-running generation, a frontend that could keep complex state comprehensible, and storage that could handle structured entities alongside flexible generated timetable documents."
          ]
        },
        {
          id: "decisions",
          title: "Key Decisions",
          body: [
            "Constraint Satisfaction over Genetic Algorithms: near-correct schedules are still operationally wrong when compliance is mandatory.",
            "FastAPI for async request handling: generation can run for tens of seconds, so the UI stays responsive with status-aware progress.",
            "React + TypeScript on the frontend: complex UI stays understandable and safer to evolve when the data model is explicit."
          ]
        }
      ]
    },
    {
      id: "architecture",
      label: "Architecture",
      number: "04",
      pages: [
        {
          id: "system",
          title: "System Architecture",
          body: [
            "EduManage is a full-stack system with one job per layer: interface, API, persistence, and the scheduling engine itself.",
            "The frontend guides administrators through upload, configuration, generation, and timetable review. FastAPI exposes the backend workflow while PostgreSQL keeps entity integrity and timetable flexibility via JSONB.",
            "The algorithm engine handles clustering, constraint enforcement, optimization, and validation, which is where the product earns its reliability."
          ]
        },
        {
          id: "pipeline",
          title: "Generation Pipeline",
          body: [
            "1. CSV Upload: Students, teachers, subjects, and rooms enter the system.",
            "2. Validation: Data integrity issues are surfaced before generation begins.",
            "3. Clustering: Elective combinations are grouped into workable lesson structures.",
            "4. CSP Solve: The engine searches for a valid timetable under hard constraints.",
            "5. Compliance Check: Generated output is validated against TSC rules.",
            "6. Export: Timetables can be reviewed and distributed in multiple formats."
          ]
        }
      ]
    },
    {
      id: "results",
      label: "Results",
      number: "05",
      pages: [
        {
          id: "impact",
          title: "Measured Impact",
          body: [
            "Generation time: 45 seconds (down from weeks of manual effort).",
            "TSC compliance: 100% across generated timetables.",
            "Conflict rate: near-zero after generation.",
            "Elective satisfaction: 85% today, with a long-term target of 95%."
          ]
        },
        {
          id: "limits",
          title: "Honest Limitations",
          body: [
            "Elective satisfaction still sits below the long-term target when compliance conflicts with preference.",
            "The current system is optimized for single-school deployment.",
            "The administrator workflow is desktop-first, not mobile-first.",
            "Initial setup still relies on structured CSV imports."
          ]
        }
      ]
    },
    {
      id: "learnings",
      label: "Learnings",
      number: "06",
      pages: [
        {
          id: "takeaways",
          title: "What I Learned",
          body: [
            "Domain knowledge beats generic cleverness: real educational constraints shape the correct solution.",
            "Performance is a product feature: the sub-60-second goal shaped architecture from the start.",
            "Compliance requirements are architecture requirements: TSC rules define the correctness model.",
            "Full-stack thinking compounds: algorithm output, API shape, data model, and UI influence each other."
          ]
        }
      ]
    }
  ]
};
