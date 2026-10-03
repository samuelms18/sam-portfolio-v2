export type Socials = { linkedin: string; github: string; behance: string; dribbble: string };

export type Site = {
  name: string;
  role: string;
  location: string;
  intro: string;
  introAlt: string;
  support: string;
  /** Production URL, used for metadata and link previews. */
  url: string;
  /** Leave empty to hide. */
  email: string;
  /** Path under /public, e.g. "/Sam-Resume.pdf". Empty hides the button. */
  resume: string;
  photo: string;
  /** Self-intro video under /public, e.g. "/videos/intro.mp4". Empty shows the photo instead. */
  introVideo: string;
  /** Optional short, silent loop for the hero card (defaults to introVideo, muted). */
  introPreview: string;
  /** Optional WebVTT subtitles, e.g. "/videos/intro.vtt". */
  introCaptions: string;
  /** Shown on the play button, e.g. "0:45". */
  introLength: string;
  socials: Socials;
  currently: string;
};

export type MockType = 'dashboard' | 'planner' | 'mobile' | 'commerce' | 'portal' | 'form';

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  category: string[];
  role: string;
  tools: string[];
  domain: string;
  platform: string;
  focus: string[];
  mock: MockType;
  /** Hue (0–360) that tints this project's accents. */
  hue: number;
  context: string;
  problem: string;
  myRole: string;
  understanding: string[];
  process: string[];
  wireframes?: string;
  visual?: string;
  prototype?: string;
  development?: string;
  outcome: string[];
  learnings: string;
};

export type Experience = { company: string; role: string; period: string; text: string; highlights?: string[] };
export type Education = { title: string; place: string; year: string; grade?: string };
export type SkillGroup = { group: string; items: string[] };
export type Principle = { title: string; text: string };
export type ProcessStep = { step: string; text: string };
