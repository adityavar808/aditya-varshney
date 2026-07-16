require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');

// Define Skill Schema inline for simplicity
const skillSchema = new mongoose.Schema({
  skillId:     { type: String, required: true, unique: true },
  name:        { type: String, required: true },
  tagline:     { type: String, required: true },
  glow:        { type: String, required: true },
  border:      { type: String, required: true },
  iconType:    { type: String, required: true },  // 'svg' or 'lucide'
  iconContent: { type: String, required: true }   // SVG markup or Lucide icon name
});

const Skill = mongoose.model('Skill', skillSchema);

const skillsData = [
  {
    skillId: "skill-java",
    name: "Java",
    tagline: "Robust object-oriented programming language for enterprise-grade backend applications.",
    glow: "rgba(228, 77, 38, 0.25)",
    border: "border-[#E44D26]/30",
    iconType: "svg",
    iconContent: '<path fill="#E44D26" d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/>'
  },
  {
    skillId: "skill-python",
    name: "Python",
    tagline: "High-level programming language for scientific computing and backend systems.",
    glow: "rgba(55, 118, 171, 0.25)",
    border: "border-[#3776AB]/30",
    iconType: "svg",
    iconContent: '<path d="M14.31.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.83l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.23l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05L0 11.97l.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.24l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05 1.07.13zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09-.33.22zM21.1 6.11l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01.21.03zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08-.33.23z" fill="#3776AB"/>'
  },
  {
    skillId: "skill-javascript",
    name: "JavaScript",
    tagline: "Dynamic scripting language powering interactive web applications and server-side runtimes.",
    glow: "rgba(247, 223, 30, 0.25)",
    border: "border-[#F7DF30]/30",
    iconType: "svg",
    iconContent: '<path fill="#F7DF1E" d="M0 0h24v24H0z"/><path d="M20.25 18.72c-.82 1.48-2.3 2.52-4.14 2.52-2.38 0-4-1.74-4-4h2.26c0 1.09.7 1.8 1.74 1.8 1 0 1.63-.52 1.63-1.84V9.83h2.51v7.35c0 1.13-.02 1.54-.02 1.54zM11.96 15c-.4 2-1.9 3.24-4.22 3.24-2.73 0-4.33-1.68-4.33-4.18H5.6c0 1.25.75 2 1.9 2a1.86 1.86 0 0 0 1.91-1.94c0-1.57-.93-2.14-2.58-2.85-2.07-.9-3.23-1.77-3.23-3.92 0-2.19 1.73-3.66 4.14-3.66a4.23 4.23 0 0 1 4.15 3.09h-2.2c-.37-1-1.07-1.39-1.9-1.39-1 0-1.71.6-1.71 1.61 0 .93.58 1.42 2.06 2.06 2.22.95 3.75 1.78 3.75 4.09z" fill="black"/>'
  },
  {
    skillId: "skill-html",
    name: "HTML",
    tagline: "Standard markup language used to structure web page content layouts.",
    glow: "rgba(227, 79, 38, 0.25)",
    border: "border-[#E34F26]/30",
    iconType: "svg",
    iconContent: '<path fill="#E34F26" d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0z"/><path fill="#EF652A" d="M12 2.2v19.5l6.8-2.2L20.2 4.4 12 2.2z"/><path fill="#EAEAEA" d="M12 9.6H8.5V6.1H12v3.5zm0 5.4H8.5V11.5H12V15z"/><path fill="white" d="M12 9.6h6.2l-.6 6.1-5.6 1.8V9.6zm0-3.5h6.6l-.3 3h-6.3v-3z"/>'
  },
  {
    skillId: "skill-css",
    name: "CSS",
    tagline: "Style sheet language used for designing responsive web interface layouts.",
    glow: "rgba(21, 114, 182, 0.25)",
    border: "border-[#1572B6]/30",
    iconType: "svg",
    iconContent: '<path fill="#1572B6" d="M1.5 0h21l-1.9 21.2L12 24l-8.6-2.8L1.5 0z"/><path fill="#33A9DC" d="M12 2.2v19.5l6.8-2.2L20.2 4.4 12 2.2z"/><path fill="#EAEAEA" d="M12 9.6H6.1l.3 3.5H12V9.6zm0 7.3l-4-.9-.2-2H6.1l.5 5 5.4 1.5v-3.6z"/><path fill="white" d="M12 9.6h6.2l-.6 6.1-5.6 1.8V9.6zm0-3.5h6.6l-.3 3h-6.3v-3z"/>'
  },
  {
    skillId: "skill-react",
    name: "React.js",
    tagline: "Declarative component-based library for building dynamic user interface layouts.",
    glow: "rgba(0, 216, 255, 0.25)",
    border: "border-[#00D8FF]/30",
    iconType: "svg",
    iconContent: '<circle cx="12" cy="12" r="2" fill="#00D8FF"/><g stroke="#00D8FF" stroke-width="1" fill="none"><ellipse rx="10" ry="4.5" cx="12" cy="12"/><ellipse rx="10" ry="4.5" cx="12" cy="12" transform="rotate(60 12 12)"/><ellipse rx="10" ry="4.5" cx="12" cy="12" transform="rotate(120 12 12)"/></g>'
  },
  {
    skillId: "skill-vite",
    name: "Vite",
    tagline: "Ultra-fast frontend build tool and dev server for modern applications.",
    glow: "rgba(189, 52, 254, 0.25)",
    border: "border-[#BD34FE]/30",
    iconType: "svg",
    iconContent: '<path fill="#BD34FE" d="M12 2L2 19.5h20L12 2z"/><path fill="#FFD600" d="M12 5.5l7.5 12H4.5L12 5.5z"/><path fill="#FF8D00" d="M12 7l6 9.5H6L12 7z"/>'
  },
  {
    skillId: "skill-mui",
    name: "Material UI",
    tagline: "Modern component library implementing Google's Material Design principles beautifully.",
    glow: "rgba(0, 127, 255, 0.25)",
    border: "border-[#007FFF]/30",
    iconType: "svg",
    iconContent: '<path fill="#007FFF" d="M0 2.475L12 9.2v13.6L0 16.075V2.475zm12-2.475L24 6.725v13.6L12 24V0z"/>'
  },
  {
    skillId: "skill-nodejs",
    name: "Node.js",
    tagline: "Cross-platform JavaScript runtime environment for high-performance backend systems.",
    glow: "rgba(51, 153, 51, 0.25)",
    border: "border-[#339933]/30",
    iconType: "svg",
    iconContent: '<path fill="#339933" d="M12 0L2.8 5.3v10.6L12 21.2l9.2-5.3V5.3L12 0zm-1.8 15.6V5.6l5.4 3.1-5.4 6.9z"/>'
  },
  {
    skillId: "skill-express",
    name: "Express.js",
    tagline: "Minimalist web framework for building fast RESTful APIs on Node.",
    glow: "rgba(128, 128, 128, 0.25)",
    border: "border-white/20",
    iconType: "svg",
    iconContent: '<path fill="#333" d="M0 0h24v24H0z"/><text x="2" y="15" fill="#FFFFFF" font-family="sans-serif" font-weight="bold" font-size="10">EX</text>'
  },
  {
    skillId: "skill-flask",
    name: "Flask",
    tagline: "Lightweight Python web framework for building efficient backend service endpoints.",
    glow: "rgba(255, 255, 255, 0.15)",
    border: "border-white/20",
    iconType: "svg",
    iconContent: '<path fill="none" stroke="white" stroke-width="2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>'
  },
  {
    skillId: "skill-rest",
    name: "REST APIs",
    tagline: "Architectural style for designing networked applications using HTTP protocol requests.",
    glow: "rgba(0, 216, 255, 0.25)",
    border: "border-[#00D8FF]/30",
    iconType: "svg",
    iconContent: '<rect x="2" y="2" width="20" height="20" rx="4" fill="none" stroke="#00D8FF" stroke-width="2"/><text x="4" y="14" fill="#00D8FF" font-family="monospace" font-size="7" font-weight="bold">REST</text>'
  },
  {
    skillId: "skill-mysql",
    name: "MySQL",
    tagline: "Relational database management system for structured data storage and querying.",
    glow: "rgba(0, 117, 143, 0.25)",
    border: "border-[#00758F]/30",
    iconType: "svg",
    iconContent: '<path fill="#00758F" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.3 11.2c-.3 1.5-1.5 2.7-3.1 3-1.6.3-3.2-.3-4-1.6l1.7-1c.5.7 1.3 1 2.2.8.9-.2 1.5-.9 1.6-1.8h-3.8v-2h5.8V12c0 .4-.2 1-.4 1.2z"/>'
  },
  {
    skillId: "skill-git",
    name: "Git",
    tagline: "Distributed version control system for tracking source code changes efficiently.",
    glow: "rgba(240, 80, 50, 0.25)",
    border: "border-[#F05032]/30",
    iconType: "svg",
    iconContent: '<path fill="#F05032" d="M23.3 10.9L13.1.7C12.7.3 12 .3 11.6.7L8.9 3.4l3.1 3.1c.4-.1.9 0 1.2.3.4.4.4 1 0 1.4-.4.4-1 .4-1.4 0-.3-.3-.4-.8-.3-1.2L8.4 3.9 1.1 11.2c-.4.4-.4 1 0 1.4L11.3 23c.4.4 1.1.4 1.5 0L23.3 12.3c.4-.4.4-1 0-1.4z"/>'
  },
  {
    skillId: "skill-github",
    name: "GitHub",
    tagline: "Cloud-based hosting service for Git repository collaboration and versioning.",
    glow: "rgba(255, 255, 255, 0.15)",
    border: "border-white/20",
    iconType: "svg",
    iconContent: '<path fill="white" d="M12 .3C5.4.3 0 5.7 0 12.4c0 5.3 3.5 9.9 8.3 11.5.6.1.8-.3.8-.6 0-.3 0-1.1 0-2.2-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1.1 1.9 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.3-3.2-.1-.3-.6-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C18 3 19 3.3 19 3.3c.7 1.6.2 2.8.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2 0 1.6 0 2.9 0 3.3 0 .3.2.7.8.6A12 12 0 0 0 24 12.4C24 5.7 18.6.3 12 .3z"/>'
  },
  {
    skillId: "skill-linux",
    name: "Linux",
    tagline: "Open-source operating system powering robust cloud environments and server infrastructures.",
    glow: "rgba(252, 198, 36, 0.25)",
    border: "border-[#FCC624]/30",
    iconType: "svg",
    iconContent: '<path fill="#FCC624" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>'
  },
  {
    skillId: "skill-ml",
    name: "Machine Learning",
    tagline: "Algorithms that enable computers to learn from training datasets autonomously.",
    glow: "rgba(182, 0, 168, 0.25)",
    border: "border-[#B600A8]/30",
    iconType: "svg",
    iconContent: '<rect x="2" y="2" width="20" height="20" rx="4" fill="none" stroke="#B600A8" stroke-width="2"/><path d="M7 17l5-10 5 10" stroke="#B600A8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  {
    skillId: "skill-dl",
    name: "Deep Learning",
    tagline: "Subfield of machine learning based on deep artificial neural networks.",
    glow: "rgba(182, 0, 168, 0.25)",
    border: "border-[#B600A8]/30",
    iconType: "svg",
    iconContent: '<circle cx="12" cy="12" r="10" fill="none" stroke="#B600A8" stroke-width="2"/><circle cx="8" cy="8" r="1.5" fill="#B600A8"/><circle cx="16" cy="8" r="1.5" fill="#B600A8"/><circle cx="12" cy="16" r="1.5" fill="#B600A8"/><path d="M8 8l4 8 4-8" stroke="#B600A8" stroke-width="1"/>'
  },
  {
    skillId: "skill-tensorflow",
    name: "TensorFlow",
    tagline: "Open-source library for building and training machine learning models.",
    glow: "rgba(255, 111, 0, 0.25)",
    border: "border-[#FF6F00]/30",
    iconType: "svg",
    iconContent: '<path d="M19.6 12l.1 4.7-3.1-1.8v6.7L12.5 24V0l10.2 5.9v5.3l-6.1-3.6v2.7zM1.3 5.9L11.5 0v24l-4.1-2.4v-14l-6.1 3.6z" fill="#FF6F00"/>'
  },
  {
    skillId: "skill-sklearn",
    name: "Scikit-learn",
    tagline: "Python library for predictive data analysis and classic machine learning.",
    glow: "rgba(55, 118, 171, 0.25)",
    border: "border-[#3776AB]/30",
    iconType: "svg",
    iconContent: '<rect x="2" y="2" width="20" height="20" rx="4" fill="none" stroke="#3776AB" stroke-width="2"/><circle cx="7" cy="7" r="2" fill="#F7DF1E"/><circle cx="17" cy="17" r="2" fill="#3776AB"/><line x1="7" y1="7" x2="17" y2="17" stroke="#3776AB" stroke-width="1.5"/>'
  },
  {
    skillId: "skill-opencv",
    name: "OpenCV",
    tagline: "Computer vision library for real-time image and video processing.",
    glow: "rgba(227, 26, 28, 0.25)",
    border: "border-[#E31A1C]/30",
    iconType: "svg",
    iconContent: '<circle cx="12" cy="7" r="4" fill="none" stroke="#E31A1C" stroke-width="2"/><circle cx="7" cy="15" r="4" fill="none" stroke="#33A02C" stroke-width="2"/><circle cx="17" cy="15" r="4" fill="none" stroke="#1F78B4" stroke-width="2"/>'
  },
  {
    skillId: "skill-llms",
    name: "Large Language Models (LLMs)",
    tagline: "Advanced AI models trained to understand and generate human text.",
    glow: "rgba(182, 0, 168, 0.25)",
    border: "border-[#B600A8]/30",
    iconType: "svg",
    iconContent: '<circle cx="12" cy="12" r="10" fill="none" stroke="#B600A8" stroke-width="2"/><path d="M8 12h8M12 8v8" stroke="#B600A8" stroke-width="2" stroke-linecap="round"/>'
  },
  {
    skillId: "skill-prompt",
    name: "Prompt Engineering",
    tagline: "Art of designing optimal inputs to guide generative AI outputs.",
    glow: "rgba(182, 0, 168, 0.25)",
    border: "border-[#B600A8]/30",
    iconType: "svg",
    iconContent: '<path fill="none" stroke="#B600A8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/><path d="M7.5 10h9M7.5 14h5" stroke="#B600A8" stroke-width="1.5" stroke-linecap="round"/>'
  },
  {
    skillId: "skill-agents",
    name: "AI Agents",
    tagline: "Autonomous systems designed to perform tasks using advanced artificial intelligence.",
    glow: "rgba(182, 0, 168, 0.25)",
    border: "border-[#B600A8]/30",
    iconType: "svg",
    iconContent: '<rect x="3" y="11" width="18" height="10" rx="2" fill="none" stroke="#B600A8" stroke-width="2"/><path d="M12 2v3M8 5h8M9 11V8h6v3M6 15h.01M18 15h.01" stroke="#B600A8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  {
    skillId: "skill-numpy",
    name: "NumPy",
    tagline: "Fundamental package for scientific computing with multi-dimensional arrays in Python.",
    glow: "rgba(1, 50, 67, 0.25)",
    border: "border-[#013243]/30",
    iconType: "svg",
    iconContent: '<rect x="2" y="2" width="20" height="20" rx="4" fill="none" stroke="#013243" stroke-width="2"/><path d="M6 6h12v12H6z" fill="#013243"/>'
  },
  {
    skillId: "skill-pandas",
    name: "Pandas",
    tagline: "Data analysis library providing high-performance data structures for Python.",
    glow: "rgba(21, 4, 88, 0.25)",
    border: "border-[#150458]/30",
    iconType: "svg",
    iconContent: '<circle cx="12" cy="12" r="10" fill="none" stroke="#150458" stroke-width="2"/><circle cx="8" cy="10" r="2" fill="#150458"/><circle cx="16" cy="10" r="2" fill="#150458"/><path d="M10 15s1 1 2 1 2-1 2-1" stroke="#150458" stroke-width="2" stroke-linecap="round"/>'
  },
  {
    skillId: "skill-oop",
    name: "Object-Oriented Programming (OOP)",
    tagline: "Programming paradigm based on the concept of objects and classes.",
    glow: "rgba(182, 0, 168, 0.25)",
    border: "border-[#B600A8]/30",
    iconType: "svg",
    iconContent: '<circle cx="6" cy="6" r="3" fill="#B600A8"/><circle cx="18" cy="18" r="3" fill="#B600A8"/><line x1="6" y1="6" x2="18" y2="18" stroke="#B600A8" stroke-width="2"/>'
  },
  {
    skillId: "skill-dsa",
    name: "Data Structures & Algorithms",
    tagline: "Core computer science principles for organizing and processing data efficiently.",
    glow: "rgba(182, 0, 168, 0.25)",
    border: "border-[#B600A8]/30",
    iconType: "svg",
    iconContent: '<rect x="2" y="2" width="6" height="6" rx="1" fill="#B600A8"/><rect x="16" y="2" width="6" height="6" rx="1" fill="#B600A8"/><rect x="9" y="16" width="6" height="6" rx="1" fill="#B600A8"/><line x1="5" y1="8" x2="12" y2="16" stroke="#B600A8" stroke-width="2"/><line x1="19" y1="8" x2="12" y2="16" stroke="#B600A8" stroke-width="2"/>'
  },
  {
    skillId: "skill-dbms",
    name: "DBMS",
    tagline: "Software system used to create, manage, and retrieve databases securely.",
    glow: "rgba(0, 216, 255, 0.25)",
    border: "border-[#00D8FF]/30",
    iconType: "svg",
    iconContent: '<path d="M12 2C6.48 2 2 4.24 2 7v10c0 2.76 4.48 5 10 5s10-2.24 10-5V7c0-2.76-4.48-5-10-5z" fill="none" stroke="#00D8FF" stroke-width="2"/><path d="M2 12c0 2.76 4.48 5 10 5s10-2.24 10-5M2 7c0 2.76 4.48 5 10 5s10-2.24 10-5" fill="none" stroke="#00D8FF" stroke-width="2"/>'
  },
  {
    skillId: "skill-pytorch",
    name: "PyTorch",
    tagline: "Deep learning framework for building complex neural network architectures.",
    glow: "rgba(238, 76, 44, 0.25)",
    border: "border-[#EE4C2C]/30",
    iconType: "svg",
    iconContent: '<path d="M12.005.04l-7.03 7.03a9.832 9.832 0 0 0 0 13.975 9.833 9.833 0 0 0 13.976 0c3.97-3.887 3.972-10.171.084-13.976l-1.738 1.737c2.895 2.895 2.895 7.608 0 10.503-2.894 2.894-7.608 2.894-10.503 0C3.9 16.414 3.9 11.7 6.794 8.806l4.632-4.631.58-.663z" fill="#EE4C2C"/>'
  },
  {
    skillId: "skill-fastapi",
    name: "FastAPI",
    tagline: "High-performance framework for building modern APIs with Python asynchronously.",
    glow: "rgba(5, 150, 105, 0.25)",
    border: "border-[#059669]/30",
    iconType: "svg",
    iconContent: '<circle cx="12" cy="12" r="10" fill="#009485"/><path d="M13 6l-6 7h5v5l6-7h-5z" fill="white"/>'
  }
];

const runMigration = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected successfully. Dropping existing skills collection...");
    await Skill.deleteMany({});
    console.log("Existing skills dropped. Inserting new verified list of 31 skills...");
    await Skill.insertMany(skillsData);
    console.log("Skills seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  }
};

runMigration();
