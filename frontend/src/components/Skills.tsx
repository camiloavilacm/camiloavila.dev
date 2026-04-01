/**
 * Skills.tsx — Technical Skills Section
 *
 * Displays Camilo's technical skills grouped into categories:
 * - Automation Frameworks
 * - Programming Languages
 * - Cloud & DevOps
 * - Core Competencies
 *
 * Each skill group is rendered as a card with tag pills.
 * This layout makes it easy for recruiters to scan skills at a glance.
 */

import React from "react";

/** A single skill group with a title and list of skills. */
interface SkillGroup {
  /** Category title displayed as the card heading. */
  title: string;
  /** Individual skill tags shown as pills inside the card. */
  skills: string[];
}

/** All skill groups to display in the section. */
const SKILL_GROUPS: SkillGroup[] = [
  {
    title: "Test Automation",
    skills: ["Cypress", "Puppeteer", "Selenium", "Appium", "Katalon Studio", "HP UFT"],
  },
  {
    title: "Programming Languages",
    skills: ["Python", "TypeScript", "JavaScript"],
  },
  {
    title: "Cloud & DevOps",
    skills: [
      "AWS Lambda",
      "Amazon S3",
      "Amazon Bedrock",
      "AWS CodePipeline",
      "Jenkins",
      "GitLab CI",
      "GitHub Actions",
    ],
  },
  {
    title: "API & Performance",
    skills: ["Postman", "SoapUI", "JMeter", "REST APIs", "Microservices"],
  },
  {
    title: "Core Competencies",
    skills: [
      "Test Automation Patterns",
      "CI/CD Integration",
      "Team Management",
      "Agile / Scrum",
      "Critical Thinking",
      "API Testing",
    ],
  },
  {
    title: " Industry Experience",
    skills: [
      "Financial Services (Digital Banking)",
      "IoT (Internet of Things)",
      "Data Science & Analytics",
      "Government & Public Sector",
    ],
  },
    {
    title: " Project Management & Collaboration",
    skills: [
      "Issue Tracking: Jira, Linear",
      "Design Tools: Figma",
      "Documentation: Confluence, Notion",
      "Collaboration: Miro",
    ],
  },
  {
    title: "Languages Spoken",
    skills: ["Spanish (Native)", "English (Full)", "French (Full)", "Portuguese (Full)", "Italian (Limited)"],
  },
];

/**
 * Skills section component.
 *
 * @returns A grid of skill category cards with tag pills.
 */
const Skills: React.FC = () => {
  return (
    <section id="skills" aria-labelledby="skills-heading">
      <h2 className="section-heading" id="skills-heading">
        <span className="section-number">01.</span> Skills
      </h2>

      <div style={styles.grid}>
        {SKILL_GROUPS.map((group) => (
          <div key={group.title} className="card" style={styles.card}>
            <h3 style={styles.groupTitle}>{group.title}</h3>
            <div style={styles.tagList}>
              {group.skills.map((skill) => (
                <span key={skill} className="tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
  },
  card: {
    minHeight: "120px",
  },
  groupTitle: {
    fontSize: "16px",
    color: "var(--accent)",
    fontFamily: "var(--font-mono)",
    marginBottom: "14px",
  },
  tagList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
  },
};

export default Skills;
