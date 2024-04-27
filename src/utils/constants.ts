export const GEO_ID_SG = "102454443";
export const MCF_BASE_URL = "https://www.mycareersfuture.gov.sg/search";
export const LINKEDIN_BASE_URL = "https://www.linkedin.com/jobs/search";
export const SSG_MID_CAREER_URL =
  "https://www.myskillsfuture.gov.sg/content/portal/en/career-resources/career-resources/education-career-personal-development/SkillsFuture_Credit.html#:~:text=%5BFrom%201%20May%202024%5D%20SkillsFuture%20Credit%20(Mid%2DCareer)";
export const SSG_COURSE_BASE_URL =
  "https://www.myskillsfuture.gov.sg/content/portal/en/training-exchange/course-directory/course-detail.html";
export const ODL_ACCESS_DATE = "26 April 2024";
export const ODL_URL =
  "https://developer.ssg-wsg.gov.sg/webapp/terms-of-use#:~:text=SINGAPORE%20OPEN%20DATA%20LICENCE,-Acceptance";

export enum Steps {
  Home,
  JobTitle,
  FetchPostings,
  PastePostings,
  Skills,
  Courses,
}

export enum PostingOption {
  None = "no-postings",
  Fetch = "fetch-postings",
  Paste = "paste-postings",
}

export const PRICES = [
  0, 200, 400, 600, 800, 1000, 1200, 1500, 2000, 2500, 3000, 4000, 6000, 8000,
  10000, 25000, 50000, 75000,
];
const PRICE_LABELS = PRICES.map((price) => `$${price.toLocaleString()}`);
PRICE_LABELS.push("Max.");
export { PRICE_LABELS };

export const DURATIONS = [0, 35, 140, 420, 840, 1680];

export const DURATION_LABELS = [
  "Min.",
  "1 week",
  "1 month",
  "3 months",
  "6 months",
  "1 year",
  "Max.",
];
