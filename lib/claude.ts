import Anthropic from "@anthropic-ai/sdk";
import type { OptimizeResponse } from "./types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) resume optimizer and professional resume writer.
Your task is to analyze a candidate's resume against a job description and produce an optimized, ATS-friendly resume.

Rules:
- Mirror the exact keywords and phrases from the job description where truthful
- Quantify achievements with numbers/percentages wherever possible (estimate if not given)
- Use strong action verbs to start every bullet point
- Keep language concise and impactful
- Reorder skills/experience bullets to prioritize relevance to the JD
- Do NOT fabricate roles, companies, degrees, or dates
- Return ONLY valid JSON — no markdown, no prose outside the JSON object`;

const USER_PROMPT = (resumeText: string, jobDescription: string) => `
Analyze this resume against the job description and return an optimized resume as JSON.

--- ORIGINAL RESUME ---
${resumeText}

--- JOB DESCRIPTION ---
${jobDescription}

Return a JSON object with this exact shape:
{
  "resume": {
    "name": "string",
    "contact": {
      "email": "string",
      "phone": "string",
      "location": "string",
      "linkedin": "string or null",
      "github": "string or null",
      "website": "string or null"
    },
    "summary": "3-4 sentence professional summary tailored to the JD",
    "experience": [
      {
        "title": "string",
        "company": "string",
        "location": "string",
        "startDate": "Mon YYYY",
        "endDate": "Mon YYYY or Present",
        "bullets": ["action verb + achievement + impact metric", "..."]
      }
    ],
    "skills": {
      "technical": ["comma-separated technical skills matching JD keywords"],
      "soft": ["leadership", "communication", "..."]
    },
    "education": [
      {
        "degree": "string",
        "school": "string",
        "location": "string",
        "graduationYear": "YYYY",
        "gpa": "string or null"
      }
    ],
    "certifications": ["string", "..."]
  },
  "improvements": ["list of 3-5 specific improvements made"],
  "keywordsAdded": ["list of keywords from JD that were incorporated"],
  "atsScore": 85
}`;

export async function optimizeResume(
  resumeText: string,
  jobDescription: string
): Promise<OptimizeResponse> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: USER_PROMPT(resumeText, jobDescription),
      },
    ],
  });

  const textContent = response.content.find((c) => c.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text content in Claude response");
  }

  const raw = textContent.text.trim();
  // Strip markdown code fences if present
  const json = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");

  try {
    return JSON.parse(json) as OptimizeResponse;
  } catch {
    throw new Error("Claude returned invalid JSON. Please try again.");
  }
}
