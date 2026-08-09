/**
 * FrameInGoa - Team Builder View
 */

const TeamView = {
  state: {
    selectedTeamId: "team_goa_cyber",
    teamName: "Goa Cyber Squad",
    newMemberName: "",
    newMemberPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
    newMemberRole: "Dev",
    newMemberClass: "Web3 Builder"
  },

  render() {
    const teams = db.getTeams();
    const currentTeam = teams.find(t => t.id === this.state.selectedTeamId) || teams[0] || { members: [] };

    return `
      <div class="team-builder-container">
        <div class="generator-header">
          <h2><i class="fas fa-users gradient-text"></i> Squad Team Builder</h2>
          <p>Stitch up to 5 builder identity cards onto a single high-definition Goa Hackathon squad poster.</p>
        </div>

        <div class="team-layout">
          <!-- Left Panel: Squad Control & Add Members -->
          <div class="team-control-panel">
            <!-- Create Squad Card -->
            <div class="form-section-card">
              <div class="section-title-sm"><i class="fas fa-plus-circle"></i> Create New Squad</div>
              <div class="form-group">
                <label>Squad Team Name</label>
                <div class="input-group-btn">
                  <input type="text" id="new-team-input" class="form-control" placeholder="e.g. Goa Cyber Squad" value="${this.state.teamName}" oninput="TeamView.state.teamName = this.value" />
                  <button class="btn btn-primary" onclick="TeamView.createNewTeam()"><i class="fas fa-magic"></i> Create</button>
                </div>
              </div>
            </div>

            <!-- Existing Squad Selector & Invite Link -->
            <div class="form-section-card">
              <div class="section-title-sm"><i class="fas fa-list"></i> Select Active Squad</div>
              <select class="form-control" onchange="TeamView.selectTeam(this.value)">
                ${teams.map(t => `<option value="${t.id}" ${t.id === currentTeam.id ? 'selected' : ''}>${t.name} (Code: #${t.code})</option>`).join("")}
              </select>

              <div class="invite-link-box">
                <label>Dynamic Team Invite Link:</label>
                <div class="invite-code-display">
                  <span>https://${APP_CONFIG.domain}/team/join?code=${currentTeam.code || 'GOA2026'}</span>
                  <button class="btn btn-xs btn-outline" onclick="TeamView.copyInviteLink('${currentTeam.code}')"><i class="fas fa-copy"></i> Copy</button>
                </div>
              </div>
            </div>

            <!-- Add Teammates Form -->
            <div class="form-section-card">
              <div class="section-title-sm"><i class="fas fa-user-plus"></i> Add Teammate (${currentTeam.members.length}/5)</div>
              
              <div class="form-group">
                <label>Teammate Name</label>
                <input type="text" class="form-control" placeholder="e.g. Rahul" value="${this.state.newMemberName}" oninput="TeamView.state.newMemberName = this.value" />
              </div>

              <div class="form-group">
                <label>Photo URL / Selfie</label>
                <input type="text" class="form-control" value="${this.state.newMemberPhoto}" oninput="TeamView.state.newMemberPhoto = this.value" />
              </div>

              <div class="form-row-2">
                <div class="form-group">
                  <label>Squad Role</label>
                  <select class="form-control" onchange="TeamView.state.newMemberRole = this.value">
                    <option value="Leader">Leader</option>
                    <option value="Dev" selected>Dev</option>
                    <option value="Designer">Designer</option>
                    <option value="AI Specialist">AI Specialist</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Builder Class</label>
                  <select class="form-control" onchange="TeamView.state.newMemberClass = this.value">
                    <option value="AI Builder">AI Builder</option>
                    <option value="Full Stack Builder">Full Stack Builder</option>
                    <option value="Mobile Builder">Mobile Builder</option>
                    <option value="Web3 Builder" selected>Web3 Builder</option>
                  </select>
                </div>
              </div>

              <button class="btn btn-secondary btn-block" onclick="TeamView.addMember()"><i class="fas fa-user-check"></i> Add Teammate to Poster</button>
            </div>
          </div>

          <!-- Right Panel: Combined Team Poster Preview & Download -->
          <div class="team-preview-panel">
            <div class="preview-sticky-box">
              <div class="preview-header">
                <h3><i class="fas fa-image"></i> High-Res Team Combined Poster</h3>
                <span class="preview-status-pill"><i class="fas fa-shield-alt"></i> ${currentTeam.members.length} Cards Combined</span>
              </div>

              <div class="canvas-poster-wrapper">
                <canvas id="team-poster-canvas" width="1200" height="800"></canvas>
              </div>

              <div class="card-export-actions">
                <button class="btn btn-primary btn-block btn-lg" onclick="TeamView.downloadPoster()">
                  <i class="fas fa-download"></i> Download Combined Team Poster (PNG)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  mounted() {
    this.refreshPosterCanvas();
  },

  selectTeam(teamId) {
    this.state.selectedTeamId = teamId;
    App.render();
    this.refreshPosterCanvas();
  },

  createNewTeam() {
    if (!this.state.teamName.trim()) {
      App.showToast("Please enter a squad name", "warning");
      return;
    }
    const user = App.state.currentUser || db.getUsers()[0];
    const newTeam = db.createTeam(this.state.teamName, user);
    this.state.selectedTeamId = newTeam.id;
    App.showToast(`🎉 Team "${newTeam.name}" created! (+30 Leaderboard Pts)`, "success");
    App.render();
    this.refreshPosterCanvas();
  },

  addMember() {
    if (!this.state.newMemberName.trim()) {
      App.showToast("Please enter teammate name", "warning");
      return;
    }

    const currentTeam = db.getTeamById(this.state.selectedTeamId);
    if (!currentTeam) return;

    try {
      db.addTeamMember(currentTeam.id, {
        userId: "u_" + Date.now(),
        name: this.state.newMemberName,
        role: this.state.newMemberRole,
        photo: this.state.newMemberPhoto,
        builderClass: this.state.newMemberClass
      });
      App.showToast(`Teammate ${this.state.newMemberName} added to poster!`, "success");
      this.state.newMemberName = "";
      App.render();
      this.refreshPosterCanvas();
    } catch (e) {
      App.showToast(e.message, "danger");
    }
  },

  copyInviteLink(code) {
    const url = `https://${APP_CONFIG.domain}/team/join?code=${code || 'GOA2026'}`;
    navigator.clipboard.writeText(url);
    App.showToast(`Invite link copied: ${url}`, "info");
  },

  async refreshPosterCanvas() {
    const canvas = document.getElementById("team-poster-canvas");
    if (!canvas) return;

    const currentTeam = db.getTeamById(this.state.selectedTeamId) || db.getTeams()[0];
    if (currentTeam) {
      await TeamPosterEngine.renderPoster(canvas, currentTeam);
    }
  },

  downloadPoster() {
    const canvas = document.getElementById("team-poster-canvas");
    if (!canvas) return;

    const currentTeam = db.getTeamById(this.state.selectedTeamId) || { name: "Squad" };
    const link = document.createElement("a");
    link.download = `FrameInGoa_${currentTeam.name.replace(/\s+/g, '_')}_SquadPoster.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    App.showToast("Squad Poster Downloaded!", "success");
  }
};
