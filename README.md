# Koushik Kudirilla — Portfolio

A static, dependency-free personal portfolio site. Plain HTML, CSS, and JavaScript — no build step, no framework, no paid services required.

## File structure

```
portfolio/
├── index.html          Page structure (containers only — content comes from data.js)
├── style.css            All styling, including the theme color variables
├── script.js             Renders data.js into the page, handles nav/theme/filters
├── data.js                ALL editable content lives here
├── assets/
│   └── favicon/favicon.svg
│   └── documents/       Certificate/proof PDFs & images (see below)
│   └── profile.jpg      Your photo (add this yourself)
│   └── resume.pdf        Your resume (add this yourself)
└── README.md
```

## Running it locally

No installation needed. Just open `index.html` in a browser — or, for the most accurate experience (some browsers restrict local file scripts), run a tiny local server from inside the `portfolio` folder:

```bash
# Python 3
python -m http.server 8000

# or Node
npx serve .
```

Then visit `http://localhost:8000`.

## Editing content

**Everything you'll want to change lives in `data.js`.** Open it and edit the plain-text values — names, dates, links, project descriptions, etc. You don't need to touch `index.html`, `style.css`, or `script.js` for normal content updates.

### Update personal info / headline
Edit the `personal` object at the top of `data.js`.

### Add a new project
Copy one of the existing objects inside the `projects` array in `data.js` and edit the fields:

```js
{
  name: "Project Name",
  duration: "Month Year – Month Year",
  category: "AI/ML",        // "AI/ML", "IoT", or "Software" — controls the filter buttons
  description: "One or two sentences describing what it does.",
  technologies: ["Tech1", "Tech2"],
  github: "https://github.com/your-username/repo"
}
```

### Add/edit a certification, achievement, workshop, etc.
Same pattern — each section of the site maps to an array or object in `data.js` with the same name (e.g. `certifications`, `achievements`, `workshops`, `community`).

### Replace the profile image
The hero already uses a real photo by default (`assets/profile.jpg`, with an initials-circle fallback if that file is missing). To swap in a different photo:
1. Add your image to `assets/`, e.g. `assets/profile.jpg` (replacing the existing one), or a new filename.
2. In `index.html`, find the `<img class="hero-photo" id="hero-avatar" ...>` tag and update its `src` if you used a different filename.
3. **Keep the `class="hero-photo"` attribute** — that's what makes the image crop neatly into the square panel instead of overflowing it. `script.js` and `style.css` handle the rest automatically; no other edits needed.

If you ever want to go back to the initials placeholder, replace the `<img class="hero-photo" ...>` tag with `<div class="hero-panel-avatar" id="hero-avatar"></div>` — `script.js` detects the change automatically.

### Add a resume download button
The hero already includes a **Download Resume** button by default. To make it work:
1. Add your PDF to `assets/`, e.g. `assets/resume.pdf`.
2. If you used a different filename, open `data.js` and update `personal.resumeUrl`.
3. If you don't have a resume PDF yet, set `personal.resumeAvailable: false` in `data.js` — the button will automatically disappear until you're ready.

### Add certificate / document proof
You can attach the actual soft copy (PDF or image) to any certification, workshop, or your internship entry, and a small **"View Certificate"** link will appear on that card automatically.

1. Drop your files into `assets/documents/` — PDFs and images (JPG/PNG) both work, no conversion needed.
2. Open `data.js`, find the relevant entry (in `certifications`, `workshops`, or `experience`), and set its `proofUrl` field, e.g.:
   ```js
   {
     name: "NPTEL Elite + Gold",
     ...
     proofUrl: "assets/documents/nptel-python.pdf"
   }
   ```
3. Leave `proofUrl: null` on any entry you don't have a soft copy for yet — no link will show, nothing breaks.

Keep filenames simple (lowercase, hyphens instead of spaces) so links never break: `nptel-python.pdf`, not `NPTEL Certificate (final).pdf`.

### Change the color theme
The site loads in **light mode by default** (dark mode is available via the toggle in the nav). To swap which one loads first, open `index.html` and change `<body data-theme="light">` to `<body data-theme="dark">`.

Open `style.css` and edit the CSS variables at the very top, inside `:root { ... }`:

```css
--bg: #0F1214;        /* page background */
--surface: #171B1E;   /* card backgrounds */
--accent: #E8A33D;    /* primary accent — buttons, highlights */
--accent-2: #5FA8A0;  /* secondary accent — tags, links */
```

The `[data-theme="light"]` block right below it controls the light-mode palette.

### LeetCode link
The resume listed the LeetCode profile as `leetcode.com/koushik kudirilla`, which contains a space and is likely a typo — so it's currently hidden from the live site. Once you have the correct URL, open `data.js`, find `profiles.leetcode`, and set:

```js
leetcode: { label: "LeetCode", url: "https://leetcode.com/your-actual-handle", verified: true }
```

It will then appear automatically in the Contact section.

## Deploying (free — GitHub Pages)

1. Create a new GitHub repository (or use an existing one).
2. Push this `portfolio` folder's contents to the repository's root (or to a `docs/` folder — your choice).
3. In the repo, go to **Settings → Pages**.
4. Under "Build and deployment", set **Source** to "Deploy from a branch", pick your branch (e.g. `main`) and folder (`/root` or `/docs`).
5. Save. GitHub will give you a URL like `https://your-username.github.io/repo-name/` within a minute or two.

No paid hosting, database, or backend is required — this is a fully static site.

## Notes on what's intentionally left out

- **Sensitive personal fields** (date of birth, home address, father's name, gender, marital status, ACM membership ID) are stored in `data.js` under `personal._private` for your own reference, but are never rendered on the page.
- **The declaration statement** from the resume is also kept in that private block but not shown publicly.
- **No fake statistics**: there are no invented skill-proficiency percentages, project metrics (accuracy, FPS, users), or embellished achievement claims. Everything shown traces directly back to the resume content you provided.
