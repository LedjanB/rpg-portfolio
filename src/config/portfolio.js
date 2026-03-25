import { YOUR_NAME, YOUR_TITLE } from "./player.js";

// ─── PORTFOLIO CONTENT ───────────────────────────────────────────
// Each key must match a building's `id`. Theme colors style the panel.
export const PORTFOLIO_CONTENT = {
  about: {
    theme: { accent: "#FF6B6B", bg: "#2a1a1aF0" },
    title: "⚔ PLAYER ONE",
    subtitle: YOUR_TITLE,
    stats: [
      { label: "CLASS", value: "Developer" },
      { label: "LEVEL", value: "Senior" },
      { label: "XP",    value: "5+ Years" },
      { label: "BASE",  value: "Your City" },
    ],
    text: `Hey there! I'm ${YOUR_NAME} — a developer who builds at the intersection of code and creativity. I love crafting polished user experiences and solving tricky problems.\n\nWhen I'm not shipping features, I'm exploring retro games, tinkering with creative coding, or learning something new.`,
  },
  projects: {
    theme: { accent: "#4ECDC4", bg: "#1a2a2aF0" },
    title: "📚 HIGH SCORES",
    items: [
      { name: "Project Alpha", desc: "Real-time collaboration platform with 10k+ MAU.", tech: ["React","Node.js","WebSocket","PostgreSQL"], stage: 1 },
      { name: "Project Beta",  desc: "AI-powered image generation tool with custom models.", tech: ["Python","PyTorch","FastAPI","Next.js"], stage: 2 },
      { name: "Project Gamma", desc: "Mobile e-commerce platform with AR try-on features.", tech: ["React Native","GraphQL","AWS","Stripe"], stage: 3 },
    ],
  },
  skills: {
    theme: { accent: "#FFE66D", bg: "#2a2a1aF0" },
    title: "🔥 POWER-UPS",
    categories: [
      { name: "FRONTEND", skills: [{ n: "React / Next.js", v: 95 },{ n: "TypeScript", v: 90 },{ n: "CSS / Tailwind", v: 92 },{ n: "Three.js", v: 75 }] },
      { name: "BACKEND",  skills: [{ n: "Node.js", v: 90 },{ n: "Python", v: 85 },{ n: "PostgreSQL", v: 88 },{ n: "GraphQL", v: 80 }] },
      { name: "DEVOPS",   skills: [{ n: "Git / GitHub", v: 95 },{ n: "Docker", v: 82 },{ n: "AWS / GCP", v: 78 },{ n: "CI/CD", v: 85 }] },
    ],
  },
  resume: {
    theme: { accent: "#95E86B", bg: "#1a2a1aF0" },
    title: "📜 QUEST LOG",
    jobs: [
      { role: "Senior Developer",    co: "TechCorp Inc.", period: "2022 – Present", desc: "Leading frontend architecture for a SaaS platform. Mentoring devs and driving design system adoption." },
      { role: "Full-Stack Developer", co: "StartupXYZ",   period: "2020 – 2022",    desc: "Built core product from zero to launch. Implemented real-time features, optimized perf 3x." },
      { role: "Junior Developer",     co: "AgencyName",   period: "2018 – 2020",    desc: "Delivered 20+ client projects. Leveled up fast across the full stack." },
    ],
    edu: { degree: "B.S. Computer Science", school: "University Name", year: "2018" },
  },
  contact: {
    theme: { accent: "#C77DFF", bg: "#2a1a2aF0" },
    title: "📡 SEND MESSAGE",
    text: "Ready to team up? I'm always open to new quests and collaborations!",
    links: [
      { icon: "✉️", label: "EMAIL",    value: "hello@youremail.com" },
      { icon: "🐙", label: "GITHUB",   value: "github.com/yourusername" },
      { icon: "🔗", label: "LINKEDIN", value: "linkedin.com/in/yourname" },
      { icon: "🐦", label: "TWITTER",  value: "@yourhandle" },
    ],
  },
  // ── New buildings ──
  observatory: {
    theme: { accent: "#7B9FFF", bg: "#1a1a2eF0" },
    title: "🔭 STAR MAP",
    subtitle: "Achievements & Certifications",
    achievements: [
      { name: "AWS Solutions Architect", org: "Amazon Web Services", year: "2023", icon: "☁️" },
      { name: "Google Cloud Professional", org: "Google", year: "2022", icon: "🌐" },
      { name: "Hackathon Winner", org: "HackCity 2023", year: "2023", icon: "🏆" },
      { name: "Open Source Contributor", org: "500+ contributions", year: "Ongoing", icon: "⭐" },
      { name: "Tech Speaker", org: "ReactConf, NodeSummit", year: "2021–2023", icon: "🎤" },
    ],
  },
  gallery: {
    theme: { accent: "#FF8C6B", bg: "#2a1a1aF0" },
    title: "🎨 ART GALLERY",
    items: [
      { name: "Brand Identity", desc: "Complete visual identity system for a tech startup.", tech: ["Figma","Illustrator","Motion"], stage: 1 },
      { name: "Dashboard UI", desc: "Analytics dashboard with real-time data visualization.", tech: ["Figma","D3.js","React"], stage: 2 },
      { name: "Mobile App Design", desc: "End-to-end UX design for a fitness tracking app.", tech: ["Sketch","Protopie","User Testing"], stage: 3 },
    ],
  },
  arcade: {
    theme: { accent: "#6BFFB8", bg: "#1a2a1aF0" },
    title: "🕹️ GAME ROOM",
    text: "When I'm not coding, you'll find me doing these things!",
    interests: [
      { icon: "🎮", name: "RETRO GAMING", desc: "NES, SNES, and indie pixel-art games" },
      { icon: "🎵", name: "MUSIC PRODUCTION", desc: "Making chiptune and lo-fi beats" },
      { icon: "📚", name: "SCI-FI BOOKS", desc: "Asimov, Philip K. Dick, and cyberpunk" },
      { icon: "🏃", name: "TRAIL RUNNING", desc: "Getting outdoors and clearing my head" },
    ],
  },
};
