/**
 * FrameInGoa - Team Poster Canvas Engine
 * Combines 1 to 5 individual builder identity cards onto a unified squad poster
 */

class TeamPosterEngine {
  /**
   * Generates a high-definition Team Poster Canvas
   * @param {HTMLCanvasElement} canvas 
   * @param {Object} teamData { name, code, members: [{ name, photo, builderClass, techStack }] }
   */
  static async renderPoster(canvas, teamData) {
    const ctx = canvas.getContext("2d");
    const memberCount = Math.min(5, Math.max(1, teamData.members ? teamData.members.length : 1));

    // Dynamic width based on member count
    const posterWidth = memberCount === 1 ? 700 : memberCount === 2 ? 1100 : memberCount === 3 ? 1500 : 1800;
    const posterHeight = 1000;

    canvas.width = posterWidth;
    canvas.height = posterHeight;

    // 1. Goa Beach Cyber Background Gradient
    const grad = ctx.createLinearGradient(0, 0, posterWidth, posterHeight);
    grad.addColorStop(0, "#0b0517");
    grad.addColorStop(0.5, "#1a0b2e");
    grad.addColorStop(1, "#090314");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, posterWidth, posterHeight);

    // Decorative Mesh & Wave overlay
    ctx.strokeStyle = "rgba(0, 240, 255, 0.08)";
    ctx.lineWidth = 2;
    for (let x = 0; x < posterWidth; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, posterHeight);
      ctx.stroke();
    }

    // 2. Poster Header
    ctx.textAlign = "center";
    ctx.font = "bold 20px 'Outfit', sans-serif";
    ctx.fillStyle = "#ff7043";
    ctx.fillText("HACKER HOUSE GOA 2026 • OFFICIAL SQUAD POSTER", posterWidth / 2, 70);

    ctx.font = "bold 46px 'Outfit', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(teamData.name || "Goa Cyber Squad", posterWidth / 2, 125);

    // Team Code Badge
    ctx.font = "600 16px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#38bdf8";
    ctx.fillText(`Squad Code: #${teamData.code || 'GOA2026'} • Members: ${memberCount}`, posterWidth / 2, 160);

    // Header divider line
    ctx.strokeStyle = "linear-gradient(90deg, transparent, #ff6b35, transparent)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(posterWidth / 2 - 250, 180);
    ctx.lineTo(posterWidth / 2 + 250, 180);
    ctx.stroke();

    // 3. Render Individual Member Cards
    const cardW = 320;
    const cardH = 680;
    const gap = 35;

    const totalCardsWidth = memberCount * cardW + (memberCount - 1) * gap;
    let startX = (posterWidth - totalCardsWidth) / 2;
    const startY = 220;

    for (let i = 0; i < memberCount; i++) {
      const member = teamData.members[i] || { name: `Member ${i+1}`, builderClass: "Builder" };
      await this.renderMemberCardOnPoster(ctx, member, startX, startY, cardW, cardH, i + 1);
      startX += cardW + gap;
    }

    // 4. Footer Branding
    ctx.font = "bold 14px 'Outfit', sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.textAlign = "center";
    ctx.fillText("FRAMEINGOA.COM • OFFICIAL TEAM BADGE GENERATOR", posterWidth / 2, posterHeight - 35);

    return canvas;
  }

  static async renderMemberCardOnPoster(ctx, member, x, y, width, height, rank) {
    ctx.save();

    // Card background panel
    ctx.shadowColor = "rgba(0, 240, 255, 0.3)";
    ctx.shadowBlur = 15;

    CanvasEngine.roundRect(ctx, x, y, width, height, 18);
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.fill();
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Member Photo
    const photoSize = 160;
    const photoX = x + (width - photoSize) / 2;
    const photoY = y + 50;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x + width / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
    ctx.clip();

    if (member.photo) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise((resolve) => {
        img.onload = () => {
          ctx.drawImage(img, photoX, photoY, photoSize, photoSize);
          resolve();
        };
        img.onerror = () => {
          ctx.fillStyle = "#334155";
          ctx.fillRect(photoX, photoY, photoSize, photoSize);
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 50px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText((member.name || "M")[0], x + width / 2, photoY + 100);
          resolve();
        };
        img.src = member.photo;
      });
    } else {
      ctx.fillStyle = "#334155";
      ctx.fillRect(photoX, photoY, photoSize, photoSize);
    }
    ctx.restore();

    // Member Name
    ctx.font = "bold 22px 'Outfit', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(member.name || `Builder ${rank}`, x + width / 2, photoY + photoSize + 45);

    // Role / Class
    ctx.font = "bold 14px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#ff7043";
    ctx.fillText(member.builderClass || member.role || "Hacker", x + width / 2, photoY + photoSize + 75);

    // Tech Stack Pills
    if (member.techStack && member.techStack.length > 0) {
      ctx.font = "bold 12px sans-serif";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(member.techStack.slice(0, 3).join(" • "), x + width / 2, photoY + photoSize + 110);
    }

    // Role Badge Pill at bottom
    const roleTag = member.role === "Leader" ? "👑 Squad Leader" : `⚡ Member #${rank}`;
    CanvasEngine.roundRect(ctx, x + 30, y + height - 70, width - 60, 34, 17);
    ctx.fillStyle = member.role === "Leader" ? "rgba(255, 112, 67, 0.2)" : "rgba(56, 189, 248, 0.2)";
    ctx.fill();
    ctx.strokeStyle = member.role === "Leader" ? "#ff7043" : "#38bdf8";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px 'Outfit', sans-serif";
    ctx.fillText(roleTag, x + width / 2, y + height - 48);

    ctx.restore();
  }
}
