/**
 * FrameInGoa - Dynamic Builder Class Engine
 * Rule-based classifier mapping selected tech stack tags to official Builder Classes & Badges
 */

class RuleEngine {
  /**
   * Evaluates tech stack IDs array and returns matching Builder Class details
   * @param {Array<string>} selectedTechIds 
   * @returns {Object} { name, badge, gradient, color }
   */
  static determineClass(selectedTechIds = []) {
    if (!Array.isArray(selectedTechIds) || selectedTechIds.length === 0) {
      return {
        name: "Hacker House Builder",
        badge: "🚀 HH Goa Builder",
        gradient: "linear-gradient(135deg, #ff5722, #ff9800)",
        color: "#ff5722",
        description: "Official Hacker House Goa 2026 Participant"
      };
    }

    const rules = APP_CONFIG.builderClassRules;

    for (const rule of rules) {
      if (rule.condition(selectedTechIds)) {
        return {
          name: rule.name,
          badge: rule.badge,
          gradient: rule.gradient,
          color: rule.color,
          description: this.getClassDescription(rule.name)
        };
      }
    }

    return {
      name: "Hacker House Builder",
      badge: "🚀 HH Goa Builder",
      gradient: "linear-gradient(135deg, #ff5722, #ff9800)",
      color: "#ff5722",
      description: "Official Hacker House Goa 2026 Participant"
    };
  }

  static getClassDescription(className) {
    const map = {
      "AI Builder": "Specialized in Artificial Intelligence, Neural Networks, Machine Learning & Intelligent Agents.",
      "Full Stack Builder": "Master of Frontend UIs, Backend APIs, Databases & End-to-End Applications.",
      "Cloud Builder": "Expert in DevOps, Cloud Infrastructure, Docker, Kubernetes & Scalable Systems.",
      "Mobile Builder": "Crafting cross-platform mobile apps with Flutter, React Native & Native SDKs.",
      "Web3 Builder": "Pioneering Smart Contracts, Blockchain protocols, DeFi & Decentralized Tech.",
      "Cyber Security Builder": "Defending systems, penetration testing, cryptography & threat mitigation.",
      "UI/UX Architect": "Designing pixel-perfect user interfaces, design systems & seamless user flows.",
      "Systems Engineer": "Writing high-performance low-level code in Rust, C++ & OS Kernels."
    };
    return map[className] || "Hacker House Goa 2026 Innovator";
  }
}
