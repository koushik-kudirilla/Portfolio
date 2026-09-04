(() => {
  const d = PORTFOLIO_DATA;
  const body = document.body;
  const $ = (id) => document.getElementById(id);
  const PDFJS_SOURCES = [
    // Prefer a bundled copy when the portfolio is deployed with its assets.
    "assets/pdfjs/pdf.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
    "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js",
    "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.min.js"
  ];
  let pdfPromise = null;

  function esc(v){return String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
  function attr(v){return esc(v);}
  function docLink(url,label="Certificate"){
    if(!url)return "";
    return `<a class="chip-link chip-link-outline" href="${attr(url)}" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="10" r="6" stroke="currentColor" stroke-width="1.6"/><path d="m9.5 10 1.7 1.7 3.5-3.5M9.5 15.2 8.5 21l3.5-2 3.5 2-1-5.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>${esc(label)}</a>`;
  }

  function loadPdfJs(){
    if(window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    if(pdfPromise) return pdfPromise;
    pdfPromise = new Promise((resolve,reject)=>{
      let index=0;
      const tryNext=()=>{
        if(index>=PDFJS_SOURCES.length){reject(new Error("PDF.js unavailable"));return;}
        const src=PDFJS_SOURCES[index++];
        const s=document.createElement("script"); s.src=src; s.async=true;
        s.onload=()=>{
          if(window.pdfjsLib){
            const base=src.replace(/\/build\/pdf\.min\.js$|\/pdf\.min\.js$/,"/");
            window.pdfjsLib.GlobalWorkerOptions.workerSrc=base+"pdf.worker.min.js";
            resolve(window.pdfjsLib);
          } else tryNext();
        };
        s.onerror=tryNext;
        document.head.appendChild(s);
      };
      tryNext();
    });
    return pdfPromise;
  }

  // Start loading PDF.js in parallel with page setup on the certifications page.
  // This removes the avoidable library-load delay from the first preview.
  if(body.dataset.page === "certifications") loadPdfJs().catch(()=>{});

  async function renderPdf(container,url){
    if(!container||!url)return;
    container.innerHTML="";
    container.classList.remove("pdf-ready","pdf-failed");

    // The outer preview is fixed/stable. Only this inner viewport scrolls.
    // Keeping the custom rail outside the scrolling content prevents the rail
    // from moving upward with the PDF pages.
    const scroller=document.createElement("div");
    scroller.className="pdf-scroll-viewport";
    container.appendChild(scroller);

    try{
      const pdfjs=await loadPdfJs();
      const absoluteUrl=new URL(url,location.href).href;
      const pdf=await pdfjs.getDocument({
        url:absoluteUrl,
        withCredentials:false,
        disableAutoFetch:false,
        disableStream:false,
        rangeChunkSize:65536
      }).promise;

      container.classList.add("pdf-ready");
      scroller.classList.add("pdf-scroll");

      const firstPage=await pdf.getPage(1);
      const hostWidth=Math.max(scroller.clientWidth,1);
      const base=firstPage.getViewport({scale:1});
      const scale=hostWidth/base.width;
      const pages=[];

      const makePage=(page,n)=>{
        const viewport=page.getViewport({scale});
        const wrap=document.createElement("div");
        wrap.className="pdf-page";
        wrap.dataset.page=String(n);
        const canvas=document.createElement("canvas");
        canvas.setAttribute("aria-label",`PDF page ${n}`);
        canvas.className="pdf-page-canvas";
        wrap.appendChild(canvas);
        scroller.appendChild(wrap);
        return {page,viewport,canvas,wrap};
      };

      const renderOne=async item=>{
        if(item.wrap.dataset.rendered)return;
        const ratio=Math.min(window.devicePixelRatio||1.5,2);
        item.canvas.width=Math.max(1,Math.floor(item.viewport.width*ratio));
        item.canvas.height=Math.max(1,Math.floor(item.viewport.height*ratio));
        const ctx=item.canvas.getContext("2d",{alpha:false});
        ctx.setTransform(ratio,0,0,ratio,0,0);
        await item.page.render({canvasContext:ctx,viewport:item.viewport}).promise;
        item.wrap.dataset.rendered="1";
      };

      pages.push(makePage(firstPage,1));
      await renderOne(pages[0]);

      for(let n=2;n<=pdf.numPages;n++){
        const page=await pdf.getPage(n);
        pages.push(makePage(page,n));
      }

      const renderRest=async()=>{
        for(let i=1;i<pages.length;i++){
          await renderOne(pages[i]);
          await new Promise(r=>requestAnimationFrame(r));
        }
        updatePdfScrollbar(scroller,container);
      };
      if("requestIdleCallback" in window) requestIdleCallback(()=>renderRest(),{timeout:80});
      else setTimeout(renderRest,0);

      setupPdfScrollbar(scroller,container);
      setupPdfScrollChaining(scroller);
      requestAnimationFrame(()=>updatePdfScrollbar(scroller,container));
    }catch(err){
      console.warn("PDF preview failed:",err);
      container.classList.remove("pdf-ready");
      container.classList.add("pdf-failed");
      container.innerHTML=`<div class="pdf-error"><strong>Preview unavailable</strong><span>The PDF viewer could not load this file in the current browser context.</span></div>`;
    }
  }

  function updatePdfScrollbar(scroller,host){
    const rail=host?.querySelector(".pdf-custom-scrollbar");
    const thumb=rail?.querySelector(".pdf-scroll-thumb");
    if(!rail||!thumb||!scroller)return;

    const max=Math.max(0,scroller.scrollHeight-scroller.clientHeight);
    const track=Math.max(0,rail.clientHeight);
    if(max<=1||track<=1){
      rail.classList.add("is-hidden");
      return;
    }

    rail.classList.remove("is-hidden");
    const h=Math.max(38,Math.min(track,Math.round(track*(scroller.clientHeight/scroller.scrollHeight))));
    const y=Math.round((track-h)*(scroller.scrollTop/max));
    thumb.style.height=`${h}px`;
    thumb.style.transform=`translate3d(0,${y}px,0)`;
    rail.setAttribute("aria-valuenow",String(Math.round((scroller.scrollTop/max)*100)));
  }

  function setupPdfScrollbar(scroller,host){
    if(!scroller||!host)return;
    let rail=host.querySelector(".pdf-custom-scrollbar");

    if(!rail){
      rail=document.createElement("div");
      rail.className="pdf-custom-scrollbar";
      rail.setAttribute("role","scrollbar");
      rail.setAttribute("aria-label","PDF preview scroll");
      rail.setAttribute("aria-valuemin","0");
      rail.setAttribute("aria-valuemax","100");
      rail.setAttribute("aria-valuenow","0");
      rail.innerHTML='<span class="pdf-scroll-thumb"></span>';
      host.appendChild(rail);

      let dragging=false,startY=0,startScroll=0;
      const thumb=rail.firstElementChild;

      const move=e=>{
        if(!dragging)return;
        const track=Math.max(1,rail.clientHeight-thumb.offsetHeight);
        const delta=e.clientY-startY;
        scroller.scrollTop=startScroll+(delta/track)*(scroller.scrollHeight-scroller.clientHeight);
        e.preventDefault();
      };

      const stop=()=>{
        dragging=false;
        document.removeEventListener("pointermove",move);
        document.removeEventListener("pointerup",stop);
      };

      thumb.addEventListener("pointerdown",e=>{
        dragging=true;
        startY=e.clientY;
        startScroll=scroller.scrollTop;
        thumb.setPointerCapture?.(e.pointerId);
        document.addEventListener("pointermove",move,{passive:false});
        document.addEventListener("pointerup",stop,{once:true});
        e.preventDefault();
      });

      rail.addEventListener("pointerdown",e=>{
        if(e.target===thumb)return;
        const rect=rail.getBoundingClientRect();
        const ratio=Math.max(0,Math.min(1,(e.clientY-rect.top)/rect.height));
        scroller.scrollTop=ratio*(scroller.scrollHeight-scroller.clientHeight);
      });
    }

    const update=()=>updatePdfScrollbar(scroller,host);
    scroller.addEventListener("scroll",update,{passive:true});

    if(window.ResizeObserver){
      const ro=new ResizeObserver(update);
      ro.observe(scroller);
      ro.observe(host);
    }
    requestAnimationFrame(update);
  }

  function setupPdfScrollChaining(scroller){
    if(!scroller||scroller.dataset.chainBound)return;
    scroller.dataset.chainBound="1";

    scroller.addEventListener("wheel",e=>{
      if(Math.abs(e.deltaY)<0.5)return;

      const atTop=scroller.scrollTop<=0;
      const atBottom=scroller.scrollTop+scroller.clientHeight>=scroller.scrollHeight-1;

      if((atTop&&e.deltaY<0)||(atBottom&&e.deltaY>0)){
        e.preventDefault();
        window.scrollBy({top:e.deltaY,left:0,behavior:"auto"});
      }
    },{passive:false});
  }

  function setupTheme(){
    const toggle=$("theme-toggle");
    const saved=localStorage.getItem("portfolio-theme");
    if(saved==="light") body.setAttribute("data-theme","light");
    toggle?.setAttribute("aria-pressed",String(body.getAttribute("data-theme")!=="light"));
    if(toggle && !toggle.dataset.bound){
      toggle.dataset.bound="1";
      toggle.addEventListener("click",()=>{
        const light=body.getAttribute("data-theme")==="light";
        body.setAttribute("data-theme",light?"dark":"light");
        localStorage.setItem("portfolio-theme",light?"dark":"light");
        toggle.setAttribute("aria-pressed",String(light));
      });
    }
  }

  function setupMobileNav(){
    const menu=$("menu-toggle"), links=$("nav-links");
    if(menu&&!menu.dataset.bound){
      menu.dataset.bound="1";
      menu.addEventListener("click",()=>{const open=links.classList.toggle("open");menu.setAttribute("aria-expanded",String(open));});
    }
    links?.querySelectorAll("a").forEach(a=>{
      if(a.dataset.navBound)return; a.dataset.navBound="1";
      a.addEventListener("click",()=>{links.classList.remove("open");menu?.setAttribute("aria-expanded","false");});
    });
  }

  function setActiveNav(page){
    document.querySelectorAll("#nav-links [data-nav]").forEach(a=>a.classList.toggle("active",a.dataset.nav===page));
  }

  const PAGE_TEMPLATES = window.PORTFOLIO_PAGE_TEMPLATES || {};

  async function fetchText(url){
    const res=await fetch(url,{cache:"no-store"});
    if(!res.ok) throw new Error(`Fetch failed: ${url}`);
    return await res.text();
  }

  const NAV_FALLBACK = `<header class="site-header" data-site-nav>
  <nav class="nav container" aria-label="Primary">
    <a class="nav-brand" href="home.html" aria-label="Koushik Kudirilla — Home">
      <span class="brand-mark">KK</span>
      <span class="brand-name">Koushik <span class="brand-name-last">Kudirilla</span></span>
    </a>
    <ul class="nav-links" id="nav-links">
      <li><a data-nav="home" href="home.html">Home</a></li>
      <li><a data-nav="about" href="about.html">About</a></li>
      <li><a data-nav="skills" href="skills.html">Skills</a></li>
      <li><a data-nav="experience" href="experience.html">Experience</a></li>
      <li><a data-nav="projects" href="projects.html">Projects</a></li>
      <li><a data-nav="education" href="education.html">Education</a></li>
      <li><a data-nav="achievements" href="achievements.html">Achievements</a></li>
      <li><a data-nav="certifications" href="certifications.html">Certifications</a></li>
      <li><a data-nav="research" href="research.html">Research</a></li>
      <li><a data-nav="leadership" href="leadership.html">Leadership</a></li>
      <li><a data-nav="activities" href="activities.html">Activities</a></li>
      <li><a data-nav="contact" href="contact.html">Contact</a></li>
    </ul>
    <div class="nav-actions">
      <button class="theme-toggle" id="theme-toggle" type="button" aria-pressed="true" aria-label="Toggle light and dark theme">
        <svg class="icon-moon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
        <svg class="icon-sun" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="1.6"/><path d="M12 2.5v2.4M12 19.1v2.4M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      </button>
      <button class="menu-toggle" id="menu-toggle" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="Toggle menu"><span></span><span></span><span></span></button>
    </div>
  </nav>
</header>`;
  const FOOTER_FALLBACK = `<footer class="site-footer" data-site-footer><div class="container footer-row"><span>© <span id="footer-year"></span> Koushik Kudirilla</span><span>Visakhapatnam, Andhra Pradesh, India • <a href="mailto:koushikkudirilla@gmail.com">koushikkudirilla@gmail.com</a></span></div></footer>`;

  async function loadSharedChrome(){
    const navHost=$("site-nav"), footerHost=$("site-footer");
    const base=new URL(".",location.href);
    if(navHost && !navHost.dataset.loaded){
      try{ navHost.innerHTML=await fetchText(new URL("nav.html",base).href); navHost.dataset.loaded="1"; }
      catch(err){ navHost.innerHTML=NAV_FALLBACK; navHost.dataset.loaded="1"; }
    }
    if(footerHost && !footerHost.dataset.loaded){
      try{ footerHost.innerHTML=await fetchText(new URL("footer.html",base).href); footerHost.dataset.loaded="1"; }
      catch(err){ footerHost.innerHTML=FOOTER_FALLBACK; footerHost.dataset.loaded="1"; }
    }
  }

  async function loadHomeContent(){
    if(body.dataset.page!=="home") return;
    const main=$("main-content");
    if(!main || main.dataset.homeLoaded) return;
    try{
      const html=await fetchText(new URL("home.html",location.href).href);
      const doc=new DOMParser().parseFromString(html,"text/html");
      const home=doc.querySelector("#main-content");
      if(home){ main.innerHTML=home.innerHTML; main.dataset.homeLoaded="1"; }
    }catch(err){
      console.warn("Home content could not load:",err);
      const fallback=PAGE_TEMPLATES["index.html"];
      if(fallback){
        const doc=new DOMParser().parseFromString(fallback,"text/html");
        const home=doc.querySelector("#main-content");
        if(home){ main.innerHTML=home.innerHTML; main.dataset.homeLoaded="1"; }
      }
    }
  }

  function iconSvg(name){
    const icons={
      home:'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m3.5 10.7 8.5-7 8.5 7v9.1a1.7 1.7 0 0 1-1.7 1.7H5.2a1.7 1.7 0 0 1-1.7-1.7z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9.2 21.2v-6.4h5.6v6.4" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
      project:'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h3l2 2H17.5A2.5 2.5 0 0 1 20 9.5v7A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M4.5 10h15" stroke="currentColor" stroke-width="1.7"/></svg>',
      repository:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .7C5.8.7.8 5.7.8 12c0 5 3.3 9.2 7.9 10.7.6.1.8-.3.8-.6v-2.2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.4-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.6-.3-5.3-1.3-5.3-5.6 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.5.1-3.1 0 0 .9-.3 3.2 1.1.9-.2 1.9-.4 2.9-.4s2 .1 2.9.4c2.2-1.5 3.2-1.1 3.2-1.1.6 1.6.2 2.8.1 3.1.7.8 1.1 1.8 1.1 3 0 4.3-2.6 5.3-5.3 5.6.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6C19.9 21.2 23.2 17 23.2 12 23.2 5.7 18.2.7 12 .7Z"/></svg>',
      workshop:'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 20V9.5L12 4l8 5.5V20" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M8 20v-6h8v6M7 9h10" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M10 9h4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
      community:'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="9" cy="8" r="2.8" stroke="currentColor" stroke-width="1.7"/><circle cx="16.5" cy="9" r="2.3" stroke="currentColor" stroke-width="1.7"/><path d="M3.8 19c.5-3.2 2.2-5 5.2-5s4.7 1.8 5.2 5M14 14.5c2.7.2 4.5 1.7 4.9 4.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
      strength:'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 3 1.9 5.7h6l-4.9 3.5 1.9 5.8-4.9-3.5-4.9 3.5 1.9-5.8-4.9-3.5h6z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
      hobby:'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 18V6l11-2v12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="5.5" cy="18" r="3" stroke="currentColor" stroke-width="1.7"/><circle cx="16.5" cy="16" r="3" stroke="currentColor" stroke-width="1.7"/></svg>'
    };
    return icons[name]||'';
  }

  async function getPageDocument(target){
    try{
      const res=await fetch(target.href,{headers:{"X-Requested-Page":"portfolio-spa"},cache:"no-store"});
      if(!res.ok) throw new Error("Page fetch failed");
      return new DOMParser().parseFromString(await res.text(),"text/html");
    }catch(err){
      const key=target.pathname.split("/").pop() || "index.html";
      const template=PAGE_TEMPLATES[key] || PAGE_TEMPLATES["index.html"];
      if(!template) throw err;
      return new DOMParser().parseFromString(template,"text/html");
    }
  }

  async function navigate(url,push=true,force=false){
    const target=new URL(url,location.href);
    if(target.origin!==location.origin || !target.pathname.endsWith(".html")){location.href=target.href;return;}
    if(target.pathname===location.pathname && !target.search && !force){window.scrollTo({top:0,behavior:"smooth"});return;}
    try{
      const doc=await getPageDocument(target);
      let nextMain=doc.querySelector("#main-content");
      if(target.pathname.endsWith("/index.html") || target.pathname.endsWith("/")){
        try{
          const homeHtml=await fetchText(new URL("home.html",target.href).href);
          const homeDoc=new DOMParser().parseFromString(homeHtml,"text/html");
          const homeMain=homeDoc.querySelector("#main-content"); if(homeMain) nextMain=homeMain;
        }catch(err){ console.warn("Home partial unavailable during navigation:",err); }
      }
      if(!nextMain) throw new Error("Page content missing");
      const currentMain=$("main-content");
      body.classList.add("page-leaving");
      await new Promise(r=>setTimeout(r,120));
      currentMain.replaceWith(nextMain.cloneNode(true));
      document.title=doc.title;
      body.dataset.page=doc.body.dataset.page||"home";
      const kicker=$("page-kicker"), title=$("page-title"), desc=$("page-description");
      const copy=d.pageCopy?.[body.dataset.page];
      if(copy){ if(kicker)kicker.textContent=copy.kicker; if(title)title.textContent=copy.title; if(desc)desc.textContent=copy.description; }
      setActiveNav(body.dataset.page);
      initPage();
      if(push) history.pushState({page:body.dataset.page},"",target.href);
      window.scrollTo({top:0,behavior:"auto"});
      requestAnimationFrame(()=>body.classList.remove("page-leaving"));
    }catch(err){
      console.error("Client-side navigation failed:",err);
      body.classList.remove("page-leaving");
    }
  }

  function setupSpaNavigation(){
    if(document.body.dataset.spaBound)return;
    document.body.dataset.spaBound="1";
    document.addEventListener("click",e=>{
      const a=e.target.closest("a[href]"); if(!a)return;
      if(a.target==="_blank"||a.hasAttribute("download")||a.origin!==location.origin)return;
      const u=new URL(a.href,location.href);
      if(!u.pathname.endsWith(".html"))return;
      e.preventDefault(); navigate(u.href,true);
    });
    window.addEventListener("popstate",()=>navigate(location.href,false,true));
  }

  function setupPdfScrollChaining(){
    // Native nested scrolling is intentionally used here. Preventing wheel
    // events on the PDF causes the document behind it to freeze at the pointer.
    // CSS overscroll-behavior:auto lets the page take over at the PDF edges.
  }

  function setupResumeModal(){
    const modal=$("resume-modal"), viewer=$("resume-viewer"), close=$("resume-close"), openLink=$("resume-open");
    if(!modal || modal.dataset.bound)return;
    modal.dataset.bound="1";
    const resumeUrl=d.personal.resumeUrl;
    const open=()=>{
      if(!resumeUrl)return;
      modal.classList.add("open"); modal.setAttribute("aria-hidden","false"); body.classList.add("modal-open");
      if(openLink)openLink.href=resumeUrl;
      renderPdf(viewer,resumeUrl); close?.focus();
    };
    const shut=()=>{modal.classList.remove("open");modal.setAttribute("aria-hidden","true");body.classList.remove("modal-open");if(viewer)viewer.innerHTML="";};
    document.addEventListener("click",e=>{if(e.target.closest("[data-resume-preview]")){e.preventDefault();open();}});
    close?.addEventListener("click",shut); modal.addEventListener("click",e=>{if(e.target===modal)shut();});
    document.addEventListener("keydown",e=>{if(e.key==="Escape")shut();});
  }

  function initPage(){
    const page=body.dataset.page||"home";
    const copy=d.pageCopy?.[page];
    if(copy){
      $("page-kicker") && ($("page-kicker").textContent=copy.kicker);
      $("page-title") && ($("page-title").textContent=copy.title);
      $("page-description") && ($("page-description").textContent=copy.description);
    }
    setActiveNav(page);
    if(page==="home"){
      $("hero-name").textContent=d.personal.name; $("hero-headline").textContent=d.personal.headline; $("hero-intro").textContent=d.personal.summary;
      $("hero-location").textContent=d.personal.location; const email=$("hero-email"); email.href=`mailto:${d.personal.email}`; email.textContent=d.personal.email;
      $("hero-github").href=d.profiles.github.url; $("hero-linkedin").href=d.profiles.linkedin.url;
      $("stat-projects").textContent=d.projects.length; $("stat-certs").textContent=d.certifications.length; $("stat-achievements").textContent=d.achievements.length;
    }
    if(page==="about"){
      $("about-intro").textContent=d.about.intro; const list=$("about-points"); list.innerHTML="";
      d.about.points.forEach((pt,i)=>{const li=document.createElement("li");li.innerHTML=`<span class="about-point-index">${String(i+1).padStart(2,"0")}</span><span>${esc(pt)}</span>`;list.appendChild(li);});
    }
    if(page==="skills"){
      const grid=$("skills-grid"); grid.innerHTML="";
      d.skills.categories.forEach((cat,i)=>{const card=document.createElement("div");card.className="skill-card";card.innerHTML=`<div class="skill-card-top"><span class="skill-index">${String(i+1).padStart(2,"0")}</span><span class="skill-count">${cat.items.length} skills</span></div><h3>${esc(cat.name)}</h3><div class="tag-list">${cat.items.map(x=>`<span class="tag">${esc(x)}</span>`).join("")}</div>`;grid.appendChild(card);});
      $("ai-tools-list").textContent=d.skills.aiTools.join(", ");
    }
    if(page==="experience"){
      const root=$("experience-timeline");root.innerHTML="";
      d.experience.forEach(job=>{const item=document.createElement("div");item.className="timeline-item timeline-item-card";item.innerHTML=`<div class="experience-card-accent"></div><div class="experience-card-main"><div class="timeline-card-head"><span class="timeline-label">Professional experience</span><span class="timeline-date">${esc(job.duration)}</span></div><div class="experience-heading-row"><div><h3>${esc(job.role)}</h3><p class="timeline-meta">${esc(job.company)} · ${esc(job.location)}</p></div><span class="experience-type">Internship</span></div><div class="experience-divider"></div><ul>${job.points.map(p=>`<li>${esc(p)}</li>`).join("")}</ul><div class="experience-proof">${docLink(job.proofUrl)}</div></div>`;root.appendChild(item);});
    }
    if(page==="projects"){
      const grid=$("project-grid"),filters=$("filter-row"); filters.innerHTML=""; grid.innerHTML=""; const cats=["All",...new Set(d.projects.map(p=>p.category))];
      const render=filter=>{grid.innerHTML="";d.projects.filter(p=>filter==="All"||p.category===filter).forEach(p=>{const card=document.createElement("article");card.className="project-card";card.innerHTML=`<div class="project-card-top"><div class="project-card-index">${String(d.projects.indexOf(p)+1).padStart(2,"0")}</div><div class="project-card-main"><span class="project-category">${esc(p.category)}</span><h3>${esc(p.name)}</h3><p class="project-date">${esc(p.duration)}</p></div></div><p class="project-desc">${esc(p.description)}</p><div class="tag-list">${p.technologies.map(t=>`<span class="tag">${esc(t)}</span>`).join("")}</div><div class="project-card-footer"><a class="chip-link" href="${attr(p.github)}" target="_blank" rel="noopener noreferrer">${iconSvg("repository")}<span>Repository</span></a></div>`;grid.appendChild(card);});};
      cats.forEach((cat,i)=>{const b=document.createElement("button");b.className="filter-btn";b.type="button";b.textContent=cat;b.setAttribute("aria-pressed",String(i===0));b.addEventListener("click",()=>{filters.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed","false"));b.setAttribute("aria-pressed","true");render(cat);});filters.appendChild(b);});render("All");
    }
    if(page==="education"){
      const root=$("education-timeline");root.innerHTML="";d.education.forEach(ed=>{const item=document.createElement("div");item.className="timeline-item timeline-item-card education-card";item.innerHTML=`<div class="education-card-accent"></div><div class="education-card-main"><div class="timeline-card-head"><span class="timeline-label">Academic record</span><span class="timeline-date">${esc(ed.duration)}</span></div><div class="education-heading-row"><div><h3>${esc(ed.degree)}</h3><p class="timeline-meta">${esc(ed.institution)}</p></div><span class="timeline-status">${esc(ed.status)}</span></div><div class="education-meta-row"><span>${esc(ed.board)}</span><span>${esc(ed.score)}</span></div></div>`;root.appendChild(item);});
    }
    if(page==="achievements"){
      const grid=$("achievements-grid");grid.innerHTML="";d.achievements.forEach((a,i)=>{const card=document.createElement("article");card.className="achievement-card";card.innerHTML=`<div class="achievement-card-top"><span class="achievement-index">${String(i+1).padStart(2,"0")}</span><span class="achievement-title">${esc(a.title)}</span></div><p class="achievement-context">${esc(a.context)}</p><p class="achievement-detail">${esc(a.detail)}</p><p class="achievement-date">${esc(a.date)}</p>`;grid.appendChild(card);});
    }
    if(page==="certifications"){
      const grid=$("cert-grid");grid.innerHTML="";d.certifications.forEach(c=>{const card=document.createElement("article");card.className="cert-card";card.innerHTML=`<div class="cert-preview pdf-scroll" data-pdf="${attr(c.proofUrl||"")}"></div><div class="cert-body"><div class="cert-heading"><span class="cert-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="5.5" stroke="currentColor" stroke-width="1.6"/><path d="m9.5 13.5-1 6 3.5-2 3.5 2-1-6M9.7 9l1.5 1.5L14.8 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span><h3>${esc(c.name)}</h3></div>${c.course?`<p class="cert-course">${esc(c.course)}</p>`:""}<div class="cert-meta"><span class="cert-org">${esc(c.organization)}</span><span>${esc(c.date)}</span></div>${c.score?`<div class="cert-meta"><span>Score</span><span class="cert-score">${esc(c.score)}</span></div>`:""}<div class="cert-proof-row">${c.proofUrl?docLink(c.proofUrl,"Open Certificate"):""}</div></div>`;grid.appendChild(card);});
      grid.querySelectorAll("[data-pdf]").forEach(v=>{if(v.dataset.pdf)renderPdf(v,v.dataset.pdf);});
    }
    if(page==="research") $("research-callout").innerHTML=`<div class="callout-kicker">Publication</div><h3>${esc(d.research.title)}</h3><p>${esc(d.research.type)}</p><p class="meta">Paper ID · ${esc(d.research.paperId)}</p>`;
    if(page==="leadership") $("leadership-callout").innerHTML=`<div class="callout-kicker">Student Leadership</div><h3>${esc(d.leadership.role)}</h3><p class="meta">${esc(d.leadership.duration)}</p><ul>${d.leadership.points.map(p=>`<li>${esc(p)}</li>`).join("")}</ul>`;
    if(page==="activities"){
      const wl=$("workshops-list"),cl=$("community-list"); wl.innerHTML="";cl.innerHTML="";
      d.workshops.forEach(w=>{const li=document.createElement("li");li.innerHTML=`<div class="item-title">${esc(w.title)}</div><div class="item-meta">${esc(w.location||w.organizer||"")} · ${esc(w.date)}</div>${w.detail?`<p class="item-detail">${esc(w.detail)}</p>`:""}${Array.isArray(w.gallery)&&w.gallery.length?`<div class="event-gallery" data-gallery-label="${attr(w.title)}"></div>`:""}${docLink(w.proofUrl)}`;wl.appendChild(li);if(Array.isArray(w.gallery)&&w.gallery.length)renderGallery(li.querySelector(".event-gallery"),w.gallery,w.title);});
      d.community.forEach(c=>{const li=document.createElement("li");li.innerHTML=`<div class="item-title">${esc(c.title)}</div><div class="item-meta">${esc(c.organization?`${c.organization} · ${c.date}`:c.date)}</div>${c.detail?`<p class="item-detail">${esc(c.detail)}</p>`:""}${Array.isArray(c.gallery)&&c.gallery.length?`<div class="event-gallery" data-gallery-label="${attr(c.title)}"></div>`:""}`;cl.appendChild(li);if(Array.isArray(c.gallery)&&c.gallery.length)renderGallery(li.querySelector(".event-gallery"),c.gallery,c.title);});
      d.strengths.forEach(s=>{const x=document.createElement("span");x.className="pill";x.textContent=s;$("strengths-list").appendChild(x);});d.hobbies.forEach(s=>{const x=document.createElement("span");x.className="pill";x.textContent=s;$("hobbies-list").appendChild(x);});
      const ig=$("industrial-gallery"),cg=$("community-gallery"); if(ig)ig.innerHTML="";if(cg)cg.innerHTML="";
      if(ig)ig.closest(".gallery-block")?.classList.add("is-event-gallery"); if(cg)cg.closest(".gallery-block")?.classList.add("is-event-gallery");
    }
    if(page==="contact"){
      $("contact-heading").textContent=d.contact.heading;$("contact-subtext").textContent=d.contact.subtext;const e=$("contact-email");e.href=`mailto:${d.personal.email}`;e.textContent=d.personal.email;$("contact-linkedin").href=d.profiles.linkedin.url;$("contact-github").href=d.profiles.github.url;$("contact-hackerrank").href=d.profiles.hackerrank.url;$("contact-leetcode").href=d.profiles.leetcode.url;
    }
    document.querySelectorAll(".reveal").forEach(x=>x.classList.add("is-visible"));
    $("footer-year") && ($("footer-year").textContent=new Date().getFullYear());
  }

  function renderGallery(target,items,label){
    if(!target)return;
    if(!items?.length){target.innerHTML=`<div class="gallery-placeholder"><strong>Event gallery</strong><span>Add photographs for this event in <code>data.js</code>.</span></div>`;return;}
    target.innerHTML=`<div class="gallery-grid">${items.map((item)=>`<figure class="gallery-item"><img src="${attr(typeof item==='string'?item:item.src)}" alt="${attr(typeof item==='string'?label:item.alt||label)}" loading="lazy"></figure>`).join("")}</div>`;
  }

  document.addEventListener("DOMContentLoaded",async()=>{
    await loadSharedChrome();
    await loadHomeContent();
    setupTheme();setupMobileNav();setupSpaNavigation();setupPdfScrollChaining();setupResumeModal();initPage();

  });
})();
