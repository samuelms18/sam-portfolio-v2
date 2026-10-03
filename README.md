# Sam — Portfolio v2

Portfolio of **Sam, UI/UX Designer & UI/UX Developer**, built in the **Depth** direction: glass planes over a deep emerald scene lit by teal and coral light.

**Stack (all free):** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion · Three.js + React Three Fiber · hosted on Vercel.

## Roadmap

| Stage | What | Status |
|---|---|---|
| 1 | Foundation: design system, all pages, content, preloader, theme toggle, page-to-case-study morph | ✅ |
| 2 | 3D hero "The Untangling": a glass knot around the photo that untangles into a clean ring on scroll, plus floating 3D UI objects | ✅ |
| 3 | Scroll storytelling (GSAP ScrollTrigger) and route transitions | Next |
| 4 | Sanity CMS: edit projects, photos and text from a dashboard | |

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

## Content checklist

- [ ] LinkedIn URL → `site.socials.linkedin`
- [ ] Resume PDF → put it in `public/` and set `site.resume` (e.g. `"/Sam-Resume.pdf"`)
- [ ] Final photo → replace `public/images/sam.jpg`
- [ ] Project screenshots (blur confidential data) → will replace the schematic mocks
- [ ] Review each case study's text in `src/content/data.ts`
