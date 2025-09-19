"use client";

import RichTextEditor from "@/components/RichTextEditor";
import styles from "./page.module.css";

const DEFAULT_CONTENT = `
  <h1>Project Launch Brief</h1>
  <p>Welcome to your brand-new WYSIWYG editor. This default template helps you capture the vision for your next big idea.</p>
  <h2>Objectives</h2>
  <ul>
    <li>Summarise the project goals in clear, actionable language.</li>
    <li>Highlight the customer value proposition and success metrics.</li>
    <li>Outline the first milestones for the project team.</li>
  </ul>
  <h2>Launch Checklist</h2>
  <ol>
    <li>Identify the core team and confirm responsibilities.</li>
    <li>Share the target launch date and communication channels.</li>
    <li>Capture risks, assumptions, and dependencies.</li>
  </ol>
  <blockquote>
    Remember: a concise plan keeps the team focused and aligned.
  </blockquote>
  <p>
    You can customise this content freely—format headings, change colours, align text, and export an exact PDF replica of what you see.
  </p>
`;

export default function Home() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <RichTextEditor defaultTitle="Project Brief" initialContent={DEFAULT_CONTENT} />
      </div>
    </main>
  );
}
