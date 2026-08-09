/**
 * FrameInGoa - Leaderboard View
 * Official Hacker Goa House 2026 Leaderboard
 */

const LeaderboardView = {
  render() {
    const cards = db.getCards() || [];
    
    // Sort cards by likes/downloads
    const leaderboard = cards.slice().sort((a, b) => (b.likesCount || 1) - (a.likesCount || 1));
    const top3 = leaderboard.slice(0, 3);

    return `
      <div class="leaderboard-container">
        <div class="generator-header text-center">
          <div class="event-pill">
            <span class="pulse-dot"></span> OFFICIAL HACKER GOA HOUSE LEADERBOARD
          </div>
          <h2>Hacker Goa House <span class="gradient-text">Member Leaderboard</span></h2>
          <p>Compete with fellow Goa builders! Generate your Builder ID Card to get featured on the official Leaderboard.</p>
        </div>

        ${cards.length === 0 ? `
          <div class="empty-state-card text-center" style="background: rgba(0, 43, 26, 0.85); border: 2px dashed #FFE600; padding: 50px 20px; border-radius: 20px; margin: 40px 0;">
            <div style="font-size: 60px; margin-bottom: 15px;">🏆</div>
            <h3 style="color: #FFE600; font-size: 24px; font-weight: 800;">No Members Added Yet</h3>
            <p style="color: #A3D9C3; max-width: 500px; margin: 10px auto 25px auto;">Generate your official Hacker Goa House Builder ID Card and click <strong>"Add My Member Card to Gallery &amp; Leaderboard"</strong> to feature your photo!</p>
            <button class="btn btn-primary btn-lg" onclick="App.navigateTo('generator')">
              <i class="fas fa-magic"></i> Generate My Builder Card Now 🚀
            </button>
          </div>
        ` : `
          <!-- Top 3 Podium -->
          <div class="podium-container">
            ${top3[1] ? `
              <div class="podium-card rank-2">
                <div class="podium-crown">🥈</div>
                <img src="${top3[1].imageUrl}" alt="${top3[1].userName}" class="podium-avatar" />
                <h4>${top3[1].userName}</h4>
                <span class="podium-score">🚩 ${top3[1].teamName || 'Team Builder'}</span>
                <span class="podium-badge">${top3[1].builderTitle || 'Code Wizard'}</span>
              </div>
            ` : ''}

            ${top3[0] ? `
              <div class="podium-card rank-1">
                <div class="podium-crown">👑</div>
                <img src="${top3[0].imageUrl}" alt="${top3[0].userName}" class="podium-avatar rank-1-avatar" />
                <h4>${top3[0].userName}</h4>
                <span class="podium-score highlight">🚩 ${top3[0].teamName || 'Team Goa'}</span>
                <span class="podium-badge gold">${top3[0].builderTitle || 'Goa Champ'}</span>
              </div>
            ` : ''}

            ${top3[2] ? `
              <div class="podium-card rank-3">
                <div class="podium-crown">🥉</div>
                <img src="${top3[2].imageUrl}" alt="${top3[2].userName}" class="podium-avatar" />
                <h4>${top3[2].userName}</h4>
                <span class="podium-score">🚩 ${top3[2].teamName || 'Team Builder'}</span>
                <span class="podium-badge">${top3[2].builderTitle || 'Code Wizard'}</span>
              </div>
            ` : ''}
          </div>

          <!-- Leaderboard Table -->
          <div class="leaderboard-table-card">
            <table class="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Member Builder</th>
                  <th>Team / Squad</th>
                  <th>College / City</th>
                  <th>Builder ID</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${leaderboard.map((card, idx) => `
                  <tr>
                    <td class="rank-col">
                      ${idx === 0 ? '🥇 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : `#${idx + 1}`}
                    </td>
                    <td class="user-col">
                      <img src="${card.imageUrl}" alt="${card.userName}" class="table-avatar" />
                      <div>
                        <strong>${card.userName}</strong>
                        <span class="user-sub">${card.builderTitle || 'Code Wizard'}</span>
                      </div>
                    </td>
                    <td><strong>🚩 ${card.teamName || 'Code Wizards'}</strong></td>
                    <td>${card.location || card.college || 'Goa, India'}</td>
                    <td><span class="id-code-badge">${card.builderId || 'HHG26-001'}</span></td>
                    <td>
                      <button class="btn btn-xs btn-primary" onclick="App.navigateTo('generator')">
                        Create Card
                      </button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        `}
      </div>
    `;
  }
};
