import { LongformCaseStudyProject } from "./portfolio.types";

export const eduManageProject: LongformCaseStudyProject = {
  template: "longform-case-study",
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
  chapters: [
    {
      id: "crisis",
      label: "The Crisis",
      blocks: [
        {
          type: "text",
          lead:
            "Kenyan secondary schools implementing CBC face a scheduling crisis that manual spreadsheets cannot absorb cleanly anymore.",
          paragraphs: [
            "Administrators can spend weeks building timetables by hand, only to discover conflicts that trigger another round of revisions. The cost is time, stress, fairness, and regulatory risk.",
            "The problem is not abstract. Teachers worry about workload compliance, students lose access to preferred electives, and specialized facilities remain underused when the schedule cannot keep pace with the complexity."
          ]
        },
        {
          type: "stat-grid",
          items: [
            {
              value: "2-3 weeks",
              label: "Manual scheduling time",
              context: "Typical term-by-term effort."
            },
            {
              value: "15-20%",
              label: "Conflict rate",
              context: "Observed in manual schedules."
            },
            {
              value: "810+",
              label: "Elective combinations",
              context: "Unique combinations across one cohort."
            }
          ]
        }
      ]
    },
    {
      id: "complexity",
      label: "Why It Is Hard",
      blocks: [
        {
          type: "text",
          lead:
            "This is a constraint-satisfaction problem, not just a tedious spreadsheet exercise.",
          paragraphs: [
            "CBC elective choices create a combinatorial explosion. Students, teachers, rooms, periods, and regulatory rules all interact, and changing one variable sends ripple effects through the entire schedule.",
            "Hard constraints cannot be violated at all, while soft constraints still matter for the final usability of the timetable. That makes the search space both huge and unforgiving."
          ]
        },
        {
          type: "bullet-list",
          title: "Hard constraints",
          items: [
            "No teacher can teach two classes at once.",
            "No room can host overlapping classes.",
            "Teachers must remain within TSC workload rules.",
            "Students cannot be double-booked.",
            "The generated result must pass compliance validation before use."
          ]
        },
        {
          type: "bullet-list",
          title: "Soft constraints",
          items: [
            "Prioritize core subjects in high-focus morning slots.",
            "Balance workloads across teachers.",
            "Maximize elective satisfaction where possible.",
            "Use specialized rooms efficiently.",
            "Reduce unnecessary movement between spaces."
          ]
        }
      ]
    },
    {
      id: "approach",
      label: "The Approach",
      blocks: [
        {
          type: "text",
          lead:
            "The technical strategy was chosen to satisfy real-world constraints, not to chase fashionable tooling.",
          paragraphs: [
            "Constraint satisfaction was the right fit because the system had to guarantee valid timetables, not merely approximate them. Regulatory failure was not an acceptable outcome.",
            "The rest of the stack followed the same logic: async backend behavior for long-running generation, a frontend that could keep complex state comprehensible, and storage that could handle structured entities alongside flexible generated timetable documents."
          ]
        },
        {
          type: "cards",
          title: "Key decisions",
          items: [
            {
              title: "Constraint Satisfaction over Genetic Algorithms",
              body:
                "A near-correct timetable is still operationally wrong when TSC compliance is mandatory. CSP made correctness the baseline."
            },
            {
              title: "FastAPI over synchronous server defaults",
              body:
                "Generation can run for tens of seconds, so async request handling keeps the UI responsive and status-aware."
            },
            {
              title: "React + TypeScript on the frontend",
              body:
                "The product needed a complex but understandable interface for non-technical administrators managing high-stakes operations."
            }
          ]
        }
      ]
    },
    {
      id: "architecture",
      label: "Architecture",
      blocks: [
        {
          type: "text",
          lead:
            "EduManage is a full-stack system with one job per layer: interface, API, persistence, and the scheduling engine itself.",
          paragraphs: [
            "The frontend guides administrators through upload, configuration, generation, and timetable review. FastAPI exposes the backend workflow while PostgreSQL keeps entity integrity and timetable flexibility via JSONB.",
            "The algorithm engine handles clustering, constraint enforcement, optimization, and validation, which is where the product earns its reliability."
          ]
        },
        {
          type: "cards",
          title: "System layers",
          items: [
            {
              eyebrow: "Frontend",
              title: "React + TypeScript",
              body:
                "Wizard flows, timetable views, and progress states for non-technical users."
            },
            {
              eyebrow: "Backend",
              title: "FastAPI",
              body:
                "Async API surface for long-running generation tasks and status polling."
            },
            {
              eyebrow: "Database",
              title: "PostgreSQL + JSONB",
              body:
                "Entity integrity for school data plus flexible storage for generated timetables."
            },
            {
              eyebrow: "Algorithm",
              title: "CSP Engine",
              body:
                "Constraint pruning, backtracking, and optimization for valid schedule generation."
            }
          ]
        },
        {
          type: "sequence",
          title: "Generation pipeline",
          items: [
            {
              step: "1",
              title: "CSV Upload",
              description: "Students, teachers, subjects, and rooms enter the system."
            },
            {
              step: "2",
              title: "Validation",
              description: "Data integrity issues are surfaced before generation begins."
            },
            {
              step: "3",
              title: "Clustering",
              description: "Elective combinations are grouped into workable lesson structures."
            },
            {
              step: "4",
              title: "CSP Solve",
              description: "The engine searches for a valid timetable under hard constraints."
            },
            {
              step: "5",
              title: "Compliance Check",
              description: "Generated output is validated against TSC rules."
            },
            {
              step: "6",
              title: "Export",
              description: "Timetables can be reviewed and distributed in multiple formats."
            }
          ]
        }
      ]
    },
    {
      id: "results",
      label: "Results",
      blocks: [
        {
          type: "stat-grid",
          items: [
            {
              value: "45 sec",
              label: "Generation time",
              context: "Down from weeks of manual effort."
            },
            {
              value: "100%",
              label: "TSC compliance",
              context: "Across generated timetables."
            },
            {
              value: "<1%",
              label: "Conflict rate",
              context: "Near-zero conflicts after generation."
            },
            {
              value: "85%",
              label: "Elective satisfaction",
              context: "Improvement target remains 95%."
            }
          ]
        },
        {
          type: "text",
          lead:
            "The system produced measurable operational value while still surfacing honest limits.",
          paragraphs: [
            "The dramatic time reduction changes what administrators can spend their time on, and the compliance guarantees reduce the risk of painful late-stage corrections.",
            "The product is still honest about tradeoffs. Elective satisfaction can improve further, multi-school support remains a future step, and mobile usage was intentionally deprioritized in favor of desktop administrator workflows."
          ]
        },
        {
          type: "bullet-list",
          title: "Current limitations",
          items: [
            "Elective satisfaction still sits below the long-term target.",
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
      blocks: [
        {
          type: "cards",
          title: "What the project taught me",
          items: [
            {
              title: "Domain knowledge beats generic cleverness",
              body:
                "Real educational constraints shaped the correct solution more than abstract algorithm familiarity ever could."
            },
            {
              title: "Performance is a product feature",
              body:
                "The sub-60-second goal changed the architecture and the optimization strategy from the very beginning."
            },
            {
              title: "Compliance requirements are architecture requirements",
              body:
                "TSC rules were not edge cases; they determined the system's entire correctness model."
            },
            {
              title: "Full-stack thinking compounds",
              body:
                "The strongest decisions came from seeing how algorithm output, API shape, data model, and UI all influenced each other."
            }
          ]
        },
        {
          type: "text",
          paragraphs: [
            "EduManage reinforced that great software for serious domains is built by understanding the domain deeply enough to let it shape the product. That is what made the system practical instead of merely impressive.",
            "It also sharpened how I think about product engineering: the right architecture is the one that keeps technical correctness and human usability aligned under pressure."
          ]
        }
      ]
    }
  ]
};
