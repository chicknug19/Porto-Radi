import { useState, useEffect } from 'react';
// HAPUS TANDA KOMENTAR (//) PADA BARIS DI BAWAH INI JIKA FOTO SUDAH ADA DI FOLDER SRC/ASSETS
// import profilePic from './assets/profile.jpg';

// eslint-disable-next-line no-undef
const PROFILE_PHOTO = typeof profilePic !== 'undefined' ? profilePic : null;

/* ------------------------------------------------------------------ */
/*  DATA — edit bagian ini saja untuk mengganti isi portofolio         */
/* ------------------------------------------------------------------ */

// Tombol dengan href kosong atau "#" otomatis disembunyikan.
const EMAIL = ""; // contoh: "kamu@email.com"
const SOCIALS = [
  {
    label: "LinkedIn",
    href: "", // isi dengan URL LinkedIn kamu
    path: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
  },
  {
    label: "GitHub",
    href: "https://github.com/chicknug19",
    path: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z",
  },
];

const skillGroups = [
  {
    title: "AI & machine learning",
    items: ["Python", "Scikit-Learn", "Pandas", "NumPy", "Dlib", "IndoBERT", "XLM-RoBERTa", "Random Forest", "RAG"],
  },
  {
    title: "Web & backend",
    items: ["React.js", "Tailwind CSS", "Vite", "ASP.NET Core", "C#", "Entity Framework Core", "SQL Server", "Flask", "FastAPI"],
  },
  {
    title: "Cloud & DevOps",
    items: ["Azure App Services", "Vercel", "Hugging Face Spaces", "Docker", "GitHub Actions", "DVC"],
  },
];

// Pengelompokan tampilan: `group` menentukan project masuk ke section AI atau Software.
const sections = [
  {
    id: "ai-projects",
    group: "ai",
    title: "AI & machine learning projects",
    text: "Computer vision, machine learning, NLP, and applied AI, each shipped as a working web app.",
  },
  {
    id: "software-projects",
    group: "software",
    title: "Software engineering projects",
    text: "Backend services and full-stack systems built with clean architecture and real deployments.",
  },
];

// Isi `demo` dengan link live demo (mis. Vercel) dan `image` dengan screenshot hasil import.
// Kalau `demo` / `image` null: tombol demo disembunyikan dan cover bergradasi dipakai.
const projects = [
  /* ---------------- AI ---------------- */
  {
    id: 1,
    group: "ai",
    title: "Driver Drowsiness Detection System (ADAS)",
    short: "Drowsiness",
    cover: ["#3f5f94", "#6b4f96"],
    category: "Computer Vision",
    period: "Apr – Jun 2026",
    role: "Computer Vision Engineer",
    company: null,
    summary: "A real-time in-cabin safety system that detects driver fatigue and micro-sleep with classical computer vision, running at 31.11 FPS on a local x86 machine.",
    overview: "A real-time in-cabin monitoring system (Advanced Driver Assistance Systems) that detects driver fatigue and micro-sleep events. Instead of heavy deep neural networks, it relies on deterministic classical computer vision for ultra-low latency and fully interpretable decisions, which suits edge deployment.",
    pointsHeading: "What I built",
    points: [
      {
        title: "Facial landmarks and geometric modeling",
        text: "Used Dlib's 68-point facial landmark predictor (HOG + Linear SVM) to track facial micromovements and compute the Eye Aspect Ratio (EAR) and Mouth Aspect Ratio (MAR) in real time, catching prolonged eye closure and yawning.",
      },
      {
        title: "Hyperparameter optimization and evaluation",
        text: "Ran a multi-dimensional Grid Search over EAR, MAR, and temporal-frame thresholds, evaluated on the UTA Real-Life Drowsiness Dataset (UTA-RLDD). The system follows a strict maximum-recall approach and reaches 83% recall on critical drowsiness states, prioritizing the elimination of dangerous false negatives.",
      },
      {
        title: "Full-stack and edge performance",
        text: "Reached real-time inference at 31.11 FPS on a local x86 machine. A responsive React.js frontend talks to a Flask backend through Base64-encoded frame streaming, with multi-state visual and audio alerts.",
      },
      {
        title: "DevOps and CI/CD pipeline",
        text: "Set up automated CI/CD through GitHub, deploying the frontend to Vercel and the backend API to Hugging Face Spaces. Git branching strategies protect the production environment.",
      },
    ],
    highlights: [
      { value: "83%", label: "recall on critical drowsiness states" },
      { value: "31.11 FPS", label: "real-time inference on x86" },
    ],
    tech: ["Python", "Dlib", "Flask", "React.js", "GitHub Actions", "Vercel", "Hugging Face Spaces"],
    image: null,
    demo: null,
    repo: "https://github.com/chicknug19/AOL-Comvis",
  },
  {
    id: 2,
    group: "ai",
    title: "LQ45 Market Direction Predictor",
    short: "LQ45",
    cover: ["#a06a3f", "#84507a"],
    category: "Machine Learning",
    period: "Apr – Jun 2026",
    role: "Machine Learning Engineer",
    company: null,
    summary: "A full-stack ML web app that forecasts the daily direction of Indonesia's LQ45 index using an RBF-kernel SVC and live technical indicators.",
    overview: "An end-to-end machine learning web application that forecasts the daily directional movement of the Indonesian LQ45 stock index. It combines Support Vector Classification (SVC) with technical indicators calculated on live data to deliver clear market-momentum insights.",
    pointsHeading: "What I built",
    points: [
      {
        title: "Model engineering",
        text: "Built an SVC classifier with a Radial Basis Function (RBF) kernel and tuned the C and gamma parameters with GridSearchCV and 5-fold cross-validation, capturing complex non-linear market patterns without overfitting.",
      },
      {
        title: "Data engineering and leakage prevention",
        text: "Turned historical market data into 14 technical indicators (EMA, RSI, MACD, Bollinger Bands). Strict sequential splitting (shuffle=False) and isolated feature scaling with StandardScaler keep future data out of training and preserve time-series integrity.",
      },
      {
        title: "Decoupled cloud architecture",
        text: "A responsive React.js frontend deployed on Vercel, paired with a containerized inference backend built with Flask and Docker and hosted on Hugging Face Spaces.",
      },
      {
        title: "Real-time data pipeline",
        text: "Pulls live market data through the Yahoo Finance API (yfinance) and computes features on the fly, so the model always evaluates current conditions without manual data ingestion.",
      },
      {
        title: "CI/CD and MLOps automation",
        text: "A GitHub Actions pipeline, combined with Data Version Control (DVC) and MLflow concepts, keeps backend updates automated and stable in production.",
      },
    ],
    highlights: [
      { value: "14", label: "technical indicators engineered" },
      { value: "5-fold", label: "cross-validation for tuning" },
    ],
    tech: ["Python", "Scikit-Learn", "Flask", "React.js", "Docker", "GitHub Actions", "DVC", "yfinance"],
    image: null,
    demo: null,
    repo: "https://github.com/chicknug19/AOL-ML",
  },
  {
    id: 3,
    group: "ai",
    title: "Smart Hoax Detector",
    short: "Hoax",
    cover: ["#3b7f86", "#4a5f9c"],
    category: "Natural Language Processing",
    period: "May – Jun 2026",
    role: "NLP Engineer",
    company: null,
    summary: "An AI web app that classifies Indonesian political misinformation with a fine-tuned IndoBERT (99.39% Macro F1) and shows live fact-checking references.",
    overview: "An end-to-end web application built to fight political misinformation in Indonesia. It combines state-of-the-art NLP transformers with a Hybrid RAG (Retrieval-Augmented Generation) search pipeline, so it not only flags fake news but also shows real-time fact-checking references.",
    pointsHeading: "What I built",
    points: [
      {
        title: "NLP model engineering",
        text: "Ran a comparative ablation study across 5 models: SVM, 1D-CNN, BiLSTM + Attention, XLM-RoBERTa, and IndoBERT V2. A fine-tuned IndoBERT performed best with a peak Macro F1-Score of 99.39%, decoding Indonesian stylometric variations accurately.",
      },
      {
        title: "Data engineering and leakage prevention",
        text: "Processed 30,000+ articles with strict downsampling and Regex-based structural cleaning that removes media watermarks and journalistic footprints, so the models learn from the narrative itself instead of source bias.",
      },
      {
        title: "Decoupled cloud architecture",
        text: "A React.js frontend deployed on Vercel, backed by an asynchronous FastAPI inference service hosted on Hugging Face Spaces.",
      },
      {
        title: "Real-time fact-checking",
        text: "A DuckDuckGo web-scraping module provides live factual validation, with an automated fallback to the Wikipedia API that keeps the service running during rate-limiting events.",
      },
      {
        title: "CI/CD automation",
        text: "A GitHub Actions pipeline delivers seamless backend updates.",
      },
    ],
    highlights: [
      { value: "99.39%", label: "peak Macro F1 with IndoBERT" },
      { value: "30,000+", label: "articles processed" },
    ],
    tech: ["Python", "IndoBERT", "FastAPI", "React.js", "DuckDuckGo", "Wikipedia API", "GitHub Actions", "Hugging Face Spaces"],
    image: null,
    demo: null,
    repo: "https://github.com/chicknug19/AOL-NLP",
  },
  {
    id: 4,
    group: "ai",
    title: "Forest Fire Risk Prediction Engine",
    short: "Fire Risk",
    cover: ["#2f7a5a", "#8a6a3a"],
    category: "Artificial Intelligence",
    period: "Dec 2025",
    role: "Full-Stack AI Developer",
    company: null,
    summary: "A real-time forest fire risk system that feeds live weather data into a Random Forest model and shows the results on an interactive satellite map.",
    overview: "A full-stack, real-time forest fire risk prediction system that monitors vulnerable regions across Indonesia. It focuses on interactive geospatial visualization, live meteorological integration, and predictive environmental modeling.",
    pointsHeading: "What I built",
    points: [
      {
        title: "Synthetic environmental data",
        text: "Built data generation pipelines with Pandas and NumPy that simulate weather patterns, wind speeds, and peatland conditions, mirroring real-world distributions closely enough to train the predictive model.",
      },
      {
        title: "Machine learning and predictive modeling",
        text: "Compared several classification algorithms and optimized a Random Forest Classifier in Scikit-Learn to calculate fire-risk probabilities and classify danger levels from environmental factors.",
      },
      {
        title: "Real-time data integration",
        text: "Fetches live temperature, humidity, wind, and rainfall from the OpenWeatherMap API for specific forest coordinates and feeds them directly into the model for dynamic risk scoring.",
      },
      {
        title: "Interactive geospatial dashboard",
        text: "A responsive interface built with React, Vite, and Tailwind CSS. React-Leaflet plots monitoring stations and extreme-weather simulation modes on an interactive satellite map.",
      },
      {
        title: "High-performance RESTful backend",
        text: "The prediction engine runs behind a lightweight FastAPI backend, with CORS configured and low-latency prediction endpoints for smooth communication with the client app.",
      },
    ],
    highlights: [{ value: "4", label: "live weather inputs per prediction" }],
    tech: ["Python", "Scikit-Learn", "Pandas", "NumPy", "FastAPI", "React", "Vite", "Tailwind CSS", "React-Leaflet", "OpenWeatherMap API"],
    image: null,
    demo: null,
    repo: "https://github.com/chicknug19/kebakaran-hutan-AI",
  },

  /* ---------------- Software engineering ---------------- */
  {
    id: 5,
    group: "software",
    title: "Omnichannel Messaging & Webhook Integration Service",
    short: "Omnichannel",
    cover: ["#2f7a63", "#3a6d8c"],
    category: "Backend Development",
    period: "Jul 2026",
    role: "Backend Engineer Intern",
    company: "PT Cellbox",
    summary: "A standalone messaging backend that brings WeChat and WhatsApp conversations into one API, later merged into a larger enterprise management system.",
    overview: "Built during my internship at PT Cellbox, this is a standalone backend messaging engine that unifies client communications from WeChat and WhatsApp behind one consistent API. It ran as an independent, scalable communication service before being successfully merged into a larger enterprise management system.",
    pointsHeading: "What I built",
    points: [
      {
        title: "Webhook architecture and API development",
        text: "Designed RESTful endpoints in ASP.NET Core (C#) that securely receive, process, and route incoming webhook events from the WeChat Sandbox and WhatsApp.",
      },
      {
        title: "Data persistence and DTO mapping",
        text: "Designed the database schema in Microsoft SQL Server with Entity Framework Core and wrote efficient LINQ queries. Detailed Data Transfer Object (DTO) mappings keep external API payloads cleanly separated from internal storage.",
      },
      {
        title: "Real-time message processing",
        text: "Implemented backend logic for message parsing, contact resolution, and status tracking, including read receipts and unread message counters. This lays the groundwork for real-time, two-way chat interfaces.",
      },
      {
        title: "Cloud deployment and DevOps",
        text: "Configured and deployed the services to Microsoft Azure App Services with secure endpoints and continuous integration, keeping the service highly available.",
      },
    ],
    highlights: [
      { value: "2", label: "messaging platforms unified" },
      { value: "Azure", label: "App Services deployment" },
    ],
    tech: ["C#", "ASP.NET Core", "Entity Framework Core", "SQL Server", "LINQ", "Azure App Services"],
    image: null,
    demo: null,
    repo: "https://github.com/chicknug19/WeChatTest",
  },
  {
    id: 6,
    group: "software",
    title: "Bookuger - Library System",
    short: "Bookuger",
    cover: ["#33726f", "#48689a"],
    category: "Software Engineering",
    period: "2026",
    role: "Full-Stack Engineer",
    company: null,
    summary: "A web-based library book lending system with a full-stack architecture, built with UML diagrams and SRS documentation.",
    overview: "Bookuger is an end-to-end library management system designed to streamline borrowing and returning. The project followed rigorous software engineering practices, including UML diagramming and SRS documentation.",
    pointsHeading: "Problem and solution",
    points: [
      {
        title: "The problem",
        text: "Managing physical book inventories and tracking borrower deadlines by hand leads to data loss and inefficiency.",
      },
      {
        title: "The solution",
        text: "A responsive React frontend coupled with a secure ASP.NET Core API backend, using SQL Server for reliable relational data storage and transaction management.",
      },
    ],
    highlights: [],
    tech: ["React.js", "ASP.NET Core", "SQL Server"],
    image: null,
    demo: null,
    repo: null,
  },
];

/* ------------------------------------------------------------------ */
/*  STYLE — background berganti warna + font                           */
/*  Ubah warna background di baris `.bg-shift` (5 warna, lalu kembali) */
/* ------------------------------------------------------------------ */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Instrument+Sans:wght@400;500;600&display=swap');

html { scroll-behavior: smooth; }
body { margin: 0; background: #2b3866; }
::selection { background: rgba(255,255,255,.35); color: #fff; }

.f-display { font-family: 'Bricolage Grotesque', 'Segoe UI', system-ui, sans-serif; }
.f-body { font-family: 'Instrument Sans', 'Segoe UI', system-ui, sans-serif; }

/* Background yang perlahan berganti warna (versi lebih gelap) */
.bg-shift {
  background: linear-gradient(120deg, #1f4e5c, #2b3866, #4a3a78, #62406f, #294a7a, #1f4e5c);
  background-size: 300% 300%;
  animation: bgshift 32s ease-in-out infinite;
}
@keyframes bgshift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Dua cahaya lembut yang melayang pelan untuk memberi kedalaman */
.orb {
  position: absolute;
  width: 42vmax;
  height: 42vmax;
  border-radius: 9999px;
  filter: blur(90px);
  opacity: .2;
  animation: drift 44s ease-in-out infinite alternate;
}
@keyframes drift {
  from { transform: translate3d(0, 0, 0) scale(1); }
  to   { transform: translate3d(10vw, 8vh, 0) scale(1.15); }
}

/* Animasi masuk hero (sekali saat halaman dibuka) */
.rise { animation: rise .9s cubic-bezier(.2,.7,.2,1) both; }
.rise-2 { animation-delay: .12s; }
.rise-3 { animation-delay: .24s; }
.rise-4 { animation-delay: .36s; }
@keyframes rise {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}

a:focus-visible, button:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .bg-shift, .orb, .rise { animation: none !important; }
}
`;

/* ------------------------------------------------------------------ */
/*  Komponen kecil                                                     */
/* ------------------------------------------------------------------ */

function Cover({ project, className = "" }) {
  if (project.image) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
      </div>
    );
  }
  const [a, b] = project.cover;
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}
    >
      <div className="absolute -right-10 -top-12 w-52 h-52 rounded-full bg-white/15" />
      <div className="absolute -left-8 -bottom-14 w-44 h-44 rounded-full bg-black/15" />
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,.35) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <span className="absolute left-6 bottom-5 f-display text-3xl sm:text-4xl font-bold text-white leading-none">
        {project.short}
      </span>
    </div>
  );
}

function Chip({ children }) {
  return (
    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs">
      {children}
    </span>
  );
}

function ArrowRight() {
  return (
    <svg className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}

function ProjectCard({ project, onOpen }) {
  const shownTech = project.tech.slice(0, 4);
  const extra = project.tech.length - shownTech.length;
  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      className="group flex flex-col text-left rounded-3xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/[0.15] hover:border-white/35 transition-colors duration-300"
    >
      <Cover project={project} className="h-48 w-full" />
      <span className="flex flex-col flex-1 p-6">
        <span className="text-sm text-white/70 mb-1">
          {project.category}
          {project.company ? ` at ${project.company}` : ''}
        </span>
        <span className="f-display text-xl font-bold mb-2">{project.title}</span>
        <span className="text-sm text-white/80 leading-relaxed mb-5">{project.summary}</span>

        {project.highlights.length > 0 && (
          <span className="flex flex-wrap gap-x-8 gap-y-3 mb-5">
            {project.highlights.slice(0, 2).map((h) => (
              <span key={h.label}>
                <span className="block f-display text-2xl font-bold leading-none mb-1">{h.value}</span>
                <span className="block text-xs text-white/65">{h.label}</span>
              </span>
            ))}
          </span>
        )}

        <span className="flex flex-wrap gap-2 mb-5">
          {shownTech.map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
          {extra > 0 && <Chip>+{extra} more</Chip>}
        </span>

        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold">
          View details <ArrowRight />
        </span>
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    document.title = selectedProject
      ? `${selectedProject.title} | Radianda Setiawan`
      : 'Radianda Setiawan | AI Developer & Software Engineer';
  }, [selectedProject]);

  const openProject = (project) => {
    setSelectedProject(project);
    setCurrentView('project');
    window.scrollTo(0, 0);
  };

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Pindah ke section tertentu, dari halaman mana pun
  const goTo = (id) => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setSelectedProject(null);
      setTimeout(() => scrollToId(id), 60);
    } else if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      scrollToId(id);
    }
  };

  // Proyek berikutnya di kelompok yang sama (AI atau Software)
  const siblings = selectedProject ? projects.filter((p) => p.group === selectedProject.group) : [];
  const nextProject =
    siblings.length > 1 ? siblings[(siblings.findIndex((p) => p.id === selectedProject.id) + 1) % siblings.length] : null;
  const backTarget = selectedProject && selectedProject.group === 'ai' ? 'ai-projects' : 'software-projects';
  const backLabel = selectedProject && selectedProject.group === 'ai' ? 'Back to AI projects' : 'Back to software projects';

  const visibleSocials = SOCIALS.filter((s) => s.href && s.href !== '#');

  const navLinks = [
    { label: 'Home', id: 'home', hideOnMobile: true },
    { label: 'About', id: 'about' },
    { label: 'Projects', id: 'ai-projects' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <div className="relative min-h-screen text-white f-body overflow-x-hidden">
      <style>{styles}</style>

      {/* Background bergerak */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-shift" aria-hidden="true">
        <div className="orb" style={{ top: '-12%', left: '-10%', background: '#4f97a0' }} />
        <div className="orb" style={{ bottom: '-15%', right: '-10%', background: '#9a7fc0', animationDelay: '-18s' }} />
      </div>

      <div className="relative z-10">
        {/* Navbar */}
        <header className="fixed top-4 inset-x-0 z-50 px-4">
          <nav className="mx-auto max-w-2xl flex items-center justify-between rounded-full bg-white/10 backdrop-blur-xl border border-white/20 pl-5 pr-2 py-2">
            <button onClick={() => goTo('home')} className="f-display font-bold text-lg tracking-tight">
              Radianda
            </button>
            <div className="flex items-center gap-1 text-sm font-medium">
              {navLinks.map((l) => (
                <button
                  key={l.id}
                  onClick={() => goTo(l.id)}
                  className={`${l.hideOnMobile ? 'hidden sm:inline-flex' : 'inline-flex'} px-3 sm:px-4 py-2 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-colors`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </nav>
        </header>

        {/* ============ HALAMAN UTAMA ============ */}
        {currentView === 'home' && (
          <main>
            {/* Hero */}
            <section id="home" className="px-6 pt-36 pb-24 min-h-screen flex items-center">
              <div className="mx-auto max-w-6xl w-full grid lg:grid-cols-[1.15fr_1fr] gap-14 items-center">
                <div className="text-center lg:text-left">
                  <div className="rise inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-sm text-white/90 mb-8">
                    <span className="w-2 h-2 rounded-full bg-emerald-300" />
                    Open to internships and collaborations
                  </div>

                  <h1 className="rise rise-2 f-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight mb-5">
                    <span className="block">Radianda</span>
                    <span className="block">Setiawan</span>
                  </h1>

                  <h2 className="rise rise-3 f-display text-xl sm:text-2xl lg:text-3xl font-medium text-white/85 mb-6">
                    AI Developer &amp; Software Engineer
                  </h2>

                  <p className="rise rise-3 text-white/80 text-lg leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
                    A Computer Science student focusing on full-stack web architecture and Artificial Intelligence. I specialize in turning complex algorithms into clean, efficient, and interactive software solutions.
                  </p>

                  <div className="rise rise-4 flex flex-wrap gap-3 justify-center lg:justify-start">
                    <button
                      onClick={() => goTo('ai-projects')}
                      className="px-7 py-3 bg-white text-[#1f2a52] font-semibold rounded-full hover:bg-white/90 transition-colors"
                    >
                      View my work
                    </button>
                    <button
                      onClick={() => goTo('contact')}
                      className="px-7 py-3 bg-white/10 border border-white/35 font-semibold rounded-full hover:bg-white/20 transition-colors"
                    >
                      Let&apos;s talk
                    </button>
                  </div>
                </div>

                {/* Foto profil */}
                <div className="rise rise-2 order-first lg:order-none flex justify-center">
                  <div className="relative w-60 h-60 sm:w-72 sm:h-72 lg:w-96 lg:h-96 shrink-0">
                    <div className="absolute inset-0 translate-x-4 translate-y-4 border-2 border-white/30 rounded-[58%_42%_47%_53%/52%_44%_56%_48%]" />
                    <div className="relative w-full h-full overflow-hidden rounded-[58%_42%_47%_53%/52%_44%_56%_48%] bg-white/10 border border-white/30">
                      {PROFILE_PHOTO ? (
                        <img src={PROFILE_PHOTO} alt="Radianda Setiawan" className="w-full h-full object-cover object-center" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center f-display text-7xl lg:text-8xl font-bold text-white/85">
                          RS
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* About / skills */}
            <section id="about" className="px-6 py-24 scroll-mt-20">
              <div className="mx-auto max-w-6xl grid lg:grid-cols-[1fr_1.4fr] gap-12 items-start">
                <div>
                  <h2 className="f-display text-3xl sm:text-4xl font-bold tracking-tight mb-5">
                    Models, and the software around them
                  </h2>
                  <p className="text-white/80 text-lg leading-relaxed max-w-md">
                    I work on both sides of an AI product: training and evaluating the models, and building the web and backend services that put them in front of people.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  {skillGroups.map((g, i) => (
                    <div
                      key={g.title}
                      className={`rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 p-6 ${
                        i === skillGroups.length - 1 && skillGroups.length % 2 === 1 ? 'sm:col-span-2' : ''
                      }`}
                    >
                      <h3 className="f-display text-lg font-bold mb-4">{g.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        {g.items.map((item) => (
                          <Chip key={item}>{item}</Chip>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Projects: dipisah AI dan Software */}
            <section id="projects" className="px-6 py-24">
              <div className="mx-auto max-w-6xl space-y-24">
                {sections.map((s) => (
                  <div key={s.id} id={s.id} className="scroll-mt-24">
                    <div className="mb-10 max-w-2xl">
                      <h2 className="f-display text-3xl sm:text-4xl font-bold tracking-tight mb-3">{s.title}</h2>
                      <p className="text-white/75 text-lg">{s.text}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {projects
                        .filter((p) => p.group === s.group)
                        .map((p) => (
                          <ProjectCard key={p.id} project={p} onOpen={openProject} />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        )}

        {/* ============ HALAMAN DETAIL PROYEK ============ */}
        {currentView === 'project' && selectedProject && (
          <main className="pt-32 pb-20 px-6 min-h-screen">
            <div className="max-w-3xl mx-auto">
              <button
                onClick={() => goTo(backTarget)}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 px-4 py-2 mb-10 text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {backLabel}
              </button>

              <h1 className="f-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-8">
                {selectedProject.title}
              </h1>

              <div
                className={`grid grid-cols-2 gap-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 p-6 mb-8 ${
                  selectedProject.company ? 'sm:grid-cols-4' : 'sm:grid-cols-3'
                }`}
              >
                <div>
                  <p className="text-white/65 text-sm mb-1">Category</p>
                  <p className="font-semibold">{selectedProject.category}</p>
                </div>
                <div>
                  <p className="text-white/65 text-sm mb-1">Period</p>
                  <p className="font-semibold">{selectedProject.period}</p>
                </div>
                <div>
                  <p className="text-white/65 text-sm mb-1">Role</p>
                  <p className="font-semibold">{selectedProject.role}</p>
                </div>
                {selectedProject.company && (
                  <div>
                    <p className="text-white/65 text-sm mb-1">Company</p>
                    <p className="font-semibold">{selectedProject.company}</p>
                  </div>
                )}
              </div>

              <Cover project={selectedProject} className="h-56 sm:h-72 w-full rounded-3xl mb-10 border border-white/20" />

              {selectedProject.highlights.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mb-12">
                  {selectedProject.highlights.map((h) => (
                    <div key={h.label} className="rounded-2xl bg-white/10 border border-white/15 p-5">
                      <p className="f-display text-3xl sm:text-4xl font-bold leading-none mb-2">{h.value}</p>
                      <p className="text-sm text-white/70">{h.label}</p>
                    </div>
                  ))}
                </div>
              )}

              <h2 className="f-display text-2xl font-bold mb-4">Overview</h2>
              <p className="text-white/80 text-lg leading-relaxed mb-12">{selectedProject.overview}</p>

              <h2 className="f-display text-2xl font-bold mb-4">{selectedProject.pointsHeading}</h2>
              <div className="divide-y divide-white/15 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 mb-12">
                {selectedProject.points.map((pt) => (
                  <div key={pt.title} className="p-6">
                    <h3 className="f-display text-lg font-bold mb-2">{pt.title}</h3>
                    <p className="text-white/80 leading-relaxed">{pt.text}</p>
                  </div>
                ))}
              </div>

              <h2 className="f-display text-2xl font-bold mb-4">Tech stack</h2>
              <div className="flex flex-wrap gap-2 mb-12">
                {selectedProject.tech.map((t) => (
                  <span key={t} className="px-4 py-2 rounded-full bg-white/10 border border-white/25 text-sm">
                    {t}
                  </span>
                ))}
              </div>

              {(selectedProject.demo || selectedProject.repo) && (
                <div className="flex flex-wrap gap-3 mb-16">
                  {selectedProject.demo && (
                    <a href={selectedProject.demo} target="_blank" rel="noreferrer" className="px-6 py-3 bg-white text-[#1f2a52] font-semibold rounded-full hover:bg-white/90 transition-colors text-sm">
                      Live demo
                    </a>
                  )}
                  {selectedProject.repo && (
                    <a href={selectedProject.repo} target="_blank" rel="noreferrer" className="px-6 py-3 bg-white/10 border border-white/35 font-semibold rounded-full hover:bg-white/20 transition-colors text-sm">
                      View on GitHub
                    </a>
                  )}
                </div>
              )}

              {/* Proyek berikutnya (dalam kelompok yang sama) */}
              {nextProject && (
                <button
                  onClick={() => openProject(nextProject)}
                  className="group w-full text-left flex items-center justify-between gap-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/[0.15] hover:border-white/35 transition-colors p-6"
                >
                  <span>
                    <span className="block text-sm text-white/65 mb-1">Next project</span>
                    <span className="block f-display text-xl font-bold">{nextProject.title}</span>
                  </span>
                  <ArrowRight />
                </button>
              )}
            </div>
          </main>
        )}

        {/* ============ KONTAK ============ */}
        <section id="contact" className="px-6 py-24 scroll-mt-20">
          <div className="mx-auto max-w-3xl rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/20 px-8 py-14 sm:px-14 text-center">
            <h2 className="f-display text-3xl sm:text-5xl font-bold tracking-tight mb-4">Let&apos;s connect.</h2>
            <p className="text-white/80 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              I&apos;m currently open to new opportunities, internships, and interesting collaborations. If you&apos;re working on something exciting, I&apos;d love to hear about it.
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              {EMAIL && (
                <a href={`mailto:${EMAIL}`} className="px-6 py-3 bg-white text-[#1f2a52] font-semibold rounded-full hover:bg-white/90 transition-colors">
                  Email me
                </a>
              )}
              {visibleSocials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/35 font-semibold rounded-full hover:bg-white/20 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <p className="text-white/60 text-sm text-center mt-10">
            © 2026 Radianda Setiawan. Built with React &amp; Tailwind CSS.
          </p>
        </section>
      </div>
    </div>
  );
}