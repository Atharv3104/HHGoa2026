/**
 * FrameInGoa - Landing Page View
 * Official Hacker Goa House 2026 ID Generator
 */

const LandingView = {
  render() {
    return `
      <div class="landing-hero">

        
        <h1 class="hero-title">
          Hacker Goa House <br>
          <span class="gradient-text">ID &amp; Team Frame Generator</span>
        </h1>
        


        <div class="hero-cta-group">
          <button class="btn btn-primary btn-hero-cta" onclick="App.navigateTo('generator')">
            <i class="fas fa-magic"></i> Generate Graphics Now 🚀
          </button>
        </div>

        <!-- Format Features Showcase -->
        <div class="format-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-top: 40px;">
          <div class="format-card" onclick="App.navigateTo('generator', { mode: 'vertical' })" style="cursor: pointer;">
            <div class="format-card-icon" style="font-size: 36px; margin-bottom: 12px;"><i class="fas fa-id-badge text-yellow"></i></div>
            <h3>Format A: Builder ID Card</h3>
            <p>Personalized vertical event badge featuring participant photo, name, role, team name, tech stack, contact handles &amp; QR code.</p>
            <span class="btn-text-link">Generate Builder ID Card <i class="fas fa-arrow-right"></i></span>
          </div>

          <div class="format-card" onclick="App.navigateTo('generator', { mode: 'team' })" style="cursor: pointer;">
            <div class="format-card-icon" style="font-size: 36px; margin-bottom: 12px;"><i class="fas fa-users text-pink"></i></div>
            <h3>Format B: Team Picture Frame</h3>
            <p>Minimal &amp; clean team picture frame featuring official "Hacker Goa House" header logo, large team squad photo &amp; squad name.</p>
            <span class="btn-text-link">Generate Team Picture Frame <i class="fas fa-arrow-right"></i></span>
          </div>
        </div>

        <!-- Task Requirements Check Banner -->
        <div class="requirements-banner" style="margin-top: 30px;">
          <div class="req-title"><i class="fas fa-check-double text-success"></i> Key Submission &amp; Privacy Guarantees</div>
          <div class="req-items">
            <div class="req-item"><i class="fas fa-bolt text-yellow"></i> Fast Near-Instant Canvas Rendering</div>
            <div class="req-item"><i class="fas fa-mobile-alt text-cyan"></i> 100% Mobile &amp; Smartphone Friendly</div>
            <div class="req-item"><i class="fas fa-lock text-pink"></i> Phone Number Privacy Masked</div>
            <div class="req-item"><i class="fab fa-twitter text-blue"></i> 1-Click Share to X with #FrameInGoa</div>
            <div class="req-item"><i class="fas fa-user-shield text-emerald"></i> No Login or Signup Gate</div>
          </div>
        </div>
      </div>
    `;
  }
};
