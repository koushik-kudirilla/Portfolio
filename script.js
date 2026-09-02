/* ==========================================================================
   EDITABLE CONTENT is in data.js — this file only renders it and wires up
   interactions. You shouldn't need to edit this file to update your content.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const d = PORTFOLIO_DATA;

  /* ---------------------------------------------------------------- */
  /* THEME TOGGLE (persists in memory only for this session)          */
  /* ---------------------------------------------------------------- */
  const themeToggle = document.getElementById("theme-toggle");
  themeToggle.addEventListener("click", () => {
    const root = document.body;
    const isLight = root.getAttribute("data-theme") === "light";
    root.setAttribute("data-theme", isLight ? "dark" : "light");
    themeToggle.setAttribute("aria-pressed", String(!isLight));
  });

  /* ---------------------------------------------------------------- */
  /* MOBILE MENU                                                       */
  /* ---------------------------------------------------------------- */
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------------------------------------------------------------- */
  /* HERO                                                               */
  /* ---------------------------------------------------------------- */
  document.getElementById("hero-name").textContent = d.personal.name;
  document.getElementById("hero-headline").textContent = d.personal.headline;
  document.getElementById("hero-intro").textContent = d.about.intro.split(". ")[0] + ".";
  document.getElementById("hero-location").textContent = d.personal.location;
  const heroEmail = document.getElementById("hero-email");
  heroEmail.href = `mailto:${d.personal.email}`;
  heroEmail.textContent = d.personal.email;

  // Hero photo/avatar: if hero-avatar is an <img> (a real photo has been
  // added), just set its alt text. If it's still a <div> (no photo yet),
  // fill it with initials as a placeholder.
  const heroAvatarEl = document.getElementById("hero-avatar");
  if (heroAvatarEl.tagName === "IMG") {
    heroAvatarEl.alt = `Portrait of ${d.personal.name}`;
  } else {
    heroAvatarEl.textContent = d.personal.name
      .split(" ")
      .map((n) => n[0])
      .join("");
  }
  document.getElementById("hero-github").href = d.profiles.github.url;
  document.getElementById("hero-linkedin").href = d.profiles.linkedin.url;
  document.title = `${d.personal.name} — ${d.personal.headline}`;

  // Resume download button — hidden if no resume has been added yet
  const resumeBtn = document.getElementById("hero-resume");
  if (d.personal.resumeAvailable && d.personal.resumeUrl) {
    resumeBtn.href = d.personal.resumeUrl;
  } else {
    resumeBtn.remove();
  }

  // Hero stat strip — real counts derived from the data arrays, not fixed numbers
  document.getElementById("stat-projects").textContent = d.projects.length;
  document.getElementById("stat-certs").textContent = d.certifications.length;
  document.getElementById("stat-achievements").textContent = d.achievements.length;

  /* ---------------------------------------------------------------- */
  /* ABOUT                                                              */
  /* ---------------------------------------------------------------- */
  document.getElementById("about-intro").textContent = d.about.intro;
  const aboutPoints = document.getElementById("about-points");
  d.about.points.forEach((pt) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="about-point-index">${String(aboutPoints.children.length + 1).padStart(2, "0")}</span><span>${escapeHtml(pt)}</span>`;
    aboutPoints.appendChild(li);
  });

  /* ---------------------------------------------------------------- */
  /* SKILLS                                                             */
  /* ---------------------------------------------------------------- */
  const skillsGrid = document.getElementById("skills-grid");
  d.skills.categories.forEach((cat) => {
    const card = document.createElement("div");
    card.className = "skill-card";
    card.innerHTML = `
      <div class="skill-card-top"><span class="skill-index">${String(skillsGrid.children.length + 1).padStart(2, "0")}</span><span class="skill-count">${cat.items.length} skills</span></div>
      <h3>${escapeHtml(cat.name)}</h3>
      <div class="tag-list">
        ${cat.items.map((i) => `<span class="tag">${escapeHtml(i)}</span>`).join("")}
      </div>`;
    skillsGrid.appendChild(card);
  });
  document.getElementById("ai-tools-list").textContent = d.skills.aiTools.join(", ");

  /* ---------------------------------------------------------------- */
  /* EXPERIENCE                                                         */
  /* ---------------------------------------------------------------- */
  const expTimeline = document.getElementById("experience-timeline");
  d.experience.forEach((job) => {
    const item = document.createElement("div");
    item.className = "timeline-item timeline-item-card";
    item.innerHTML = `
      <div class="experience-card-accent" aria-hidden="true"></div>
      <div class="experience-card-main">
        <div class="timeline-card-head">
          <span class="timeline-label">Professional experience</span>
          <span class="timeline-date">${escapeHtml(job.duration)}</span>
        </div>
        <div class="experience-heading-row">
          <div>
            <h3>${escapeHtml(job.role)}</h3>
            <p class="timeline-meta">${escapeHtml(job.company)} · ${escapeHtml(job.location)}</p>
          </div>
          <span class="experience-type">Internship</span>
        </div>
        <div class="experience-divider"></div>
        <ul>${job.points.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ul>
        <div class="experience-proof">${docLink(job.proofUrl)}</div>
      </div>`;
    expTimeline.appendChild(item);
  });

  /* ---------------------------------------------------------------- */
  /* PROJECTS + FILTERS                                                 */
  /* ---------------------------------------------------------------- */
  const projectGrid = document.getElementById("project-grid");
  const filterRow = document.getElementById("filter-row");
  const categories = ["All", ...new Set(d.projects.map((p) => p.category))];

  function renderProjects(filter) {
    projectGrid.innerHTML = "";
    d.projects
      .filter((p) => filter === "All" || p.category === filter)
      .forEach((p) => {
        const card = document.createElement("article");
        card.className = "project-card";
        card.innerHTML = `
          <div class="project-card-top">
            <div class="project-card-index">${String(d.projects.indexOf(p) + 1).padStart(2, "0")}</div>
            <div class="project-card-main">
              <span class="project-category">${escapeHtml(p.category)}</span>
              <h3>${escapeHtml(p.name)}</h3>
              <p class="project-date">${escapeHtml(p.duration)}</p>
            </div>
          </div>
          <p class="project-desc">${escapeHtml(p.description)}</p>
          <div class="tag-list">${p.technologies.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>
          <div class="project-card-footer">
            <a class="chip-link" href="${escapeAttr(p.github)}" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.5 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.21-3.37-1.21-.46-1.18-1.11-1.5-1.11-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.05 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 2.5-.35c.85 0 1.7.12 2.5.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.92-2.34 4.78-4.57 5.04.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.81 0 .28.18.61.69.5A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"/></svg>
              Repository
            </a>
          </div>`;
        projectGrid.appendChild(card);
      });
  }

  categories.forEach((cat, i) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.type = "button";
    btn.textContent = cat;
    btn.setAttribute("aria-pressed", String(i === 0));
    btn.addEventListener("click", () => {
      filterRow.querySelectorAll(".filter-btn").forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      renderProjects(cat);
    });
    filterRow.appendChild(btn);
  });
  renderProjects("All");

  /* ---------------------------------------------------------------- */
  /* EDUCATION                                                          */
  /* ---------------------------------------------------------------- */
  const eduTimeline = document.getElementById("education-timeline");
  d.education.forEach((ed) => {
    const item = document.createElement("div");
    item.className = "timeline-item timeline-item-card education-card";
    item.innerHTML = `
      <div class="education-card-accent" aria-hidden="true"></div>
      <div class="education-card-main">
        <div class="timeline-card-head">
          <span class="timeline-label">Academic record</span>
          <span class="timeline-date">${escapeHtml(ed.duration)}</span>
        </div>
        <div class="education-heading-row">
          <div>
            <h3>${escapeHtml(ed.degree)}</h3>
            <p class="timeline-meta">${escapeHtml(ed.institution)}</p>
          </div>
          <span class="timeline-status">${escapeHtml(ed.status)}</span>
        </div>
        <div class="education-meta-row">
          <span>${escapeHtml(ed.board)}</span>
          <span>${escapeHtml(ed.score)}</span>
        </div>
      </div>`;
    eduTimeline.appendChild(item);
  });

  /* ---------------------------------------------------------------- */
  /* ACHIEVEMENTS                                                       */
  /* ---------------------------------------------------------------- */
  const achGrid = document.getElementById("achievements-grid");
  d.achievements.forEach((a) => {
    const card = document.createElement("div");
    card.className = "achievement-card";
    card.innerHTML = `
      <div class="achievement-card-top"><span class="achievement-index">${String(achGrid.children.length + 1).padStart(2, "0")}</span><span class="achievement-title">${escapeHtml(a.title)}</span></div>
      <p class="achievement-context">${escapeHtml(a.context)}</p>
      <p class="achievement-detail">${escapeHtml(a.detail)}</p>
      <p class="achievement-date">${escapeHtml(a.date)}</p>`;
    achGrid.appendChild(card);
  });

  /* ---------------------------------------------------------------- */
  /* CERTIFICATIONS                                                     */
  /* ---------------------------------------------------------------- */
  const certGrid = document.getElementById("cert-grid");
  d.certifications.forEach((c) => {
    const card = document.createElement("div");
    card.className = "cert-card";
    card.innerHTML = `
      <div class="cert-heading">
        <span class="cert-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="5.5" stroke="currentColor" stroke-width="1.6"/><path d="m9.5 13.5-1 6 3.5-2 3.5 2-1-6M9.7 9l1.5 1.5L14.8 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
        <h3>${escapeHtml(c.name)}</h3>
      </div>
      ${c.course ? `<p class="cert-course">${escapeHtml(c.course)}</p>` : ""}
      <div class="cert-meta">
        <span class="cert-org">${escapeHtml(c.organization)}</span>
        <span>${escapeHtml(c.date)}</span>
      </div>
      ${c.score ? `<div class="cert-meta"><span></span><span class="cert-score">${escapeHtml(c.score)}</span></div>` : ""}
      ${docLink(c.proofUrl)}`;
    certGrid.appendChild(card);
  });

  /* ---------------------------------------------------------------- */
  /* RESEARCH + LEADERSHIP                                              */
  /* ---------------------------------------------------------------- */
  document.getElementById("research-callout").innerHTML = `
    <div class="callout-kicker">Publication</div>
    <h3>${escapeHtml(d.research.title)}</h3>
    <p>${escapeHtml(d.research.type)}</p>
    <p class="meta">Paper ID · ${escapeHtml(d.research.paperId)}</p>`;

  document.getElementById("leadership-callout").innerHTML = `
    <div class="callout-kicker">Student Leadership</div>
    <h3>${escapeHtml(d.leadership.role)}</h3>
    <p class="meta">${escapeHtml(d.leadership.duration)}</p>
    <ul>${d.leadership.points.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ul>`;

  /* ---------------------------------------------------------------- */
  /* WORKSHOPS / COMMUNITY / STRENGTHS / HOBBIES                        */
  /* ---------------------------------------------------------------- */
  const workshopsList = document.getElementById("workshops-list");
  d.workshops.forEach((w) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="item-title">${escapeHtml(w.title)}</div>
      <div class="item-meta">${escapeHtml(w.location || w.organizer || "")} · ${escapeHtml(w.date)}</div>
      ${w.detail ? `<p class="item-detail">${escapeHtml(w.detail)}</p>` : ""}
      ${docLink(w.proofUrl)}`;
    workshopsList.appendChild(li);
  });

  const communityList = document.getElementById("community-list");
  d.community.forEach((c) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="item-title">${escapeHtml(c.title)}</div>
      <div class="item-meta">${escapeHtml(c.organization ? `${c.organization} · ${c.date}` : c.date)}</div>
      ${c.detail ? `<p class="item-detail">${escapeHtml(c.detail)}</p>` : ""}`;
    communityList.appendChild(li);
  });

  const strengthsList = document.getElementById("strengths-list");
  d.strengths.forEach((s) => {
    const span = document.createElement("span");
    span.className = "pill";
    span.textContent = s;
    strengthsList.appendChild(span);
  });

  const hobbiesList = document.getElementById("hobbies-list");
  d.hobbies.forEach((h) => {
    const span = document.createElement("span");
    span.className = "pill";
    span.textContent = h;
    hobbiesList.appendChild(span);
  });

  /* ---------------------------------------------------------------- */
  /* CONTACT                                                            */
  /* ---------------------------------------------------------------- */
  document.getElementById("contact-heading").textContent = d.contact.heading;
  document.getElementById("contact-subtext").textContent = d.contact.subtext;
  document.getElementById("contact-email").href = `mailto:${d.personal.email}`;
  document.getElementById("contact-email").textContent = d.personal.email;
  document.getElementById("contact-linkedin").href = d.profiles.linkedin.url;
  document.getElementById("contact-github").href = d.profiles.github.url;
  document.getElementById("contact-hackerrank").href = d.profiles.hackerrank.url;

  // LeetCode: only show if verified
  const leetWrap = document.getElementById("contact-leetcode-wrap");
  if (d.profiles.leetcode.verified && d.profiles.leetcode.url) {
    document.getElementById("contact-leetcode").href = d.profiles.leetcode.url;
  } else {
    leetWrap.remove();
  }

  document.getElementById("footer-year").textContent = new Date().getFullYear();
  document.getElementById("footer-name").textContent = d.personal.name;

  /* ---------------------------------------------------------------- */
  /* SCROLL REVEAL                                                      */
  /* ---------------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------------------------------------------------------------- */
  /* ACTIVE NAV LINK ON SCROLL                                          */
  /* ---------------------------------------------------------------- */
  const sections = document.querySelectorAll("main section[id]");
  const navAnchors = document.querySelectorAll(".nav-links a");
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navAnchors.forEach((a) => {
            a.classList.toggle("active", a.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => navObserver.observe(s));

  /* ---------------------------------------------------------------- */
  /* helpers                                                            */
  /* ---------------------------------------------------------------- */
  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function escapeAttr(str) {
    return escapeHtml(str);
  }

  // Renders a small "Certificate" pill link for any item with a proofUrl set
  // in data.js. Returns an empty string (renders nothing) if no URL is set.
  function docLink(url, label = "Certificate") {
    if (!url) return "";
    return `<a class="chip-link chip-link-outline" href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="10" r="6" stroke="currentColor" stroke-width="1.6"/><path d="m9.5 10 1.7 1.7 3.5-3.5M9.5 15.2 8.5 21l3.5-2 3.5 2-1-5.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      ${escapeHtml(label)}
    </a>`;
  }
});
