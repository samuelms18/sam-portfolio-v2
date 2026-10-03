# Sam — Portfolio v2

Portfolio of **Sam, UI/UX Designer & UI/UX Developer**, built in the **Depth** direction: glass planes over a deep emerald scene lit by teal and coral light.

**Stack (all free):** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion · GSAP (ScrollTrigger, SplitText) · hosted on Vercel.

## Roadmap

| Stage | What | Status |
|---|---|---|
| 1 | Foundation: design system, all pages, content, preloader, theme toggle, page-to-case-study morph | ✅ |
| 2 | Hero self-intro video: silent looping preview in the hero card, full video with sound in a dialog (photo until the video is added) | ✅ |
| 3 | Scroll storytelling (GSAP): masked heading reveals, depth-in cards, pinned horizontal process, pinned wireframe → visual wipe, scroll-reactive marquee, hero scroll-out, page transitions | ✅ |
| 4 | Sanity CMS: edit projects, photos and text from a dashboard | Next |

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all pages are static)
npm run lint
```

## Where things live

```
src/content/data.ts      ← all text: bio, projects (case studies), skills, experience, education, links
src/content/types.ts     ← content types
public/images/sam.jpg    ← your photo (replace the file to change it everywhere)
src/app/                 ← pages: /, /work, /work/[slug], /about, /contact
src/components/          ← Hero, Header, Footer, ProjectCard, Preloader, ContactForm, …
src/lib/mocks.ts         ← schematic UI illustrations used instead of confidential screens
src/app/globals.css      ← design tokens (both themes) and component styles
```

## Deploy on Vercel (free)

1. Sign in at https://vercel.com with GitHub.
2. **Add New → Project →** import `sam-portfolio-v2` → **Deploy**. No settings needed.
3. Every push to `main` redeploys automatically.
4. Optional: set `NEXT_PUBLIC_WEB3FORMS_KEY` (see `.env.example`) so the contact form sends emails directly.
5. If your Vercel address differs from `https://sam-portfolio-v2.vercel.app`, update `site.url` in `src/content/data.ts`.

## Intro video

1. Put the files in `public/videos/` — `intro.mp4` (H.264 + AAC), optionally `intro-preview.mp4` (5–8 s, silent loop) and `intro.vtt` (subtitles).
2. In `src/content/data.ts` set `introVideo: "/videos/intro.mp4"`, `introLength: "0:45"`, and optionally `introPreview` / `introCaptions`.
3. Keep `intro.mp4` under ~15 MB (1080p, CRF 23–26, `-movflags +faststart`) so it starts fast.

## Content checklist

- [ ] LinkedIn URL → `site.socials.linkedin`
- [ ] Resume PDF → put it in `public/` and set `site.resume` (e.g. `"/Sam-Resume.pdf"`)
- [ ] Final photo → replace `public/images/sam.jpg`
- [ ] Project screenshots (blur confidential data) → will replace the schematic mocks
- [ ] Review each case study's text in `src/content/data.ts`
