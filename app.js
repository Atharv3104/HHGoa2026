/**
 * FrameInGoa - Main Application Launcher & SPA Router
 * Official Hacker Goa House 2026 Graphic Generator
 */

const App = {
  state: {
    currentView: "generator",
    currentParams: {},
    currentUser: null,
    currentTheme: "emerald-tropic",
    currentLang: "en"
  },

  init() {
    this.applyTheme(this.state.currentTheme);
    this.render();
  },

  navigateTo(viewName, params = {}) {
    this.state.currentView = viewName;
    this.state.currentParams = params;
    
    if (params.mode && GeneratorView && GeneratorView.state) {
      GeneratorView.state.formatMode = params.mode;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    this.render();
  },

  applyTheme(themeName) {
    document.body.setAttribute("data-theme", themeName);
  },

  showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'warning' ? 'fa-exclamation-triangle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle'}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  },

  render() {
    const appEl = document.getElementById("app");
    if (!appEl) return;

    appEl.innerHTML = `
      <!-- Top Navigation Bar -->
      <header class="main-header">
        <div class="header-brand" onclick="App.navigateTo('landing')">
          <div class="brand-logo">🌴</div>
          <div>
            <span class="brand-title">FrameIn<span class="gradient-text">Goa</span></span>
            <span class="brand-sub">Hacker Goa House 2026</span>
          </div>
        </div>

        <nav class="nav-links">
          <a class="nav-link ${this.state.currentView === 'landing' ? 'active' : ''}" onclick="App.navigateTo('landing')">Home</a>
          <a class="nav-link ${this.state.currentView === 'generator' ? 'active' : ''}" onclick="App.navigateTo('generator')">Generate Card</a>
        </nav>
      </header>

      <!-- Main Body View Container -->
      <main class="main-content">
        ${this.renderCurrentView()}
      </main>

      <!-- Main Footer -->
      <footer class="main-footer">
        <div class="footer-container">
          <p>© 2026 Hacker Goa House • Powered by <strong>FrameInGoa</strong> • Official #FrameInGoa Shortlisting Generator</p>
        </div>
      </footer>
    `;

    if (this.state.currentView === "generator" && GeneratorView.mounted) {
      setTimeout(() => GeneratorView.mounted(), 50);
    }
  },

  renderCurrentView() {
    switch (this.state.currentView) {
      case "landing":
        return LandingView.render();
      case "generator":
        return GeneratorView.render();
      default:
        return GeneratorView.render();
    }
  }
};

// Initialize App on DOM Ready
document.addEventListener("DOMContentLoaded", () => App.init());
