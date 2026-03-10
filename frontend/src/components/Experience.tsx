/**
 * Experience.tsx — Work Experience Section
 *
 * Displays Camilo's professional work history as a vertical timeline.
 * Each entry shows company, role, period, location, and key responsibilities.
 *
 * Entries are sorted most-recent first to match recruiter expectations.
 * The active tab pattern (common in dev portfolios) is used to keep
 * the section compact while showing full detail per role.
 */

import React, { useState } from "react";

/** A single work experience entry. */
interface ExperienceEntry {
  /** Company name. */
  company: string;
  /** Job title / role. */
  role: string;
  /** Employment period (human-readable). */
  period: string;
  /** Work location. */
  location: string;
  /** Key responsibilities as bullet points. */
  bullets: string[];
}

/** Full work history — most recent first. */
const EXPERIENCE: ExperienceEntry[] = [
  {
    company: "Credit Mountain",
    role: "Senior QA Automation Engineer",
    period: "Sep 2022 – Jan 2026",
    location: "Spain (Texas-based client)",
    bullets: [
      "Created TypeScript Cypress framework for web testing projects",
      "Implemented CI/CD pipelines using Docker, TypeScript, and Cypress",
      "Integrated testing workflows with Jira",
      "Designed and maintained test plans for Web and API applications",
    ],
  },
  {
    company: "Minded",
    role: "Senior QA Automation Engineer",
    period: "Jan 2021 – Jul 2022",
    location: "Buenos Aires (NY-based client)",
    bullets: [
      "Created JavaScript Cypress framework for web testing projects",
      "Implemented CI/CD pipelines using Docker, Jenkins, JavaScript, Cypress, and AWS",
      "Integrated testing workflows with Jira",
      "Designed and maintained test plans for Web, API, and microservices",
    ],
  },
  {
    company: "TeraCode",
    role: "Senior QA Automation Engineer",
    period: "Apr 2019 – Dec 2020",
    location: "Buenos Aires, Argentina",
    bullets: [
      "100% interaction with English-speaking teams",
      "Built Python automation frameworks for IoT and Data Science solutions",
      "Integrated tests with GitLab, Jira, Selenium, Appium, and AWS services",
      "Implemented CI/CD with Docker and AWS CodePipeline",
      "Conducted performance testing; designed plans for Mobile, Web, API, microservices",
    ],
  },
  {
    company: "Naranja (Digital Bank)",
    role: "Senior QA Analyst",
    period: "Aug 2018 – Apr 2019",
    location: "Buenos Aires, Argentina",
    bullets: [
      "Built Python + Appium framework for microservices and mobile testing",
      "Implemented CI/CD with Docker, Jenkins, GitLab, and Zephyr",
      "Conducted load testing with JMeter; functional testing with Postman and SoapUI",
    ],
  },
  {
    company: "Baufest",
    role: "Automation Test Engineer",
    period: "Nov 2017 – Aug 2018",
    location: "Buenos Aires, Argentina",
    bullets: [
      "Client: Gobierno de la Ciudad de Buenos Aires",
      "Implemented Katalon Studio (Groovy and JavaScript)",
      "Designed and delivered Katalon training for groups of 10+ people",
      "Built reporting framework using Jenkins, Jira, and Katalon",
    ],
  },
  {
    company: "Penta Security Solutions",
    role: "QA Automation Engineer & Functional Analyst",
    period: "Sep 2016 – Nov 2017",
    location: "Buenos Aires, Argentina",
    bullets: [
      "Built C# + Selenium framework for desktop and web applications",
      "Implemented HP UFT for UI automation",
      "Mentored and trained junior automation engineers",
      "Participated in Scrum ceremonies",
    ],
  },
  {
    company: "UAESP — Bogotá Mayor's Office",
    role: "Web Software Developer",
    period: "Oct 2010 – Feb 2016",
    location: "Bogotá, Colombia",
    bullets: [
      "Designed and developed two reporting applications using Joomla and SQL",
      "Provided user training for Planning Office applications",
    ],
  },
  {
    company: "SITA",
    role: "Support Level 2 Representative",
    period: "Mar 2009 – Sep 2010",
    location: "Montreal, Canada",
    bullets: [
      "Level 2 support in Spanish, English, French, and Portuguese",
      "Support for client operations software across Americas and Europe",
      "Automated call information loading processes",
    ],
  },
  {
    company: "Hewlett Packard Enterprise",
    role: "Customer Master Data Representative",
    period: "Jun 2006 – Apr 2009",
    location: "Bogotá, Colombia",
    bullets: [
      "Automated Excel-to-SAP R/3 data loading for Americas Sales Operations",
      "Designed and implemented automation apps for Brazil Operations Area",
      "Provided support and training to employees and channel partners",
    ],
  },
];

/**
 * Experience section component with tabbed navigation.
 *
 * @returns A section with company tabs on the left and detail on the right.
 */
const Experience: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = EXPERIENCE[activeIndex];

  return (
    <section id="experience" aria-labelledby="experience-heading">
      <h2 className="section-heading" id="experience-heading">
        <span className="section-number">02.</span> Experience
      </h2>

      <div style={styles.container}>
        {/* Company tab list */}
        <div style={styles.tabList} role="tablist" aria-label="Companies">
          {EXPERIENCE.map((entry, i) => (
            <button
              key={entry.company}
              role="tab"
              aria-selected={i === activeIndex}
              aria-controls={`panel-${i}`}
              style={{
                ...styles.tab,
                ...(i === activeIndex ? styles.tabActive : {}),
              }}
              onClick={() => setActiveIndex(i)}
            >
              {entry.company}
            </button>
          ))}
        </div>

        {/* Active experience panel */}
        <div
          id={`panel-${activeIndex}`}
          role="tabpanel"
          aria-label={active.company}
          style={styles.panel}
        >
          <h3 style={styles.role}>
            {active.role}{" "}
            <span style={styles.company}>@ {active.company}</span>
          </h3>
          <p style={styles.period}>
            {active.period} &nbsp;·&nbsp; {active.location}
          </p>
          <ul style={styles.bullets}>
            {active.bullets.map((bullet) => (
              <li key={bullet} style={styles.bullet}>
                <span style={styles.bulletArrow}>▹</span>
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    gap: "40px",
    flexWrap: "wrap",
  },
  tabList: {
    display: "flex",
    flexDirection: "column",
    minWidth: "160px",
    borderLeft: "2px solid var(--border)",
  },
  tab: {
    background: "none",
    border: "none",
    borderLeft: "2px solid transparent",
    color: "var(--text-secondary)",
    cursor: "pointer",
    fontFamily: "var(--font-mono)",
    fontSize: "13px",
    marginLeft: "-2px",
    padding: "10px 20px",
    textAlign: "left",
    transition: "var(--transition)",
    whiteSpace: "nowrap",
  },
  tabActive: {
    borderLeftColor: "var(--accent)",
    color: "var(--accent)",
    background: "rgba(100, 255, 218, 0.05)",
  },
  panel: {
    flex: 1,
    minWidth: "280px",
  },
  role: {
    fontSize: "20px",
    color: "var(--text-primary)",
    fontWeight: 500,
    marginBottom: "6px",
  },
  company: {
    color: "var(--accent)",
  },
  period: {
    fontFamily: "var(--font-mono)",
    fontSize: "13px",
    color: "var(--text-secondary)",
    marginBottom: "20px",
  },
  bullets: {
    listStyle: "none",
    padding: 0,
  },
  bullet: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    color: "var(--text-secondary)",
    fontSize: "15px",
    lineHeight: 1.6,
    marginBottom: "10px",
  },
  bulletArrow: {
    color: "var(--accent)",
    minWidth: "14px",
    fontSize: "14px",
    marginTop: "3px",
  },
};

export default Experience;
