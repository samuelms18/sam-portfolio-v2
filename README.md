# Sam — Portfolio v2

Portfolio of **Sam, UI/UX Designer & UI/UX Developer**, built in the **Depth** direction: glass planes over a deep emerald scene lit by teal and coral light.

**Stack (all free):** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion · GSAP (ScrollTrigger, SplitText) · Sanity · hosted on Vercel.

## Roadmap

| Stage | What | Status |
|---|---|---|
| 1 | Foundation: design system, all pages, content, preloader, theme toggle, page-to-case-study morph | ✅ |
| 2 | Hero self-intro video: silent looping preview in the hero card, full video with sound in a dialog (photo until the video is added) | ✅ |
| 3 | Scroll storytelling (GSAP): masked heading reveals, depth-in cards, pinned horizontal process, pinned wireframe → visual wipe, scroll-reactive marquee, hero scroll-out, page transitions | ✅ |
| 4 | Sanity content dashboard at `/studio`: profile, projects (with real screenshots), experience and education | ✅ |

## Content dashboard (Sanity) — one-time setup

Until these steps are done the site uses the built-in content in `src/content/data.ts`, so nothing breaks.

1. Sign in at **https://www.sanity.io/manage** (GitHub login works) and **Create project** → name it *Sam Portfolio*, dataset **production**, plan **Free**. Copy the **Project ID**.
2. In the project: **API → CORS origins → Add**:
   - `https://sam-portfolio-v2.vercel.app` with **Allow credentials** ticked
   - `http://localhost:3000` with **Allow credentials** ticked
3. In **Vercel → sam-portfolio-v2 → Settings → Environment Variables** add `NEXT_PUBLIC_SANITY_PROJECT_ID` = your Project ID, then **Deployments → Redeploy**.
4. Import the current content once (so you don't retype it): in Sanity **API → Tokens → Add token** (Editor), then on your computer:
   ```bash
   NEXT_PUBLIC_SANITY_PROJECT_ID=yourid SANITY_API_WRITE_TOKEN=yourtoken npm run seed
   ```
   Delete the token afterwards.
5. Open **https://sam-portfolio-v2.vercel.app/studio**, sign in, and edit. Published changes appear on the site within about a minute.

In the dashboard: **Profile & site** (photo, headline, bio, links, skills…), **Projects** (text, order, filters, **cover screenshot + more screens** — these replace the drawn illustrations), **Experience**, **Education**.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all pages are static)
npm run lint
```

## Where things live

```
src/content/index.ts     ← getContent(): Sanity when configured, otherwise data.ts (merged field by field)
src/content/data.ts      ← built-in content: bio, projects (case studies), skills, experience, education, links
src/sanity/              ← dashboard schemas, client, env · sanity.config.ts · app/studio
scripts/seed-sanity.mjs  ← one-time import of data.ts into Sanity (npm run seed)
src/content/types.ts     ← content types
public/images/sam.jpg    ← your photo (replace the file to change it everywhere)
src/app/(site)/          ← pages: /, /work, /work/[slug], /about, /contact
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
