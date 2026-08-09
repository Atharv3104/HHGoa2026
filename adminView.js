/**
 * FrameInGoa - Admin Panel View
 */

const AdminView = {
  state: {
    newFrameName: "",
    newFrameTheme: "neon",
    newFrameColor: "#00ffcc"
  },

  render() {
    const users = db.getUsers();
    const cards = db.getCards();
    const frames = db.getFrames();
    const teams = db.getTeams();
    const logs = db.getActivityLogs();

    const totalDownloads = cards.reduce((acc, c) => acc + (c.downloadsCount || 0), 0);
    const totalShares = cards.reduce((acc, c) => acc + (c.sharesCount || 0), 0);

    return `
      <div class="admin-container">
        <div class="generator-header">
          <h2><i class="fas fa-user-shield gradient-text"></i> Admin Control Panel</h2>
          <p>Real-time system analytics, frame catalog management, user accounts, and moderation log.</p>
        </div>

        <!-- 1. Real-Time Analytics Counters -->
        <div class="admin-stats-grid">
          <div class="admin-stat-card">
            <div class="stat-icon bg-sunset"><i class="fas fa-users"></i></div>
            <div>
              <h3>${users.length}</h3>
              <span>Total Registered Users</span>
            </div>
          </div>

          <div class="admin-stat-card">
            <div class="stat-icon bg-neon"><i class="fas fa-id-card"></i></div>
            <div>
              <h3>${cards.length}</h3>
              <span>Cards Generated</span>
            </div>
          </div>

          <div class="admin-stat-card">
            <div class="stat-icon bg-gold"><i class="fas fa-download"></i></div>
            <div>
              <h3>${totalDownloads}</h3>
              <span>Total Downloads</span>
            </div>
          </div>

          <div class="admin-stat-card">
            <div class="stat-icon bg-emerald"><i class="fas fa-share-alt"></i></div>
            <div>
              <h3>${totalShares}</h3>
              <span>Total Shares</span>
            </div>
          </div>
        </div>

        <div class="admin-two-cols">
          <!-- 2. Dynamic Frame Management -->
          <div class="admin-panel-card">
            <div class="panel-header">
              <h3><i class="fas fa-layer-group"></i> Dynamic Frame Catalog Manager</h3>
              <span>Add frames dynamically without editing code</span>
            </div>

            <!-- Upload New Frame Form -->
            <div class="add-frame-form">
              <div class="form-row-3">
                <input type="text" class="form-control" placeholder="Frame Name (e.g. Neon Sunset)" value="${this.state.newFrameName}" oninput="AdminView.state.newFrameName = this.value" />
                <input type="color" class="form-control color-picker-input" value="${this.state.newFrameColor}" onchange="AdminView.state.newFrameColor = this.value" />
                <button class="btn btn-primary" onclick="AdminView.addFrame()"><i class="fas fa-plus"></i> Add Frame</button>
              </div>
            </div>

            <table class="admin-table">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Frame Name</th>
                  <th>Theme ID</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${frames.map(f => `
                  <tr>
                    <td><div class="frame-color-swatch" style="background: ${f.borderColor};"></div></td>
                    <td><strong>${f.name}</strong></td>
                    <td><code>${f.theme}</code></td>
                    <td><span class="badge-status ${f.isActive ? 'active' : 'inactive'}">${f.isActive ? 'Active' : 'Disabled'}</span></td>
                    <td>
                      <button class="btn btn-xs ${f.isActive ? 'btn-danger' : 'btn-success'}" onclick="AdminView.toggleFrame('${f.id}')">
                        ${f.isActive ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>

          <!-- 3. System Activity Logs -->
          <div class="admin-panel-card">
            <div class="panel-header">
              <h3><i class="fas fa-history"></i> Live Activity Logs</h3>
              <span>Recent system events & user actions</span>
            </div>

            <div class="activity-log-feed">
              ${logs.map(l => `
                <div class="log-feed-item">
                  <span class="log-time">${new Date(l.timestamp).toLocaleTimeString()}</span>
                  <p class="log-msg">${l.message}</p>
                </div>
              `).join("")}
            </div>
          </div>
        </div>

        <!-- 4. Manage Registered Users Table -->
        <div class="admin-panel-card" style="margin-top: 24px;">
          <div class="panel-header">
            <h3><i class="fas fa-user-cog"></i> Registered Builders Management</h3>
          </div>

          <table class="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>College</th>
                <th>Points</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(u => `
                <tr>
                  <td class="user-col">
                    <img src="${u.photo}" alt="${u.name}" class="table-avatar" />
                    <strong>${u.name}</strong>
                  </td>
                  <td>${u.email}</td>
                  <td>${u.college || 'N/A'}</td>
                  <td><strong>${u.points || 0} pts</strong></td>
                  <td><span class="badge-role ${u.role}">${u.role}</span></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  addFrame() {
    if (!this.state.newFrameName.trim()) {
      App.showToast("Please enter a frame name", "warning");
      return;
    }

    db.addFrame({
      name: this.state.newFrameName,
      theme: "custom-" + Date.now(),
      borderColor: this.state.newFrameColor,
      accentGlow: this.state.newFrameColor,
      pattern: "cyber-grid"
    });

    this.state.newFrameName = "";
    App.showToast("New Dynamic Frame Added to Catalog!", "success");
    App.render();
  },

  toggleFrame(frameId) {
    db.toggleFrameActive(frameId);
    App.showToast("Frame status updated!", "info");
    App.render();
  }
};
