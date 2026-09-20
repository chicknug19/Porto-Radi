import { useState, useEffect, useRef } from 'react';

/* ------------------------------------------------------------------ */
/*  MEDIA (GAMBAR & VIDEO) — otomatis dibaca dari src/assets           */
/*                                                                     */
/*  Cukup taruh file di:  src/assets/projects/                         */
/*    drowsiness.png  atau  drowsiness.mp4   -> media utama            */
/*    drowsiness-2.png, drowsiness-3.mp4     -> galeri tambahan        */
/*  Nama file = "slug" project (lihat field `slug` di data di bawah).  */
/*  Format: png, jpg, jpeg, webp, gif, mp4, webm (huruf kecil).        */
/*                                                                     */
/*  Foto profil: taruh di src/assets/profile.jpg (atau .png / .webp).  */
/*  Catatan: fitur ini memakai Vite (import.meta.glob).                */
/* ------------------------------------------------------------------ */

const mediaFiles = import.meta.glob('./assets/projects/*.{png,jpg,jpeg,webp,gif,mp4,webm}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const profileFiles = import.meta.glob('./assets/profile.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const PROFILE_PHOTO = Object.values(profileFiles)[0] || null;
const IS_DEV = Boolean(import.meta.env && import.meta.env.DEV);

function getMedia(slug) {
  const items = [];
  Object.entries(mediaFiles).forEach(([path, src]) => {
    const file = path.split('/').pop();
    const match = file.match(/^(.+?)(?:-(\d+))?\.(\w+)$/);
    if (!match || match[1].toLowerCase() !== slug) return;
    items.push({
      order: match[2] ? Number(match[2]) : 1,
      type: /^(mp4|webm)$/i.test(match[3]) ? 'video' : 'image',
      src,
    });
  });
  return items.sort((a, b) => a.order - b.order);
}

// Jika kamu lebih suka import manual, isi `media` di project:
//   media: [{ type: 'video', src: myVideo }, { type: 'image', src: myImage }]
const getProjectMedia = (p) => (p.media && p.media.length ? p.media : getMedia(p.slug));

/* ------------------------------------------------------------------ */
/*  DATA — edit bagian ini saja untuk mengganti isi portofolio         */
/* ------------------------------------------------------------------ */

// Lebar konten utama (ubah angka 1400px kalau mau lebih lebar / sempit)
const WRAP = "mx-auto w-full max-w-[1400px]";
const PAD = "px-6 sm:px-10 lg:px-16";

// Tombol dengan href kosong atau "#" otomatis disembunyikan.
const EMAIL = ""; // contoh: "kamu@email.com"
const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/radianda-setiawan-22287225a",
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
    items: ["Python", "Scikit-Learn", "Pandas", "NumPy", "OpenCV", "Dlib", "Gemini API", "IndoBERT", "XLM-RoBERTa", "Random Forest", "SMOTE-Tomek", "RAG"],
  },
  {
    title: "Web & backend",
    items: ["React.js", "Tailwind CSS", "Vite", "ASP.NET Core", "C#", "Entity Framework Core", "SQL Server", "Flask", "FastAPI", "Playwright"],
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
    text: "Research, computer vision, machine learning, NLP, and applied AI, each backed by real experiments or a working app.",
  },
  {
    id: "software-projects",
    group: "software",
    title: "Software engineering projects",
    text: "Backend services and full-stack systems built with clean architecture and real deployments.",
  },
];

/*
  Cara mengisi `links` (tombol di halaman detail):
    { label: "Live demo", href: "https://...", primary: true }   <- tombol putih
    { label: "View on GitHub", href: "https://github.com/..." }  <- tombol outline
  Isi link live demo (Vercel dll.) dengan menambahkan objek baru di array `links`.
*/
const projects = [
  /* ---------------- AI ---------------- */
  {
    id: 1,
    group: "ai",
    slug: "paper",
    title: "Evaluating the Financial Impact of Cost-Sensitive Random Forest and SMOTE-Tomek in Fraud Detection",
    short: "Research",
    badge: "Accepted at COMPGINEER2026",
    cover: ["#7b4a5c", "#48487f"],
    category: "Machine Learning Research",
    period: "Apr – Aug 2026",
    role: "Co-author & ML Researcher",
    company: null,
    summary: "A conference paper on cutting real-world financial loss in credit card fraud detection by combining SMOTE-Tomek resampling with a Cost-Sensitive Random Forest.",
    overview: "A machine learning research paper accepted at COMPGINEER2026. It studies how to reduce real financial loss in credit card fraud detection under extreme class imbalance, using SMOTE-Tomek resampling together with a Cost-Sensitive Random Forest. Every model is judged by projected monetary impact as well as PR-AUC and minority recall.",
    pointsHeading: "Research highlights",
    points: [
      {
        title: "Hybrid data resampling",
        text: "Used SMOTE to synthesize minority fraud cases and Tomek Links to clean overlapping noise at the decision boundary. Resampling touched only the training set (80/20 split), so the test set kept its realistic 0.172% fraud rate.",
      },
      {
        title: "Cost-sensitive Random Forest",
        text: "Applied a custom cost matrix that penalizes false negatives far more than false positives: Rp 5,000,000 per missed fraud versus Rp 50,000 per false alarm, a 100:1 ratio. The model is trained to catch actual financial theft instead of maximizing global accuracy.",
      },
      {
        title: "Penalty tuning and financial impact",
        text: "Explored penalty weights from 100 to 500. Weights of 204 to 209 worked best: missed frauds fell from 20 to 19 and the estimated loss dropped from Rp 100.65M to Rp 95.7M. Raising the weight to 500 lowered PR-AUC to 0.8475.",
      },
      {
        title: "Robustness analysis of PCA features",
        text: "Tomek Links removed zero rows from the 454,902-row SMOTE output, because the PCA-transformed features already separate the classes. SMOTE and SMOTE-Tomek therefore produced identical models, which turned the comparison into an ablation of the cost-sensitive penalty.",
      },
      {
        title: "Evaluation against honest baselines",
        text: "Benchmarked against SMOTE + Random Forest using PR-AUC, minority recall, false negatives, and projected monetary impact. The plain SMOTE baseline still had the lowest loss on this dataset (Rp 90.7M), so the paper concludes that the benefit depends on dataset topology and penalty calibration.",
      },
    ],
    highlights: [
      { value: "Rp 95.7M", label: "estimated loss after tuning, down from Rp 100.65M" },
      { value: "0.172%", label: "fraud share of 284,807 transactions" },
    ],
    tech: ["Python", "Scikit-Learn", "Random Forest", "SMOTE-Tomek", "Cost-sensitive learning", "PR-AUC"],
    links: [
      // Taruh file PDF di folder `public/` dengan nama paper.pdf agar link ini berfungsi.
      { label: "Read the paper (PDF)", href: "/paper.pdf", primary: true },
      { label: "View on GitHub", href: "https://github.com/chicknug19/research-method" },
    ],
  },
  {
    id: 2,
    group: "ai",
    slug: "scraper",
    title: "Autonomous AI-Powered E-Commerce Scraping Engine",
    short: "Scraper",
    badge: null,
    cover: ["#5c4a8f", "#2f7086"],
    category: "Artificial Intelligence",
    period: "Aug – Sep 2026",
    role: "AI & Backend Engineer",
    company: null,
    summary: "An autonomous engine that collects large-scale competitor product data from Shopee, filters it with Gemini, and solves slider CAPTCHAs with OpenCV.",
    overview: "An enterprise-grade, autonomous web scraping engine that extracts large-scale competitor product data from e-commerce platforms (Shopee) for market analysis and business intelligence. It is designed around fault tolerance, AI integration, and advanced anti-bot evasion.",
    pointsHeading: "What I built",
    points: [
      {
        title: "Intelligent AI filtering",
        text: "Integrated the Google Gemini API to parse natural-language scraping intents and filter raw scraped data on its own, so the SQL database only receives highly relevant product variations.",
      },
      {
        title: "Advanced anti-bot evasion",
        text: "Got past Datadome protection using Playwright with persistent contexts (to keep natural session fingerprints), human-like scrolling intervals, and randomized mouse movements drawn along cubic Bezier curves.",
      },
      {
        title: "Autonomous CAPTCHA solving with computer vision",
        text: "Built an automated solver for soft-block slider puzzles with OpenCV. Canny edge detection and template matching calculate the exact X-axis distance, so the bot can drag the puzzle piece into place by itself.",
      },
      {
        title: "Fault-tolerant architecture",
        text: "Built an \"Emergency Stop\" system that shuts the script down gracefully when it detects a hard block it cannot resolve, protecting the corporate IP address. An automated SMTP email alerts the team, who can step in through a custom cross-execution .bat script.",
      },
      {
        title: "Backend API and database management",
        text: "Wrapped the engine in a FastAPI RESTful backend and implemented upsert logic with pyodbc to store dynamic product data (variants, prices, ratings, and stock) in a Microsoft SQL Server database.",
      },
    ],
    highlights: [],
    tech: ["Python", "Gemini API", "Playwright", "OpenCV", "FastAPI", "SQL Server", "pyodbc"],
    links: [{ label: "View on GitHub", href: "https://github.com/chicknug19/scraping_ecom" }],
  },
  {
    id: 3,
    group: "ai",
    slug: "hoax",
    title: "Smart Hoax Detector",
    short: "Hoax",
    badge: null,
    cover: ["#2f6a70", "#3e5083"],
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
    links: [{ label: "View on GitHub", href: "https://github.com/chicknug19/AOL-NLP" }],
  },
  {
    id: 4,
    group: "ai",
    slug: "lq45",
    title: "LQ45 Market Direction Predictor",
    short: "LQ45",
    badge: null,
    cover: ["#875832", "#6d4266"],
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
    links: [{ label: "View on GitHub", href: "https://github.com/chicknug19/AOL-ML" }],
  },
  {
    id: 5,
    group: "ai",
    slug: "drowsiness",
    title: "Driver Drowsiness Detection System (ADAS)",
    short: "Drowsiness",
    badge: null,
    cover: ["#34507f", "#57427f"],
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
    links: [{ label: "View on GitHub", href: "https://github.com/chicknug19/AOL-Comvis" }],
  },
  {
    id: 6,
    group: "ai",
    slug: "firerisk",
    title: "Forest Fire Risk Prediction Engine",
    short: "Fire Risk",
    badge: null,
    cover: ["#276448", "#735832"],
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
    links: [{ label: "View on GitHub", href: "https://github.com/chicknug19/kebakaran-hutan-AI" }],
  },

  /* ---------------- Software engineering ---------------- */
  {
    id: 7,
    group: "software",
    slug: "omnichannel",
    title: "Omnichannel Messaging & Webhook Integration Service",
    short: "Omnichannel",
    badge: null,
    cover: ["#276650", "#2f5a75"],
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
    links: [{ label: "View on GitHub", href: "https://github.com/chicknug19/WeChatTest" }],
  },
  {
    id: 8,
    group: "software",
    slug: "creepydonut",
    title: "Creepy Donut - E-Commerce with a Smart Assistant",
    short: "Creepy Donut",
    badge: null,
    cover: ["#4a2f57", "#9a6386"],
    category: "Full-Stack Development",
    period: "Apr – May 2025",
    role: "Full-Stack Developer",
    company: null,
    summary: "A dark-pastel e-commerce site for a playful donut brand, with a product catalog and a chatbot that answers menu questions from a SQL Server database.",
    overview: "A uniquely themed e-commerce web platform for a playful donut brand. It pairs an interactive product catalog with a conversational shopping assistant, all wrapped in a distinctive \"dark-pastel\" look.",
    pointsHeading: "What I built",
    points: [
      {
        title: "Distinctive UI/UX design",
        text: "Built a fully responsive landing page with a bold, memorable visual identity that mixes playful and sinister themes.",
      },
      {
        title: "Structured product catalog",
        text: "Designed modular, card-based layouts for categorized items (Food, Drinks, Merchandise) with seamless \"Add to Cart\" functionality.",
      },
      {
        title: "Integrated smart assistant",
        text: "Implemented a real-time chatbot connected directly to a SQL Server database to give personalized menu recommendations and handle customer questions dynamically.",
      },
      {
        title: "Branding and community engagement",
        text: "Added dedicated \"About Us\" and \"Fundraising\" sections that tell the brand story and build customer loyalty.",
      },
      {
        title: "Frontend and database integration",
        text: "Connected the frontend to a backend SQL Server database so the chatbot can run dynamic queries and answer with real data, turning static browsing into an interactive shopping experience.",
      },
    ],
    highlights: [],
    // TODO: tambahkan bahasa/framework yang kamu pakai di frontend dan backend
    tech: ["SQL Server", "Responsive UI", "Chatbot"],
    links: [
      { label: "Frontend repo", href: "https://github.com/chicknug19/CreepyDonutFE" },
      { label: "Backend repo", href: "https://github.com/chicknug19/backendCreepyDonut" },
    ],
  },
  {
    id: 9,
    group: "software",
    slug: "bookuger",
    title: "Bookuger - Library System",
    short: "Bookuger",
    badge: null,
    cover: ["#2b5f5c", "#3d5885"],
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
    // Isi link repo Bookuger di sini, contoh:
    // { label: "View on GitHub", href: "https://github.com/chicknug19/..." }
    links: [],
  },
];

/* ------------------------------------------------------------------ */
/*  STYLE — background berganti warna + font                           */
/*  Ubah warna background di baris `.bg-shift` (5 warna, lalu kembali) */
/* ------------------------------------------------------------------ */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Instrument+Sans:wght@400;500;600&display=swap');

html { scroll-behavior: smooth; }
body { margin: 0; background: #1c2547; }
::selection { background: rgba(255,255,255,.35); color: #fff; }

.f-display { font-family: 'Bricolage Grotesque', 'Segoe UI', system-ui, sans-serif; }
.f-body { font-family: 'Instrument Sans', 'Segoe UI', system-ui, sans-serif; }

/* Background yang perlahan berganti warna (versi paling gelap) */
.bg-shift {
  background: linear-gradient(120deg, #123640, #1c2547, #33285a, #47294f, #1a3357, #123640);
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
  opacity: .14;
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

// Cover bergradasi: dipakai sebagai placeholder kartu sampai media asli ditambahkan
function Cover({ project, className = "" }) {
  const [a, b] = project.cover;
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}
    >
      <div className="absolute -right-10 -top-12 w-52 h-52 rounded-full bg-white/15" />
      <div className="absolute -left-8 -bottom-14 w-44 h-44 rounded-full bg-black/20" />
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

// Video di kartu: tampil frame pertama, diputar saat kursor diarahkan
function VideoPreview({ src, className }) {
  const ref = useRef(null);
  return (
    <video
      ref={ref}
      src={`${src}#t=0.1`}
      muted
      loop
      playsInline
      preload="metadata"
      className={className}
      onMouseEnter={() => ref.current && ref.current.play().catch(() => {})}
      onMouseLeave={() => ref.current && ref.current.pause()}
    />
  );
}

function CardMedia({ project, media }) {
  const first = media[0];
  return (
    <div className="relative h-52 w-full overflow-hidden">
      {!first && <Cover project={project} className="h-full w-full" />}
      {first && first.type === 'image' && (
        <img src={first.src} alt={project.title} className="h-full w-full object-cover" />
      )}
      {first && first.type === 'video' && <VideoPreview src={first.src} className="h-full w-full object-cover" />}
      {project.badge && (
        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/45 backdrop-blur-sm border border-white/25 px-3 py-1 text-xs font-medium">
          <svg className="w-3.5 h-3.5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          {project.badge}
        </span>
      )}
    </div>
  );
}

// Galeri di halaman detail: gambar / video utama + thumbnail
function MediaViewer({ project, media }) {
  const [active, setActive] = useState(0);
  const current = media[active];

  if (media.length === 0) {
    return (
      <div className="aspect-video w-full rounded-3xl border-2 border-dashed border-white/25 bg-white/[0.04] flex flex-col items-center justify-center gap-4 text-center p-8">
        <svg className="w-12 h-12 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zm0 11l4.5-4.5a1 1 0 011.4 0L14 15.5l2-2a1 1 0 011.4 0L21 17M9 9.5h.01" />
        </svg>
        <p className="f-display text-xl sm:text-2xl font-semibold">Preview coming soon</p>
        {IS_DEV && (
          <p className="text-sm text-white/70 max-w-xl leading-relaxed">
            Add <code className="px-1.5 py-0.5 rounded bg-white/10">{project.slug}.png</code> or{' '}
            <code className="px-1.5 py-0.5 rounded bg-white/10">{project.slug}.mp4</code> to{' '}
            <code className="px-1.5 py-0.5 rounded bg-white/10">src/assets/projects/</code>. For a gallery, add{' '}
            <code className="px-1.5 py-0.5 rounded bg-white/10">{project.slug}-2.png</code>,{' '}
            <code className="px-1.5 py-0.5 rounded bg-white/10">{project.slug}-3.mp4</code>, and so on.
            This hint only shows while developing.
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="aspect-video w-full rounded-3xl overflow-hidden bg-black/30 border border-white/15">
        {current.type === 'video' ? (
          <video key={current.src} src={current.src} controls playsInline preload="metadata" className="w-full h-full object-contain" />
        ) : (
          <img src={current.src} alt={`${project.title}, image ${active + 1}`} className="w-full h-full object-contain" />
        )}
      </div>

      {media.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
          {media.map((m, i) => (
            <button
              key={m.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show ${m.type} ${i + 1}`}
              aria-pressed={i === active}
              className={`relative shrink-0 w-28 h-20 rounded-xl overflow-hidden border transition-opacity ${
                i === active ? 'border-white' : 'border-white/20 opacity-70 hover:opacity-100'
              }`}
            >
              {m.type === 'video' ? (
                <>
                  <video src={`${m.src}#t=0.1`} muted preload="metadata" className="w-full h-full object-cover" />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </>
              ) : (
                <img src={m.src} alt="" className="w-full h-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
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
  const media = getProjectMedia(project);
  const shownTech = project.tech.slice(0, 4);
  const extra = project.tech.length - shownTech.length;
  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      className="group flex flex-col text-left rounded-3xl overflow-hidden bg-white/[0.08] backdrop-blur-md border border-white/15 hover:bg-white/[0.13] hover:border-white/35 transition-colors duration-300"
    >
      <CardMedia project={project} media={media} />
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
              <span key={h.label} className="max-w-[10rem]">
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
  const detailMedia = selectedProject ? getProjectMedia(selectedProject) : [];

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
        <div className="orb" style={{ top: '-12%', left: '-10%', background: '#2f7280' }} />
        <div className="orb" style={{ bottom: '-15%', right: '-10%', background: '#6a5599', animationDelay: '-18s' }} />
      </div>

      <div className="relative z-10">
        {/* Navbar */}
        <header className="fixed top-4 inset-x-0 z-50 px-4">
          <nav className="mx-auto max-w-3xl flex items-center justify-between rounded-full bg-white/10 backdrop-blur-xl border border-white/20 pl-5 pr-2 py-2">
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
            <section id="home" className={`${PAD} pt-36 pb-24 min-h-screen flex items-center`}>
              <div className={`${WRAP} grid lg:grid-cols-[1.15fr_1fr] gap-14 items-center`}>
                <div className="text-center lg:text-left">
                  <div className="rise inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-sm text-white/90 mb-8">
                    <span className="w-2 h-2 rounded-full bg-emerald-300" />
                    Open to internships and collaborations
                  </div>

                  <h1 className="rise rise-2 f-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.02] tracking-tight mb-5">
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
                      className="px-7 py-3 bg-white text-[#141b38] font-semibold rounded-full hover:bg-white/90 transition-colors"
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

                {/* Foto profil: taruh di src/assets/profile.jpg */}
                <div className="rise rise-2 order-first lg:order-none flex justify-center">
                  <div className="relative w-60 h-60 sm:w-72 sm:h-72 lg:w-96 lg:h-96 xl:w-[28rem] xl:h-[28rem] shrink-0">
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
            <section id="about" className={`${PAD} py-24 scroll-mt-20`}>
              <div className={`${WRAP} grid lg:grid-cols-[1fr_1.6fr] gap-12 items-start`}>
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
                      className={`rounded-3xl bg-white/[0.08] backdrop-blur-md border border-white/15 p-6 ${
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
            <section id="projects" className={`${PAD} py-24`}>
              <div className={`${WRAP} space-y-28`}>
                {sections.map((s) => (
                  <div key={s.id} id={s.id} className="scroll-mt-24">
                    <div className="mb-10 max-w-2xl">
                      <h2 className="f-display text-3xl sm:text-4xl font-bold tracking-tight mb-3">{s.title}</h2>
                      <p className="text-white/75 text-lg">{s.text}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <main className={`${PAD} pt-32 pb-24 min-h-screen`}>
            <div className={WRAP}>
              <button
                onClick={() => goTo(backTarget)}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 px-4 py-2 mb-10 text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {backLabel}
              </button>

              <div className="max-w-4xl mb-10">
                {selectedProject.badge && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 border border-emerald-300/40 text-emerald-100 px-3.5 py-1 text-sm font-medium mb-5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    {selectedProject.badge}
                  </span>
                )}
                <h1 className="f-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-5">
                  {selectedProject.title}
                </h1>
                <p className="text-white/80 text-lg sm:text-xl leading-relaxed">{selectedProject.summary}</p>
              </div>

              {/* Gambar / video */}
              <MediaViewer key={selectedProject.id} project={selectedProject} media={detailMedia} />

              <div className="mt-14 grid lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-10 xl:gap-16 items-start">
                {/* Kolom kiri: cerita */}
                <div>
                  <h2 className="f-display text-2xl font-bold mb-4">Overview</h2>
                  <p className="text-white/80 text-lg leading-relaxed mb-12">{selectedProject.overview}</p>

                  <h2 className="f-display text-2xl font-bold mb-4">{selectedProject.pointsHeading}</h2>
                  <div className="divide-y divide-white/15 rounded-3xl bg-white/[0.08] backdrop-blur-md border border-white/15">
                    {selectedProject.points.map((pt) => (
                      <div key={pt.title} className="p-6 sm:p-7">
                        <h3 className="f-display text-lg font-bold mb-2">{pt.title}</h3>
                        <p className="text-white/80 leading-relaxed">{pt.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Kolom kanan: ringkasan */}
                <aside className="lg:sticky lg:top-28 space-y-6">
                  <dl className="rounded-3xl bg-white/[0.08] backdrop-blur-md border border-white/15 p-6 space-y-4">
                    <div>
                      <dt className="text-white/65 text-sm mb-0.5">Category</dt>
                      <dd className="font-semibold">{selectedProject.category}</dd>
                    </div>
                    <div>
                      <dt className="text-white/65 text-sm mb-0.5">Period</dt>
                      <dd className="font-semibold">{selectedProject.period}</dd>
                    </div>
                    <div>
                      <dt className="text-white/65 text-sm mb-0.5">Role</dt>
                      <dd className="font-semibold">{selectedProject.role}</dd>
                    </div>
                    {selectedProject.company && (
                      <div>
                        <dt className="text-white/65 text-sm mb-0.5">Company</dt>
                        <dd className="font-semibold">{selectedProject.company}</dd>
                      </div>
                    )}
                  </dl>

                  {selectedProject.highlights.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {selectedProject.highlights.map((h) => (
                        <div key={h.label} className="rounded-2xl bg-white/[0.08] border border-white/15 p-5">
                          <p className="f-display text-2xl sm:text-3xl font-bold leading-none mb-2">{h.value}</p>
                          <p className="text-sm text-white/70 leading-snug">{h.label}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="rounded-3xl bg-white/[0.08] backdrop-blur-md border border-white/15 p-6">
                    <h2 className="f-display text-lg font-bold mb-4">Tech stack</h2>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tech.map((t) => (
                        <Chip key={t}>{t}</Chip>
                      ))}
                    </div>
                  </div>

                  {selectedProject.links.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {selectedProject.links.map((l) => (
                        <a
                          key={l.label}
                          href={l.href}
                          target="_blank"
                          rel="noreferrer"
                          className={`px-6 py-3 font-semibold rounded-full transition-colors text-sm ${
                            l.primary
                              ? 'bg-white text-[#141b38] hover:bg-white/90'
                              : 'bg-white/10 border border-white/35 hover:bg-white/20'
                          }`}
                        >
                          {l.label}
                        </a>
                      ))}
                    </div>
                  )}
                </aside>
              </div>

              {/* Proyek berikutnya (dalam kelompok yang sama) */}
              {nextProject && (
                <button
                  onClick={() => openProject(nextProject)}
                  className="group mt-20 w-full text-left flex items-center justify-between gap-4 rounded-3xl bg-white/[0.08] backdrop-blur-md border border-white/15 hover:bg-white/[0.13] hover:border-white/35 transition-colors p-6 sm:p-8"
                >
                  <span>
                    <span className="block text-sm text-white/65 mb-1">Next project</span>
                    <span className="block f-display text-xl sm:text-2xl font-bold">{nextProject.title}</span>
                  </span>
                  <ArrowRight />
                </button>
              )}
            </div>
          </main>
        )}

        {/* ============ KONTAK ============ */}
        <section id="contact" className={`${PAD} py-24 scroll-mt-20`}>
          <div className="mx-auto max-w-4xl rounded-[2rem] bg-white/[0.08] backdrop-blur-md border border-white/20 px-8 py-14 sm:px-14 text-center">
            <h2 className="f-display text-3xl sm:text-5xl font-bold tracking-tight mb-4">Let&apos;s connect.</h2>
            <p className="text-white/80 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              I&apos;m currently open to new opportunities, internships, and interesting collaborations. If you&apos;re working on something exciting, I&apos;d love to hear about it.
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              {EMAIL && (
                <a href={`mailto:${EMAIL}`} className="px-6 py-3 bg-white text-[#141b38] font-semibold rounded-full hover:bg-white/90 transition-colors">
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