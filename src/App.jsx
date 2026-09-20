import { useState, useEffect, useRef } from 'react';

/* ------------------------------------------------------------------ */
/*  MEDIA & DOKUMEN — dibaca otomatis dari folder src/assets           */
/*                                                                     */
/*  1. Taruh gambar / video / PDF di src/assets/ (subfolder juga boleh)*/
/*  2. Tulis NAMA FILE-nya di project:                                 */
/*       media: ["rm1.jpeg", { file: "rm2.jpeg", caption: "..." }]     */
/*       links: [{ label: "Read the report", file: "laporan.pdf" }]    */
/*  Format media: png, jpg, jpeg, webp, gif, mp4, webm (huruf kecil).  */
/*  Media pertama menjadi gambar sampul kartu project.                 */
/*                                                                     */
/*  Foto profil: taruh sebagai src/assets/profile.jpg (.jpeg/.png/.webp)*/
/*  Sertifikat: taruh sertifikat_magang.pdf & sertifikat_AI_azure.pdf  */
/*  di src/assets/ (dipakai oleh bagian Experience & Certifications).  */
/*  Catatan: fitur ini memakai Vite (import.meta.glob).                */
/* ------------------------------------------------------------------ */

const assetModules = import.meta.glob('./assets/**/*.{png,jpg,jpeg,webp,gif,mp4,webm,pdf}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const assetByName = {};
Object.entries(assetModules).forEach(([path, url]) => {
  assetByName[path.split('/').pop().toLowerCase()] = url;
});
const getAsset = (name) => (name ? assetByName[String(name).toLowerCase()] : undefined);

const PROFILE_PHOTO =
  getAsset('profile.jpg') || getAsset('profile.jpeg') || getAsset('profile.png') || getAsset('profile.webp') || null;

const IS_DEV = Boolean(import.meta.env && import.meta.env.DEV);

// Pengguna yang mematikan animasi di sistemnya akan melihat versi statis.
const REDUCED =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mengubah daftar `media` project menjadi [{ src, type, caption }]; file yang belum ada dilewati.
function getProjectMedia(p) {
  return (p.media || [])
    .map((m) => (typeof m === 'string' ? { file: m } : m))
    .map((m) => {
      const src = m.src || getAsset(m.file);
      if (!src) return null;
      const name = m.file || '';
      return {
        src,
        type: m.type || (/\.(mp4|webm)$/i.test(name) ? 'video' : 'image'),
        caption: m.caption || '',
      };
    })
    .filter(Boolean);
}

// Mengubah `links` project menjadi [{ label, url, primary }]; link tanpa tujuan disembunyikan.
function getProjectLinks(p) {
  return (p.links || [])
    .map((l) => ({ ...l, url: l.file ? getAsset(l.file) || l.href : l.href }))
    .filter((l) => l.url && l.url !== '#');
}

/* ------------------------------------------------------------------ */
/*  DATA — edit bagian ini saja untuk mengganti isi portofolio         */
/* ------------------------------------------------------------------ */

// Lebar konten utama (ubah max-w-6xl menjadi max-w-5xl / max-w-7xl kalau mau lebih sempit / lebar)
const WRAP = "mx-auto w-full max-w-6xl";
const PAD = "px-6 sm:px-8 lg:px-10";

// ---- Kontak: isi tiga baris ini agar tombolnya muncul di bagian "Let's connect" ----
// Boleh diisi username / nomor saja, atau URL lengkap.
// Tombol "Email me" menampilkan pilihan Gmail / Outlook. Kosongkan salah satu untuk menyembunyikannya.
const EMAIL_GMAIL = "setiawanradianda@gmail.com";
const EMAIL_OUTLOOK = "radianda.setiawan@binus.ac.id";
const WHATSAPP = "628117761151"; // nomor dengan kode negara, tanpa "+", contoh: "6281234567890"
const LINE_ID = "radianda123"; // LINE ID, contoh: "radianda"  (atau URL LINE kamu)
const INSTAGRAM = "radianda_setiawan"; // username tanpa @, contoh: "radianda.setiawan"

const asUrl = (value, build) => (!value ? '' : /^https?:\/\//i.test(value) ? value : build(value));

// Tombol dengan href kosong atau "#" otomatis disembunyikan.
const SOCIALS = [
  { label: "LinkedIn", icon: "linkedin", href: "https://www.linkedin.com/in/radianda-setiawan-22287225a" },
  { label: "GitHub", icon: "github", href: "https://github.com/chicknug19" },
  { label: "WhatsApp", icon: "whatsapp", href: asUrl(WHATSAPP, (v) => `https://wa.me/${v.replace(/\D/g, '')}`) },
  { label: "LINE", icon: "line", href: asUrl(LINE_ID, (v) => `https://line.me/ti/p/~${v.replace(/^~/, '')}`) },
  { label: "Instagram", icon: "instagram", href: asUrl(INSTAGRAM, (v) => `https://instagram.com/${v.replace(/^@/, '')}`) },
];

const FILLED_ICONS = {
  linkedin:
    "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
  github:
    "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z",
};

function SocialIcon({ name }) {
  if (FILLED_ICONS[name]) {
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d={FILLED_ICONS[name]} />
      </svg>
    );
  }
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {name === 'instagram' && (
        <>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" />
        </>
      )}
      {name === 'whatsapp' && (
        <>
          <path d="M3 21l1.8-5.2A8.5 8.5 0 1 1 8.2 19.3L3 21z" />
          <path d="M9.2 8.6c-.3.8.1 2 1.2 3.2s2.4 1.9 3.3 1.7c.6-.1 1-.6 1.1-1l-1.4-.9-.7.6c-.7-.3-1.6-1-2-1.8l.5-.8-.9-1.4c-.4 0-.9.3-1.1.4z" />
        </>
      )}
      {name === 'line' && (
        <>
          <path d="M12 3C6.9 3 3 6.3 3 10.4c0 2.5 1.5 4.7 3.8 6.1-.2.9-.6 2.2-.7 2.6 0 0 0 .3.2.4.2.1.4 0 .4 0 .5-.1 2.4-1.5 3.3-2.1.5.1 1.1.1 1.6.1 5.1 0 9-3.3 9-7.4S17.1 3 12 3z" />
          <circle cx="8.5" cy="10.5" r="0.7" fill="currentColor" />
          <circle cx="12" cy="10.5" r="0.7" fill="currentColor" />
          <circle cx="15.5" cy="10.5" r="0.7" fill="currentColor" />
        </>
      )}
    </svg>
  );
}

// Kalimat yang diketik otomatis di hero: "I build ____"
const TYPED_PHRASES = [
  "real-time computer vision systems",
  "NLP models for Indonesian text",
  "full-stack machine learning apps",
  "REST APIs deployed on Azure",
];

const skillGroups = [
  {
    title: "Languages",
    items: ["Python", "C#", "TypeScript", "JavaScript", "SQL"],
  },
  {
    title: "AI & machine learning",
    items: ["Scikit-Learn", "Pandas", "NumPy", "OpenCV", "Dlib", "Gemini API", "IndoBERT", "XLM-RoBERTa", "Random Forest", "SMOTE-Tomek", "RAG"],
  },
  {
    title: "Web & backend",
    items: ["React.js", "Tailwind CSS", "Vite", "ASP.NET Core", "ASP.NET MVC", "ASP.NET Web API", "Entity Framework Core", "Dapper ORM", "SQL Server", "REST APIs", "AngularJS", "Flask", "FastAPI", "Playwright"],
  },
  {
    title: "Cloud & DevOps",
    items: ["Azure App Services", "Vercel", "Hugging Face Spaces", "Docker", "GitHub Actions", "DVC", "Git", "GitHub", "GitLab", "CI/CD"],
  },
  {
    title: "Business & domain",
    items: ["ERP Systems", "Supply Chain Management", "Logistics Management", "Inventory Management", "Invoicing", "Client Billing", "Client Relations"],
  },
];

/* ---------------- Pengalaman kerja ----------------
   Deskripsi di LinkedIn terpotong ("...more"); lengkapi di bagian TODO.
   Field `file` (opsional) = nama PDF di src/assets, tampil sebagai tombol. */
// Skill PT Cellbox: dipakai bersama oleh kartu pengalaman dan kartu sertifikat magang
const CELLBOX_SKILLS = [
  "ASP.NET MVC", "Model-View-Controller (MVC)", "C#", "Microsoft SQL Server", "Dapper ORM", "Databases", "REST APIs",
  "CRUD Operations", "Full-Stack Development", "Front-End Development", "Back-End Web Development", "Software Infrastructure",
];

const experiences = [
  {
    id: "batavia-satu",
    role: "Full Stack Engineer",
    company: "PT Batavia Satu",
    type: "Part-time",
    period: "Jun 2026 – Present",
    location: "West Jakarta, Indonesia · Hybrid",
    current: true,
    summary:
      "Architecting and building end-to-end B2B order and fulfillment workflows for a supply chain management and ERP system.",
    points: [
      "Developed modules for Purchase Orders, Sales Orders, Delivery Orders, and Invoicing.",
      // TODO: tempel sisa deskripsi dari LinkedIn di sini
    ],
    skills: [
      "ASP.NET MVC", "ASP.NET Web API", "C#", "Microsoft SQL Server", "Dapper ORM", "REST APIs", "CRUD Operations",
      "Enterprise Resource Planning (ERP)", "Supply Chain Management", "Python", "FastAPI", "Web Scraping",
      "React.js", "AngularJS", "JavaScript", "Front-End Development", "Back-End Web Development", "Software Development",
      "Software Infrastructure", "Microsoft Azure", "GitHub", "GitLab", "CI/CD", "Teamwork", "Team Leadership",
    ],
  },
  {
    id: "cellbox",
    role: "Full Stack Engineer",
    company: "PT Cellbox",
    type: "Internship",
    period: "Jul 2025 – Aug 2025",
    location: "West Jakarta, Indonesia · On-site",
    current: false,
    summary:
      "Built and maintained end-to-end web applications using the Model-View-Controller (MVC) architecture across the frontend, backend, and relational database layers.",
    points: [
      "Built the Omnichannel Messaging & Webhook Integration Service that unifies WeChat and WhatsApp conversations (see the project above).",
      // TODO: tempel sisa deskripsi dari LinkedIn di sini
    ],
    skills: CELLBOX_SKILLS,
    file: "sertifikat_magang.pdf",
    fileLabel: "Internship letter (PDF)",
  },
  {
    id: "cipta-duta",
    role: "Administrator",
    company: "PT Cipta Duta Mahakarya",
    type: "Part-time",
    period: "May 2024 – Aug 2024",
    location: "Batam City, Riau Islands, Indonesia · On-site",
    current: false,
    summary:
      "Managed end-to-end billing workflows for logistics transactions, from drafting and verifying invoices to reconciling them with delivery orders.",
    points: [
      "Reconciled invoices against delivery orders to keep every logistics transaction accurate.",
      // TODO: tempel sisa deskripsi dari LinkedIn di sini
    ],
    skills: [
      "Supply Chain Management", "Logistics Management", "Invoicing", "Client Billing",
      "Inventory Management", "Client Relations", "Administrative Assistance",
    ],
  },
];

/* ---------------- Sertifikat ---------------- */
const certifications = [
  {
    id: "cellbox-cert",
    title: "Internship Certificate, PT Cellbox",
    issuer: "PT Cellbox",
    issued: "Jul 2025",
    text: "Proof of completing a full-stack software development internship, covering MVC-based web development with ASP.NET MVC, C#, REST APIs, and SQL Server.",
    skills: CELLBOX_SKILLS,
    file: "sertifikat_magang.pdf",
  },
  {
    id: "ai900",
    title: "Microsoft AI-900T00-A: Belajar AI dari Dasar",
    issuer: "Microsoft",
    issued: "Mar 2026",
    text: "Foundational course on artificial intelligence concepts and Azure AI services, including machine learning and generative AI.",
    skills: ["Azure AI", "Machine Learning"],
    file: "sertifikat_AI_azure.pdf",
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
  Field project:
    media:        ["file1.jpeg", { file: "file2.jpeg", caption: "keterangan" }, "demo.mp4"]
    links:        [{ label, href, primary? }]  atau  [{ label, file: "nama.pdf" }] untuk PDF di src/assets
                  Link `primary: true` tampil sebagai tombol putih.
    team:         "Group of 5 at BINUS University"   -> baris "Team" di sidebar detail
    contribution: "..."                              -> baris "My contribution" di sidebar detail
  Kartu di halaman utama menampilkan 2 `highlights` pertama; halaman detail menampilkan semuanya.
*/
const projects = [
  /* ---------------- AI ---------------- */
  {
    id: 1,
    group: "ai",
    title: "Evaluating the Financial Impact of Cost-Sensitive Random Forest and SMOTE-Tomek in Fraud Detection",
    short: "Research",
    badge: "Accepted at COMPGINEER2026",
    cover: ["#7b4a5c", "#48487f"],
    category: "Machine Learning Research",
    period: "Apr – Aug 2026",
    role: "Co-author & ML Researcher",
    company: null,
    team: "4 authors, BINUS University",
    contribution: "Methodology, software, validation, investigation, and manuscript review and editing.",
    summary: "A conference paper on cutting real-world financial loss in credit card fraud detection by combining SMOTE-Tomek resampling with a Cost-Sensitive Random Forest.",
    overview: "A machine learning research paper accepted at COMPGINEER2026, a Nutral Conferences event, and presented in its online session. It studies how to reduce real financial loss in credit card fraud detection under extreme class imbalance, using SMOTE-Tomek resampling together with a Cost-Sensitive Random Forest. Every model is judged by projected monetary impact as well as PR-AUC and minority recall.",
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
        text: "Benchmarked four configurations (SMOTE + RF, SMOTE-Tomek + RF, and both with the cost-sensitive RF) using PR-AUC, minority recall, false negatives, and projected monetary impact. The plain SMOTE baseline still had the lowest loss on this dataset (Rp 90.7M), so the paper concludes that the benefit depends on dataset topology and penalty calibration.",
      },
      {
        title: "Presented at the conference",
        text: "Presented the work in the conference's online session, walking the audience through the pipeline from the 284,807-transaction raw dataset, through robust scaling and resampling, to classification and a financial-loss estimate.",
      },
    ],
    highlights: [
      { value: "Rp 95.7M", label: "estimated loss after tuning, down from Rp 100.65M" },
      { value: "0.172%", label: "fraud share of 284,807 transactions" },
    ],
    tech: ["Python", "Scikit-Learn", "Random Forest", "SMOTE-Tomek", "Cost-sensitive learning", "PR-AUC"],
    media: [
      { file: "rm1.jpeg", caption: "Title slide from the COMPGINEER 2026 online presentation" },
      { file: "rm2.jpeg", caption: "Methodology slide: from 284,807 raw transactions to a financial-loss estimate" },
    ],
    links: [
      { label: "Read the paper (PDF)", file: "paper_rm.pdf", primary: true },
      { label: "View on GitHub", href: "https://github.com/chicknug19/research-method" },
    ],
  },
  {
    id: 2,
    group: "ai",
    title: "Autonomous AI-Powered E-Commerce Scraping Engine",
    short: "Scraper",
    badge: null,
    cover: ["#5c4a8f", "#2f7086"],
    category: "Artificial Intelligence",
    period: "Aug – Sep 2026",
    role: "AI & Backend Engineer",
    company: null,
    summary: "An autonomous engine that collects large-scale competitor product data from Shopee and Tokopedia, filters it with Gemini, and solves slider CAPTCHAs with OpenCV.",
    overview: "An enterprise-grade, autonomous web scraping engine that extracts large-scale competitor product data from e-commerce platforms (Shopee and Tokopedia) for market analysis and business intelligence. It is designed around fault tolerance, AI integration, and advanced anti-bot evasion.",
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
    media: ["scrape.jpeg"],
    links: [{ label: "View on GitHub", href: "https://github.com/chicknug19/scraping_ecom" }],
  },
  {
    id: 3,
    group: "ai",
    title: "Smart Hoax Detector",
    short: "Hoax",
    badge: null,
    cover: ["#2f6a70", "#3e5083"],
    category: "Natural Language Processing",
    period: "May – Jun 2026",
    role: "NLP Engineer",
    company: null,
    team: "Group of 4, BINUS University",
    summary: "An AI web app that classifies Indonesian political news as fact or hoax with a fine-tuned IndoBERT (99.39% Macro F1) and shows live fact-checking references.",
    overview: "An end-to-end system for fighting political misinformation in Indonesia. The research side benchmarks five NLP architectures under identical conditions on a balanced corpus of Indonesian political news. The product side wraps the best models in a decoupled cloud app that also pulls live references from the web. The app is deliberately limited to political news: the models were trained on that domain, and text from unrelated areas such as health or entertainment would degrade accuracy.",
    pointsHeading: "What I built",
    points: [
      {
        title: "Balanced corpus from four sources",
        text: "Combined roughly 30,000 articles: CNN Indonesia, Kompas, and Tempo as the 'FAKTA' (fact) class, and debunked items from TurnBackHoax as the 'HOAKS' (hoax) class. The majority class was downsampled to a strict 50:50 ratio before an 80/20 split, leaving 4,113 unseen test samples (2,019 fact, 2,094 hoax).",
      },
      {
        title: "Data engineering and leakage prevention",
        text: "Regex-based structural cleaning removes HTML, URLs, media watermarks, and journalistic footprints, so the models learn from the narrative itself instead of source bias. The test set was isolated before TF-IDF fitting and tokenization, so no test information leaks into training.",
      },
      {
        title: "Five-model ablation study",
        text: "Compared SVM with TF-IDF (unigrams and bigrams, 20,000 features), 1D-CNN, BiLSTM with Attention, XLM-RoBERTa, and IndoBERT V2. Macro F1 climbed from 98.47% (1D-CNN) and 98.49% (SVM) through 98.69% (BiLSTM) and 99.12% (XLM-RoBERTa) to 99.39% for IndoBERT, which made only 25 errors across 4,113 test articles.",
      },
      {
        title: "Fair, conservative training setup",
        text: "Transformers were fine-tuned with the Hugging Face Trainer under identical constraints: 2 epochs, learning rate 2e-5, weight decay 0.01, 100 warmup steps, and a 128-token maximum sequence length, to avoid memorizing the training set.",
      },
      {
        title: "Explainability and stylometry",
        text: "Extracted the linear SVM's coefficients to see which words push a text toward 'hoax' (emotional, deceptive vocabulary) or 'fact' (neutral journalistic terms). The study attributes the near-perfect scores to the models decoding style: formal PUEBI journalism versus informal, capitalized, emotive user-generated hoaxes.",
      },
      {
        title: "Decoupled cloud architecture",
        text: "A React.js frontend deployed on Vercel, backed by an asynchronous FastAPI inference service hosted on Hugging Face Spaces that serves the fine-tuned IndoBERT and XLM-RoBERTa models.",
      },
      {
        title: "Real-time fact-checking with a safety net",
        text: "A DuckDuckGo web-scraping module provides live factual validation. If it hits rate limits, timeouts, or failures, the query automatically falls back to the Wikipedia API, so the service keeps running during high traffic.",
      },
      {
        title: "What users see",
        text: "Users paste an article and press the detect button. The result panel shows a FAKTA or HOAKS verdict with a confidence bar and explains it in terms of writing style, for example that the text is 98.21% similar to official journalistic reporting. Below it, cards with related web references let users open the original sources.",
      },
      {
        title: "CI/CD automation",
        text: "A GitHub Actions pipeline deploys every push to the main branch to the Hugging Face backend, authenticated with a write token stored as an encrypted GitHub secret.",
      },
    ],
    highlights: [
      { value: "99.39%", label: "peak Macro F1 with IndoBERT V2" },
      { value: "30,000", label: "articles collected from 4 news and fact-check sources" },
      { value: "5", label: "architectures benchmarked, from SVM to transformers" },
      { value: "25", label: "errors out of 4,113 test articles (IndoBERT)" },
    ],
    tech: ["Python", "IndoBERT", "XLM-RoBERTa", "TF-IDF + SVM", "FastAPI", "React.js", "DuckDuckGo", "Wikipedia API", "GitHub Actions", "Hugging Face Spaces"],
    media: [
      { file: "nlp1.jpeg", caption: "Paste a news article and let IndoBERT analyse its writing style" },
      { file: "nlp2.jpeg", caption: "Verdict (FAKTA, 98.21% confidence) with related fact-checking references from the web" },
    ],
    links: [
      { label: "Try the live app", href: "https://aol-nlp.vercel.app/", primary: true },
      { label: "Watch the demo video", href: "https://drive.google.com/file/d/1ISOj4hwmQ6fVlkRpGHzen6UnhEka9cnI/view?usp=sharing" },
      { label: "View the slides (Canva)", href: "https://canva.link/7a2k00tkpy92ndn" },
      { label: "Read the report (PDF)", file: "laporan_nlp.pdf" },
      { label: "View on GitHub", href: "https://github.com/chicknug19/AOL-NLP" },
    ],
  },
  {
    id: 4,
    group: "ai",
    title: "LQ45 Market Direction Predictor",
    short: "LQ45",
    badge: null,
    cover: ["#875832", "#6d4266"],
    category: "Machine Learning",
    period: "Apr – Jun 2026",
    role: "Machine Learning Engineer",
    company: null,
    team: "Group of 5, BINUS University",
    contribution: "Model training and tuning, Flask backend, React frontend, and deployment.",
    summary: "A full-stack ML web app that predicts the next-day direction of Indonesia's LQ45 index with an RBF-kernel SVC, 14 technical indicators, and live market data, tested with five student traders.",
    overview: "An end-to-end machine learning project that predicts whether the LQ45 index will close higher or lower on the next trading day. The team first considered price regression, then pivoted to binary direction classification because direction is more robust against daily market noise. The final system pairs a tuned Support Vector Classifier with technical indicators computed on live Yahoo Finance data, and was checked in usability tests with five students who trade stocks. Hold-out results stayed close to chance level, and I report that openly below instead of hiding it.",
    pointsHeading: "What I built",
    points: [
      {
        title: "Problem framing and model engineering",
        text: "Framed the task as binary classification (1 = next close is higher, 0 = lower or flat). Built an SVC with a Radial Basis Function kernel and tuned C and gamma with GridSearchCV and 5-fold cross-validation, using class_weight='balanced' so 'Up' and 'Down' days are treated equally.",
      },
      {
        title: "Feature engineering",
        text: "Turned 649 labelled trading days of LQ45 history into 14 technical indicators across price action, trend (EMA 21/99/200, MACD and signal line), momentum (RSI, Stochastic %K), and volatility (Bollinger Bands). Trading volume was left out because the live API could not supply it reliably.",
      },
      {
        title: "Leakage prevention",
        text: "A strict sequential 80/20 split (shuffle=False) and a StandardScaler fitted on training data only keep future information out of the model and preserve time-series integrity.",
      },
      {
        title: "Honest evaluation",
        text: "On the 130-day test set the model reached 50.77% accuracy, 47.17% precision, 40.98% recall, and an F1 of 43.86%, with a ROC-AUC of 0.4994. Five-fold cross-validation averaged 51.61% (std 3.29%). That is no real edge over chance, so the project treats the tool as a supplement to analysis rather than a trading signal, and lists missing volume, news sentiment, and movement magnitude as limits.",
      },
      {
        title: "Decoupled cloud architecture",
        text: "A responsive React.js frontend deployed on Vercel, paired with a containerized Flask backend built with Docker and hosted on Hugging Face Spaces, which serves the pre-trained model as a .pkl file.",
      },
      {
        title: "Real-time data pipeline",
        text: "On every request the backend pulls live market data through the Yahoo Finance API (yfinance), computes the indicators, scales them, runs inference, and returns the direction with up/down probabilities and a confidence level. No manual data upload is needed.",
      },
      {
        title: "User testing with five student traders",
        text: "Testers opened the page and pressed Predict. Average ratings out of 5: smooth flow 4.4, result clarity 4.4, confidence information 4.2, ease of use 4.2, usefulness for decisions 4.0. Their feedback: show a timestamp for the fetched data, explain the probabilities with tooltips, and display core indicator values such as RSI and MACD.",
      },
      {
        title: "CI/CD and MLOps automation",
        text: "A GitHub Actions pipeline, combined with Data Version Control (DVC) and MLflow concepts, keeps backend updates automated and stable in production.",
      },
    ],
    highlights: [
      { value: "14", label: "technical indicators engineered" },
      { value: "4.4/5", label: "user rating for result clarity (5 testers)" },
      { value: "0.4994", label: "ROC-AUC, an honest near-chance baseline" },
      { value: "51.6%", label: "average 5-fold cross-validation accuracy" },
    ],
    tech: ["Python", "Scikit-Learn", "SVC (RBF)", "GridSearchCV", "Flask", "React.js", "Docker", "GitHub Actions", "DVC", "yfinance"],
    media: [{ file: "ml1.jpeg", caption: "Prediction result: NAIK (up) with 67.7% confidence and the up/down probabilities" }],
    links: [
      { label: "Try the live app", href: "https://aol-ml-nu.vercel.app/", primary: true },
      {
        label: "Watch the demo video",
        href: "https://onedrive.live.com/?qt=allmyphotos&photosData=%2Fshare%2F4AA6A29D10B92604%21se3d6eff93e974b72ad48c7169cbf8a70%3Fithint%3Dvideo%26e%3DgrxjOu%26migratedtospo%3Dtrue&cid=4AA6A29D10B92604&id=4AA6A29D10B92604%21se3d6eff93e974b72ad48c7169cbf8a70&redeem=aHR0cHM6Ly8xZHJ2Lm1zL3YvYy80YWE2YTI5ZDEwYjkyNjA0L0lRRDU3OWJqbHo1eVM2MUl4eGFjdjRwd0FhS3VReGE0ckJJMEgxa1FYOERTWlZJP2U9Z3J4ak91&v=photos",
      },
      { label: "View the slides (Canva)", href: "https://canva.link/cot8n43vjqqtbfe" },
      { label: "View on GitHub", href: "https://github.com/chicknug19/AOL-ML" },
    ],
  },
  {
    id: 5,
    group: "ai",
    title: "Driver Drowsiness Detection System (ADAS)",
    short: "Drowsiness",
    badge: null,
    cover: ["#34507f", "#57427f"],
    category: "Computer Vision",
    period: "Apr – Jun 2026",
    role: "Computer Vision Engineer",
    company: null,
    team: "Group of 6, BINUS University",
    summary: "A real-time in-cabin safety system that detects driver fatigue and micro-sleep with classical computer vision (Dlib, EAR, and MAR), reaching 83% recall on drowsy drivers at 31.11 FPS.",
    overview: "A research-style computer vision project for Advanced Driver Assistance Systems. Most modern driver monitors rely on deep neural networks that are hard to interpret and need GPUs. This system uses deterministic geometry instead: it finds 68 facial landmarks, turns them into an Eye Aspect Ratio and a Mouth Aspect Ratio, and applies transparent thresholds, so every alert can be explained and it runs on ordinary hardware. It follows a 'maximum recall' philosophy, because missing a drowsy driver is far more dangerous than a false alarm.",
    pointsHeading: "What I built",
    points: [
      {
        title: "Detection pipeline",
        text: "The React client captures webcam frames, encodes them as Base64, and posts them to a Flask backend. The server decodes each frame into a NumPy array, converts it to grayscale with OpenCV, finds the face with Dlib's HOG + Linear SVM detector, predicts 68 landmarks, and computes EAR from the eye landmarks and MAR from the lip landmarks.",
      },
      {
        title: "Three-state decision logic",
        text: "A hard-threshold rule tree instead of probabilities. Alert is the default state. Warning fires when EAR drops below a secondary threshold or MAR signals a yawn for N consecutive frames. Drowsy fires when EAR stays below the critical threshold for N consecutive frames, which indicates a micro-sleep. Each state triggers its own visual and audio alert.",
      },
      {
        title: "Grid search under a maximum-recall paradigm",
        text: "Tuned the EAR threshold, MAR threshold, and consecutive-frame count with a two-phase grid search: a 2D pass over EAR and frames, then a 3D pass adding MAR (27 combinations). To keep runtime manageable it scored on a 15-video subset. Both passes selected an EAR of 0.23 and 9 consecutive frames.",
      },
      {
        title: "Catching overfitting with a stress test",
        text: "The 3D search picked a MAR of 0.5 on the small subset, but on the full 141-video stress test it proved too sensitive: normal speaking was read as yawning, correct 'Alert' predictions fell from 21 to 13, accuracy dropped from 46% to 40%, and macro F1 from 0.41 to 0.35. Drowsy recall stayed at 83% in both runs, so I kept MAR 0.6 as the more generalizable setting.",
      },
      {
        title: "Evaluation on UTA-RLDD",
        text: "Evaluated on 141 videos (47 per class) from the UTA Real-Life Drowsiness Dataset across Alert, Low-vigilance, and Drowsy states. The system detected 39 of 47 drowsy videos (83% recall), at the cost of 46% overall accuracy and 0.40 precision on the Drowsy class. That trade-off is deliberate for a safety-critical setting, and it also shows the limits of fixed thresholds across faces, angles, and lighting.",
      },
      {
        title: "Live driver dashboard",
        text: "The web app streams the webcam feed with the detected eye and mouth landmarks drawn on top. A status card shows the current state (for example 'Aman (Alert)') next to live EAR and MAR readouts, and one button starts or stops the camera.",
      },
      {
        title: "Real-time performance and full-stack delivery",
        text: "Reached 31.11 FPS on a local x86 machine without a GPU, about twice the 15 FPS needed for fluid real-time use. A responsive React.js frontend talks to the Flask backend through Base64-encoded frame streaming.",
      },
      {
        title: "DevOps and CI/CD pipeline",
        text: "Set up automated CI/CD through GitHub, deploying the frontend to Vercel and the backend API to Hugging Face Spaces. Git branching strategies protect the production environment.",
      },
    ],
    highlights: [
      { value: "83%", label: "recall on the critical Drowsy class (39 of 47 videos)" },
      { value: "31.11 FPS", label: "average speed on x86 without a GPU" },
      { value: "141", label: "videos in the stress test (47 per class)" },
      { value: "27", label: "threshold combinations searched" },
    ],
    tech: ["Python", "Dlib", "OpenCV", "Flask", "React.js", "GitHub Actions", "Vercel", "Hugging Face Spaces"],
    media: [
      { file: "comvis1.jpeg", caption: "Dashboard before the camera is activated" },
      { file: "comvis2.jpeg", caption: "Live analysis: Alert state with EAR 0.271 and MAR 0.344, landmarks drawn on the eyes and mouth" },
    ],
    links: [
      { label: "Try the live app (needs a webcam)", href: "https://aol-comvis.vercel.app/", primary: true },
      // Catatan: link Drive di bawah ini saya anggap video demo; kalau ternyata laporan, ganti labelnya.
      { label: "Watch the demo video", href: "https://drive.google.com/file/d/1bIkkTWAsDnjedLdrEgkgcluCZhZkKkxU/view?usp=sharing" },
      { label: "View the slides (Canva)", href: "https://canva.link/7ibkhnakmq32xy2" },
      { label: "Read the report (PDF)", file: "laporan_comvis.pdf" },
      { label: "View on GitHub", href: "https://github.com/chicknug19/AOL-Comvis" },
    ],
  },
  {
    id: 6,
    group: "ai",
    title: "Forest Fire Risk Prediction Engine",
    short: "Fire Risk",
    badge: null,
    cover: ["#276448", "#735832"],
    category: "Artificial Intelligence",
    period: "Dec 2025",
    role: "Full-Stack AI Developer",
    company: null,
    summary: "FireWatch AI: a real-time forest fire risk system that feeds live weather data and land type into a Random Forest model and shows the result on an interactive satellite map.",
    overview: "A full-stack, real-time forest fire risk prediction system, shipped as the FireWatch AI dashboard, that monitors vulnerable regions across Indonesia. It focuses on interactive geospatial visualization, live meteorological integration, and predictive environmental modeling.",
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
        title: "Location scenarios and land type",
        text: "Users pick a location or scenario, such as a protected forest in Jambi or peatland in Riau. The dashboard loads the current weather for it and sets the land type automatically from geological data (stable mineral soil or very fire-prone peatland). The verdict, for example 'AMAN: low risk', comes with its probability.",
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
    media: [
      { file: "fire1.jpeg", caption: "Jambi protected-forest scenario on the satellite map: live weather, mineral soil, low risk (15.3%)" },
      { file: "fire2.jpeg", caption: "Riau peatland scenario in a thunderstorm: peatland is flagged as very fire-prone, verdict low risk (12.7%)" },
    ],
    links: [
      { label: "View the slides", href: "https://drive.google.com/file/d/1Xv-YXpoc_9yM6SGN704WnazJJwqG54gW/view?usp=sharing", primary: true },
      { label: "Watch the demo video", href: "https://drive.google.com/file/d/1dXICGosf8tow9eoDLzXg_c_Gyt2rYaw-/view?usp=sharing" },
      { label: "View on GitHub", href: "https://github.com/chicknug19/kebakaran-hutan-AI" },
    ],
  },

  /* ---------------- Software engineering ---------------- */
  {
    id: 7,
    group: "software",
    title: "Omnichannel Messaging & Webhook Integration Service",
    short: "Omnichannel",
    badge: null,
    cover: ["#276650", "#2f5a75"],
    category: "Web Development",
    period: "Jul 2026",
    role: "Full-Stack Engineer / Developer Intern",
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
        title: "Test chat interface",
        text: "A simple inbox was used to exercise the backend. It lists conversations from both platforms with [WA] and [WC] tags, opens a chat with timestamps, lets you send text and attachments, delete messages, and edit a contact's name, and shows received files as downloadable cards.",
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
    media: [
      { file: "wawe1.jpeg", caption: "Unified inbox with WhatsApp [WA] and WeChat [WC] conversations in one list" },
      { file: "wawe2.jpeg", caption: "Conversation view with timestamps, delete buttons, and a downloadable file attachment" },
    ],
    links: [{ label: "View on GitHub", href: "https://github.com/chicknug19/WeChatTest" }],
  },
  {
    id: 8,
    group: "software",
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
    media: [{ file: "creepydonut1.jpeg", caption: "Landing page with the chatbot button in the corner" }],
    links: [
      { label: "View the slides (Canva)", href: "https://www.canva.com/design/DAGoi6cdJ-4/3F4wMEwjf8IfoOwOUWs6wA/view", primary: true },
      { label: "Frontend repo", href: "https://github.com/chicknug19/CreepyDonutFE" },
      { label: "Backend repo", href: "https://github.com/chicknug19/backendCreepyDonut" },
    ],
  },
  {
    id: 9,
    group: "software",
    title: "Bookuger - Library System",
    short: "Bookuger",
    badge: null,
    cover: ["#2b5f5c", "#3d5885"],
    category: "Software Engineering",
    period: "Feb – Jun 2026",
    role: "Full-Stack Engineer",
    company: null,
    contribution: "Built the ASP.NET Core REST API and SQL Server data layer (DTOs, controllers for books, users, and transactions, JWT auth, password-reset emails), integrated it with the React frontend, and set up the Azure and Vercel deployment.",
    summary: "A web-based library lending system for BINUS with QR and barcode self-service checkout, role-based access, automated fines, and a full SRS with UML and ERD.",
    overview: "Bookuger is an online-to-offline library circulation system for BINUS University, built as a software engineering project that followed the Waterfall model from a 98-page Software Requirements Specification through implementation and deployment. Students browse the catalog and get a digital member ID. Library admins scan the member's QR code and the book's barcode at the desk to check books out and in. The goal: shorter queues, less manual data entry for librarians, and an accurate log of inventory and loans.",
    pointsHeading: "Problem, solution, and what I built",
    points: [
      {
        title: "The problem",
        text: "Managing physical book inventories and tracking borrower deadlines by hand leads to queues, data loss, and inefficiency for both students and librarians.",
      },
      {
        title: "Barcode-assisted circulation",
        text: "The admin scans the member's QR code (or types the Member ID as a fallback), and the system checks eligibility for blacklists and unpaid fines. After the book's barcode is scanned it stamps the borrow date, calculates the due date, and reduces available stock. Returns follow the same scan flow.",
      },
      {
        title: "Secure authentication and roles",
        text: "Role-based access for members and admins with JWT, which replaced the earlier session approach. There is no self-registration: member login is validated against the student NIM. Forgot-password and reset flows send emails through Gmail SMTP with time-limited reset tokens. The SRS sets JWT lifetime at 1 day, or 7 days with 'Remember me'.",
      },
      {
        title: "Data integrity and concurrency",
        text: "Book and transaction controllers were reworked so database changes are ACID. The SRS also specifies pessimistic row locking during checkout, so two people cannot borrow the last copy at the same moment.",
      },
      {
        title: "Automated fines and blacklist",
        text: "Late fees are calculated automatically from the due date at Rp 2,000 per day and shown to both admin and student. Admins can toggle a member's blacklist status, which blocks future borrowing.",
      },
      {
        title: "Catalog management and discovery",
        text: "Admins get full CRUD on the catalog with validation (unique ISBN, no negative stock) and a confirmation modal before deletion. Students get real-time search, category filtering, and pagination. Book images are stored in the database.",
      },
      {
        title: "Cloud deployment and security",
        text: "React frontend on Vercel, ASP.NET Core API on Azure App Service, and Azure SQL accessed only through Entity Framework Core, so queries are parameterized. CORS accepts only the frontend domain, secrets live in environment variables, and a GitHub Actions workflow builds and publishes the backend to Azure.",
      },
      {
        title: "Engineering process",
        text: "Documented in an SRS with use case, activity, sequence, and class diagrams plus an ERD. Development used role-based Git branches with pull-request reviews across frontend and backend. A risk analysis covers scanner failure (manual ID fallback), SSO downtime, race conditions, QR screenshot sharing, and misplaced books.",
      },
    ],
    highlights: [
      { value: "98 pages", label: "SRS with UML diagrams and an ERD" },
      { value: "2 roles", label: "member and admin, secured with JWT" },
      { value: "Rp 2,000", label: "late fee per day, calculated automatically" },
      { value: "5", label: "risks analysed with mitigation plans" },
    ],
    tech: ["React.js", "ASP.NET Core", "C#", "Entity Framework Core", "SQL Server", "JWT", "Azure App Service", "Vercel", "GitHub Actions"],
    media: [
      { file: "se_uhomepage.jpeg", caption: "Member home page" },
      { file: "se_uhomepage1.jpeg", caption: "Member home page, second view" },
      { file: "se_explorepage.jpeg", caption: "Explore page" },
      { file: "se_searchpage.jpeg", caption: "Search page" },
      { file: "se_bookpage.jpeg", caption: "Book page" },
      { file: "se_login.jpeg", caption: "Login page" },
      { file: "se_ahomepage.jpeg", caption: "Admin home page" },
      { file: "se_memberpage.jpeg", caption: "Member page" },
      { file: "se_borrowbook.jpeg", caption: "Borrow book flow" },
      { file: "se_returnbook.jpeg", caption: "Return book flow" },
      { file: "se_inventorypage.jpeg", caption: "Inventory page" },
    ],
    links: [
      { label: "Watch the demo video", href: "https://drive.google.com/file/d/1c0OLaxqyWhti_1Obtf1t1KaAAWna_hvf/view?usp=sharing", primary: true },
      { label: "Read the SRS (Google Docs)", href: "https://docs.google.com/document/d/1Nh95T285dmyuxs9D7atajg8gC4WXlZRG9qlUDuJIe4E/edit?usp=sharing" },
      { label: "UML diagrams (Google Docs)", href: "https://docs.google.com/document/d/1CA-N-X9Kq5Inup6SW6VWD7EgPP4dFqL4W6PlSXFB4iQ/edit?usp=sharing" },
      { label: "PKM-KC document (Google Docs)", href: "https://docs.google.com/document/d/1_cf_9uGqMd-wOg3RnSa5iam9iYLX34urFplSut2t03A/edit?tab=t.0" },
      // PENTING: ini link "edit" Canva. Ganti dengan link "view" dari Canva (Share > Public view link)
      // supaya pengunjung tidak bisa mengubah desainmu.
      { label: "View the slides (Canva)", href: "https://www.canva.com/design/DAHLbyGgHlA/ebdRKJWSf3puPk_PMvwLgA/edit" },
      // Repo ini saya asumsikan milik Bookuger (tugas Software Engineering); hapus baris ini kalau salah.
      { label: "View on GitHub", href: "https://github.com/chicknug19/AOL-SE-cuy" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  STYLE — background berganti warna + font + animasi                 */
/*  Ubah warna background di baris `.bg-shift` (5 warna, lalu kembali) */
/* ------------------------------------------------------------------ */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Instrument+Sans:wght@400;500;600&display=swap');

html { scroll-behavior: smooth; }
body { margin: 0; background: #0f1630; }
::selection { background: rgba(255,255,255,.35); color: #fff; }

.f-display { font-family: 'Bricolage Grotesque', 'Segoe UI', system-ui, sans-serif; }
.f-body { font-family: 'Instrument Sans', 'Segoe UI', system-ui, sans-serif; }

/* Background yang perlahan berganti warna (versi paling gelap) */
.bg-shift {
  background: linear-gradient(120deg, #0a1f27, #101730, #1c1636, #2a1a31, #0e1e38, #0a1f27);
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
  opacity: .1;
  animation: drift 44s ease-in-out infinite alternate;
}
@keyframes drift {
  from { transform: translate3d(0, 0, 0) scale(1); }
  to   { transform: translate3d(10vw, 8vh, 0) scale(1.15); }
}
.parallax-layer {
  position: absolute;
  inset: 0;
  transform: translate3d(0, calc(var(--sy, 0) * -0.05px), 0);
  will-change: transform;
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

/* Nama di hero muncul huruf demi huruf, lalu tiap huruf bisa "melompat" saat di-hover */
.letter {
  display: inline-block;
  transition: transform .3s cubic-bezier(.2,.7,.2,1);
  animation: letter-in .9s cubic-bezier(.2,.7,.2,1) backwards;
}
.letter:hover { transform: translateY(-.08em) rotate(-2deg); }
@keyframes letter-in {
  from { opacity: 0; transform: translateY(.7em) rotate(6deg); }
  to   { opacity: 1; transform: none; }
}

/* Teks yang diketik + kursor berkedip */
.caret {
  display: inline-block;
  width: 2px;
  height: 1em;
  margin-left: 4px;
  background: currentColor;
  vertical-align: -0.12em;
  animation: blink 1s steps(1) infinite;
}
@keyframes blink { 50% { opacity: 0; } }

/* Foto profil: bentuk blob yang pelan-pelan berubah + melayang */
.blob { animation: morph 14s ease-in-out infinite; border-radius: 58% 42% 47% 53% / 52% 44% 56% 48%; }
.blob-rev { animation-direction: reverse; }
@keyframes morph {
  0%, 100% { border-radius: 58% 42% 47% 53% / 52% 44% 56% 48%; }
  33%      { border-radius: 46% 54% 55% 45% / 58% 42% 58% 42%; }
  66%      { border-radius: 52% 48% 40% 60% / 44% 56% 44% 56%; }
}
.float { animation: float 8s ease-in-out infinite; }
@keyframes float { 50% { transform: translateY(-12px); } }

/* Muncul saat di-scroll (dipakai komponen <Reveal />) */
.reveal {
  opacity: 0;
  transform: translateY(26px);
  transition: opacity .8s cubic-bezier(.2,.7,.2,1), transform .8s cubic-bezier(.2,.7,.2,1);
}
.reveal.reveal-in { opacity: 1; transform: none; }

/* Transisi saat pindah ke halaman detail */
.page-in { animation: page-in .6s cubic-bezier(.2,.7,.2,1) both; }
.fade-in { animation: fade-in .5s ease both; }
@keyframes page-in {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: none; }
}
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

/* Kartu proyek: sedikit miring mengikuti kursor */
.tilt {
  transform: perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
  transition: transform .18s ease-out, background-color .3s, border-color .3s;
  will-change: transform;
}

/* Tombol putih dengan kilatan saat di-hover */
.btn-shine { position: relative; overflow: hidden; }
.btn-shine::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(110deg, transparent 30%, rgba(11,16,36,.14) 50%, transparent 70%);
  transform: translateX(-120%);
  transition: transform .8s;
}
.btn-shine:hover::after { transform: translateX(120%); }

/* Pita teknologi yang bergeser terus; berhenti saat di-hover */
.marquee-track { display: flex; width: max-content; animation: marquee 48s linear infinite; }
.marquee-rev { animation-direction: reverse; animation-duration: 56s; }
.marquee-wrap:hover .marquee-track { animation-play-state: paused; }
.marquee-item {
  margin-right: .75rem;
  padding: .5rem 1rem;
  border-radius: 9999px;
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.18);
  font-size: .9rem;
  white-space: nowrap;
  color: rgba(255,255,255,.9);
}
@keyframes marquee { to { transform: translateX(-50%); } }

a:focus-visible, button:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .bg-shift, .orb, .rise, .letter, .caret, .blob, .float, .page-in, .fade-in, .marquee-track {
    animation: none !important;
  }
  .parallax-layer { transform: none !important; }
  .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
  .tilt { transform: none !important; }
  .marquee-wrap { overflow-x: auto !important; }
}
`;

/* ------------------------------------------------------------------ */
/*  Hooks & komponen animasi                                           */
/* ------------------------------------------------------------------ */

// true setelah elemen masuk layar (sekali saja)
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(REDUCED);
  useEffect(() => {
    if (REDUCED) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -6% 0px', ...options }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [ref, inView];
}

// Membungkus konten agar muncul halus saat di-scroll. `delay` (ms) untuk efek berurutan.
function Reveal({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? 'reveal-in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// Angka yang menghitung naik dari 0. Awalan/akhiran ("Rp ", "M", "%", " FPS") dipertahankan.
function CountUp({ value }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const str = String(value);
  const m = str.match(/\d[\d,]*\.?\d*/);

  const numStr = m ? m[0] : '';
  const prefix = m ? str.slice(0, m.index) : '';
  const suffix = m ? str.slice(m.index + numStr.length) : '';
  const target = m ? parseFloat(numStr.replace(/,/g, '')) : 0;
  const decimals = (numStr.split('.')[1] || '').length;
  const hasComma = numStr.includes(',');

  const build = (v) => {
    const body = hasComma
      ? v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
      : v.toFixed(decimals);
    return `${prefix}${body}${suffix}`;
  };

  const [display, setDisplay] = useState(() => (m && !REDUCED ? build(0) : str));

  useEffect(() => {
    if (!m || REDUCED || !inView) return undefined;
    let raf = 0;
    let t0;
    const step = (t) => {
      if (t0 === undefined) t0 = t;
      const p = Math.min((t - t0) / 1400, 1);
      setDisplay(build(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <span ref={ref} className="tabular-nums" aria-label={str}>
      {display}
    </span>
  );
}

// Mengetik dan menghapus kalimat secara bergantian
function useTypewriter(phrases) {
  const [text, setText] = useState(REDUCED ? phrases[0] : '');
  useEffect(() => {
    if (REDUCED) return undefined;
    let i = 0;
    let j = 0;
    let deleting = false;
    let timer;
    const tick = () => {
      const word = phrases[i];
      if (!deleting) {
        j += 1;
        setText(word.slice(0, j));
        if (j === word.length) {
          deleting = true;
          timer = setTimeout(tick, 1600);
          return;
        }
        timer = setTimeout(tick, 60);
      } else {
        j -= 1;
        setText(word.slice(0, j));
        if (j === 0) {
          deleting = false;
          i = (i + 1) % phrases.length;
          timer = setTimeout(tick, 350);
          return;
        }
        timer = setTimeout(tick, 28);
      }
    };
    timer = setTimeout(tick, 1100);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return text;
}

// Memecah teks jadi huruf-huruf yang muncul berurutan
function SplitText({ text, start = 0 }) {
  return (
    <span aria-hidden="true">
      {[...text].map((c, i) => (
        <span key={i} className="letter" style={{ animationDelay: `${start + i * 55}ms` }}>
          {c}
        </span>
      ))}
    </span>
  );
}

// Pita teknologi yang bergeser terus
function Marquee({ items, reverse = false }) {
  const row = [...items, ...items];
  return (
    <div
      className="marquee-wrap overflow-hidden"
      style={{
        WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
        maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
      }}
    >
      <div className={`marquee-track ${reverse ? 'marquee-rev' : ''}`}>
        {row.map((t, i) => (
          <span key={`${t}-${i}`} className="marquee-item" aria-hidden={i >= items.length ? 'true' : undefined}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

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
      <span className="absolute left-6 bottom-5 f-display text-3xl font-bold text-white leading-none">
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
  const zoom = 'transition-transform duration-700 ease-out group-hover:scale-105';
  return (
    <div className="relative h-48 w-full overflow-hidden bg-black/20">
      {!first && <Cover project={project} className={`h-full w-full ${zoom}`} />}
      {first && first.type === 'image' && (
        <img src={first.src} alt={project.title} className={`h-full w-full object-cover object-top ${zoom}`} />
      )}
      {first && first.type === 'video' && <VideoPreview src={first.src} className={`h-full w-full object-cover ${zoom}`} />}
      {project.badge && (
        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/55 backdrop-blur-sm border border-white/25 px-3 py-1 text-xs font-medium">
          <svg className="w-3.5 h-3.5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          {project.badge}
        </span>
      )}
    </div>
  );
}

// Galeri di halaman detail: gambar / video utama + panah kiri/kanan + keterangan + thumbnail
function MediaViewer({ project, media }) {
  const [active, setActive] = useState(0);
  const thumbsRef = useRef(null);
  const touchX = useRef(null);
  const count = media.length;
  const current = media[active];

  const go = (dir) => setActive((a) => (a + dir + count) % count);

  // Panah keyboard kiri/kanan
  useEffect(() => {
    if (count < 2) return undefined;
    const onKey = (e) => {
      const tag = e.target && e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') setActive((a) => (a + 1) % count);
      else if (e.key === 'ArrowLeft') setActive((a) => (a - 1 + count) % count);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [count]);

  // Thumbnail aktif selalu terlihat di tengah barisnya
  useEffect(() => {
    const box = thumbsRef.current;
    const el = box && box.children[active];
    if (!box || !el) return;
    box.scrollTo({ left: el.offsetLeft - (box.clientWidth - el.offsetWidth) / 2, behavior: REDUCED ? 'auto' : 'smooth' });
  }, [active]);

  if (count === 0) {
    const expected = (project.media || []).map((m) => (typeof m === 'string' ? m : m.file)).filter(Boolean);
    return (
      <div className="aspect-video w-full rounded-3xl border-2 border-dashed border-white/25 bg-white/[0.04] flex flex-col items-center justify-center gap-4 text-center p-8">
        <svg className="w-12 h-12 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zm0 11l4.5-4.5a1 1 0 011.4 0L14 15.5l2-2a1 1 0 011.4 0L21 17M9 9.5h.01" />
        </svg>
        <p className="f-display text-xl font-semibold">Preview coming soon</p>
        {IS_DEV && (
          <p className="text-sm text-white/70 max-w-xl leading-relaxed">
            {expected.length > 0 ? (
              <>
                Put <code className="px-1.5 py-0.5 rounded bg-white/10">{expected.join(', ')}</code> in{' '}
                <code className="px-1.5 py-0.5 rounded bg-white/10">src/assets/</code>.
              </>
            ) : (
              <>
                Add file names to this project&apos;s <code className="px-1.5 py-0.5 rounded bg-white/10">media</code> array and
                put the files in <code className="px-1.5 py-0.5 rounded bg-white/10">src/assets/</code>.
              </>
            )}{' '}
            This hint only shows while developing.
          </p>
        )}
      </div>
    );
  }

  const arrow =
    'absolute top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-sm border border-white/30 transition-colors';

  return (
    <div>
      <div
        className="relative aspect-video w-full rounded-3xl overflow-hidden bg-black/30 border border-white/15"
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchX.current === null || count < 2) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        }}
      >
        {current.type === 'video' ? (
          <video key={current.src} src={current.src} controls playsInline preload="metadata" className="fade-in w-full h-full object-contain" />
        ) : (
          <img key={current.src} src={current.src} alt={current.caption || `${project.title}, image ${active + 1}`} className="fade-in w-full h-full object-contain" />
        )}

        {count > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous image" className={`${arrow} left-3`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next image" className={`${arrow} right-3`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <span className="absolute top-3 right-3 z-10 rounded-full bg-black/55 backdrop-blur-sm border border-white/25 px-3 py-1 text-xs tabular-nums">
              {active + 1} / {count}
            </span>
          </>
        )}
      </div>

      {current.caption && (
        <p className="mt-3 text-sm text-white/70 leading-relaxed" aria-live="polite">
          {current.caption}
        </p>
      )}

      {count > 1 && (
        <div ref={thumbsRef} className="relative flex gap-3 mt-4 overflow-x-auto pb-1">
          {media.map((m, i) => (
            <button
              key={m.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={m.caption || `Show ${m.type} ${i + 1}`}
              aria-pressed={i === active}
              className={`relative shrink-0 w-28 h-20 rounded-xl overflow-hidden border transition-all duration-300 ${
                i === active ? 'border-white scale-105' : 'border-white/20 opacity-70 hover:opacity-100'
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
                <img src={m.src} alt="" className="w-full h-full object-cover object-top" />
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

function ExternalIcon() {
  return (
    <svg className="w-4 h-4 shrink-0 opacity-80 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M9 7h8v8" />
    </svg>
  );
}

function ProjectCard({ project, onOpen }) {
  const ref = useRef(null);
  const media = getProjectMedia(project);
  const shownTech = project.tech.slice(0, 4);
  const extra = project.tech.length - shownTech.length;

  // Efek miring 3D halus mengikuti kursor (dinonaktifkan di layar sentuh)
  const onMove = (e) => {
    if (REDUCED || e.pointerType === 'touch') return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${(0.5 - py) * 6}deg`);
    el.style.setProperty('--ry', `${(px - 0.5) * 8}deg`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onOpen(project)}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="tilt group flex flex-col h-full w-full text-left rounded-3xl overflow-hidden bg-white/[0.07] backdrop-blur-md border border-white/15 hover:bg-white/[0.12] hover:border-white/35"
    >
      <CardMedia project={project} media={media} />
      <span className="flex flex-col flex-1 p-5">
        <span className="text-sm text-white/70 mb-1">
          {project.category}
          {project.company ? ` at ${project.company}` : ''}
        </span>
        <span className="f-display text-lg font-bold mb-2">{project.title}</span>
        <span className="text-sm text-white/80 leading-relaxed mb-4">{project.summary}</span>

        {project.highlights.length > 0 && (
          <span className="flex flex-wrap gap-x-7 gap-y-3 mb-4">
            {project.highlights.slice(0, 2).map((h) => (
              <span key={h.label} className="max-w-[9.5rem]">
                <span className="block f-display text-xl font-bold leading-none mb-1">
                  <CountUp value={h.value} />
                </span>
                <span className="block text-xs text-white/65">{h.label}</span>
              </span>
            ))}
          </span>
        )}

        <span className="flex flex-wrap gap-2 mb-4">
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

// Daftar skill yang bisa dilipat (supaya kartu pengalaman tidak terlalu panjang)
function ExperienceSkills({ skills, initial = 8 }) {
  const [open, setOpen] = useState(false);
  const shown = open ? skills : skills.slice(0, initial);
  const hidden = skills.length - initial;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {shown.map((s) => (
        <Chip key={s}>{s}</Chip>
      ))}
      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="px-3 py-1 rounded-full border border-dashed border-white/35 text-white/80 hover:bg-white/10 text-xs transition-colors"
        >
          {open ? 'Show less' : `+${hidden} more`}
        </button>
      )}
    </div>
  );
}

// Tombol "Email me": memilih Gmail atau Outlook, lalu membuka layar tulis email di tab baru
function EmailMenu() {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const options = [
    {
      label: 'Gmail',
      address: EMAIL_GMAIL,
      href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL_GMAIL)}`,
    },
    {
      label: 'Outlook',
      address: EMAIL_OUTLOOK,
      href: `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(EMAIL_OUTLOOK)}`,
    },
  ].filter((o) => o.address);

  if (options.length === 0) return null;

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="btn-shine inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0b1024] font-semibold rounded-full hover:bg-white/90 transition-colors"
      >
        Email me
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="fade-in absolute left-1/2 -translate-x-1/2 top-full mt-2 z-20 w-72 rounded-2xl bg-[#141a36] border border-white/25 shadow-xl shadow-black/40 p-2 text-left"
        >
          {options.map((o) => (
            <a
              key={o.label}
              role="menuitem"
              href={o.href}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="group flex items-center justify-between gap-3 rounded-xl px-4 py-3 hover:bg-white/10 transition-colors"
            >
              <span>
                <span className="block text-sm font-semibold">{o.label}</span>
                <span className="block text-xs text-white/65 break-all">{o.address}</span>
              </span>
              <ExternalIcon />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// Pengalaman kerja (timeline) + sertifikat
function ExperienceSection() {
  return (
    <section id="experience" className={`${PAD} py-20 scroll-mt-20`}>
      <div className={WRAP}>
        <Reveal className="mb-10 max-w-2xl">
          <h2 className="f-display text-2xl sm:text-3xl font-bold tracking-tight mb-2">Work experience</h2>
          <p className="text-white/75 text-base sm:text-lg">
            Building real business systems alongside my AI work: ERP modules, messaging backends, and logistics operations.
          </p>
        </Reveal>

        <ol className="relative border-l border-white/20 ml-3 space-y-8">
          {experiences.map((e, i) => {
            const fileUrl = e.file ? getAsset(e.file) : undefined;
            return (
              <li key={e.id} className="relative ml-6">
                <span
                  aria-hidden="true"
                  className={`absolute -left-[1.9rem] top-7 w-3 h-3 rounded-full border-2 border-white/60 ${
                    e.current ? 'bg-emerald-300' : 'bg-[#101730]'
                  }`}
                />
                <Reveal delay={i * 80}>
                  <div className="rounded-3xl bg-white/[0.07] backdrop-blur-md border border-white/15 p-5 sm:p-6 transition-colors duration-300 hover:bg-white/[0.11]">
                    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1 mb-2">
                      <div>
                        <h3 className="f-display text-lg font-bold">{e.role}</h3>
                        <p className="text-white/85 text-sm">
                          {e.company} · {e.type}
                        </p>
                      </div>
                      <div className="text-sm text-white/65 sm:text-right">
                        <p className="flex items-center gap-2 sm:justify-end">
                          {e.current && (
                            <span className="rounded-full bg-emerald-400/15 border border-emerald-300/40 text-emerald-100 px-2 py-0.5 text-xs">
                              Current
                            </span>
                          )}
                          {e.period}
                        </p>
                        <p>{e.location}</p>
                      </div>
                    </div>

                    <p className="text-white/80 text-[15px] leading-relaxed mb-3">{e.summary}</p>

                    {e.points.length > 0 && (
                      <ul className="list-disc pl-5 space-y-1 text-white/80 text-[15px] leading-relaxed mb-4">
                        {e.points.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    )}

                    <ExperienceSkills skills={e.skills} />

                    {fileUrl && (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/30 hover:bg-white/20 px-4 py-2 text-sm font-semibold transition-colors"
                      >
                        {e.fileLabel || 'View document'} <ExternalIcon />
                      </a>
                    )}
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>

        {/* Sertifikat */}
        <Reveal className="mt-20 mb-8 max-w-2xl">
          <h2 className="f-display text-2xl sm:text-3xl font-bold tracking-tight mb-2">Licenses &amp; certifications</h2>
          <p className="text-white/75 text-base sm:text-lg">
            Formal proof of the internship and the AI fundamentals behind my projects.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-5">
          {certifications.map((c, i) => {
            const url = getAsset(c.file);
            return (
              <Reveal key={c.id} delay={i * 90} className="h-full">
                <div className="h-full flex flex-col rounded-3xl bg-white/[0.07] backdrop-blur-md border border-white/15 p-5 sm:p-6 transition-colors duration-300 hover:bg-white/[0.11]">
                  <p className="text-sm text-white/65 mb-1">
                    {c.issuer} · Issued {c.issued}
                  </p>
                  <h3 className="f-display text-lg font-bold mb-2">{c.title}</h3>
                  <p className="text-white/80 text-[15px] leading-relaxed mb-4">{c.text}</p>
                  <div className="mb-5">
                    <ExperienceSkills skills={c.skills} />
                  </div>
                  {url && (
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="group btn-shine mt-auto self-start inline-flex items-center gap-2 rounded-full bg-white text-[#0b1024] hover:bg-white/90 px-4 py-2 text-sm font-semibold transition-colors"
                    >
                      Show credential <ExternalIcon />
                    </a>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const typed = useTypewriter(TYPED_PHRASES);

  useEffect(() => {
    document.title = selectedProject
      ? `${selectedProject.title} | Radianda Setiawan`
      : 'Radianda Setiawan | AI Developer & Software Engineer';
  }, [selectedProject]);

  // Progres scroll + parallax background (lewat CSS variable, tanpa re-render React)
  useEffect(() => {
    const root = document.documentElement;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = root.scrollHeight - window.innerHeight;
      root.style.setProperty('--progress', String(max > 0 ? Math.min(window.scrollY / max, 1) : 0));
      root.style.setProperty('--sy', String(window.scrollY));
      setScrolled((prev) => {
        const next = window.scrollY > 24;
        return prev === next ? prev : next;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Menandai menu navbar sesuai section yang sedang terlihat
  useEffect(() => {
    if (currentView !== 'home') {
      setActiveSection('');
      return undefined;
    }
    const ids = ['home', 'about', 'experience', 'ai-projects', 'software-projects', 'contact'];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [currentView]);

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
  const missingSocials = [
    !WHATSAPP && 'WHATSAPP',
    !LINE_ID && 'LINE_ID',
    !INSTAGRAM && 'INSTAGRAM',
  ].filter(Boolean);
  const detailMedia = selectedProject ? getProjectMedia(selectedProject) : [];
  const detailLinks = selectedProject ? getProjectLinks(selectedProject) : [];

  const navLinks = [
    { label: 'Home', id: 'home', match: ['home'], hideOnMobile: true },
    { label: 'About', id: 'about', match: ['about'] },
    { label: 'Experience', id: 'experience', match: ['experience'] },
    { label: 'Projects', id: 'ai-projects', match: ['ai-projects', 'software-projects'] },
    { label: 'Contact', id: 'contact', match: ['contact'] },
  ];

  const marqueeTop = [...skillGroups[0].items, ...skillGroups[1].items];
  const marqueeBottom = [...skillGroups[2].items, ...skillGroups[3].items, ...skillGroups[4].items];

  return (
    <div className="relative min-h-screen text-white f-body overflow-x-hidden">
      <style>{styles}</style>

      {/* Garis progres scroll */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 z-[60] h-[3px] w-full origin-left bg-gradient-to-r from-cyan-300 via-violet-300 to-pink-300"
        style={{ transform: 'scaleX(var(--progress, 0))' }}
      />

      {/* Background bergerak (dengan parallax halus saat scroll) */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-shift" aria-hidden="true">
        <div className="parallax-layer">
          <div className="orb" style={{ top: '-12%', left: '-10%', background: '#2f7280' }} />
          <div className="orb" style={{ bottom: '-15%', right: '-10%', background: '#6a5599', animationDelay: '-18s' }} />
        </div>
      </div>

      <div className="relative z-10">
        {/* Navbar */}
        <header className="fixed top-4 inset-x-0 z-50 px-4">
          <nav
            className={`mx-auto max-w-3xl flex items-center justify-between rounded-full backdrop-blur-xl border pl-5 pr-2 py-2 transition-all duration-500 ${
              scrolled ? 'bg-white/[0.14] border-white/30 shadow-lg shadow-black/30' : 'bg-white/[0.08] border-white/20'
            }`}
          >
            <button onClick={() => goTo('home')} className="f-display font-bold text-lg tracking-tight">
              Radianda
            </button>
            <div className="flex items-center gap-1 text-sm font-medium">
              {navLinks.map((l) => {
                const isActive = l.match.includes(activeSection);
                return (
                  <button
                    key={l.id}
                    onClick={() => goTo(l.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`${l.hideOnMobile ? 'hidden sm:inline-flex' : 'inline-flex'} px-3 sm:px-4 py-2 rounded-full transition-colors duration-300 ${
                      isActive ? 'bg-white/20 text-white' : 'text-white/80 hover:text-white hover:bg-white/15'
                    }`}
                  >
                    {l.label}
                  </button>
                );
              })}
            </div>
          </nav>
        </header>

        {/* ============ HALAMAN UTAMA ============ */}
        {currentView === 'home' && (
          <main>
            {/* Hero */}
            <section id="home" className={`${PAD} pt-32 pb-20 min-h-screen flex items-center`}>
              <div className={`${WRAP} grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center`}>
                <div className="text-center lg:text-left">
                  <div className="rise inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-sm text-white/90 mb-7">
                    <span className="relative flex w-2 h-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-70 animate-ping" />
                      <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-300" />
                    </span>
                    Open to internships and collaborations
                  </div>

                  <h1
                    aria-label="Radianda Setiawan"
                    className="f-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight mb-5"
                  >
                    <span className="block">
                      <SplitText text="Radianda" start={150} />
                    </span>
                    <span className="block">
                      <SplitText text="Setiawan" start={650} />
                    </span>
                  </h1>

                  <h2 className="rise rise-3 f-display text-xl sm:text-2xl font-medium text-white/85 mb-3">
                    AI Developer &amp; Software Engineer
                  </h2>

                  <p className="rise rise-3 text-base sm:text-lg text-white/70 mb-5 min-h-[3rem] sm:min-h-[1.75rem]">
                    I build <span className="text-white font-medium">{typed}</span>
                    <span className="caret" aria-hidden="true" />
                  </p>

                  <p className="rise rise-3 text-white/80 text-base sm:text-lg leading-relaxed mb-9 max-w-xl mx-auto lg:mx-0">
                    A Computer Science student focusing on full-stack web architecture and Artificial Intelligence. I specialize in turning complex algorithms into clean, efficient, and interactive software solutions.
                  </p>

                  <div className="rise rise-4 flex flex-wrap gap-3 justify-center lg:justify-start">
                    <button
                      onClick={() => goTo('ai-projects')}
                      className="btn-shine px-7 py-3 bg-white text-[#0b1024] font-semibold rounded-full hover:bg-white/90 transition-colors"
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
                  <div className="float relative w-56 h-56 sm:w-64 sm:h-64 lg:w-80 lg:h-80 shrink-0">
                    <div className="blob blob-rev absolute inset-0 translate-x-4 translate-y-4 border-2 border-white/30" />
                    <div className="blob relative w-full h-full overflow-hidden bg-white/10 border border-white/30">
                      {PROFILE_PHOTO ? (
                        <img src={PROFILE_PHOTO} alt="Radianda Setiawan" className="w-full h-full object-cover object-center" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center f-display text-7xl font-bold text-white/85">
                          RS
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Pita teknologi */}
            <section aria-label="Tools and technologies" className="py-6 space-y-3">
              <Marquee items={marqueeTop} />
              <Marquee items={marqueeBottom} reverse />
            </section>

            {/* About / skills */}
            <section id="about" className={`${PAD} py-20 scroll-mt-20`}>
              <div className={`${WRAP} grid lg:grid-cols-[1fr_1.6fr] gap-10 items-start`}>
                <Reveal>
                  <h2 className="f-display text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                    Bridging AI research and software engineering
                  </h2>
                  <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-lg">
                    I specialize in the end-to-end lifecycle of an AI product. On one side, I design, train, and rigorously evaluate machine learning models—spanning NLP, computer vision, and predictive analytics. On the other, I architect the robust backend APIs and responsive web interfaces that bring them to life. I don't just build models that sit in notebooks; I transform them into scalable, real-time applications that solve actual problems for real users.
                  </p>
                </Reveal>

                <div className="grid sm:grid-cols-2 gap-4">
                  {skillGroups.map((g, i) => (
                    <Reveal
                      key={g.title}
                      delay={i * 90}
                      className={i === skillGroups.length - 1 && skillGroups.length % 2 === 1 ? 'sm:col-span-2' : ''}
                    >
                      <div className="h-full rounded-3xl bg-white/[0.07] backdrop-blur-md border border-white/15 p-5 transition-colors duration-300 hover:bg-white/[0.11]">
                        <h3 className="f-display text-base font-bold mb-3">{g.title}</h3>
                        <div className="flex flex-wrap gap-2">
                          {g.items.map((item) => (
                            <Chip key={item}>{item}</Chip>
                          ))}
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>

            {/* Experience & certifications */}
            <ExperienceSection />

            {/* Projects: dipisah AI dan Software */}
            <section id="projects" className={`${PAD} py-20`}>
              <div className={`${WRAP} space-y-24`}>
                {sections.map((s) => (
                  <div key={s.id} id={s.id} className="scroll-mt-24">
                    <Reveal className="mb-8 max-w-2xl">
                      <h2 className="f-display text-2xl sm:text-3xl font-bold tracking-tight mb-2">{s.title}</h2>
                      <p className="text-white/75 text-base sm:text-lg">{s.text}</p>
                    </Reveal>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {projects
                        .filter((p) => p.group === s.group)
                        .map((p, i) => (
                          <Reveal key={p.id} delay={(i % 3) * 100} className="h-full">
                            <ProjectCard project={p} onOpen={openProject} />
                          </Reveal>
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
          <main key={selectedProject.id} className={`page-in ${PAD} pt-28 pb-20 min-h-screen`}>
            <div className={WRAP}>
              <button
                onClick={() => goTo(backTarget)}
                className="group inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 px-4 py-2 mb-8 text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {backLabel}
              </button>

              <div className="max-w-3xl mb-8">
                {selectedProject.badge && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 border border-emerald-300/40 text-emerald-100 px-3.5 py-1 text-sm font-medium mb-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    {selectedProject.badge}
                  </span>
                )}
                <h1 className="f-display text-3xl md:text-5xl font-bold tracking-tight leading-[1.08] mb-4">
                  {selectedProject.title}
                </h1>
                <p className="text-white/80 text-base sm:text-lg leading-relaxed">{selectedProject.summary}</p>
              </div>

              {/* Gambar / video */}
              <MediaViewer key={selectedProject.id} project={selectedProject} media={detailMedia} />

              <div className="mt-12 grid lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-10 xl:gap-14 items-start">
                {/* Kolom kiri: cerita */}
                <div>
                  <Reveal>
                    <h2 className="f-display text-xl font-bold mb-3">Overview</h2>
                    <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-10">{selectedProject.overview}</p>
                  </Reveal>

                  <Reveal>
                    <h2 className="f-display text-xl font-bold mb-3">{selectedProject.pointsHeading}</h2>
                  </Reveal>
                  <div className="divide-y divide-white/15 rounded-3xl bg-white/[0.07] backdrop-blur-md border border-white/15 overflow-hidden">
                    {selectedProject.points.map((pt, i) => (
                      <Reveal key={pt.title} delay={Math.min(i, 3) * 60}>
                        <div className="p-5 sm:p-6 transition-colors duration-300 hover:bg-white/[0.05]">
                          <h3 className="f-display text-base font-bold mb-1.5">{pt.title}</h3>
                          <p className="text-white/80 text-[15px] leading-relaxed">{pt.text}</p>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>

                {/* Kolom kanan: ringkasan */}
                <aside className="space-y-5">
                  <dl className="rounded-3xl bg-white/[0.07] backdrop-blur-md border border-white/15 p-5 space-y-4">
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
                    {selectedProject.team && (
                      <div>
                        <dt className="text-white/65 text-sm mb-0.5">Team</dt>
                        <dd className="font-semibold">{selectedProject.team}</dd>
                      </div>
                    )}
                    {selectedProject.company && (
                      <div>
                        <dt className="text-white/65 text-sm mb-0.5">Company</dt>
                        <dd className="font-semibold">{selectedProject.company}</dd>
                      </div>
                    )}
                    {selectedProject.contribution && (
                      <div>
                        <dt className="text-white/65 text-sm mb-0.5">My contribution</dt>
                        <dd className="text-white/90 text-[15px] leading-relaxed">{selectedProject.contribution}</dd>
                      </div>
                    )}
                  </dl>

                  {detailLinks.length > 0 && (
                    <div className="space-y-2">
                      {detailLinks.map((l) => (
                        <a
                          key={l.label}
                          href={l.url}
                          target="_blank"
                          rel="noreferrer"
                          className={`group flex items-center justify-between gap-3 px-5 py-3 rounded-2xl text-sm font-semibold transition-colors ${
                            l.primary
                              ? 'btn-shine bg-white text-[#0b1024] hover:bg-white/90'
                              : 'bg-white/[0.08] border border-white/25 hover:bg-white/[0.16]'
                          }`}
                        >
                          <span>{l.label}</span>
                          <ExternalIcon />
                        </a>
                      ))}
                    </div>
                  )}

                  {selectedProject.highlights.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      {selectedProject.highlights.map((h, i) => (
                        <Reveal key={h.label} delay={i * 80}>
                          <div className="h-full rounded-2xl bg-white/[0.07] border border-white/15 p-4">
                            <p className="f-display text-2xl font-bold leading-none mb-2">
                              <CountUp value={h.value} />
                            </p>
                            <p className="text-sm text-white/70 leading-snug">{h.label}</p>
                          </div>
                        </Reveal>
                      ))}
                    </div>
                  )}

                  <div className="rounded-3xl bg-white/[0.07] backdrop-blur-md border border-white/15 p-5">
                    <h2 className="f-display text-base font-bold mb-3">Tech stack</h2>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tech.map((t) => (
                        <Chip key={t}>{t}</Chip>
                      ))}
                    </div>
                  </div>
                </aside>
              </div>

              {/* Proyek berikutnya (dalam kelompok yang sama) */}
              {nextProject && (
                <Reveal className="mt-16">
                  <button
                    onClick={() => openProject(nextProject)}
                    className="group w-full text-left flex items-center justify-between gap-4 rounded-3xl bg-white/[0.07] backdrop-blur-md border border-white/15 hover:bg-white/[0.12] hover:border-white/35 transition-colors p-5 sm:p-6"
                  >
                    <span>
                      <span className="block text-sm text-white/65 mb-1">Next project</span>
                      <span className="block f-display text-lg sm:text-xl font-bold">{nextProject.title}</span>
                    </span>
                    <ArrowRight />
                  </button>
                </Reveal>
              )}
            </div>
          </main>
        )}

        {/* ============ KONTAK ============ */}
        <section id="contact" className={`${PAD} py-20 scroll-mt-20`}>
          <Reveal>
            <div className="mx-auto max-w-3xl rounded-[2rem] bg-white/[0.07] backdrop-blur-md border border-white/20 px-6 py-12 sm:px-12 text-center">
              <h2 className="f-display text-3xl sm:text-4xl font-bold tracking-tight mb-4">Let&apos;s connect.</h2>
              <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-9 max-w-xl mx-auto">
                I&apos;m currently open to new opportunities, internships, and interesting collaborations. If you&apos;re working on something exciting, I&apos;d love to hear about it.
              </p>

              <div className="flex flex-wrap gap-3 justify-center">
                <EmailMenu />
                {visibleSocials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 border border-white/35 font-semibold rounded-full hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <SocialIcon name={s.icon} />
                    {s.label}
                  </a>
                ))}
              </div>

              {IS_DEV && missingSocials.length > 0 && (
                <p className="mt-6 text-xs text-white/50">
                  Dev hint: fill in {missingSocials.join(', ')} at the top of App.jsx to show those buttons. This hint only shows while developing.
                </p>
              )}
            </div>
          </Reveal>

          <p className="text-white/60 text-sm text-center mt-10">
            © 2026 Radianda Setiawan. Built with React &amp; Tailwind CSS.
          </p>
        </section>
      </div>
    </div>
  );
}