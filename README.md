# Λletheia — Website Oficial · RC1 documentation + Academy

**Website content update — 11 November 2026**  
Preserves the established visual identity and original logo. Primary technical content now follows *v1.0-RC1* (draft PR #5, based on Rev13). The language repository main is not changed. No writes to `Antoniorjr4/Aletheia` or `Antoniorjr4/Aletheia-Lab` are performed.

## View locally — one command

From the project directory:

```bash
python -m http.server 8080
```

Open **http://localhost:8080** in a browser. If `python` is unavailable, `npx serve .` is an alternative (requires Node/npm). The site is static: no server runtime, secrets, Node installation or API keys are needed.

### Pages

- `index.html` — brand home, philosophy, compiler architecture, code samples and research summary, with versioned/review status.
- `docs.html` — searchable technical library with 15+ chapters, TOC, code-copy tools and source PDFs.
- `academy.html` — nine bilingual lessons with source-grounded examples, short quizzes, local-only progress and a capstone. No certification, no browser compiler.\n- `playground.html` — educational local syntax/analyzer demonstration. **Not a WASM/real `athc` compilation or LLM call.**
- `research.html` — four research dashboards: AgentDojo, M1, formal proofs, runtime evidence.

The EN/PT switch remembers the selected language locally. Main prose and editorial landing pages are localized; research tabular data and CLI syntax deliberately retain canonical English notation.

### Real tools vs website visualization

The frontend **does not** execute Rust, Lean 4, Python or Groq calls. Use the documented commands in the original source repository to execute the compiler and verify evidence.

### Deployment

The entire folder can be published as a static site using GitHub Pages, Netlify, Cloudflare Pages or Vercel. No bundler is required. Point the publish directory at this folder and use `index.html` as entrypoint. The original language repository is deliberately not modified.

For a separate deployment repository:

```bash
cd aletheia-website-v0
# publish these files to a NEW dedicated static-web repository
```

For a custom domain, configure DNS/SSL on your chosen host. Site navigation uses relative links and works under project subpaths (e.g. GitHub Pages `/Aletheia-Website/`).

### Design provenance

- Brand asset: user-supplied original `Gemini_Generated_Image_vme8dvme8dvme8dv.jpg`, kept unaltered in `assets/aletheia-original.jpg`.
- Derived RGBA brand lockup: `assets/aletheia-lockup.png` preserving logo geometry, right-open stroke and lower anchor. The visual manual uses a Deep Void `#000000` base, Radiant Cyan `#38BDF8`, Platinum Steel `#E2E8F0`, Slate Monolith `#CBD5E1`.
- Technical content: v1.0-RC1 branch `release/v1.0-rc1`, draft PR #5. The older main v0.9 baseline and Rev11 remain historical research. The outdated Marco Zero PDF has been removed from the public site.
- Research claims, samples and limitations are drawn from the bundled primary source PDFs. This site is a communication layer, **not a claim of production certification**.

### Features

- Fully responsive layout, mobile navigation, scroll animation honoring `prefers-reduced-motion`.
- No tracking cookies, analytics, service workers, hidden network API calls, or third-party JS.
- Optional Google Fonts CSS is requested; safe system font fallback if offline.
- Docs filtering, deep-linkable articles, keyboard Ctrl/⌘+K search, TOC and copy affordances.
- Code sample switcher and architecture stepper.
- Playground editable `.ath` snippets, heuristic educational diagnostics, copied code.
- Research views with limited sample scope, denominators and caveats.

### Known V0.0 limits

- This is not yet a live compiler WASM, hosted documentation search index, user account, telemetry service or browser IDE.
- Sources were provided by the owner; numerical claims are from those files and are not independently revalidated against the latest GitHub CI in this website package.
- Before public launch: verify trademark/domain rights, accessibility in assistive technology, SEO URL/domain metadata and all citation/evidence paths on the chosen hosting provider.
