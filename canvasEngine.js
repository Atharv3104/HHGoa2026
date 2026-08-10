/**
 * FrameInGoa - HTML5 Canvas Engine
 * Official Hacker Goa House 2026 Graphic Generator
 */

class CanvasEngine {
  /**
   * Main render dispatch method
   * @param {HTMLCanvasElement} canvas 
   * @param {Object} cardData 
   * @param {string} mode 'vertical' (Format A Default) or 'team' (Format B Team Frame)
   */
  static async render(canvas, cardData, mode = "vertical") {
    if (mode === "team") {
      return await this.renderTeamFrame(canvas, cardData);
    }
    return await this.renderVerticalBadge(canvas, cardData);
  }

  /* ==========================================================================
     FORMAT A: OFFICIAL VERTICAL BUILDER ID CARD (650x1050 High Res)
     Zero Overlapping • Clean Spacing • Formatted Layout
     ========================================================================== */
  static async renderVerticalBadge(canvas, cardData) {
    const ctx = canvas.getContext("2d");
    const W = 650;
    const H = 1050;
    canvas.width = W;
    canvas.height = H;

    const frameConfig = APP_CONFIG.defaultFrames.find(f => f.id === cardData.frameId) || APP_CONFIG.defaultFrames[0];
    const bgColor = frameConfig.bgColor || "#005A36";

    // 1. User Attached Background Image
    await new Promise((resolve) => {
      const bgImg = new Image();
      bgImg.onload = () => {
        ctx.drawImage(bgImg, 0, 0, W, H);
        resolve();
      };
      bgImg.onerror = () => {
        this.drawGoaBackgroundAccents(ctx, W, H);
        resolve();
      };
      bgImg.src = "id_card_bg.jpg";
    });

    // 2. Outer Decorative Edge Borders (Hot Pink Outer + Sunny Yellow Inner)
    ctx.lineWidth = 14;
    ctx.strokeStyle = "#FF007A";
    ctx.strokeRect(7, 7, W - 14, H - 14);

    ctx.lineWidth = 6;
    ctx.strokeStyle = "#FFE600";
    ctx.strokeRect(16, 16, W - 32, H - 32);

    // 3. Header Section: GOA, INDIA • HACKER GOA HOUSE • 28 - 31 OCT 2026
    this.drawVerticalHeader(ctx, W);

    // 4. Goa Beach Stickers & Badges
    this.drawGoaStickers(ctx, W);

    // 5. User Photo Circle Avatar (Center X = 325, Y = 220, Radius = 85)
    await this.drawUserPhotoCircle(ctx, cardData, W / 2, 220, 85);

    // 6. Large Participant Name & Role (Positioned at Y = 375, ample space from photo!)
    this.drawVerticalNameAndRole(ctx, cardData, W / 2, 375);

    // 7. Information Grid - 2 Columns (Clean Alignment, Zero Overlapping)
    this.drawVerticalDetailsGrid(ctx, cardData, 50, 465);

    // 8. ID Code Pill & Barcode Section (Cleanly Separated Levels)
    await this.drawVerticalFooterSection(ctx, cardData, W, H);

    // 9. Official Website Link & Official Email at Bottom Bar
    this.drawOfficialFooterLinks(ctx, W, H);

    return canvas;
  }

  /* ==========================================================================
     FORMAT B: TEAM PICTURE FRAME (650x950 High Res)
     Large Round Circular Team Photo Frame • Team Name Banner • No Studio Sticker
     ========================================================================== */
  static async renderTeamFrame(canvas, cardData) {
    const ctx = canvas.getContext("2d");
    const W = 650;
    const H = 950;
    canvas.width = W;
    canvas.height = H;

    const frameConfig = APP_CONFIG.defaultFrames.find(f => f.id === cardData.frameId) || APP_CONFIG.defaultFrames[0];
    const bgColor = frameConfig.bgColor || "#005A36";

    // 1. User Attached Background Image
    await new Promise((resolve) => {
      const bgImg = new Image();
      bgImg.onload = () => {
        ctx.drawImage(bgImg, 0, 0, W, H);
        resolve();
      };
      bgImg.onerror = () => {
        this.drawGoaBackgroundAccents(ctx, W, H);
        resolve();
      };
      bgImg.src = "id_card_bg.jpg";
    });

    // 2. Outer Decorative Edge Borders
    ctx.lineWidth = 14;
    ctx.strokeStyle = "#FF007A";
    ctx.strokeRect(7, 7, W - 14, H - 14);

    ctx.lineWidth = 6;
    ctx.strokeStyle = "#FFE600";
    ctx.strokeRect(16, 16, W - 32, H - 32);

    // 3. Header Section: HACKER GOA HOUSE logo + #FrameInGoa
    this.drawVerticalHeader(ctx, W);

    // 4. Goa Beach Stickers
    this.drawGoaStickers(ctx, W);

    // 5. Large Round Circular Team Photo Frame (Center X = 325, Center Y = 395, Radius = 205)
    const cx = W / 2;
    const cy = 395;
    const r = 205;

    ctx.save();

    // Outer Yellow Glow Ring
    ctx.shadowColor = "#FFE600";
    ctx.shadowBlur = 25;

    // Heavy Sunny Yellow Outer Border Ring
    ctx.beginPath();
    ctx.arc(cx, cy, r + 9, 0, Math.PI * 2);
    ctx.fillStyle = "#FFE600";
    ctx.fill();

    // White Inner Ring Outline
    ctx.beginPath();
    ctx.arc(cx, cy, r + 3, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();

    // Clip team photo into large circle
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    if (cardData.photoElement) {
      FaceDetectionEngine.drawCroppedFace(
        ctx, cardData.photoElement,
        cx - r, cy - r, r * 2, r * 2,
        cardData.zoom || 1.0,
        cardData.offsetX || 0,
        cardData.offsetY || 0
      );
    } else if (cardData.photo) {
      const img = new Image();
      if (!cardData.photo.startsWith("data:")) img.crossOrigin = "anonymous";
      await new Promise((resolve) => {
        img.onload = () => {
          FaceDetectionEngine.drawCroppedFace(
            ctx, img,
            cx - r, cy - r, r * 2, r * 2,
            cardData.zoom || 1.0,
            cardData.offsetX || 0,
            cardData.offsetY || 0
          );
          resolve();
        };
        img.onerror = () => {
          this.drawFallbackTeamPhoto(ctx, cx - r, cy - r, r * 2, r * 2, cardData.teamName);
          resolve();
        };
        img.src = cardData.photo;
      });
    } else {
      this.drawFallbackTeamPhoto(ctx, cx - r, cy - r, r * 2, r * 2, cardData.teamName);
    }

    ctx.restore();

    // 6. Large Team Squad Name Banner (Below Round Photo at Y = 650)
    ctx.save();
    const teamNameStr = cardData.teamName && cardData.teamName.trim() ? cardData.teamName.trim().toUpperCase() : "YOUR SQUAD NAME";
    
    const teamPillY = 650;
    const teamPillH = 72;
    const teamPillW = 550;
    const teamPillX = (W - teamPillW) / 2;

    this.roundRect(ctx, teamPillX, teamPillY, teamPillW, teamPillH, 20);
    ctx.fillStyle = "#00321E";
    ctx.fill();
    ctx.strokeStyle = "#FF007A";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.font = "bold 32px 'Outfit', sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.fillText(`🚩 SQUAD: ${teamNameStr}`, W / 2, teamPillY + 46);

    ctx.restore();

    // 7. Official Website & Email Footer Links (No 2:47 Studio sticker)
    this.drawOfficialFooterLinks(ctx, W, H);

    return canvas;
  }

  static drawFallbackTeamPhoto(ctx, x, y, w, h, teamName) {
    ctx.fillStyle = "#003D24";
    ctx.fillRect(x, y, w, h);
    ctx.font = "bold 34px 'Outfit', sans-serif";
    ctx.fillStyle = "#FFE600";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(teamName ? teamName.toUpperCase() : "UPLOAD TEAM PHOTO", x + w / 2, y + h / 2);
  }

  static drawGoaBackgroundAccents(ctx, W, H) {
    ctx.save();

    // 1. Goa Sunset Tropical Sky Gradient (Top -> Mid)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.65);
    skyGrad.addColorStop(0, "#002A18");    // Deep Goa Forest Green
    skyGrad.addColorStop(0.4, "#004227");  // Vibrant Emerald Green
    skyGrad.addColorStop(0.75, "#005530"); // Tropical Green Horizon
    skyGrad.addColorStop(1, "#003A20");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. Radiant Goa Golden Sun & Horizon Sunset Rays (Top Center Accent)
    ctx.save();
    const sunCx = W / 2;
    const sunCy = 140;

    // Glowing Sun Disk & Sunset Atmosphere
    const sunGrad = ctx.createRadialGradient(sunCx, sunCy, 10, sunCx, sunCy, 340);
    sunGrad.addColorStop(0, "rgba(255, 230, 0, 0.26)");
    sunGrad.addColorStop(0.4, "rgba(255, 100, 50, 0.1)");
    sunGrad.addColorStop(0.8, "rgba(255, 0, 122, 0.04)");
    sunGrad.addColorStop(1, "transparent");
    ctx.fillStyle = sunGrad;
    ctx.fillRect(0, 0, W, H);

    // Sun Rays
    ctx.strokeStyle = "rgba(255, 220, 50, 0.08)";
    ctx.lineWidth = 5;
    for (let a = -1.2; a <= 1.2; a += 0.16) {
      ctx.beginPath();
      ctx.moveTo(sunCx, sunCy);
      ctx.lineTo(sunCx + Math.tan(a) * 600, sunCy + 600);
      ctx.stroke();
    }
    ctx.restore();

    // 3. Goa Ocean Waves & Water Shimmer Layer (Y = H - 180 to H - 60)
    ctx.save();
    // Deep Ocean Water Layer
    const oceanGrad = ctx.createLinearGradient(0, H - 180, 0, H - 80);
    oceanGrad.addColorStop(0, "rgba(0, 120, 100, 0.35)");
    oceanGrad.addColorStop(1, "rgba(0, 80, 70, 0.5)");
    
    ctx.fillStyle = oceanGrad;
    ctx.beginPath();
    ctx.moveTo(0, H - 170);
    for (let x = 0; x <= W; x += 40) {
      ctx.quadraticCurveTo(x + 20, H - 180, x + 40, H - 170);
    }
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.fill();

    // Ocean Surface Ripple Highlights (Cyan/Aqua Wave Foams)
    ctx.strokeStyle = "rgba(100, 255, 230, 0.28)";
    ctx.lineWidth = 2.5;
    for (let wy = H - 160; wy <= H - 90; wy += 22) {
      ctx.beginPath();
      ctx.moveTo(0, wy);
      for (let x = 0; x <= W; x += 35) {
        ctx.quadraticCurveTo(x + 17.5, wy - 8, x + 35, wy);
      }
      ctx.stroke();
    }
    ctx.restore();

    // 4. Goa Golden Beach Sand Shore (Bottom Border Y = H - 75 to H)
    ctx.save();
    const sandGrad = ctx.createLinearGradient(0, H - 75, 0, H);
    sandGrad.addColorStop(0, "rgba(220, 175, 90, 0.45)");
    sandGrad.addColorStop(1, "rgba(180, 130, 50, 0.65)");
    ctx.fillStyle = sandGrad;
    
    ctx.beginPath();
    ctx.moveTo(0, H - 65);
    for (let x = 0; x <= W; x += 50) {
      ctx.quadraticCurveTo(x + 25, H - 75, x + 50, H - 65);
    }
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.fill();

    // White Foam Line on Shore
    ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    // 5. Silhouetted Goa Coconut Palm Trees Leaning from Left & Right
    // Left Leaning Coconut Palm Trees
    this.drawVectorPalmTree(ctx, 25, H - 40, 260, 1.0, 0.15);
    this.drawVectorPalmTree(ctx, 85, H - 25, 185, 0.85, 0.1);

    // Right Leaning Coconut Palm Trees
    this.drawVectorPalmTree(ctx, W - 25, H - 40, 260, -1.0, -0.15);
    this.drawVectorPalmTree(ctx, W - 85, H - 25, 185, -0.85, -0.1);

    // 6. Goa Bougainvillea & Hibiscus Flowers Along Bottom Sand
    this.drawVectorBottomFoliage(ctx, W, H);

    ctx.restore();
  }

  static drawVectorPalmTree(ctx, trunkX, trunkY, height, scaleX, leanAngle = 0) {
    ctx.save();
    ctx.translate(trunkX, trunkY);
    ctx.scale(scaleX, 1);
    ctx.rotate(leanAngle);

    // Curved Segmented Trunk
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(32, -height * 0.5, 45, -height);
    ctx.quadraticCurveTo(32, -height * 0.5, 12, 0);
    ctx.fillStyle = "rgba(0, 50, 30, 0.55)";
    ctx.fill();
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = "rgba(120, 210, 135, 0.6)";
    ctx.stroke();

    // Trunk Rings
    ctx.strokeStyle = "rgba(255, 230, 0, 0.3)";
    ctx.lineWidth = 1.2;
    for (let r = 0.12; r < 0.92; r += 0.14) {
      const rx = 6 + r * 32;
      const ry = -height * r;
      ctx.beginPath();
      ctx.arc(rx, ry, 7, 0, Math.PI);
      ctx.stroke();
    }

    const topX = 45;
    const topY = -height;

    // Hanging Coconuts Cluster
    ctx.save();
    ctx.fillStyle = "#7B4B28"; // Rich Coconut Brown
    ctx.strokeStyle = "#FFE600"; // Golden Outline
    ctx.lineWidth = 1.5;

    const coconuts = [
      { x: topX - 9, y: topY + 10, r: 8 },
      { x: topX + 7, y: topY + 12, r: 8.5 },
      { x: topX - 1, y: topY + 17, r: 7.5 }
    ];

    coconuts.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
    ctx.restore();

    // Tropical Palm Fronds (Leaves)
    const angles = [-2.1, -1.5, -0.9, -0.3, 0.3, 0.9, 1.5, 2.1];

    angles.forEach(ang => {
      ctx.save();
      ctx.translate(topX, topY);
      ctx.rotate(ang);

      // Frond Leaf Silhouette
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(52, -35, 115, 20);
      ctx.quadraticCurveTo(52, -22, 0, 0);
      ctx.fillStyle = "rgba(0, 85, 50, 0.45)";
      ctx.fill();
      ctx.lineWidth = 2.0;
      ctx.strokeStyle = "rgba(130, 230, 145, 0.65)";
      ctx.stroke();

      // Leaf Rib
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(52, -28, 115, 20);
      ctx.strokeStyle = "rgba(255, 230, 0, 0.5)";
      ctx.lineWidth = 1.4;
      ctx.stroke();

      ctx.restore();
    });

    ctx.restore();
  }

  static drawVectorBottomFoliage(ctx, W, H) {
    ctx.save();
    const flowerY = H - 35;
    const flowerSpacing = 30;

    // Bottom Green Foliage Base Bar
    ctx.fillStyle = "rgba(0, 45, 26, 0.7)";
    ctx.fillRect(0, H - 60, W, 60);

    for (let x = 15; x <= W - 15; x += flowerSpacing) {
      ctx.save();
      ctx.translate(x, flowerY + (x % 3 === 0 ? 6 : -4));

      // Pink Bougainvillea & Hibiscus Flower Petals
      ctx.fillStyle = (x % 2 === 0) ? "rgba(240, 30, 130, 0.75)" : "rgba(255, 70, 160, 0.75)";
      for (let i = 0; i < 5; i++) {
        ctx.rotate((Math.PI * 2) / 5);
        ctx.beginPath();
        ctx.ellipse(0, 9, 6.5, 13, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Bright Gold Core
      ctx.beginPath();
      ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = "#FFE600";
      ctx.fill();

      ctx.restore();
    }

    ctx.restore();
  }

  static drawVerticalHeader(ctx, W) {
    ctx.save();

    // Top Sub-header Line
    ctx.font = "bold 14px 'Outfit', sans-serif";
    ctx.fillStyle = "#FFE600";
    ctx.textAlign = "center";
    ctx.fillText("GOA, INDIA   •   28 - 31 OCT 2026", W / 2, 54);

    // Main Logo Title: "HACKER GOA HOUSE"
    const hackerX = W / 2 - 135;
    ctx.textAlign = "center";
    ctx.font = "900 40px 'Cinzel', serif";
    ctx.fillStyle = "#FFE600";
    
    ctx.fillText("HACKER", hackerX, 96);

    // Hot pink script "GOA" in middle
    ctx.save();
    ctx.font = "900 30px 'Syne', sans-serif";
    ctx.fillStyle = "#FF007A";
    ctx.shadowColor = "#FF007A";
    ctx.shadowBlur = 10;
    ctx.fillText("गोवा", W / 2, 96);
    ctx.restore();

    ctx.font = "900 40px 'Cinzel', serif";
    ctx.fillStyle = "#FFE600";
    ctx.fillText("HOUSE", W / 2 + 135, 96);

    // #FrameInGoa Hashtag directly below the word HACKER
    ctx.font = "900 15px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#FFE600";
    ctx.textAlign = "center";
    ctx.shadowColor = "#FF007A";
    ctx.shadowBlur = 6;
    ctx.fillText("#FrameInGoa", hackerX, 122);

    ctx.restore();
  }

  static drawGoaStickers(ctx, W) {
    ctx.save();

    // Top Right Sticker: "GOA HACKATHON '26"
    ctx.save();
    ctx.translate(W - 105, 130);
    ctx.rotate(0.12);
    this.roundRect(ctx, -65, -14, 130, 28, 6);
    ctx.fillStyle = "#FF007A";
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = "900 11px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.fillText("GOA HACKATHON '26", 0, 4);
    ctx.restore();

    // Left Sticker: "🌴 BEACH BUILDER"
    ctx.save();
    ctx.translate(90, 310);
    ctx.rotate(-0.14);
    this.roundRect(ctx, -60, -14, 120, 28, 14);
    ctx.fillStyle = "#FFE600";
    ctx.fill();
    ctx.strokeStyle = "#003622";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = "bold 11px 'Outfit', sans-serif";
    ctx.fillStyle = "#003622";
    ctx.textAlign = "center";
    ctx.fillText("🌴 BEACH BUILDER", 0, 4);
    ctx.restore();

    ctx.restore();
  }

  static async drawUserPhotoCircle(ctx, cardData, cx, cy, r) {
    ctx.save();

    // Yellow Outer Glow Ring
    ctx.shadowColor = "#FFE600";
    ctx.shadowBlur = 20;

    // Heavy Sunny Yellow Outer Border Ring
    ctx.beginPath();
    ctx.arc(cx, cy, r + 7, 0, Math.PI * 2);
    ctx.fillStyle = "#FFE600";
    ctx.fill();

    // White Inner Ring Outline
    ctx.beginPath();
    ctx.arc(cx, cy, r + 2, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();

    // Clip user photo
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    if (cardData.photoElement) {
      FaceDetectionEngine.drawCroppedFace(
        ctx, cardData.photoElement,
        cx - r, cy - r, r * 2, r * 2,
        cardData.zoom || 1.15,
        cardData.offsetX || 0,
        cardData.offsetY || 0
      );
    } else if (cardData.photo) {
      const img = new Image();
      if (!cardData.photo.startsWith("data:")) img.crossOrigin = "anonymous";

      await new Promise((resolve) => {
        img.onload = () => {
          FaceDetectionEngine.drawCroppedFace(
            ctx, img,
            cx - r, cy - r, r * 2, r * 2,
            cardData.zoom || 1.15,
            cardData.offsetX || 0,
            cardData.offsetY || 0
          );
          resolve();
        };
        img.onerror = () => {
          this.drawFallbackAvatar(ctx, cx, cy, r, cardData.userName);
          resolve();
        };
        img.src = cardData.photo;
      });
    } else {
      this.drawFallbackAvatar(ctx, cx, cy, r, cardData.userName);
    }

    ctx.restore();
  }

  static drawFallbackAvatar(ctx, cx, cy, r, name) {
    ctx.fillStyle = "#003D24";
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    ctx.font = "bold 70px 'Outfit', sans-serif";
    ctx.fillStyle = "#FFE600";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText((name || "?")[0].toUpperCase(), cx, cy);
  }

  static drawVerticalNameAndRole(ctx, cardData, cx, startY) {
    ctx.save();

    // 1. Large Participant Name (Only drawn if typed!)
    const nameStr = cardData.userName && cardData.userName.trim() ? cardData.userName.trim().toUpperCase() : "";
    if (nameStr) {
      ctx.font = "bold 38px 'Outfit', sans-serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.fillText(nameStr, cx, startY);
    }

    // 2. Role Subtext (Only drawn if typed!)
    const roleStr = cardData.role && cardData.role.trim() ? cardData.role.trim() : "";
    if (roleStr) {
      ctx.font = "600 17px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#FFE600";
      ctx.textAlign = "center";
      ctx.fillText(roleStr, cx, startY + 30);
    }

    ctx.restore();
  }

  static drawVerticalDetailsGrid(ctx, cardData, startX, startY) {
    ctx.save();

    const col1X = startX + 10;
    const col2X = startX + 315;
    const labelWidth = 95;
    const rowHeight = 52;

    const drawFieldRow = (label, value, x, y, icon = "") => {
      // Label in bright green/yellow uppercase subtext
      ctx.font = "bold 13px 'Outfit', sans-serif";
      ctx.fillStyle = "rgba(255, 230, 0, 0.85)";
      ctx.textAlign = "left";
      ctx.fillText(label.toUpperCase(), x, y);

      // Value text cleanly placed beside label (Empty if not typed!)
      ctx.font = "600 15px 'Plus Jakarta Sans', sans-serif";

      const rawVal = value ? String(value).trim() : "";
      if (rawVal) {
        const valStr = `${icon ? icon + " " : ""}${rawVal}`;
        ctx.fillStyle = "#FFFFFF";
        const truncated = valStr.length > 24 ? valStr.slice(0, 22) + "..." : valStr;
        ctx.fillText(truncated, x + labelWidth, y);
      } else {
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.fillText("—", x + labelWidth, y);
      }
    };

    // Column 1 (Left)
    drawFieldRow("ROLE", cardData.role, col1X, startY);
    drawFieldRow("TEAM", cardData.teamName, col1X, startY + rowHeight, "🚩");
    drawFieldRow("STACK", (cardData.techStack || []).join(" • "), col1X, startY + rowHeight * 2);
    drawFieldRow("INSTA", cardData.instagram, col1X, startY + rowHeight * 3, "📷");
    drawFieldRow("EMAIL", cardData.email, col1X, startY + rowHeight * 4, "✉️");

    // Column 2 (Right)
    drawFieldRow("LOCATION", cardData.location, col2X, startY, "📍");
    drawFieldRow("COLLEGE", cardData.college, col2X, startY + rowHeight, "🏫");
    drawFieldRow("LINKEDIN", cardData.linkedin, col2X, startY + rowHeight * 2, "💼");
    
    // Mask Phone Number automatically if provided
    const rawPhone = cardData.phone ? cardData.phone.trim() : "";
    const maskedPhone = rawPhone ? this.maskPhoneNumber(rawPhone) : "";
    drawFieldRow("PHONE", maskedPhone, col2X, startY + rowHeight * 3, "📞");

    // Builder ID Code
    drawFieldRow("ID CODE", cardData.builderId || "HHG26-EKP03Q", col2X, startY + rowHeight * 4, "🆔");

    ctx.restore();
  }

  static maskPhoneNumber(phoneStr) {
    if (!phoneStr) return "+91 98****3210";
    const clean = phoneStr.trim();
    if (clean.length < 8) return "******" + clean.slice(-2);
    const len = clean.length;
    return clean.slice(0, len - 8) + "****" + clean.slice(-4);
  }

  static async drawVerticalFooterSection(ctx, cardData, W, H) {
    ctx.save();

    // 1. ID Code Capsule Pill (Center X = 325, Y = 770)
    const idText = `ID: ${cardData.builderId || "HHG26-EKP03Q"}`;
    ctx.font = "bold 15px 'Space Grotesk', sans-serif";
    const pillW = ctx.measureText(idText).width + 40;
    const pillH = 36;
    const pillX = (W - pillW) / 2;
    const pillY = 752;

    this.roundRect(ctx, pillX, pillY, pillW, pillH, 18);
    ctx.fillStyle = "#00321E";
    ctx.fill();
    ctx.strokeStyle = "#FFE600";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "#FFE600";
    ctx.textAlign = "center";
    ctx.fillText(idText, W / 2, 775);

    // 2. Barcode Section (Placed cleanly at Y = 825)
    const barcodeW = 240;
    const barcodeH = 42;
    this.drawProceduralBarcode(ctx, W / 2 - barcodeW / 2, 825, barcodeW, barcodeH);

    // 3. QR Code (Right side, Center X = W / 2 + 55 = 380, Y = 880)
    const qrSize = 58;
    const qrX = W / 2 + 25;
    const qrY = 880;

    const profileUrl = `https://${APP_CONFIG.domain}/u/${cardData.builderId || 'HHG26-EKP03Q'}`;
    const qrCanvas = QRCodeGenerator.generateCanvas(profileUrl, qrSize, "#000000", "#FFFFFF");

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(qrX - 4, qrY - 4, qrSize + 8, qrSize + 8);
    ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

// 4. "2:47PM STUDIO" Graphic Sticker Image at Left Side of QR Code
    const stickerX = W / 2 - 200;
    const stickerY = 870;
    const stickerW = 150;
    const stickerH = 75;

    await new Promise((resolve) => {
      const stImg = new Image();
      stImg.onload = () => {
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
        ctx.shadowBlur = 8;
        ctx.drawImage(stImg, stickerX, stickerY, stickerW, stickerH);
        ctx.restore();
        resolve();
      };
      stImg.onerror = () => {
        resolve();
      };
      stImg.src = "studio_sticker.png";
    });

    ctx.restore();
  }

  static drawProceduralBarcode(ctx, x, y, w, h) {
    ctx.save();
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(x, y, w, h);

    ctx.fillStyle = "#000000";
    let curX = x + 10;
    const barWidths = [2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 1, 3, 2, 1, 4];
    
    barWidths.forEach(bw => {
      ctx.fillRect(curX, y + 4, bw, h - 8);
      curX += bw + 2;
    });

    ctx.restore();
  }

  static drawOfficialFooterLinks(ctx, W, H) {
    ctx.save();

    const footerY = H - 40;
    // Background Footer Bar
    ctx.fillStyle = "rgba(0, 43, 26, 0.95)";
    ctx.fillRect(20, footerY - 14, W - 40, 34);

    ctx.strokeStyle = "#FFE600";
    ctx.lineWidth = 1;
    ctx.strokeRect(20, footerY - 14, W - 40, 34);

    ctx.font = "bold 13px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#FFE600";
    ctx.textAlign = "center";
    ctx.fillText("🌐 www.hhgoa.com   •   ✉️ 247pmstudio@gmail.com", W / 2, footerY + 8);

    ctx.restore();
  }

  static roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}
