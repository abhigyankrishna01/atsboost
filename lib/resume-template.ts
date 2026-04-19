import type { ResumeData } from "./types";

export function buildResumeHtml(resume: ResumeData): string {
  const { name, contact, summary, experience, skills, education, certifications } = resume;

  const contactParts = [
    contact.email && `<a href="mailto:${contact.email}">${contact.email}</a>`,
    contact.phone,
    contact.location,
    contact.linkedin && `<a href="https://${contact.linkedin}">${contact.linkedin}</a>`,
    contact.github && `<a href="https://${contact.github}">${contact.github}</a>`,
    contact.website && `<a href="https://${contact.website}">${contact.website}</a>`,
  ]
    .filter(Boolean)
    .join(" &bull; ");

  const experienceHtml = experience
    .map(
      (job) => `
    <div class="entry">
      <div class="entry-header">
        <div>
          <span class="entry-title">${job.title}</span>
          <span class="entry-company"> &mdash; ${job.company}</span>
          <span class="entry-location">, ${job.location}</span>
        </div>
        <span class="entry-dates">${job.startDate} &ndash; ${job.endDate}</span>
      </div>
      <ul class="bullets">
        ${job.bullets.map((b) => `<li>${b}</li>`).join("\n        ")}
      </ul>
    </div>`
    )
    .join("\n");

  const educationHtml = education
    .map(
      (ed) => `
    <div class="entry">
      <div class="entry-header">
        <div>
          <span class="entry-title">${ed.degree}</span>
          <span class="entry-company"> &mdash; ${ed.school}</span>
          <span class="entry-location">, ${ed.location}</span>
          ${ed.gpa ? `<span class="entry-gpa"> | GPA: ${ed.gpa}</span>` : ""}
        </div>
        <span class="entry-dates">${ed.graduationYear}</span>
      </div>
    </div>`
    )
    .join("\n");

  const technicalSkills = skills.technical.join(" &bull; ");
  const softSkills = skills.soft?.length ? skills.soft.join(" &bull; ") : null;

  const certsHtml =
    certifications?.length
      ? `<div class="section">
        <h2 class="section-title">Certifications</h2>
        <p>${certifications.join(" &bull; ")}</p>
      </div>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${name} — Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10.5pt;
      line-height: 1.45;
      color: #111;
      background: #fff;
      padding: 0.65in 0.65in 0.5in;
      max-width: 8.5in;
      margin: 0 auto;
    }

    /* ---------- Header ---------- */
    .resume-name {
      font-size: 22pt;
      font-weight: 700;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .resume-contact {
      font-size: 9pt;
      color: #333;
    }

    .resume-contact a {
      color: #1a56db;
      text-decoration: none;
    }

    /* ---------- Section ---------- */
    .section {
      margin-top: 14px;
    }

    .section-title {
      font-size: 10.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      color: #111;
      border-bottom: 1.5px solid #111;
      padding-bottom: 2px;
      margin-bottom: 8px;
    }

    /* ---------- Entry ---------- */
    .entry {
      margin-bottom: 9px;
    }

    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      flex-wrap: wrap;
      gap: 4px;
    }

    .entry-title {
      font-weight: 700;
    }

    .entry-company {
      font-style: italic;
    }

    .entry-location {
      color: #444;
    }

    .entry-gpa {
      color: #444;
    }

    .entry-dates {
      font-size: 9.5pt;
      white-space: nowrap;
      color: #333;
    }

    /* ---------- Bullets ---------- */
    .bullets {
      margin-top: 3px;
      margin-left: 18px;
    }

    .bullets li {
      margin-bottom: 2px;
    }

    /* ---------- Summary ---------- */
    .summary-text {
      line-height: 1.5;
    }

    /* ---------- Skills ---------- */
    .skills-row {
      margin-bottom: 3px;
    }

    .skills-label {
      font-weight: 700;
    }

    @media print {
      body { padding: 0.5in; }
      a { color: #111 !important; text-decoration: none !important; }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="resume-header">
    <div class="resume-name">${name}</div>
    <div class="resume-contact">${contactParts}</div>
  </div>

  <!-- Summary -->
  <div class="section">
    <h2 class="section-title">Professional Summary</h2>
    <p class="summary-text">${summary}</p>
  </div>

  <!-- Experience -->
  <div class="section">
    <h2 class="section-title">Professional Experience</h2>
    ${experienceHtml}
  </div>

  <!-- Skills -->
  <div class="section">
    <h2 class="section-title">Skills</h2>
    <div class="skills-row">
      <span class="skills-label">Technical: </span>${technicalSkills}
    </div>
    ${softSkills ? `<div class="skills-row"><span class="skills-label">Soft Skills: </span>${softSkills}</div>` : ""}
  </div>

  <!-- Education -->
  <div class="section">
    <h2 class="section-title">Education</h2>
    ${educationHtml}
  </div>

  ${certsHtml}
</body>
</html>`;
}
