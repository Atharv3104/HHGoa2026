/**
 * FrameInGoa - Hacker Goa House 2026 Config & Default State
 */

const APP_CONFIG = {
  appName: "FrameInGoa",
  eventTitle: "HACKER GOA HOUSE",
  tagline: "Official Hacker Goa House 2026 ID Generator",
  eventYear: "2026",
  eventDates: "28 - 31 OCT 2026",
  location: "Goa, India",
  domain: "www.hhgoa.com",
  officialEmail: "247pmstudio@gmail.com",
  defaultTheme: "emerald-tropic",
  
  // Builder Titles (Capsules)
  builderTitles: [
    "CODE WIZARD",
    "FULL-STACK LEGEND",
    "AI ALCHEMIST",
    "DEV-OPS NINJA",
    "WEB3 ARCHITECT",
    "CYBER GUARDIAN",
    "UI/UX WIZARD",
    "SYSTEMS HACKER",
    "SOLANA BUILDER",
    "BYTE PRODIGY"
  ],

  // Tech Stack Options
  techStacks: [
    { id: "react", name: "React", category: "Frontend" },
    { id: "nextjs", name: "Next.js", category: "Frontend" },
    { id: "vue", name: "Vue.js", category: "Frontend" },
    { id: "node", name: "Node.js", category: "Backend" },
    { id: "python", name: "Python", category: "Backend/AI" },
    { id: "ml", name: "Machine Learning", category: "AI" },
    { id: "tensorflow", name: "TensorFlow", category: "AI" },
    { id: "aws", name: "AWS Cloud", category: "Cloud" },
    { id: "docker", name: "Docker", category: "Cloud/DevOps" },
    { id: "flutter", name: "Flutter", category: "Mobile" },
    { id: "react-native", name: "React Native", category: "Mobile" },
    { id: "solidity", name: "Solidity", category: "Web3" },
    { id: "web3", name: "Web3.js", category: "Web3" },
    { id: "cyber", name: "Cyber Security", category: "Security" },
    { id: "figma", name: "Figma UI/UX", category: "Design" },
    { id: "mongodb", name: "MongoDB", category: "Backend" },
    { id: "postgres", name: "PostgreSQL", category: "Backend" },
    { id: "rust", name: "Rust", category: "Systems" },
    { id: "cpp", name: "C++", category: "Systems" }
  ],

  // Builder Class Rule Definitions
  builderClassRules: [
    {
      name: "CODE WIZARD",
      badge: "CODE WIZARD",
      color: "#FFE600",
      gradient: "linear-gradient(135deg, #FFE600, #FF007A)",
      condition: (stacks) => stacks.some(s => ["react", "node", "nextjs"].includes(s))
    },
    {
      name: "AI ALCHEMIST",
      badge: "AI ALCHEMIST",
      color: "#a855f7",
      gradient: "linear-gradient(135deg, #a855f7, #ec4899)",
      condition: (stacks) => stacks.some(s => ["python", "ml", "tensorflow"].includes(s))
    },
    {
      name: "FULL-STACK LEGEND",
      badge: "FULL-STACK LEGEND",
      color: "#06b6d4",
      gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)",
      condition: (stacks) => 
        stacks.some(s => ["react", "nextjs", "vue"].includes(s)) && 
        stacks.some(s => ["node", "python", "mongodb", "postgres"].includes(s))
    },
    {
      name: "DEV-OPS NINJA",
      badge: "DEV-OPS NINJA",
      color: "#0ea5e9",
      gradient: "linear-gradient(135deg, #0ea5e9, #6366f1)",
      condition: (stacks) => stacks.some(s => ["aws", "docker"].includes(s))
    },
    {
      name: "WEB3 ARCHITECT",
      badge: "WEB3 ARCHITECT",
      color: "#f59e0b",
      gradient: "linear-gradient(135deg, #f59e0b, #eab308)",
      condition: (stacks) => stacks.some(s => ["solidity", "web3"].includes(s))
    },
    {
      name: "CYBER GUARDIAN",
      badge: "CYBER GUARDIAN",
      color: "#ef4444",
      gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
      condition: (stacks) => stacks.includes("cyber")
    },
    {
      name: "UI/UX WIZARD",
      badge: "UI/UX WIZARD",
      color: "#f43f5e",
      gradient: "linear-gradient(135deg, #f43f5e, #fb7185)",
      condition: (stacks) => stacks.includes("figma")
    },
    {
      name: "SYSTEMS HACKER",
      badge: "SYSTEMS HACKER",
      color: "#94a3b8",
      gradient: "linear-gradient(135deg, #64748b, #475569)",
      condition: (stacks) => stacks.some(s => ["rust", "cpp"].includes(s))
    },
    {
      name: "GOA BUILDER",
      badge: "CODE WIZARD",
      color: "#FFE600",
      gradient: "linear-gradient(135deg, #FFE600, #FF007A)",
      condition: () => true // Fallback
    }
  ],

  // Dynamic Frames Catalog
  defaultFrames: [
    {
      id: "frame1",
      name: "Tropical Forest Green 🌴 (Official)",
      theme: "emerald-tropic",
      bgColor: "#005A36",
      borderColor: "#FFE600",
      accentGlow: "rgba(255, 230, 0, 0.4)",
      badgeStyle: "gradient-green",
      isActive: true
    },
    {
      id: "frame2",
      name: "Goa Beach Sunset 🌅",
      theme: "goa-sunset",
      bgColor: "#1a0b2e",
      borderColor: "#FF007A",
      accentGlow: "rgba(255, 0, 122, 0.4)",
      badgeStyle: "gradient-sunset",
      isActive: true
    },
    {
      id: "frame3",
      name: "Cyber Neon Goa ⚡",
      theme: "cyber-neon",
      bgColor: "#090d16",
      borderColor: "#00f0ff",
      accentGlow: "rgba(0, 240, 255, 0.5)",
      badgeStyle: "gradient-neon",
      isActive: true
    },
    {
      id: "frame4",
      name: "Sunset Gold VIP ✨",
      theme: "gold-vip",
      bgColor: "#1c1917",
      borderColor: "#ffd700",
      accentGlow: "rgba(255, 215, 0, 0.4)",
      badgeStyle: "gradient-gold",
      isActive: true
    }
  ],

  // Gamification Scoring
  scoring: {
    generateCard: 10,
    shareX: 20,
    createTeam: 30,
    receiveLike: 50
  },

  // Multi-Language Support Translations
  translations: {
    en: {
      landingTitle: "Build Your Identity for Hacker House Goa 2026",
      generateBtn: "Generate Builder ID 🚀",
      exploreGallery: "View Community Gallery 🖼️",
      joinTeam: "Join / Create Squad 👥",
      welcomeMsg: "Welcome back",
      builderClass: "Builder Class",
      points: "Points",
      rank: "Rank",
      download: "Download PNG",
      shareX: "Share on X",
      copyLink: "Copy Public Link"
    },
    hi: {
      landingTitle: "हैकर हाउस गोवा 2026 के लिए अपनी बिल्डर आईडी बनाएं",
      generateBtn: "बिल्डर कार्ड बनाएं 🚀",
      exploreGallery: "कम्युनिटी गैलरी देखें 🖼️",
      joinTeam: "अपनी टीम बनाएं 👥",
      welcomeMsg: "नमस्ते",
      builderClass: "बिल्डर श्रेणी",
      points: "अंक",
      rank: "रैंक",
      download: "डाउनलोड करें",
      shareX: "X पर शेयर करें",
      copyLink: "लिंक कॉपी करें"
    },
    ga: {
      landingTitle: "हॅकर हाऊस गोंय 2026 खातीर तुमची बिल्डर आयडी तयार करात",
      generateBtn: "बिल्डर कार्ड तयार करात 🚀",
      exploreGallery: "समुदाय गॅलरी पळयात 🖼️",
      joinTeam: "तुमची पंगड तयार करात 👥",
      welcomeMsg: "येयात",
      builderClass: "बिल्डर वर्ग",
      points: "गुण",
      rank: "क्रमांक",
      download: "डाऊनलोड करात",
      shareX: "X चेर शेयर करात",
      copyLink: "लिंक कॉपी करात"
    }
  }
};
