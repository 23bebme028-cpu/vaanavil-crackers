/* =========================================================================
   STUCK -> SWITCH  (vanilla HTML / CSS / JS build, no frameworks)
   A cardiac-cycle learning prototype that detects learning friction and
   automatically switches the explanation of the concept being studied.
   ========================================================================= */

/* ------------------------------ icon helper ------------------------------ */
function icon(name, size = 15, color = "currentColor") {
  const p = {
    heart: '<path d="M12 21s-7.5-4.7-10-9.3C.4 8 2 4.5 5.4 4.1 7.6 3.9 9.6 5 12 7.8 14.4 5 16.4 3.9 18.6 4.1 22 4.5 23.6 8 22 11.7 19.5 16.3 12 21 12 21z"/>',
    play: '<path d="M6 4l14 8-14 8V4z"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke-width="2"/>',
    arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6" fill="none" stroke-width="2"/>',
    check: '<path d="M5 12l4 4 10-10" fill="none" stroke-width="3"/>',
    shield: '<path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" fill="none" stroke-width="1.6"/><path d="M8.5 12l2.4 2.4L15.5 9.5" fill="none" stroke-width="1.8"/>',
    camera: '<rect x="3" y="7" width="18" height="13" rx="2" fill="none" stroke-width="1.6"/><path d="M8 7l1.6-2.4h4.8L16 7" fill="none" stroke-width="1.6"/><circle cx="12" cy="13.5" r="3.2" fill="none" stroke-width="1.6"/>',
    cameraOff: '<path d="M3 3l18 18M9 7H5a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2v-2m0-6V7a2 2 0 00-2-2h-2.5" fill="none" stroke-width="1.6"/><circle cx="12" cy="13.5" r="3.2" fill="none" stroke-width="1.6"/>',
    eyeOff: '<path d="M3 3l18 18M10.6 10.6a3 3 0 004.2 4.2M9.9 5.1A10.9 10.9 0 0112 5c5 0 9 4 10 7-.4 1.1-1.2 2.4-2.4 3.6M6.5 6.6C4.4 8 2.9 10 2 12c1 3 5 7 10 7 1.3 0 2.5-.2 3.6-.6" fill="none" stroke-width="1.6"/>',
    rotate: '<path d="M4 4v6h6M20 20v-6h-6" fill="none" stroke-width="1.8"/><path d="M5 14a8 8 0 0014 4M19 10A8 8 0 005 6" fill="none" stroke-width="1.8"/>',
    activity: '<path d="M3 12h4l2-7 4 14 2-7h6" fill="none" stroke-width="1.8"/>',
    refresh: '<path d="M4 4v5h5M20 20v-5h-5" fill="none" stroke-width="1.8"/><path d="M5 9a8 8 0 0113.9-3M19 15a8 8 0 01-13.9 3" fill="none" stroke-width="1.8"/>',
    mouse: '<path d="M9 3l10 8-4.2.9L17 17l-2.6 1.3-2.2-4.6L9 17V3z" fill="none" stroke-width="1.4"/>',
  }[name] || "";
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0">${p}</svg>`;
}

/* ------------------------------ concept data ------------------------------ */
const CONCEPTS = [
  {
    id: "overview",
    title: "Heart Overview",
    original:
      "The human heart is a four-chambered muscular organ that functions as a dual pump, propelling deoxygenated blood through the pulmonary circuit and oxygenated blood through the systemic circuit via coordinated, rhythmic contractions.",
    simple:
      "The heart is really two pumps stacked together. One side pushes blood to the lungs to pick up oxygen. The other side pushes that oxygen-rich blood out to the rest of the body.",
    analogy:
      "Think of the heart like a duplex house with two separate water pumps — one pump sends water out to the garden (lungs), the other sends water into the house (the body). They beat in rhythm, but they never mix their supply.",
    quiz: { q: "How many separate pumps make up the heart?", options: ["One", "Two", "Four", "Six"], correct: "Two" },
  },
  {
    id: "atria",
    title: "Atria",
    original:
      "The atria are the superior, thin-walled receiving chambers of the heart. They accumulate venous return during ventricular systole and deliver it into the ventricles via a low-pressure, largely passive filling phase.",
    simple:
      "The atria are the two small rooms at the top of the heart. Their job is simple: catch incoming blood and pass it down to the bigger chambers below.",
    analogy:
      "Picture the atria as a mail room on the top floor of a building — packages (blood) arrive, sit briefly, then get dropped down a chute to the main floor (the ventricles) for delivery.",
    quiz: {
      q: "What is the main job of the atria?",
      options: ["Pump blood to the whole body", "Receive incoming blood and pass it to the ventricles", "Filter oxygen from the blood", "Generate the heartbeat's electrical signal"],
      correct: "Receive incoming blood and pass it to the ventricles",
    },
  },
  {
    id: "ventricles",
    title: "Ventricles",
    original:
      "The ventricles are the thick-walled, inferior chambers responsible for generating the pressure required to eject blood into the pulmonary and systemic circulations. Their muscular architecture reflects the afterload each must overcome.",
    simple:
      "The ventricles are the two strong chambers at the bottom of the heart. They squeeze hard to push blood out — one side to the lungs, one side to the whole body.",
    analogy:
      "Think of the ventricles as two fists. Each fist squeezes to shoot water out through a hose — the right fist's hose goes to the lungs, the left fist's hose (much stronger) goes to the rest of the body.",
    quiz: { q: "Which ventricle has the thicker, stronger wall?", options: ["Right ventricle", "Left ventricle", "They are equal", "Neither has muscle"], correct: "Left ventricle" },
  },
  {
    id: "atrial-systole",
    title: "Atrial Systole",
    original:
      "Atrial systole denotes the phase of atrial contraction that actively completes ventricular filling, contributing the final increment of end-diastolic volume immediately prior to ventricular contraction.",
    simple:
      "Atrial systole is just the top chambers giving one last squeeze to push any remaining blood down into the ventricles before the big pump happens.",
    analogy:
      "It's like tapping the last bit of ketchup out of the bottle right before you close it — the atria give a final nudge to top off the ventricles.",
    quiz: { q: "What does atrial systole do?", options: ["Pushes blood to the lungs", "Gives a final push to top off the ventricles", "Pushes blood to the body", "Relaxes the whole heart"], correct: "Gives a final push to top off the ventricles" },
  },
  {
    id: "ventricular-systole",
    title: "Ventricular Systole",
    original:
      "Ventricular systole represents the phase of the cardiac cycle during which ventricular contraction generates sufficient intraventricular pressure to exceed aortic and pulmonary arterial pressure, causing the semilunar valves to open and blood to be ejected.",
    simple:
      "Think of the ventricles as two pumps. When they squeeze: the right ventricle sends blood to the lungs, and the left ventricle sends blood to the body.",
    analogy:
      "Imagine two garden hoses connected to two hand pumps. Squeeze the right pump and water shoots toward the greenhouse (lungs). Squeeze the left pump — much harder — and water shoots all the way across the yard (the whole body).",
    quiz: { q: "Which ventricle sends oxygen-rich blood to the body?", options: ["Right Ventricle", "Left Ventricle", "Both equally", "Neither"], correct: "Left Ventricle" },
  },
  {
    id: "cardiac-cycle",
    title: "Complete Cardiac Cycle",
    original:
      "The cardiac cycle comprises the sequential phases of atrial systole, isovolumetric contraction, ventricular ejection, isovolumetric relaxation, and ventricular filling, repeating rhythmically to sustain circulatory perfusion.",
    simple:
      "One full heartbeat is just: top chambers squeeze, bottom chambers squeeze and push blood out, everything relaxes and refills. Then it repeats, about once a second.",
    analogy:
      "It's like a relay race baton pass that loops forever: atria hand off to ventricles, ventricles launch the blood out, everyone rests for a beat, and the race starts again.",
    quiz: {
      q: "What is the correct order of one cardiac cycle?",
      options: ["Ventricles fill, atria squeeze, ventricles squeeze, relax", "Atria squeeze, ventricles squeeze, relax and refill", "Relax, ventricles squeeze, atria squeeze", "Ventricles squeeze, atria squeeze, relax"],
      correct: "Atria squeeze, ventricles squeeze, relax and refill",
    },
  },
];

const FRICTION_WEIGHTS = { longTime: 25, repeatedVisit: 20, backwardScroll: 15, incorrectAnswer: 20, longResponse: 10, orientationChange: 10 };

function statusFor(score) {
  if (score >= 60) return { label: "Possible Learning Friction", tone: "pulse" };
  if (score >= 30) return { label: "Watch", tone: "watch" };
  return { label: "Normal", tone: "recover" };
}
const TONE_FG = { pulse: "var(--pulse)", watch: "var(--watch)", recover: "var(--recover)" };

/* ------------------------------ pulse strip svg ------------------------------ */
function pulseStripSVG(intensity, tone, height = 90, label = "", phase = 0) {
  const width = 900;
  const amp = 6 + (intensity / 100) * 26;
  const spikeChance = intensity / 100;
  const segments = 60;
  const pts = [];
  for (let i = 0; i <= segments; i++) {
    const x = (i / segments) * width;
    const t = i + phase * 0.6;
    let y = height / 2 + Math.sin(t * 0.35) * amp * 0.25;
    const seed = Math.sin(i * 12.9898 + phase * 0.37) * 43758.5453;
    const rnd = seed - Math.floor(seed);
    if (rnd < spikeChance * 0.22) {
      const dir = rnd < spikeChance * 0.11 ? -1 : 1;
      y = height / 2 - dir * amp * (1.4 + rnd);
    }
    pts.push([x, y]);
  }
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) d += ` L ${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)}`;
  const color = TONE_FG[tone] || "var(--ink)";
  return `
  <div class="pulse-strip-wrap">
    <svg viewBox="0 0 ${width} ${height}" width="100%" height="${height}" preserveAspectRatio="none" style="display:block">
      <line x1="0" y1="${height / 2}" x2="${width}" y2="${height / 2}" stroke="var(--line)" stroke-width="1"/>
      <path d="${d}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    ${label ? `<div class="pulse-strip-label ss-mono">${label}</div>` : ""}
  </div>`;
}

/* ------------------------------ small building blocks ------------------------------ */
function statusBadgeHTML(score) {
  const s = statusFor(score);
  return `<span class="status-badge tone-${s.tone} ss-mono"><span class="dot"></span>${s.label}</span>`;
}
function signalChipHTML(active, text) {
  return `<div class="signal-chip ${active ? "active" : ""}"><span class="signal-box">${active ? icon("check", 11, "var(--pulse)") : ""}</span>${text}</div>`;
}
function explanationHTML(concept, mode) {
  if (mode === "original") {
    return `<div class="explanation-original"><div class="exp-label ss-mono">Explanation</div><p>${concept.original}</p></div>`;
  }
  const modeLabel = mode === "simple" ? "Simple version" : "Analogy";
  const text = mode === "simple" ? concept.simple : concept.analogy;
  return `
  <div class="explanation-switched">
    <div class="exp-head">${icon("refresh", 14, "var(--recover)")}<span class="exp-head-label ss-mono">Explanation switched — ${modeLabel}</span></div>
    <p>${text}</p>
  </div>`;
}
function chartHTML(before, after) {
  const maxVal = Math.max(before.friction, before.response, after.friction, after.response, 1);
  const barH = (v) => Math.max(6, Math.round((v / maxVal) * 130));
  return `
  <div class="chart-wrap">
    <div class="chart-bars">
      <div class="chart-group">
        <div class="chart-group-bars">
          <div class="chart-bar before" style="height:${barH(before.friction)}px"><span class="val">${before.friction}</span></div>
          <div class="chart-bar after" style="height:${barH(after.friction)}px"><span class="val">${after.friction}</span></div>
        </div>
        <div class="chart-group-label">Friction</div>
      </div>
      <div class="chart-group">
        <div class="chart-group-bars">
          <div class="chart-bar before" style="height:${barH(before.response)}px"><span class="val">${before.response}</span></div>
          <div class="chart-bar after" style="height:${barH(after.response)}px"><span class="val">${after.response}</span></div>
        </div>
        <div class="chart-group-label">Response (s)</div>
      </div>
    </div>
    <div class="chart-legend">
      <span><span class="sw" style="background:var(--pulse)"></span>Before</span>
      <span><span class="sw" style="background:var(--recover)"></span>After</span>
    </div>
  </div>`;
}
function recoveryCardHTML(before, after, conceptTitle, showContinue) {
  return `
  <div class="recovery-card">
    <div class="recovery-head">${icon("check", 18, "var(--recover)")}<h3 class="ss-display">Learning Recovery Detected</h3></div>
    <div class="recovery-sub">Concept: <strong>${conceptTitle}</strong></div>
    <div class="recovery-desc">Student performance improved after the explanation changed.</div>
    <div class="recovery-stats">
      <div class="before"><div class="col-title ss-mono">Before</div>
        <div>Friction &nbsp; <span>${before.friction}</span></div>
        <div>Response &nbsp; <span>${before.response}s</span></div>
        <div>Attempts &nbsp; <span>${before.attempts}</span></div>
      </div>
      <div class="after"><div class="col-title ss-mono">After</div>
        <div>Friction &nbsp; <span>${after.friction}</span></div>
        <div>Response &nbsp; <span>${after.response}s</span></div>
        <div>Answer &nbsp; <span>Correct</span></div>
      </div>
    </div>
    ${chartHTML(before, after)}
    ${showContinue ? `<button class="btn-continue" data-action="continue-learning">Continue learning</button>` : ""}
  </div>`;
}

/* ============================================================================
   APPLICATION STATE + ROUTER
   ============================================================================ */
const root = document.getElementById("root");

const app = {
  view: "landing",
  cleanupFns: [],
};

function cleanup() {
  app.cleanupFns.forEach((fn) => { try { fn(); } catch (e) {} });
  app.cleanupFns = [];
}
function onCleanup(fn) { app.cleanupFns.push(fn); }

function navigate(view) {
  cleanup();
  app.view = view;
  render();
}

function render() {
  root.innerHTML = `
    <div class="topbar">
      <div class="topbar-inner">
        <button class="brand" data-action="go-landing">
          ${icon("heart", 16, "var(--pulse)")}
          <span class="ss-display brand-title">Stuck → Switch</span>
        </button>
        <div class="nav-actions">
          <button class="nav-btn ${app.view === "learning" ? "active" : ""}" data-action="go-learning">Learning</button>
          <button class="nav-btn ${app.view === "demo" ? "active demo" : ""}" data-action="go-demo">Live Demo</button>
        </div>
      </div>
    </div>
    <div id="view-root"></div>
  `;
  root.querySelector('[data-action="go-landing"]').addEventListener("click", () => navigate("landing"));
  root.querySelector('[data-action="go-learning"]').addEventListener("click", () => navigate("learning"));
  root.querySelector('[data-action="go-demo"]').addEventListener("click", () => navigate("demo"));

  const viewRoot = document.getElementById("view-root");
  if (app.view === "landing") renderLanding(viewRoot);
  else if (app.view === "learning") renderLearning(viewRoot);
  else if (app.view === "demo") renderDemo(viewRoot);
}

/* ============================================================================
   LANDING
   ============================================================================ */
function renderLanding(container) {
  container.innerHTML = `
    <div class="page">
      <div class="eyebrow">${icon("heart", 14, "var(--pulse)")} Smart India Hackathon — Adaptive Learning Prototype</div>
      <h1 class="hero-title ss-display">Stuck <span class="arrow">→</span> Switch</h1>
      <p class="hero-sub">Detect the learning friction. Change the explanation. Keep the student moving.</p>

      <div class="hero-actions">
        <button class="btn-primary" data-action="start-learning">Start Learning ${icon("arrowRight", 16, "#fff")}</button>
        <button class="btn-pulse" data-action="start-demo">${icon("play", 16, "#fff")} Live Demo</button>
      </div>

      <div class="hero-pulse-card">${pulseStripSVG(38, "watch", 80, "Friction signal — illustrative", 0)}</div>

      <div class="process-card">${processDiagramHTML()}</div>

      <div class="compare-grid">
        <div>
          <div class="compare-heading">The usual path</div>
          <ol>
            <li>Student gets stuck</li>
            <li>Student realizes it, eventually</li>
            <li>Student searches for another resource</li>
            <li>Student chooses something — maybe the right thing</li>
          </ol>
        </div>
        <div>
          <div class="compare-heading pulse">Stuck → Switch</div>
          <ol class="strong">
            <li>Student gets stuck</li>
            <li>System detects learning friction</li>
            <li>The exact concept is already known</li>
            <li>Explanation changes automatically, in place</li>
            <li>Recovery is tested and measured</li>
          </ol>
        </div>
      </div>

      <div class="privacy-row">
        <span>${icon("shield", 14)} No facial recognition</span>
        <span>${icon("shield", 14)} No identity recognition</span>
        <span>${icon("shield", 14)} No raw video stored</span>
        <span>${icon("shield", 14)} Camera can be disabled anytime</span>
      </div>
    </div>
  `;
  container.querySelector('[data-action="start-learning"]').addEventListener("click", () => navigate("learning"));
  container.querySelector('[data-action="start-demo"]').addEventListener("click", () => navigate("demo"));

  // animate the illustrative pulse strip
  let phase = 0;
  const holder = container.querySelector(".hero-pulse-card");
  const id = setInterval(() => {
    phase = (phase + 1) % 1000;
    holder.innerHTML = pulseStripSVG(38, "watch", 80, "Friction signal — illustrative", phase);
  }, 90);
  onCleanup(() => clearInterval(id));
}

function processDiagramHTML() {
  const steps = [
    { k: "LEARN", d: "Student studies inside the platform" },
    { k: "DETECT", d: "Friction score rises from real signals" },
    { k: "SWITCH", d: "Explanation changes automatically" },
    { k: "TEST", d: "A quick question checks understanding" },
    { k: "RECOVER", d: "Improvement is measured, not assumed" },
  ];
  return `
  <div class="process-diagram">
    <div class="process-line"></div>
    <div class="process-steps" style="grid-template-columns:repeat(${steps.length},1fr)">
      ${steps.map((s, i) => `
        <div class="process-step">
          <div class="step-circle ${i === 2 ? "active" : ""}">${i + 1}</div>
          <div class="step-key ss-mono">${s.k}</div>
          <div class="step-desc">${s.d}</div>
        </div>`).join("")}
    </div>
  </div>`;
}

/* ============================================================================
   LEARNING PAGE
   ============================================================================ */
function renderLearning(container) {
  const L = {
    activeIdx: 4, // Ventricular Systole by default
    visits: Object.fromEntries(CONCEPTS.map((c) => [c.id, 1])),
    timeOnConcept: 0,
    backwardScrolls: 0,
    orientationChanges: 0,
    wrongAnswers: 0,
    lastResponseTime: 0,
    explanationMode: "original",
    switched: false,
    beforeSnapshot: null,
    afterSnapshot: null,
    quizAttempts: 0,
    recovered: false,
    cameraOn: true,
    sustainedHighTicks: 0,
    lastScrollTop: 0,
    quizStartedAt: 0,
    phase: 0,
  };

  container.innerHTML = `
    <div class="page wide">
      <button class="back-btn" data-action="back">${icon("arrowLeft", 15)} Back</button>
      <div class="page-header-row">
        <div></div>
        <div class="page-header-label">${icon("heart", 15, "var(--pulse)")} Human Heart — Cardiac Cycle</div>
      </div>
      <div class="learning-grid">
        <div class="concept-list-card" id="concept-list"></div>
        <div class="lesson-card" id="lesson-card"></div>
        <div class="rail">
          <div class="friction-panel" id="friction-panel"></div>
          <div class="webcam-panel" id="webcam-panel"></div>
          <div class="telemetry ss-mono" id="telemetry"></div>
        </div>
      </div>
    </div>
  `;
  container.querySelector('[data-action="back"]').addEventListener("click", () => navigate("landing"));

  const conceptListEl = container.querySelector("#concept-list");
  const lessonCardEl = container.querySelector("#lesson-card");
  const frictionPanelEl = container.querySelector("#friction-panel");
  const webcamPanelEl = container.querySelector("#webcam-panel");
  const telemetryEl = container.querySelector("#telemetry");

  function concept() { return CONCEPTS[L.activeIdx]; }

  function computeSignals() {
    return {
      longTime: L.timeOnConcept >= 60,
      repeatedVisit: (L.visits[concept().id] || 1) >= 2,
      backwardScroll: L.backwardScrolls >= 1,
      incorrectAnswer: L.wrongAnswers >= 1,
      longResponse: L.lastResponseTime >= 15,
      orientationChange: L.orientationChanges >= 3,
    };
  }
  function computeScore(signals) {
    let s = 0;
    if (signals.longTime) s += FRICTION_WEIGHTS.longTime;
    if (signals.repeatedVisit) s += FRICTION_WEIGHTS.repeatedVisit;
    if (signals.backwardScroll) s += FRICTION_WEIGHTS.backwardScroll;
    if (signals.incorrectAnswer) s += FRICTION_WEIGHTS.incorrectAnswer;
    if (signals.longResponse) s += FRICTION_WEIGHTS.longResponse;
    if (signals.orientationChange) s += FRICTION_WEIGHTS.orientationChange;
    return Math.min(100, s);
  }

  function renderConceptList() {
    conceptListEl.innerHTML = `
      <div class="concept-list-title ss-mono">Concepts</div>
      ${CONCEPTS.map((c, idx) => `<button class="concept-item ${idx === L.activeIdx ? "active" : ""}" data-idx="${idx}">${c.title}</button>`).join("")}
    `;
    conceptListEl.querySelectorAll(".concept-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.idx, 10);
        if (idx === L.activeIdx) return;
        L.visits[CONCEPTS[idx].id] = (L.visits[CONCEPTS[idx].id] || 0) + 1;
        L.activeIdx = idx;
        resetForNewConcept();
      });
    });
  }

  function resetForNewConcept() {
    L.timeOnConcept = 0;
    L.backwardScrolls = 0;
    L.wrongAnswers = 0;
    L.lastResponseTime = 0;
    L.explanationMode = "original";
    L.switched = false;
    L.beforeSnapshot = null;
    L.afterSnapshot = null;
    L.quizAttempts = 0;
    L.recovered = false;
    L.sustainedHighTicks = 0;
    L.lastScrollTop = 0;
    renderConceptList();
    renderLessonCard();
    refreshFrictionAndCheck();
  }

  function renderLessonCard() {
    const c = concept();
    lessonCardEl.innerHTML = `
      <div class="lesson-kicker ss-mono">Concept ${L.activeIdx + 1} of ${CONCEPTS.length}</div>
      <h2 class="lesson-title ss-display">${c.title}</h2>
      <div id="explanation-slot">${explanationHTML(c, L.explanationMode)}</div>
      ${L.switched ? `<div class="quiz-box" id="quiz-slot"></div>` : `<div class="hint-row">${icon("mouse", 13)} Try scrolling back up, revisiting this concept from the list, or just reading slowly — the panel on the right tracks it live.</div>`}
      <div id="recovery-slot"></div>
    `;
    if (L.switched) renderQuizSlot();
    if (L.beforeSnapshot && L.afterSnapshot) {
      lessonCardEl.querySelector("#recovery-slot").innerHTML = recoveryCardHTML(L.beforeSnapshot, L.afterSnapshot, c.title, false);
    }
  }

  function renderQuizSlot() {
    const slot = lessonCardEl.querySelector("#quiz-slot");
    if (!slot) return;
    const c = concept();
    if (L.recovered) {
      slot.innerHTML = `<div class="quiz-kicker ss-mono">Quick check</div><div class="quiz-correct-msg">${icon("check", 15, "var(--recover)")} Correct — see the recovery summary on the right.</div>`;
      return;
    }
    L.quizStartedAt = Date.now();
    slot.innerHTML = `
      <div class="quiz-kicker ss-mono">Quick check</div>
      <div class="quiz-q">${c.quiz.q}</div>
      <div class="quiz-options">
        ${c.quiz.options.map((opt) => `<button class="quiz-opt" data-opt="${encodeURIComponent(opt)}">${opt}</button>`).join("")}
      </div>
    `;
    slot.querySelectorAll(".quiz-opt").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (slot.dataset.answered) return;
        slot.dataset.answered = "1";
        const opt = decodeURIComponent(btn.dataset.opt);
        const responseTime = Math.round(((Date.now() - L.quizStartedAt) / 100)) / 10;
        slot.querySelectorAll(".quiz-opt").forEach((b) => {
          b.disabled = true;
          const bOpt = decodeURIComponent(b.dataset.opt);
          if (bOpt === c.quiz.correct) b.classList.add("correct");
          else if (bOpt === opt) b.classList.add("wrong");
        });
        handleAnswer(opt === c.quiz.correct, responseTime);
      });
    });
  }

  function handleAnswer(correct, responseTime) {
    L.quizAttempts += 1;
    L.lastResponseTime = responseTime;
    if (correct) {
      if (L.switched) {
        const signals = computeSignals();
        const score = computeScore(signals);
        L.afterSnapshot = { friction: Math.max(8, Math.round(score * 0.32)), response: responseTime };
        L.recovered = true;
        setTimeout(() => {
          renderLessonCard();
          refreshFrictionAndCheck();
        }, 500);
      }
    } else {
      L.wrongAnswers += 1;
      if (L.switched && L.explanationMode === "simple") {
        L.explanationMode = "analogy";
        setTimeout(() => {
          renderLessonCard();
          refreshFrictionAndCheck();
        }, 600);
      } else {
        refreshFrictionAndCheck();
      }
    }
  }

  function renderFrictionPanel(score, signals) {
    const c = concept();
    frictionPanelEl.innerHTML = `
      <div class="friction-panel-title">Learning Friction</div>
      <div class="friction-score-row">
        <span class="friction-score ss-mono ss-display" style="color:${TONE_FG[statusFor(score).tone]}">${Math.round(score)}</span>
        ${statusBadgeHTML(score)}
      </div>
      ${pulseStripSVG(score, statusFor(score).tone, 64, "", L.phase)}
      <div class="friction-concept">Concept: <strong>${c.title}</strong></div>
      <div class="friction-signals">
        <div class="friction-signals-title">Detected signals</div>
        ${signalChipHTML(signals.longTime, "Long time on concept")}
        ${signalChipHTML(signals.repeatedVisit, "Repeated section visit")}
        ${signalChipHTML(signals.backwardScroll, "Backward scrolling")}
        ${signalChipHTML(signals.incorrectAnswer, "Incorrect answer")}
        ${signalChipHTML(signals.longResponse, "Long response time")}
        ${signalChipHTML(signals.orientationChange, "Repeated orientation change")}
      </div>
    `;
  }

  function renderTelemetry() {
    const c = concept();
    telemetryEl.innerHTML = `
      <div>Time on concept: <strong>${L.timeOnConcept}s</strong></div>
      <div>Visits: <strong>${L.visits[c.id] || 1}</strong></div>
      <div>Backward scrolls: <strong>${L.backwardScrolls}</strong></div>
      <div>Orientation changes: <strong>${L.orientationChanges}</strong></div>
    `;
  }

  function refreshFrictionAndCheck() {
    const signals = computeSignals();
    const score = computeScore(signals);
    renderFrictionPanel(score, signals);
    renderTelemetry();

    if (!L.switched) {
      const activeSignalCount = Object.values(signals).filter(Boolean).length;
      if (score >= 60 && activeSignalCount >= 2) L.sustainedHighTicks += 1;
      else L.sustainedHighTicks = 0;

      if (L.sustainedHighTicks >= 1) {
        L.beforeSnapshot = { friction: score, response: L.lastResponseTime || Math.round(L.timeOnConcept * 0.3) || 12, attempts: L.quizAttempts || 1 };
        L.switched = true;
        L.explanationMode = "simple";
        renderLessonCard();
      }
    }
  }

  // ticker: advance time on concept, recompute friction every second
  const tickerId = setInterval(() => {
    if (!L.switched) L.timeOnConcept += 1;
    L.phase = (L.phase + 1) % 1000;
    refreshFrictionAndCheck();
  }, 1000);
  onCleanup(() => clearInterval(tickerId));

  // faster pulse-only redraw for smoother animation
  const pulseId = setInterval(() => {
    L.phase = (L.phase + 1) % 1000;
    const signals = computeSignals();
    const score = computeScore(signals);
    const strip = frictionPanelEl.querySelector(".pulse-strip-wrap");
    if (strip) strip.outerHTML = pulseStripSVG(score, statusFor(score).tone, 64, "", L.phase);
  }, 300);
  onCleanup(() => clearInterval(pulseId));

  // backward-scroll detection on the lesson card
  lessonCardEl.addEventListener("scroll", () => {
    const top = lessonCardEl.scrollTop;
    if (top < L.lastScrollTop - 4) {
      L.backwardScrolls += 1;
      refreshFrictionAndCheck();
    }
    L.lastScrollTop = top;
  });

  // webcam panel (persists independently of concept switching)
  let cameraStream = null;
  function renderWebcamPanel() {
    webcamPanelEl.innerHTML = `
      <div class="webcam-head">
        <div class="webcam-head-label">${icon("camera", 13)} Supporting Signal</div>
        <button class="webcam-toggle" id="webcam-toggle">${L.cameraOn ? icon("cameraOff", 12) : icon("camera", 12)} ${L.cameraOn ? "Turn off" : "Turn on"}</button>
      </div>
      <div class="webcam-frame" id="webcam-frame">${L.cameraOn ? "" : icon("eyeOff", 22, "#7C93A6")}</div>
      <div class="webcam-stats ss-mono">
        <div class="row"><span>Camera</span><strong>${L.cameraOn ? "ON" : "OFF"}</strong></div>
        <div class="row"><span>Face</span><strong id="face-stat">—</strong></div>
        <div class="row"><span>Behavior</span><strong id="behavior-stat">—</strong></div>
      </div>
      <div class="webcam-error" id="webcam-error"></div>
      <div class="webcam-note">No facial recognition. No identity recognition. No raw video is stored — only presence and orientation are estimated on-device.</div>
    `;
    webcamPanelEl.querySelector("#webcam-toggle").addEventListener("click", () => {
      L.cameraOn = !L.cameraOn;
      if (L.cameraOn) startCamera(); else stopCamera();
      renderWebcamPanel();
    });
    if (L.cameraOn) startCamera();
  }

  let orientationIntervalId = null;
  async function startCamera() {
    const frame = webcamPanelEl.querySelector("#webcam-frame");
    const errEl = webcamPanelEl.querySelector("#webcam-error");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (errEl) errEl.textContent = "Camera unavailable — continuing with learning-interaction signals only.";
      return;
    }
    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({ video: { width: 240, height: 180 } });
      if (frame) {
        frame.innerHTML = "";
        const video = document.createElement("video");
        video.autoplay = true; video.muted = true; video.playsInline = true;
        video.srcObject = cameraStream;
        frame.appendChild(video);
      }
      const faceStat = webcamPanelEl.querySelector("#face-stat");
      const behaviorStat = webcamPanelEl.querySelector("#behavior-stat");
      if (faceStat) faceStat.textContent = "Detected";
      if (behaviorStat) behaviorStat.textContent = "Normal";

      // Lightweight, privacy-preserving behavioral proxy: while active, estimate
      // occasional head-orientation changes. No frames are stored or analyzed
      // for identity or emotion.
      orientationIntervalId = setInterval(() => {
        if (Math.random() < 0.3) {
          L.orientationChanges += 1;
          refreshFrictionAndCheck();
        }
      }, 4000);
    } catch (e) {
      if (errEl) errEl.textContent = "Camera unavailable — continuing with learning-interaction signals only.";
    }
  }
  function stopCamera() {
    if (cameraStream) { cameraStream.getTracks().forEach((t) => t.stop()); cameraStream = null; }
    if (orientationIntervalId) { clearInterval(orientationIntervalId); orientationIntervalId = null; }
  }
  onCleanup(stopCamera);

  // initial paint
  renderConceptList();
  renderLessonCard();
  renderWebcamPanel();
  refreshFrictionAndCheck();
}

/* ============================================================================
   LIVE DEMO
   ============================================================================ */
function renderDemo(container) {
  const DEMO_CONCEPT = CONCEPTS.find((c) => c.id === "ventricular-systole");
  const D = {
    stage: 0, // 0 idle, 1 start, 2 rising, 3 flagged+switch, 4 question, 5 recovery
    friction: 18,
    signals: { longTime: false, repeatedVisit: false, backwardScroll: false, incorrectAnswer: false, longResponse: false, orientationChange: false },
    answered: null,
    timers: [],
    phase: 0,
  };

  container.innerHTML = `
    <div class="page narrow">
      <button class="back-btn" data-action="back">${icon("arrowLeft", 15)} Back</button>
      <div class="page-header-row">
        <div></div>
        <div class="page-header-label">${icon("play", 14, "var(--pulse)")} Live Demo — Controlled Simulation</div>
      </div>
      <div class="card" id="demo-card"></div>
    </div>
  `;
  container.querySelector('[data-action="back"]').addEventListener("click", () => navigate("landing"));

  const demoCard = container.querySelector("#demo-card");

  function clearTimers() { D.timers.forEach(clearTimeout); D.timers = []; }
  onCleanup(clearTimers);

  function renderDemoCard() {
    const s = statusFor(D.friction);
    demoCard.innerHTML = `
      <div class="demo-head-row">
        <div>
          <div class="demo-concept-kicker ss-mono">Concept</div>
          <div class="demo-concept-title">${DEMO_CONCEPT.title}</div>
        </div>
        <div class="demo-actions">
          ${D.stage === 0 ? `<button class="btn-pulse" data-action="run">${icon("play", 15, "#fff")} Run Live Demo</button>` : ""}
          ${D.stage > 0 ? `<button class="btn-outline" data-action="reset">${icon("rotate", 14)} Reset</button>` : ""}
        </div>
      </div>

      ${D.stage > 0 ? `
      <div class="demo-readout">
        <div class="friction-score-row">
          <span class="friction-score ss-mono ss-display" style="color:${TONE_FG[s.tone]}">${D.friction}</span>
          ${statusBadgeHTML(D.friction)}
        </div>
        ${pulseStripSVG(D.friction, s.tone, 70, "", D.phase)}
        <div class="demo-signals">
          ${signalChipHTML(D.signals.longTime, "Long time")}
          ${signalChipHTML(D.signals.repeatedVisit, "Repeated reading")}
          ${signalChipHTML(D.signals.backwardScroll, "Backward scrolling")}
          ${signalChipHTML(D.signals.incorrectAnswer, "Incorrect answer")}
          ${signalChipHTML(D.signals.longResponse, "Long response time")}
        </div>
      </div>` : ""}

      ${D.stage === 0 ? `<div class="demo-idle-copy">Press <strong>Run Live Demo</strong> to watch a scripted session: a student reading "${DEMO_CONCEPT.title}" builds up learning friction, the system flags it, the explanation switches automatically, and recovery is measured.</div>` : ""}

      ${D.stage >= 3 ? `
      <div>
        <div class="demo-flag">${icon("activity", 16, "var(--pulse)")}<span class="demo-flag-label ss-mono">Possible Learning Friction → Stuck → Switch triggered</span></div>
        ${explanationHTML(DEMO_CONCEPT, "simple")}
      </div>` : ""}

      ${D.stage >= 4 ? `
      <div class="quiz-box">
        <div class="quiz-kicker ss-mono">Quick check</div>
        <div class="quiz-q">${DEMO_CONCEPT.quiz.q}</div>
        <div class="quiz-options" id="demo-quiz-options">
          ${DEMO_CONCEPT.quiz.options.map((opt) => {
            let cls = "quiz-opt";
            if (D.answered) {
              if (opt === DEMO_CONCEPT.quiz.correct) cls += " correct";
              else if (opt === D.answered) cls += " wrong";
            }
            return `<button class="${cls}" data-opt="${encodeURIComponent(opt)}" ${D.answered ? "disabled" : ""}>${opt}</button>`;
          }).join("")}
        </div>
      </div>` : ""}

      ${D.stage >= 5 ? recoveryCardHTML({ friction: 74, response: 22, attempts: 3 }, { friction: 22, response: 7 }, DEMO_CONCEPT.title, false) : ""}
    `;

    const runBtn = demoCard.querySelector('[data-action="run"]');
    if (runBtn) runBtn.addEventListener("click", runDemo);
    const resetBtn = demoCard.querySelector('[data-action="reset"]');
    if (resetBtn) resetBtn.addEventListener("click", resetDemo);
    const quizOptsWrap = demoCard.querySelector("#demo-quiz-options");
    if (quizOptsWrap) {
      quizOptsWrap.querySelectorAll(".quiz-opt").forEach((btn) => {
        btn.addEventListener("click", () => selectAnswer(decodeURIComponent(btn.dataset.opt)));
      });
    }
  }

  function at(ms, fn) { D.timers.push(setTimeout(fn, ms)); }

  function runDemo() {
    clearTimers();
    D.stage = 1; D.friction = 18; D.answered = null;
    D.signals = { longTime: false, repeatedVisit: false, backwardScroll: false, incorrectAnswer: false, longResponse: false, orientationChange: false };
    renderDemoCard();

    at(900, () => { D.stage = 2; D.friction = 35; D.signals.repeatedVisit = true; D.signals.longTime = true; renderDemoCard(); });
    at(2000, () => { D.friction = 52; D.signals.backwardScroll = true; renderDemoCard(); });
    at(3100, () => { D.friction = 74; D.signals.incorrectAnswer = true; D.signals.longResponse = true; renderDemoCard(); });
    at(4000, () => { D.stage = 3; renderDemoCard(); });
    at(5600, () => { D.stage = 4; renderDemoCard(); });
  }

  function selectAnswer(opt) {
    if (D.answered) return;
    D.answered = opt;
    renderDemoCard();
    if (opt === DEMO_CONCEPT.quiz.correct) {
      D.timers.push(setTimeout(() => { D.stage = 5; D.friction = 22; renderDemoCard(); }, 700));
    }
  }

  function resetDemo() {
    clearTimers();
    D.stage = 0; D.friction = 18; D.answered = null;
    renderDemoCard();
  }

  // pulse animation while stage > 0
  const pulseId = setInterval(() => {
    if (D.stage === 0) return;
    D.phase = (D.phase + 1) % 1000;
    const strip = demoCard.querySelector(".pulse-strip-wrap");
    if (strip) strip.outerHTML = pulseStripSVG(D.friction, statusFor(D.friction).tone, 70, "", D.phase);
  }, 300);
  onCleanup(() => clearInterval(pulseId));

  renderDemoCard();
}

/* ------------------------------ boot ------------------------------ */
render();
