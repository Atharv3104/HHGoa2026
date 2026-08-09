/**
 * FrameInGoa - Public Profile View (frameingoa.com/u/username)
 */

const ProfileView = {
  render(params = {}) {
    const username = params.username || (App.state.currentUser ? App.state.currentUser.username : "atharv");
    const user = db.getUserByUsername(username) || db.getUsers()[0];
    const userCards = db.getUserCards(user.id);
    const teams = db.getTeams().filter(t => t.members.some(m => m.userId === user.id));

    return `
      <div class="profile-container">
        <!-- Profile Banner & Header -->
        <div class="profile-header-card">
          <div class="profile-avatar-wrapper">
            <img src="${user.photo}" alt="${user.name}" class="profile-avatar-lg" />
            <span class="profile-rank-badge">Rank #${this.getRank(user.id)}</span>
          </div>

          <div class="profile-info-body">
            <h2 class="profile-name">${user.name} <i class="fas fa-check-circle verified-icon"></i></h2>
            <p class="profile-college"><i class="fas fa-university"></i> ${user.college || 'Hacker House Goa Participant'}</p>
            <p class="profile-bio">"${user.bio || 'Building future tech at HH Goa 2026.'}"</p>

            <div class="profile-social-links">
              ${user.github ? `<a href="${user.github}" target="_blank" class="social-chip"><i class="fab fa-github"></i> GitHub</a>` : ''}
              ${user.linkedin ? `<a href="${user.linkedin}" target="_blank" class="social-chip"><i class="fab fa-linkedin"></i> LinkedIn</a>` : ''}
              <button class="social-chip share-chip" onclick="ProfileView.shareProfile('${user.username}')"><i class="fas fa-share-alt"></i> Share Profile</button>
            </div>
          </div>

          <div class="profile-stats-panel">
            <div class="stat-box">
              <span class="stat-num">${user.points || 0}</span>
              <span class="stat-lbl">Leaderboard Pts</span>
            </div>
            <div class="stat-box">
              <span class="stat-num">${userCards.length}</span>
              <span class="stat-lbl">Generated Cards</span>
            </div>
            <div class="stat-box">
              <span class="stat-num">${teams.length}</span>
              <span class="stat-lbl">Squad Teams</span>
            </div>
          </div>
        </div>

        <!-- Generated Builder Cards Grid -->
        <div class="profile-section-title">
          <h3><i class="fas fa-id-badge"></i> Generated Builder Cards (${userCards.length})</h3>
        </div>

        <div class="profile-cards-grid">
          ${userCards.length === 0 ? `
            <div class="empty-gallery-state">
              <p>No builder cards generated yet by this user.</p>
            </div>
          ` : userCards.map(c => `
            <div class="gallery-card-box">
              <div class="card-image-preview-wrapper" onclick="GalleryView.openCardModal('${c.id}')">
                <img src="${c.photo}" alt="${c.userName}" class="card-avatar-main" />
                <span class="card-class-badge">${c.builderClass}</span>
              </div>
              <div class="card-body-content">
                <h4>${c.builderClass}</h4>
                <p class="card-college-name">Frame: ${c.frameName || 'Goa Sunset'}</p>
                <div class="card-actions-full">
                  <button class="btn btn-xs btn-primary btn-block" onclick="GalleryView.openCardModal('${c.id}')">
                    <i class="fas fa-expand"></i> View High-Res Badge
                  </button>
                </div>
              </div>
            </div>
          `).join("")}
        </div>

        <!-- Squad Teams Section -->
        ${teams.length > 0 ? `
          <div class="profile-section-title">
            <h3><i class="fas fa-users"></i> Squad Affiliations</h3>
          </div>
          <div class="teams-list-grid">
            ${teams.map(t => `
              <div class="team-card-item">
                <h4><i class="fas fa-shield-alt text-info"></i> ${t.name}</h4>
                <p>Squad Code: #${t.code} • ${t.members.length} Members</p>
                <button class="btn btn-xs btn-outline" onclick="App.navigateTo('team')">Open Team Poster</button>
              </div>
            `).join("")}
          </div>
        ` : ''}
      </div>
    `;
  },

  getRank(userId) {
    const lb = db.getLeaderboard();
    const idx = lb.findIndex(u => u.id === userId);
    return idx > -1 ? idx + 1 : "-";
  },

  shareProfile(username) {
    const url = `https://${APP_CONFIG.domain}/u/${username}`;
    navigator.clipboard.writeText(url);
    App.showToast(`Profile URL copied: ${url}`, "success");
  }
};
