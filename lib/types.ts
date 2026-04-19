export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface ExperienceItem {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface EducationItem {
  degree: string;
  school: string;
  location: string;
  graduationYear: string;
  gpa?: string;
}

export interface ResumeData {
  name: string;
  contact: ContactInfo;
  summary: string;
  experience: ExperienceItem[];
  skills: {
    technical: string[];
    soft?: string[];
  };
  education: EducationItem[];
  certifications?: string[];
}

export interface OptimizeResponse {
  resume: ResumeData;
  improvements: string[];
  keywordsAdded: string[];
  atsScore: number;
}
