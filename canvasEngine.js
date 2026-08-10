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
      stImg.src = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjU0NiIgaGVpZ2h0PSIzMzUiPgogIDxwYXRoIGQ9Ik0wIDAgQzEuMDc5NTg5ODQgLTAuMDExNjAxNTYgMi4xNTkxNzk2OSAtMC4wMjMyMDMxMyAzLjI3MTQ4NDM4IC0wLjAzNTE1NjI1IEM5LjMxMzExNjE4IC0wLjAxMjkzMDc1IDEzLjkyMTcwODQxIDAuMjk5MDg2MTcgMTkuMTg3NSAzLjM3NSBDMjYuMjcwNzQ2NiAxNC45NDQzMDI3NyAyMy4xODI3MzIxNCAzMi4wNTk0Njk5MyAyMS45Mzc1IDQ0LjgxMjUgQzIxLjgwMTkxMDgzIDQ2LjIzMTM2MyAyMS42NjYzMzE2NSA0Ny42NTAyMjY5NiAyMS41MzA3NjE3MiA0OS4wNjkwOTE4IEMyMC41MDYzNjg2IDU5LjY2MDQ2NjI4IDE5LjMxMjkwNjU1IDcwLjIyOTIxNjg1IDE4LjA2MzExMDM1IDgwLjc5NjA1MTAzIEMxNi45MTM1NDE1OCA5MC41Mzc2MzYyNyAxNS44ODY3NTA0NyAxMDAuMjg1MjY1MDYgMTQuOTYwOTM3NSAxMTAuMDUwNzgxMjUgQzE0Ljg1NTMyNTAxIDExMS4xNTg4MTYwNyAxNC43NDk3MTI1MiAxMTIuMjY2ODUwODkgMTQuNjQwODk5NjYgMTEzLjQwODQ2MjUyIEMxNC4xMjA4ODU1OSAxMTguODc4NTQ0ODcgMTMuNjEwMjE0NzkgMTI0LjM0OTI2Mjc2IDEzLjExMzc2OTUzIDEyOS44MjE1MzMyIEMxMi4xMTAwMDUwNiAxNDAuNjQ3NjUyNTMgMTAuODgwNTE2MzkgMTUxLjQyNDIyMTI5IDkuMjgxMjUgMTYyLjE3OTY4NzUgQzkuMTMzNzczMTkgMTYzLjI0MjQ0OTA0IDguOTg2Mjk2MzkgMTY0LjMwNTIxMDU3IDguODM0MzUwNTkgMTY1LjQwMDE3NyBDOC42Nzk1NDIyNCAxNjYuMzg2ODYzNzEgOC41MjQ3MzM4OSAxNjcuMzczNTUwNDIgOC4zNjUyMzQzOCAxNjguMzkwMTM2NzIgQzguMjM0NTE1MzggMTY5LjI1ODIyOTY4IDguMTAzNzk2MzkgMTcwLjEyNjMyMjYzIDcuOTY5MTE2MjEgMTcxLjAyMDcyMTQ0IEM2Ljk3NjYwMzQ1IDE3NC4wMTAyMzQwNSA1LjU5MjE1ODkgMTc1LjM3NDAyMzA5IDMuMTg3NSAxNzcuMzc1IEMwLjc4MTc2NTQ2IDE3OC4zNjcyOTMzOCAtMS40NTMyMzIzOSAxNzkuMTYzMDg1OTUgLTMuOTM3NSAxNzkuODc1IEMtNC42MzQ3MjE2OCAxODAuMDgxNDkxNyAtNS4zMzE5NDMzNiAxODAuMjg3OTgzNCAtNi4wNTAyOTI5NyAxODAuNTAwNzMyNDIgQy04LjI5ODIyMjUxIDE4MS4xNTA2NjEgLTEwLjU1MjMxNzEzIDE4MS43NjkxMTMzOSAtMTIuODEyNSAxODIuMzc1IEMtMTMuOTQxNzE4NzUgMTgyLjY3Nzg0OTEyIC0xMy45NDE3MTg3NSAxODIuNjc3ODQ5MTIgLTE1LjA5Mzc1IDE4Mi45ODY4MTY0MSBDLTM5LjYwNDc5NTI1IDE4OS4zODIxNDI2NCAtMzkuNjA0Nzk1MjUgMTg5LjM4MjE0MjY0IC00Ny4xMzI4MTI1IDE4NS4wMzUxNTYyNSBDLTUwLjA5OTUwOTQxIDE4Mi4xMDI5NTU4MiAtNDkuOTc1MzQ5NzcgMTc5LjAzMjQwOTI0IC01MC4wMDM5MDYyNSAxNzUuMDc0MjE4NzUgQy00OS45MTcxNTAyOSAxNjUuMDY0MjMzMDIgLTQ4Ljc2ODIyOTc5IDE1NS4xMzcyMjYyNCAtNDcuNzUgMTQ1LjE4NzUgQy00Ny41Mjk5MzQ1MyAxNDIuOTkxNjUxNzggLTQ3LjMxMDIxNzE1IDE0MC43OTU3Njg2NCAtNDcuMDkwODIwMzEgMTM4LjU5OTg1MzUyIEMtNDQuODYzNTY3NjkgMTE2LjQzNjY1NjU5IC00Mi41MDM3NzMwNiA5NC4yODY1NTcyIC00MC4xMzY0NzQ2MSA3Mi4xMzc5Mzk0NSBDLTQwLjA2MjQxODAzIDcxLjQ0NTAyMTc4IC0zOS45ODgzNjE0NSA3MC43NTIxMDQxMSAtMzkuOTEyMDYwNzQgNzAuMDM4MTg4OTMgQy0zOS41NjM4NDYxOCA2Ni43ODEzNzQ4OSAtMzkuMjE1MDAwNzIgNjMuNTI0NjMwOTUgLTM4Ljg2NTMxMDY3IDYwLjI2Nzk3NDg1IEMtMzguMTU0ODMzMjkgNTMuNjM5NDQ3MjQgLTM3LjQ2MzUzOTU0IDQ3LjAwOTY0Mjc1IC0zNi44MTI1IDQwLjM3NSBDLTM3Ljc5MzQ3NjU2IDQwLjU5MTU2MjUgLTM4Ljc3NDQ1MzEyIDQwLjgwODEyNSAtMzkuNzg1MTU2MjUgNDEuMDMxMjUgQy01OC44MTQ0MDQzOSA0NS4wNDA5MDgwOCAtNTguODE0NDA0MzkgNDUuMDQwOTA4MDggLTY3LjgxMjUgNDMuMzc1IEMtNzIuMDYxMzYwODIgMzkuODk3MDc4NDYgLTczLjQ5NjM2MDQgMzcuNDY5NDI0ODMgLTc0LjMxMjUgMzIuMDYyNSBDLTczLjY4NjUwMjIyIDI3LjQ0NTc2NjQgLTcyLjQ0OTQwMzE4IDI2LjcxOTAzMjI5IC02OC45ODM4ODY3MiAyMy45MTYyNTk3NyBDLTY1LjA5MzM3NjI4IDIxLjE1NDc1ODQ4IC02MC45MDkxMjQyNSAxOS4wNzg4OTM0MiAtNTYuNjI1IDE3IEMtNTUuNjY2MDk4NjMgMTYuNTI4ODQ3NjYgLTU0LjcwNzE5NzI3IDE2LjA1NzY5NTMxIC01My43MTkyMzgyOCAxNS41NzIyNjU2MiBDLTQ3LjI5NDQ0NDA1IDEyLjQ2MTY5MDI2IC00MC44MDE4NTEwNSA5LjU1ODU4NDIgLTM0LjE4NzUgNi44NzUgQy0zMy40MjAyNjYxMSA2LjU2MTI3NDQxIC0zMi42NTMwMzIyMyA2LjI0NzU0ODgzIC0zMS44NjI1NDg4MyA1LjkyNDMxNjQxIEMtMjEuMzAxMzEzMDMgMS43ODEzNjcyOCAtMTEuMzQ1OTMyNjEgLTAuMTI0MTUwMDIgMCAwIFogIiBmaWxsPSIjRkVFMTAxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzNjYuODEyNSw2LjYyNSkiPjwvcGF0aD4KICA8cGF0aCBkPSJNMCAwIEM3LjQ4NTU0MzM4IDYuNTA5MTY4MTYgNy40MzY5NzQ3IDE2LjM3ODYzMSA4LjEyNSAyNS42ODc1IEM4LjIwODQ2NjggMjYuODA0MzkyMDkgOC4yOTE5MzM1OSAyNy45MjEyODQxOCA4LjM3NzkyOTY5IDI5LjA3MjAyMTQ4IEM4Ljk3NjQ1NiAzNy45MDE1MDYxMiA5LjIxMjY2NTk0IDQ2LjcxMzc2MjY4IDkuMjUgNTUuNTYyNSBDOS4yNjM3NzY4NiA1Ny4zNzA3NzI3MSA5LjI2Mzc3Njg2IDU3LjM3MDc3MjcxIDkuMjc3ODMyMDMgNTkuMjE1NTc2MTcgQzkuMjIwNzY2NTEgNzUuNDY0NDEyMTggOS4yMjA3NjY1MSA3NS40NjQ0MTIxOCA0Ljk2MDkzNzUgODAuMzI4MTI1IEMwLjk4Njg4OTcyIDgyLjU3MjA0NjQ0IC0zLjEwMzYwNTc2IDg0LjE2MjUwMjEzIC03LjM3NSA4NS43NSBDLTEzLjg3OTgyMTkgODguMjY4NzI0MDkgLTIwLjI1MDM4ODY3IDkwLjg5NTQzNzk1IC0yNi40Mzc1IDk0LjEyNSBDLTI3LjU5MTIxMDk0IDk0LjcyNTcwMzEyIC0yOC43NDQ5MjE4OCA5NS4zMjY0MDYyNSAtMjkuOTMzNTkzNzUgOTUuOTQ1MzEyNSBDLTM1LjEwOTY2MzQ2IDk5LjQxMzYwODg5IC0zOC40Nzk1ODE2NSAxMDMuNDE3NjgxIC0zOS43OTY4NzUgMTA5LjY5OTIxODc1IEMtNDAuMTkxMjkxMjMgMTE0LjE2Njc0MDk5IC0zOS42MDIzMDg3MyAxMTguNTcyMjE2ODkgLTM5IDEyMyBDLTMwLjk5Nzg3MDYgMTIzLjQ0NTUxNDcgLTI0LjA4NTQ0Njc2IDEyMS43OTE5NDQgLTE2LjM3NSAxMTkuNzUgQy0xNC41MDgxMTUyMyAxMTkuMjcwMTA2MiAtMTQuNTA4MTE1MjMgMTE5LjI3MDEwNjIgLTEyLjYwMzUxNTYyIDExOC43ODA1MTc1OCBDLTYuMjIxNTUzODkgMTE3LjEzMzczNDU5IDAuMTQyNDIzODkgMTE1LjQyNTU4OTkzIDYuNSAxMTMuNjg3NSBDMjUuNzk1MjgwNDQgMTA4LjUxODMyNTU2IDI1Ljc5NTI4MDQ0IDEwOC41MTgzMjU1NiAzNCAxMTEgQzQwLjcxNzA0NDU5IDExNS4xNzk0OTQ0MSA0MS43NjkwNTY3OSAxMjMuNzQ4MzIyNjQgNDMuNDYxOTE0MDYgMTMwLjk3MDcwMzEyIEM0OC4wNjIyNzIyMiAxNTEuNDU4NjkxMyA0OC4wNjIyNzIyMiAxNTEuNDU4NjkxMyA0NS4wMzkwNjI1IDE1OS41ODIwMzEyNSBDMzguNzcyODQyNTggMTY3LjAxMjY2MzY4IDI2LjYyMzQ1MzgyIDE2Ny44NzI4MjA3IDE3LjU5NDA1NTE4IDE2OS44MDYxMjE4MyBDMTMuMTA2NzAxMzUgMTcwLjc2NzA0OTYgOC42MjU5ODQxIDE3MS43NTgwNzcxNSA0LjE0NDUzMTI1IDE3Mi43NDYwOTM3NSBDMy4yNjQyMDIyNyAxNzIuOTM5MzU3NDUgMi4zODM4NzMyOSAxNzMuMTMyNjIxMTUgMS40NzY4Njc2OCAxNzMuMzMxNzQxMzMgQy02LjU5NjM3MzQgMTc1LjExMTg0NjIzIC0xNC42MTQxODA5NCAxNzcuMDc0NjQyMDQgLTIyLjYxNzQzMTY0IDE3OS4xNDc5NDkyMiBDLTMxLjE1MTA5MzIxIDE4MS4zNDgyNDM0NyAtMzkuNDYwMDQxMTIgMTgzLjM1NzYyNTIgLTQ4LjMxMjUgMTgzLjM3NSBDLTQ4Ljk4ODYxMzI4IDE4My4zOTk0OTIxOSAtNDkuNjY0NzI2NTYgMTgzLjQyMzk4NDM4IC01MC4zNjEzMjgxMiAxODMuNDQ5MjE4NzUgQy01My42MTE0NjI5IDE4My40NjgyNDM5MyAtNTUuODgxNTg3MjYgMTgzLjA1OTI4OTE3IC01OC43OTI5Njg3NSAxODEuNjAxNTYyNSBDLTYzLjg1MDQ4MTQgMTc1LjYzOTk2MzUyIC02NC41NDc3MDUzNyAxNjYuOTM5MDcxMSAtNjUuMTY0MDYyNSAxNTkuMzY3MTg3NSBDLTY1LjI0MzIyOTA2IDE1OC40MzkyOTQxMyAtNjUuMzIyMzk1NjMgMTU3LjUxMTQwMDc2IC02NS40MDM5NjExOCAxNTYuNTU1Mzg5NCBDLTY2LjM1MDk4NDU5IDE0NC4xNTQ1NTExNCAtNjYuMzc0MzQyNzUgMTMxLjcyMDQzMzUzIC02Ni4zNzA2MDU0NyAxMTkuMjkwNTI3MzQgQy02Ni4zNzAzOTkxOSAxMTUuNzgyODg1NjMgLTY2LjM5ODExNjg5IDExMi4yNzYwMjYxOCAtNjYuNDMyMTQ5ODkgMTA4Ljc2ODU3MTg1IEMtNjYuNDU5NzcyNjMgMTA1LjM2OTE0MDQ0IC02Ni40NTg1NjQwOCAxMDEuOTY5ODU0NSAtNjYuNDYwOTM3NSA5OC41NzAzMTI1IEMtNjYuNDc1MzA4NTMgOTcuMzI0NDQzNjYgLTY2LjQ4OTY3OTU3IDk2LjA3ODU3NDgzIC02Ni41MDQ0ODYwOCA5NC43OTQ5NTIzOSBDLTY2LjQ2MDgzODA2IDg2LjQ5Nzg5ODY4IC02NS42NTE2ODAwMiA4MC42NDgyNTE5MyAtNTkuNjU5NDIzODMgNzQuNjYxNjIxMDkgQy01Ni42NjIxMTA1OCA3Mi43ODg4ODUwMyAtNTMuNzgyMzU1NzYgNzEuNTkwNzk2OTggLTUwLjQ0OTIxODc1IDcwLjQxNDA2MjUgQy00OS4xODAyNzM4MSA2OS45NTMzMDMyNCAtNDcuOTExMzk1NyA2OS40OTIzNTk4OCAtNDYuNjQyNTc4MTIgNjkuMDMxMjUgQy00NC42Njk1OTU2MSA2OC4zMjcyMjQ1MiAtNDIuNjk1MTQ4MzQgNjcuNjI3NjkwMTUgLTQwLjcxODk5NDE0IDY2LjkzMjYxNzE5IEMtMzEuMTU2NjQ1MDQgNjMuNTQ5MzY2NDQgLTIxLjU4NTAzNTc3IDYwLjAyMTk4MDg2IC0xNiA1MSBDLTEzLjk5MjQ4OTk4IDQ1LjI2NDI1NzA5IC0xMy4zODQ4ODM1IDM5Ljk1MjQ4NTgyIC0xNSAzNCBDLTIxLjYxMDU3MDAyIDMwLjY5NDcxNDk5IC0yOS44OTI2Nzc2MSAzMy44NDUyNjM0NCAtMzYuNDM3NSAzNS45Mzc1IEMtNTMuMzY1MTk1ODkgNDEuMjk4MTQ0MzMgLTUzLjM2NTE5NTg5IDQxLjI5ODE0NDMzIC02MC41IDM4Ljc1IEMtNjMgMzcgLTYzIDM3IC02NSAzNCBDLTY1LjMzNTkzNzUgMzEuNjk1MzEyNSAtNjUuMzM1OTM3NSAzMS42OTUzMTI1IC02NS4zNzUgMjkuMTI1IEMtNjUuNDAzMzU5MzcgMjguMjgxOTUzMTMgLTY1LjQzMTcxODc1IDI3LjQzODkwNjI1IC02NS40NjA5Mzc1IDI2LjU3MDMxMjUgQy02NC44MjgwODk0IDIzLjA0MTM3OTg4IC02My41MzM4MTI5MyAyMS41MjE0MTI1NCAtNjEgMTkgQy01Mi4wNjkwODg4NyAxMy45NDk1NzU1NSAtNDEuODYxNjY1NDUgMTAuNzU3NjQ1ODQgLTMyLjI1IDcuMjUgQy0zMS4yMjE3MzA5NiA2Ljg3MzI3MTQ4IC0zMC4xOTM0NjE5MSA2LjQ5NjU0Mjk3IC0yOS4xMzQwMzMyIDYuMTA4Mzk4NDQgQy04LjM2MDUxMjg5IC0xLjMyMDA4MDk4IC04LjM2MDUxMjg5IC0xLjMyMDA4MDk4IDAgMCBaICIgZmlsbD0iI0ZFRTAwMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjYsMykiPjwvcGF0aD4KICA8cGF0aCBkPSJNMCAwIEM3LjI5MDk4OTQzIC0wLjI3MTQ3MzAxIDExLjgxNjg0NDI2IDAuOTgzNjg0NjggMTggNSBDMjcuMDkxODk0MTUgMTQuMzEzNjQ3NjYgMjQuMTk0NDEyMjEgMzIuNTQxNTM0ODUgMjQuMDYwODY3MzEgNDQuNzA5ODY5MzggQzIzLjk4MjYyMTYxIDQ4LjkzOTM3NDE1IDIzLjgwNzIyODU5IDUzLjE2MTcxMjUyIDIzLjYzMDE0MjIxIDU3LjM4ODA0NjI2IEMyMy4wNTIxODgyOCA3MS42MjYwMjg3MyAyMi45Mjg2MzQzIDg1Ljg0MTI0MDYgMjIuOTcyNjU2MjUgMTAwLjA4OTg0Mzc1IEMyMi45NzUzMjc1MyAxMDEuMDU1MjIyNTMgMjIuOTc3OTk4ODEgMTAyLjAyMDYwMTMxIDIyLjk4MDc1MTA0IDEwMy4wMTUyMzM5OSBDMjMuMDA3MDA5MjIgMTEyLjAzMTYxODI2IDIzLjA0NjIzMDcyIDEyMS4wNDc5MjQ2NSAyMy4wOTU5NDcyNyAxMzAuMDY0MjA4OTggQzIzLjEyMjkzMzQ0IDEzNS4wNTkwMDYxOSAyMy4xMzk4Mjk5NCAxNDAuMDUzNzU5NjkgMjMuMTUwODE1OTYgMTQ1LjA0ODYxNjQxIEMyMy4xNTY5NDE3NCAxNDYuOTIwMjE5MDkgMjMuMTY2ODM3MjIgMTQ4Ljc5MTgxNDA0IDIzLjE4MDg5NDg1IDE1MC42NjMzNzM5NSBDMjMuNDA5NDMyMzggMTgxLjI2ODA3MzMyIDIzLjQwOTQzMjM4IDE4MS4yNjgwNzMzMiAxNyAxODggQzEzLjA2Mjk1NzY1IDE5MC4yMDEyODU1MSA5LjQ2MTIxNDIzIDE5MC4yOTgwNzc5NyA1IDE5MC4zMTI1IEMzLjgwMzc1IDE5MC4zMjkyNTc4MSAyLjYwNzUgMTkwLjM0NjAxNTYzIDEuMzc1IDE5MC4zNjMyODEyNSBDLTIuMzQ1NzYxNTQgMTg5Ljk2Mjc4MjYxIC00LjE1MTQ2MjQ0IDE4OS40MTYxNzAyNSAtNyAxODcgQy04LjY0OTAwODU4IDE4Mi45NTk4ODg2OSAtOS4yNDIxMDI5NyAxNzkuNTcwMjU3MjkgLTkuMTk1MzEyNSAxNzUuMjI1ODMwMDggQy05LjE4ODcwNjA1IDE3NC4xMTQ4MDQyMyAtOS4xODIwOTk2MSAxNzMuMDAzNzc4MzggLTkuMTc1MjkyOTcgMTcxLjg1OTA4NTA4IEMtOS4xNTg2OTYyOSAxNzAuNjc0NTMyMzIgLTkuMTQyMDk5NjEgMTY5LjQ4OTk3OTU1IC05LjEyNSAxNjguMjY5NTMxMjUgQy05LjExNzQyNjc2IDE2Ny4wNDIxNTc0NCAtOS4xMDk4NTM1MiAxNjUuODE0NzgzNjMgLTkuMTAyMDUwNzggMTY0LjU1MDIxNjY3IEMtOS4wNzc2NTQ5NCAxNjAuNjM3NTAwNiAtOS4wNDAzODI5OCAxNTYuNzI1MDgxNzggLTkgMTUyLjgxMjUgQy04Ljk0Njk1NTU5IDE0Ny42NTIzNTIwMiAtOC45MDY5MTUyNCAxNDIuNDkyMzQ4MjIgLTguODc1IDEzNy4zMzIwMzEyNSBDLTguODU4NDAzMzIgMTM2LjE0MTQwNTc5IC04Ljg0MTgwNjY0IDEzNC45NTA3ODAzMyAtOC44MjQ3MDcwMyAxMzMuNzI0MDc1MzIgQy04LjgxODEwMDU5IDEzMi42MjI1MDU5NSAtOC44MTE0OTQxNCAxMzEuNTIwOTM2NTggLTguODA0Njg3NSAxMzAuMzg1OTg2MzMgQy04Ljc5NDIxMzg3IDEyOS40MTU5MTE0MSAtOC43ODM3NDAyMyAxMjguNDQ1ODM2NDkgLTguNzcyOTQ5MjIgMTI3LjQ0NjM2NTM2IEMtOC44MjgzOTU1MiAxMjQuNzQyMzU0MjEgLTguODI4Mzk1NTIgMTI0Ljc0MjM1NDIxIC0xMSAxMjIgQy0xMy42MDc5MzIyNiAxMjEuNzQ2NzQ0MTUgLTE1Ljk2MTI4Nzk1IDEyMS42NzM5ODI4NCAtMTguNTYyNSAxMjEuNzUgQy0xOS4yNDExOTE0MSAxMjEuNzU1MTU2MjUgLTE5LjkxOTg4MjgxIDEyMS43NjAzMTI1IC0yMC42MTkxNDA2MiAxMjEuNzY1NjI1IEMtMjQuMjAzNjk5MjIgMTIxLjgxOTY4MDU1IC0yNy43MTE4NDE2IDEyMi4wNTY4MDgzIC0zMS4yNjk1MzEyNSAxMjIuNDk2MDkzNzUgQy0zNi44ODI5MTgyNSAxMjMuMTYwNjIxOTQgLTQyLjQ3NzAzMzgyIDEyMy4yNTk4NzkyIC00OC4xMjUgMTIzLjMxMjUgQy00OS42OTMxNDQ1MyAxMjMuMzU2MDA1ODYgLTQ5LjY5MzE0NDUzIDEyMy4zNTYwMDU4NiAtNTEuMjkyOTY4NzUgMTIzLjQwMDM5MDYyIEMtNTcuNzc2MzMzNDQgMTIzLjQ1MzY2NzMzIC02MS43NjcyNjY3MyAxMjIuOTM1MTI4MjUgLTY3IDExOSBDLTc1LjE2NTMzMzg0IDEwNy40MzI0NDM3MiAtNzQuNzg1OTk2MzggODguNzI0MzEwOTEgLTc2IDc1IEMtNzYuMTEzNDM3NSA3My44MDExNzE4NyAtNzYuMjI2ODc1IDcyLjYwMjM0Mzc1IC03Ni4zNDM3NSA3MS4zNjcxODc1IEMtNzcuMDQzODU4NjQgNjIuNTE4NTkyMiAtNzcuMTI3NjQ3NDQgNTMuNjU3OTkxNzMgLTc3LjE3NTIzMTkzIDQ0Ljc4NjIyNDM3IEMtNzcuMTgzMzEyMzcgNDMuMzYyNzIxNyAtNzcuMTk0MzQ2MjcgNDEuOTM5MjMyMjYgLTc3LjIwODU1NzEzIDQwLjUxNTc3NzU5IEMtNzcuMzcxMjc0NzggMjIuMjkyMjA2MTIgLTc3LjM3MTI3NDc4IDIyLjI5MjIwNjEyIC03NSAxNyBDLTcwLjg0MjM0NTk5IDE0LjM0NTc2NzA1IC02Ni43ODQwMjM0OSAxNC40Nzc2NTQyOCAtNjIgMTUgQy01OC41NjI1IDE2LjEyNSAtNTguNTYyNSAxNi4xMjUgLTU2IDE4IEMtNTQuMzEwODAxNjYgMjIuMDY3OTgzNjUgLTUzLjczNzI5NDEgMjUuNjE4MDI5NTcgLTUzLjY1NjI1IDMwIEMtNTMuNjI3ODkwNjIgMzEuMTI4NDkzNjUgLTUzLjU5OTUzMTI1IDMyLjI1Njk4NzMgLTUzLjU3MDMxMjUgMzMuNDE5Njc3NzMgQy01My41NDcxMDkzNyAzNC42MDExODQwOCAtNTMuNTIzOTA2MjUgMzUuNzgyNjkwNDMgLTUzLjUgMzcgQy01My4xOTgyNDk4NSA0Ny44NzUzMzY1OCAtNTIuNjkyMTQyMzMgNTguNDEyMzA4OTggLTUwIDY5IEMtMjkuMDM2NjQzNDggNzAuNzgzODQ2NjIgLTI5LjAzNjY0MzQ4IDcwLjc4Mzg0NjYyIC05Ljg3NzY4NTU1IDY1LjMzOTU5OTYxIEMtNy41MjQ2MDU3IDYyLjQwNzY1Nzg0IC03LjI2Mjc1NjQ4IDYwLjQ1NzU5MjIyIC02LjgzOTg0Mzc1IDU2LjczODI4MTI1IEMtNi42OTI3Mjk0OSA1NS40OTI1NjM0OCAtNi41NDU2MTUyMyA1NC4yNDY4NDU3IC02LjM5NDA0Mjk3IDUyLjk2MzM3ODkxIEMtNS44MDY3NTIyNSA0Ny4wNTYyNjc2MyAtNS4yNDExNTYwNSA0MS4xNDkzMTQ4MiAtNC43Mzc5NDU1NiAzNS4yMzQzNzUgQy0zLjcyMTI0MzEzIDIzLjM3Mjc4NzcxIC0yLjQ3NjYwOTg3IDExLjY2MjkwMDM4IDAgMCBaICIgZmlsbD0iI0ZFRTEwMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjU5LDApIj48L3BhdGg+CiAgPHBhdGggZD0iTTAgMCBDMS4yOTkzNzUgLTAuMDM4NjcxODggMS4yOTkzNzUgLTAuMDM4NjcxODggMi42MjUgLTAuMDc4MTI1IEM1IDAuMjUgNSAwLjI1IDYuNzUgMS41MTU2MjUgQzkuNzkxNzA1MjggNS43MzU5OTEwOCA5LjE1NDQwNDMyIDEwLjk5MDM3MDMyIDkuMTYxMTMyODEgMTUuOTc4MjcxNDggQzkuMTY4NTgwMTcgMTcuMjk4NDYyODMgOS4xNjg1ODAxNyAxNy4yOTg0NjI4MyA5LjE3NjE3Nzk4IDE4LjY0NTMyNDcxIEM5LjE5MDc3MTM4IDIxLjU1MzkyMjM2IDkuMTk3NTk2MDUgMjQuNDYyNDY1NTIgOS4yMDMxMjUgMjcuMzcxMDkzNzUgQzkuMjA4ODc3NzEgMjkuMzkzNjQxMTcgOS4yMTQ2MzU0MyAzMS40MTYxODg1NyA5LjIyMDM5Nzk1IDMzLjQzODczNTk2IEM5LjIzMDg5OTE2IDM3LjY3Nzk5MTI3IDkuMjM2NzQ3OTQgNDEuOTE3MjI3NjYgOS4yNDAyMzQzOCA0Ni4xNTY0OTQxNCBDOS4yNDU3MjQ2MiA1MS41ODgzNzYxNyA5LjI2OTc2NzczIDU3LjAyMDAwODI0IDkuMjk4MjA2MzMgNjIuNDUxODExNzkgQzkuMzE2ODI2ODcgNjYuNjI4ODE3MDcgOS4zMjIwMzc5NSA3MC44MDU3NjE5NyA5LjMyMzU3MDI1IDc0Ljk4MjgwNTI1IEM5LjMyNjU5NzQgNzYuOTg1NDc4MDMgOS4zMzQ2MjgwMSA3OC45ODgxNDk3NCA5LjM0Nzc1NTQzIDgwLjk5MDc4MTc4IEM5LjM2NDgwNzUgODMuNzkxNDkzMjcgOS4zNjI5Mzc5OSA4Ni41OTE1OTE2NyA5LjM1NjQ0NTMxIDg5LjM5MjMzMzk4IEM5LjM2NTY2MDEgOTAuMjE4OTkwNjMgOS4zNzQ4NzQ4OCA5MS4wNDU2NDcyOCA5LjM4NDM2ODkgOTEuODk3MzU0MTMgQzkuMzUwODAwODggOTYuNTE5MTE3NTMgOC45NTk2NTQ5NyA5OS40NzcxNzUyNyA2IDEwMy4yNSBDMS43NzI0MjA4NyAxMDYuNzExNjU4OTMgLTIuODcxMTUxMTIgMTA5LjYwNjMzODkzIC04LjQzNzUgMTA5LjgxMjUgQy0xMiAxMDkuMjUgLTEyIDEwOS4yNSAtMTMuOTM3NSAxMDcuOTM3NSBDLTE2LjI1MDI4OTE5IDEwNC4yNjQyNDY1OCAtMTYuMTIxNDQ3MDMgMTAwLjk4MTI2Njg0IC0xNi4xMTM1MjUzOSA5Ni43NTkwMzMyIEMtMTYuMTEzNjcxNDIgOTYuMTA1MTA1OSAtMTYuMTEzODE3NDQgOTUuNDUxMTc4NTkgLTE2LjExMzk2NzkgOTQuNzc3NDM1MyBDLTE2LjExMzI3MTg4IDkyLjYxODUxNjc0IC0xNi4xMDU0OTQwOCA5MC40NTk2ODQ3MiAtMTYuMDk3NjU2MjUgODguMzAwNzgxMjUgQy0xNi4wOTU3OTA5NiA4Ni44MDI5MTI4NyAtMTYuMDk0MzY3NTggODUuMzA1MDQzODkgLTE2LjA5MzM2ODUzIDgzLjgwNzE3NDY4IEMtMTYuMDg5NTUyMDcgNzkuODY2NTQ5ODEgLTE2LjA3OTcyOTIgNzUuOTI1OTYxODYgLTE2LjA2ODY2NDU1IDcxLjk4NTM1MTU2IEMtMTYuMDU4NDMxNzIgNjcuOTYzNTQ2NzUgLTE2LjA1Mzg2NjkgNjMuOTQxNzM1OTYgLTE2LjA0ODgyODEyIDU5LjkxOTkyMTg4IEMtMTYuMDM4MTA2MTYgNTIuMDI5OTMwOTkgLTE2LjAyMTA0MDE3IDQ0LjEzOTk3MDA5IC0xNiAzNi4yNSBDLTE2LjYwOTA4MjAzIDM3LjI4Nzg1NjQ1IC0xNy4yMTgxNjQwNiAzOC4zMjU3MTI4OSAtMTcuODQ1NzAzMTIgMzkuMzk1MDE5NTMgQy0xOC42NTczMTk1IDQwLjc2NjA4ODIzIC0xOS40NjkxODE0MSA0Mi4xMzcwMTE2IC0yMC4yODEyNSA0My41MDc4MTI1IEMtMjAuNjgxMTgxNjQgNDQuMTkwNzczOTMgLTIxLjA4MTExMzI4IDQ0Ljg3MzczNTM1IC0yMS40OTMxNjQwNiA0NS41NzczOTI1OCBDLTI0Ljc0Mzk5NDAxIDUxLjA0NzQxMTU1IC0yNy43MTI3NjIzOSA1NS45MDk4OTAwNSAtMzQuMDY2NjUwMzkgNTcuODk1OTk2MDkgQy0zNy40MDk2MTA1NiA1OC40NjQ3NDQ0NiAtMzkuODkxNjU5NTYgNTguODg0MjY1NjggLTQyLjkxNTUyNzM0IDU3LjE1MzgwODU5IEMtNDQuNzM3NzQyODUgNTUuNTMzNDM1MzQgLTQ2LjMzNjExMDY4IDUzLjgzODQxODA2IC00Ny45Mzc1IDUyIEMtNDguNTAwMTc1NzggNTEuNDAwNTg1OTQgLTQ5LjA2Mjg1MTU2IDUwLjgwMTE3MTg3IC00OS42NDI1NzgxMiA1MC4xODM1OTM3NSBDLTUyLjAxNDQ5NTkgNDcuNjI3NDc2ODcgLTU0LjA1OTY0NjczIDQ1LjE2MDUyOTkxIC01NiA0Mi4yNSBDLTU2LjAwODA4Njg1IDQyLjkxNTQxMzA2IC01Ni4wMTYxNzM3MSA0My41ODA4MjYxMSAtNTYuMDI0NTA1NjIgNDQuMjY2NDAzMiBDLTU2LjExMDU3NjU0IDUxLjE5MzMzOTg2IC01Ni4yMTAwODE2OCA1OC4xMTk5OTEyIC01Ni4zMTczODI4MSA2NS4wNDY2MzA4NiBDLTU2LjM1NTY2MDk5IDY3LjYzMTU0MzA1IC01Ni4zOTA1MTU4NiA3MC4yMTY1MDgyOSAtNTYuNDIxODc1IDcyLjgwMTUxMzY3IEMtNTYuNDY3NTUwMDYgNzYuNTE3NjA4MjMgLTU2LjUyNTU0MTcgODAuMjMzMzM3ODkgLTU2LjU4NTkzNzUgODMuOTQ5MjE4NzUgQy01Ni42MDMyNjQzMSA4NS42ODIyODUyMyAtNTYuNjAzMjY0MzEgODUuNjgyMjg1MjMgLTU2LjYyMDk0MTE2IDg3LjQ1MDM2MzE2IEMtNTYuNjQwODEwODUgODguNTMxMTA2MTEgLTU2LjY2MDY4MDU0IDg5LjYxMTg0OTA2IC01Ni42ODExNTIzNCA5MC43MjUzNDE4IEMtNTYuNjk0NDc2MDEgOTEuNjczNTQyOTQgLTU2LjcwNzc5OTY4IDkyLjYyMTc0NDA4IC01Ni43MjE1MjcxIDkzLjU5ODY3ODU5IEMtNTcuMTUxNDE1MzUgOTcuNjkxNjE1MTggLTU4LjAzODA1NDY2IDEwMC40MjU0NzU0MiAtNjEuMTg3NSAxMDMuMTI1IEMtNjQuODg4NTIxMjYgMTA0LjYwNTQwODUxIC02Ny4xODA2OTM5NCAxMDQuMjU4ODczMyAtNzEgMTAzLjI1IEMtNzMuMjY5NzkxNzQgOTkuODQ1MzEyMzkgLTczLjIzNjYzMzY1IDk4LjcyMjkwNzM0IC03My4xOTMxMTUyMyA5NC43MzYwODM5OCBDLTczLjE4NjQzMzI2IDkzLjYwMjAzNjI5IC03My4xNzk3NTEyOCA5Mi40Njc5ODg1OSAtNzMuMTcyODY2ODIgOTEuMjk5NTc1ODEgQy03My4xNDcyMzkxNSA4OS40NDc3ODk2OSAtNzMuMTQ3MjM5MTUgODkuNDQ3Nzg5NjkgLTczLjEyMTA5Mzc1IDg3LjU1ODU5Mzc1IEMtNzMuMTA1ODY0NDUgODUuNTg5MjA3NjggLTczLjA5MDY2MzY4IDgzLjYxOTgyMTAyIC03My4wNzY5MjI0MiA4MS42NTA0MjQgQy03My4wNjY4ODkwNiA4MC4yNzY2ODEzMiAtNzMuMDU1NTY5OTQgNzguOTAyOTQ3NDggLTczLjA0MzAzNDU1IDc3LjUyOTIyNTM1IEMtNzIuOTg5NDgwMzcgNzEuNDM5ODQwOTkgLTczLjAyNzIzMDggNjUuMzUzNTU0MzQgLTczLjA3NDEyNzIgNTkuMjY0MDY4NiBDLTczLjEwNTUzNzE5IDUzLjk1MjQzODYxIC03My4wODk2MTY2NSA0OC42NDE0NzkgLTczLjA2NzEzODY3IDQzLjMyOTgzMzk4IEMtNzMuMDU4ODMyNTEgNDAuNjA5ODk3MTYgLTczLjA3MzkxNjQxIDM3Ljg5MTM4MjIgLTczLjEwNjIwMTE3IDM1LjE3MTYzMDg2IEMtNzMuMTUyODY1MSAzMS4xNjY3NjI3MiAtNzMuMTI3MzM3NDMgMjcuMTY1MTg4NjMgLTczLjA5NzY1NjI1IDIzLjE2MDE1NjI1IEMtNzMuMTIyMjM0MDQgMjEuOTQ3Nzk4IC03My4xNDY4MTE4MyAyMC43MzU0Mzk3NiAtNzMuMTcyMTM0NCAxOS40ODYzNDMzOCBDLTczLjAzMjgyODYyIDExLjM2NzQ3NDY5IC03My4wMzI4Mjg2MiAxMS4zNjc0NzQ2OSAtNzAuMDYzNjkwMTkgOC4xNTQ5OTg3OCBDLTY2LjY2MjM1MDczIDUuODAwMDc3ODQgLTYzLjE1Nzk5MDIyIDMuNzc2MjAzOTUgLTU5IDMuMjUgQy01My43ODI4NjUxMSA2Ljc2ODUzMjgzIC01MC4zNzM2NDQgMTEuNDA1Mjc2NTUgLTQ2LjY4NzUgMTYuNDM3NSBDLTQxLjc1ODU2MTE3IDIzLjAzNjExMjQzIC0zNi42ODA3ODUwOCAyOS4yNzU2MzQzIC0zMSAzNS4yNSBDLTI2LjYwMjUyOTgxIDMzLjc4NDE3NjYgLTI1LjY2MzY1NjI1IDMwLjM1NzYwMTY1IC0yMy42ODc1IDI2LjQzNzUgQy0yMy4yOTAxNDY0OCAyNS42NzE1NTUxOCAtMjIuODkyNzkyOTcgMjQuOTA1NjEwMzUgLTIyLjQ4MzM5ODQ0IDI0LjExNjQ1NTA4IEMtMjAuNjg1MDM1NTUgMjAuNjM0NDAyMjQgLTE4LjkzMDcwMzE4IDE3LjEzNTk3MTEgLTE3LjI1MzkwNjI1IDEzLjU5Mzc1IEMtMTYuNzU3NjE3MTkgMTIuNTUyMTg3NSAtMTYuMjYxMzI4MTIgMTEuNTEwNjI1IC0xNS43NSAxMC40Mzc1IEMtMTUuMzMyMzQzNzUgOS41MjM1NTQ2OSAtMTQuOTE0Njg3NSA4LjYwOTYwOTM4IC0xNC40ODQzNzUgNy42Njc5Njg3NSBDLTEwLjk4NDA2NTY2IDEuOTY2MTQ5MDYgLTYuNDU1NjEyMTUgMC4xMTUyNzg3OSAwIDAgWiAiIGZpbGw9IiNGRUUwMDEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUzNyw3NS43NSkiPjwvcGF0aD4KICA8cGF0aCBkPSJNMCAwIEMyLjA1Mjg0MjcxIDAuMTMyMTU0MDcgNC4xMDYyMjUwOSAwLjI1MDQzNzAzIDYuMTU5OTEyMTEgMC4zNjg2NTIzNCBDNy40NTczNTM1MiAwLjQ1MjQ0MTQxIDguNzU0Nzk0OTIgMC41MzYyMzA0NyAxMC4wOTE1NTI3MyAwLjYyMjU1ODU5IEMxMS4yNjc5MDI4MyAwLjY5NTg3NDAyIDEyLjQ0NDI1MjkzIDAuNzY5MTg5NDUgMTMuNjU2MjUgMC44NDQ3MjY1NiBDMTYuNDYyNjQ2NDggMS4yNTUzNzEwOSAxNi40NjI2NDY0OCAxLjI1NTM3MTA5IDE4LjQ2MjY0NjQ4IDMuMjU1MzcxMDkgQzE5LjUyNTUzOTAzIDcuMTExNzYzMjkgMTkuNjU3NjYyOTkgMTAuODk0MDY3NDQgMTkuNzEyNjQ2NDggMTQuODgwMzcxMDkgQzE5LjczODQyNzczIDE2LjAwNzAxMTcyIDE5Ljc2NDIwODk4IDE3LjEzMzY1MjM0IDE5Ljc5MDc3MTQ4IDE4LjI5NDQzMzU5IEMxOS40NjI2NDY0OCAyMS4yNTUzNzEwOSAxOS40NjI2NDY0OCAyMS4yNTUzNzEwOSAxOC40NDcwMjE0OCAyMy4wMjg4MDg1OSBDMTEuMTU3MDk5NzEgMjcuNTM0NzgzODYgMS43MDE4NjQ0NiAyNi42ODY2OTcwMiAtNi41MzczNTM1MiAyNi44ODAzNzEwOSBDLTcuODk4MDUzNSAyNi45MTg2Mjc2MSAtOS4yNTg3MzEyNSAyNi45NTc2ODM1NyAtMTAuNjE5Mzg0NzcgMjYuOTk3NTU4NTkgQy0xMy45MjUxNjExNSAyNy4wOTEzMzk0OCAtMTcuMjMxMjM4MDIgMjcuMTc0NDIyMzkgLTIwLjUzNzM1MzUyIDI3LjI1NTM3MTA5IEMtMjAuNTM3MzUzNTIgMzIuODY1MzcxMDkgLTIwLjUzNzM1MzUyIDM4LjQ3NTM3MTA5IC0yMC41MzczNTM1MiA0NC4yNTUzNzEwOSBDLTE3LjQ2MjkzOTQ1IDQ0LjIzNzk2ODc1IC0xNy40NjI5Mzk0NSA0NC4yMzc5Njg3NSAtMTQuMzI2NDE2MDIgNDQuMjIwMjE0ODQgQy0xMi4zMDczNzQyOSA0NC4yMTMyNTI2MyAtMTAuMjg4MzMyMjUgNDQuMjA2MzI5MzIgLTguMjY5Mjg3MTEgNDQuMjAwNDM5NDUgQy02Ljg4MjU2MDQ2IDQ0LjE5NTQ1ODE2IC01LjQ5NTgzODkyIDQ0LjE4ODY3MDcgLTQuMTA5MTMwODYgNDQuMTc5OTMxNjQgQzE3LjQ5MjM3OTM2IDQ0LjA0NzM1OTIgMTcuNDkyMzc5MzYgNDQuMDQ3MzU5MiAyMS4xNjMzMzAwOCA0Ni4yOTgwOTU3IEMyNC43MDkyNDc5OCA1MS42Mzk2MjU5MiAyMy42MzY2MTQ4NCA2MC4yNzM3ODI0NCAyMy42NjU3NzE0OCA2Ni40ODU4Mzk4NCBDMjMuNjcxNDcxNTYgNjcuNDM5Mjg3ODcgMjMuNjc3MTcxNjMgNjguMzkyNzM1OSAyMy42ODMwNDQ0MyA2OS4zNzUwNzYyOSBDMjMuNjkyNDM3NzMgNzEuMzc3NzI1MyAyMy42OTkwMDU2NyA3My4zODAzODkzNiAyMy43MDI4ODA4NiA3NS4zODMwNTY2NCBDMjMuNzEyNjUwOTggNzguNDQ0MjgwMjMgMjMuNzQzNzUzNDMgODEuNTA0ODQ5NjYgMjMuNzc1MTQ2NDggODQuNTY1OTE3OTcgQzIzLjc4MTY3MTYzIDg2LjUxODM4Nzk3IDIzLjc4NjkyNDAxIDg4LjQ3MDg2MjczIDIzLjc5MDc3MTQ4IDkwLjQyMzMzOTg0IEMyMy44MDMxMTgyOSA5MS4zMzQ4ODMyNyAyMy44MTU0NjUwOSA5Mi4yNDY0MjY3IDIzLjgyODE4NjA0IDkzLjE4NTU5MjY1IEMyMy44MTEzMDgyOCA5Ny45OTIzODMyNiAyMy43NDYwNTk5MyAxMDEuNDU3MDc5MDYgMjAuNDYyNjQ2NDggMTA1LjI1NTM3MTA5IEMxNi41NjU1NzM2NiAxMDguMzMyOTQwMzYgMTMuNDMxMjY0ODUgMTA4LjY2MTQwMzg1IDguNTM2ODY1MjMgMTA4Ljc2NzA4OTg0IEM3Ljg3MTYxMzMxIDEwOC43ODUwNDEwNSA3LjIwNjM2MTM5IDEwOC44MDI5OTIyNSA2LjUyMDk1MDMyIDEwOC44MjE0ODc0MyBDNC4zOTc0MTUyMiAxMDguODc1MzIzNyAyLjI3NDA4Njk2IDEwOC45MDkyMjY5MSAwLjE1MDE0NjQ4IDEwOC45NDI4NzEwOSBDLTEuMjMzMzQ4MDkgMTA4Ljk3NjEwODY5IC0yLjYxNjgxMzA1IDEwOS4wMTA2MDQxIC00LjAwMDI0NDE0IDEwOS4wNDYzODY3MiBDLTQwLjYzOTE1MjE3IDEwOS45MzI0NzcxMiAtNDAuNjM5MTUyMTcgMTA5LjkzMjQ3NzEyIC00NS43NzE3Mjg1MiAxMDYuOTYyNDAyMzQgQy00OC41MTk5MDU1OCAxMDQuMzA1NDI1ODUgLTQ4LjQ4MjQ1NDEzIDEwMi4xNzIwNjMxOCAtNDguNzA1MzIyMjcgOTguNDUwNjgzNTkgQy00OC43NzEwNTgzOSA4OC4xMTY5NjQwNyAtNDguNzcxMDU4MzkgODguMTE2OTY0MDcgLTQ2LjUzNzM1MzUyIDgzLjI1NTM3MTA5IEMtNDUuNTM3MzUzNTIgODIuMjU1MzcxMDkgLTQ1LjUzNzM1MzUyIDgyLjI1NTM3MTA5IC00Mi4wNzQ5NTExNyA4Mi4xNTc3MTQ4NCBDLTQwLjUzMzc0Mzk3IDgyLjE2NDY3OTEyIC0zOC45OTI1NTQ5NSA4Mi4xNzY3Nzk1MiAtMzcuNDUxNDE2MDIgODIuMTkyODcxMDkgQy0zNi42Mzg2OTIzMiA4Mi4xOTY2NTc3MSAtMzUuODI1OTY4NjMgODIuMjAwNDQ0MzQgLTM0Ljk4ODYxNjk0IDgyLjIwNDM0NTcgQy0zMS40OTc5NjUyMSA4Mi4yMjA3NTM1OSAtMjguMDA3NDI4NTQgODIuMjQ4ODIwMTIgLTI0LjUxNjg0NTcgODIuMjc1ODc4OTEgQy0yMS45NzQyMDc5NSA4Mi4yOTM5Mzg3NiAtMTkuNDMxNTg5MTkgODIuMzA2MDUyMTYgLTE2Ljg4ODkxNjAyIDgyLjMxNzg3MTA5IEMtMTUuNzAyODUyNjMgODIuMzMwMzE4NiAtMTUuNzAyODUyNjMgODIuMzMwMzE4NiAtMTQuNDkyODI4MzcgODIuMzQzMDE3NTggQy0xMS4yMzc4MzM3NiA4Mi4zNTc2MDAyMSAtOC42NDg3NTIyIDgyLjI5MjUwMzk5IC01LjUzNzM1MzUyIDgxLjI1NTM3MTA5IEMtNS4xNjUyODQ4NyA3OS4zMjEyMjkxMSAtNC44MTU4NTM0NyA3Ny4zODI3MzE3NCAtNC40NzQ4NTM1MiA3NS40NDI4NzEwOSBDLTQuMjc3NjI2OTUgNzQuMzYzOTI1NzggLTQuMDgwNDAwMzkgNzMuMjg0OTgwNDcgLTMuODc3MTk3MjcgNzIuMTczMzM5ODQgQy0zLjQzNzczNDI2IDY3LjEwNjg4Njk4IC0zLjk0ODU3MDc3IDYyLjI5Mjg2MTUxIC00LjUzNzM1MzUyIDU3LjI1NTM3MTA5IEMtNS4zNjQ2MDkzNyA1Ny4yMzU1NTE3NiAtNi4xOTE4NjUyMyA1Ny4yMTU3MzI0MiAtNy4wNDQxODk0NSA1Ny4xOTUzMTI1IEMtMTAuNzkyMjMxNTcgNTcuMTAwMDU4OTcgLTE0LjUzOTcxNjY4IDU2Ljk5MDM4IC0xOC4yODczNTM1MiA1Ni44ODAzNzEwOSBDLTE5LjU4OTMwNjY0IDU2Ljg0OTQzMzU5IC0yMC44OTEyNTk3NyA1Ni44MTg0OTYwOSAtMjIuMjMyNjY2MDIgNTYuNzg2NjIxMDkgQy0yMy40ODMwNTY2NCA1Ni43NDc5NDkyMiAtMjQuNzMzNDQ3MjcgNTYuNzA5Mjc3MzQgLTI2LjAyMTcyODUyIDU2LjY2OTQzMzU5IEMtMjcuMTczODI4MTIgNTYuNjM4MDEyNyAtMjguMzI1OTI3NzMgNTYuNjA2NTkxOCAtMjkuNTEyOTM5NDUgNTYuNTc0MjE4NzUgQy0zMi40MTgwMTgwOSA1Ni4yNjc5NTE5OCAtMzQuMTMxNzE4OCA1NS44NzQyNzcyOSAtMzYuNTM3MzUzNTIgNTQuMjU1MzcxMDkgQy0zOS4zMzA2NjM4MyA0OC42OTYzMTYwMiAtMzkuMTQ4NTQ2MjIgNDIuMTY5OTg1NjQgLTM5LjUzNzM1MzUyIDM2LjA2Nzg3MTA5IEMtNDAuMDA5NzQ3NzYgMjguNzg1MTI2NDYgLTQwLjY1MzEzOTkzIDIxLjgxMjE0Njg1IC00Mi4zNDg2MzI4MSAxNC42OTk0NjI4OSBDLTQyLjc1MzEzNjkzIDkuNDYwNzk0NCAtMzkuMzA2MDExODQgNS40MjAzNjc0MiAtMzYuMTQyODIyMjcgMS41NDgzMzk4NCBDLTM0LjA2NDY1NTM0IC0wLjEyNTMxNzcxIC0zMi42ODQ3OTg4OSAtMC4yMzg3Mjc4NiAtMzAuMDM3MzUzNTIgLTAuNDMyMTI4OTEgQy0yOS4yNjM5MTYwMiAtMC40OTc4NzEwOSAtMjguNDkwNDc4NTIgLTAuNTYzNjEzMjggLTI3LjY5MzYwMzUyIC0wLjYzMTM0NzY2IEMtMTguNDMwMzI5MzEgLTAuOTYzODE2NjYgLTkuMjQ3NTE1OTQgLTAuNjA2MDYyMDggMCAwIFogIiBmaWxsPSIjRkVFMTAxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxODcuNTM3MzUzNTE1NjI1LDIyNS43NDQ2Mjg5MDYyNSkiPjwvcGF0aD4KICA8cGF0aCBkPSJNMCAwIEMwLjcxMTA1ODk2IC0wLjAwMTkxMzQ1IDEuNDIyMTE3OTIgLTAuMDAzODI2OSAyLjE1NDcyNDEyIC0wLjAwNTc5ODM0IEMzLjY2NDM1MDkyIC0wLjAwNzE1ODI1IDUuMTczOTg5NDggLTAuMDAzNDc1MyA2LjY4MzU5Mzc1IDAuMDA0ODgyODEgQzguOTM1MTgyOTYgMC4wMTUzOTUzMyAxMS4xODU5Mzg3NiAwLjAwNTA4MTkgMTMuNDM3NSAtMC4wMDc4MTI1IEM0MC41MTY1OTQ3OSAtMC4wMzYxMDIwOSA0MC41MTY1OTQ3OSAtMC4wMzYxMDIwOSA0Ni43MzQzNzUgNC4yNjU2MjUgQzQ3Ljg0OTU1ODU2IDcuNjExMTc1NjcgNDcuOTQyNjkxNCAxMC4yODIwMTM4MiA0OC4wNTA3ODEyNSAxMy44MDg1OTM3NSBDNDguMDcxNjk4MyAxNC40NzI4Mzg1OSA0OC4wOTI2MTUzNiAxNS4xMzcwODM0NCA0OC4xMTQxNjYyNiAxNS44MjE0NTY5MSBDNDguMTgxMTAzMjMgMTguMDMxODg2MDYgNDguMjM5ODQ0NTEgMjAuMjQyNDE5MDcgNDguMjk2ODc1IDIyLjQ1MzEyNSBDNDguMzI3NjQ2MzMgMjMuNTk0NzAwNjIgNDguMzI3NjQ2MzMgMjMuNTk0NzAwNjIgNDguMzU5MDM5MzEgMjQuNzU5MzM4MzggQzQ4LjY3ODQ4OTI1IDM2Ljg1MDA4Njg5IDQ4Ljg2Mjc1MTkzIDQ4Ljk0MjE0MjQ4IDQ4LjkxMDYxNDAxIDYxLjAzNzAxNzgyIEM0OC45MTgwMzUxOCA2Mi43NTI4MzQ5OSA0OC45Mjg2Mzk3OSA2NC40Njg2NDE3NyA0OC45NDI2NTc0NyA2Ni4xODQ0MTc3MiBDNDkuMTM3NzYxNzIgOTIuMzkxMDY0NjQgNDkuMTM3NzYxNzIgOTIuMzkxMDY0NjQgNDQuODMyNzYzNjcgOTcuNTQwMDM5MDYgQzM0Ljg1NTM2MTYzIDEwNS43NDQ4NDE1OCAxNS4wNDg1Mjg3MSAxMDYuMTUzNjc4MTUgMi43MzQzNzUgMTA2LjI2NTYyNSBDLTAuODcxMDAwNTYgMTA1Ljg3OTMzNDc2IC0zLjk4MzE2NzcgMTA1LjI4MzAxNTIxIC02Ljg5NjcyODUyIDEwMi45NzE2NDkxNyBDLTExLjMwMTg1MjIxIDk3LjQ4MTY0NDkzIC0xMC42MjA4NTI2MSA4Ny43NDUwMTA3OSAtMTAuODI4MTI1IDgxLjAwNzgxMjUgQy0xMC44ODMzNTMyNyA3OS41ODc3MjM4NSAtMTAuODgzMzUzMjcgNzkuNTg3NzIzODUgLTEwLjkzOTY5NzI3IDc4LjEzODk0NjUzIEMtMTEuMDU1OTMzMjQgNzUuMTM5NzMxNDggLTExLjE2MTk1NDEgNzIuMTQwMjk4ODEgLTExLjI2NTYyNSA2OS4xNDA2MjUgQy0xMS42ODA4MzIzNiA1Ny4yNTQ4MjkzMSAtMTIuMjA4NDgyMyA0NS41NDE2MzM5NSAtMTMuODMzNDk2MDkgMzMuNzU1MzcxMDkgQy0xNC40NTg2Mzc0OSAyOC43MDY5MTI4NiAtMTQuNTk2NTYzNjYgMjMuNzIyMzE5MTggLTE0LjU3ODEyNSAxOC42NDA2MjUgQy0xNC41OTQyMzgyOCAxNy43MTM3ODkwNiAtMTQuNjEwMzUxNTYgMTYuNzg2OTUzMTIgLTE0LjYyNjk1MzEyIDE1LjgzMjAzMTI1IEMtMTQuNjMwNjk1MTcgMTAuNjAwNjU4NDkgLTE0LjM2NDA1ODI2IDYuNjk5OTUxNiAtMTEuMjY1NjI1IDIuMjY1NjI1IEMtNy42ODAxMDg0NSAtMC4yMDE2MzM3NyAtNC4yNTY3MTY3NiAwLjAwNzM3NzMzIDAgMCBaIE00LjczNDM3NSAyOS4yNjU2MjUgQzEuNTIxNzE4NTYgNDEuNDg0ODYxNjIgMi44ODM2MzUzMyA1OC4wNjk5NDcyNiA1LjczNDM3NSA3MC4yNjU2MjUgQzcuNjQxNTc3NDMgNzIuODQ0Mzc3NTggOC42MTg2MTA4OSA3My4yMjcwMzY5NiAxMS43MzQzNzUgNzQuMjY1NjI1IEMxNC4zOTYxODkgNzQuNDM5MjgzNDUgMTcuMDA4NjkyOTkgNzQuNTQyMzYxNTkgMTkuNjcxODc1IDc0LjU3ODEyNSBDMjAuMzg3OTQ5MjIgNzQuNjA3MTI4OTEgMjEuMTA0MDIzNDQgNzQuNjM2MTMyODEgMjEuODQxNzk2ODggNzQuNjY2MDE1NjIgQzI1LjEyNDkyODMzIDc0LjcwNTU3MTQzIDI3LjM1MjY4MTk0IDc0LjQ5NTM3MDE4IDMwLjE4NzUgNzIuNzg5MDYyNSBDMzIuNDQyMTI2MzMgNjkuMTExMDYwOTYgMzIuNDUzNDQwOTEgNjUuODI1OTc4NzEgMzIuNTQ2ODc1IDYxLjU3ODEyNSBDMzIuNTc2MjAxMTcgNjAuNzQzOTQwNDMgMzIuNjA1NTI3MzQgNTkuOTA5NzU1ODYgMzIuNjM1NzQyMTkgNTkuMDUwMjkyOTcgQzMyLjc5MzU5MTk1IDUzLjMyNTUzNjE3IDMyLjc0MzkyMjI4IDQ3LjYxMTQwMDggMzIuNDg0Mzc1IDQxLjg5MDYyNSBDMzIuNDQ1MzQwNTggNDAuODQ5MDIyMjIgMzIuNDQ1MzQwNTggNDAuODQ5MDIyMjIgMzIuNDA1NTE3NTggMzkuNzg2Mzc2OTUgQzMyLjEzOTUwMTcxIDM1LjU0NDIzMzk4IDMxLjQyMjQ3MDYxIDMyLjU5NjM5MTc0IDI4LjczNDM3NSAyOS4yNjU2MjUgQzIyLjM2MjczMzk5IDI2LjA1OTUxMjY1IDEwLjYwNTg0NzY0IDI1LjM1MTMwOTkgNC43MzQzNzUgMjkuMjY1NjI1IFogIiBmaWxsPSIjRkVFMDAxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0OTYuMjY1NjI1LDIyNy43MzQzNzUpIj48L3BhdGg+CiAgPHBhdGggZD0iTTAgMCBDNy40NjUwOTAyIDYuNDU2Mjk0MjMgMTAuODUwMTQzNDggMTQuOTM1NjI4NDMgMTQuMzEyNSAyNCBDMTQuNzMwMTU2MjUgMjUuMDc3NjU2MjUgMTUuMTQ3ODEyNSAyNi4xNTUzMTI1IDE1LjU3ODEyNSAyNy4yNjU2MjUgQzIxLjY2NjQzNjMzIDQ0LjY3MzA1MDM2IDE3Ljc1NDkwNzU3IDY0LjUwODIwNzQ0IDEwLjc3NzM0Mzc1IDgxLjE5OTIxODc1IEMzLjE1NzQ0Njk1IDk1Ljc2ODQ2MTQ0IC0xMS45Nzc4NDUxNSAxMDAuOTQ5NDAzODkgLTI2LjczNDM3NSAxMDUuNjUyMzQzNzUgQy0yOS42ODI3MDcxOCAxMDYuMTc3MTQ2ODggLTMyLjU3MDM1NTM4IDEwNi4yMTEzOTE2OCAtMzUuNTYyNSAxMDYuMjUgQy0zNi43NTYxNzE4OCAxMDYuMjc1NzgxMjUgLTM3Ljk0OTg0Mzc1IDEwNi4zMDE1NjI1IC0zOS4xNzk2ODc1IDEwNi4zMjgxMjUgQy00My4wNTM4MTg1NiAxMDUuOTY1NzM0MTIgLTQ1LjQwMDAzNTY2IDEwNS4wNTEwNzEwNSAtNDguNjg3NSAxMDMgQy01Mi4zOTE0NDM3OCA5Ny40NDQwODQzMyAtNTEuODQxOTE3MTUgOTAuMjQwMzk3OTggLTUxLjg4MDM3MTA5IDgzLjcxOTcyNjU2IEMtNTEuODg4NTQ4NTggODIuOTM0OTQ0MzEgLTUxLjg5NjcyNjA3IDgyLjE1MDE2MjA1IC01MS45MDUxNTEzNyA4MS4zNDE1OTg1MSBDLTUxLjkyOTczNTAzIDc4Ljc3NDYxNDc0IC01MS45NDY0Mzk2NSA3Ni4yMDc2ODQ2OCAtNTEuOTYwOTM3NSA3My42NDA2MjUgQy01MS45NjYyNjExOCA3Mi43NTkzMTY2NCAtNTEuOTcxNTg0ODUgNzEuODc4MDA4MjcgLTUxLjk3NzA2OTg1IDcwLjk2OTk5MzU5IEMtNTIuMDAzNjY3MjkgNjYuMzE2NDMwNCAtNTIuMDIzMDk1NDMgNjEuNjYyODkyOTYgLTUyLjAzNzU5NzY2IDU3LjAwOTI3NzM0IEMtNTIuMDUwOTk2MTQgNTMuMTYyMzU4OTkgLTUyLjA3ODk3NTMgNDkuMzE1OTYzNjQgLTUyLjExOTYyODkxIDQ1LjQ2OTIzODI4IEMtNTIuMTY4ODQwMTUgNDAuODEwOTk2OTQgLTUyLjE5MzcwMTYyIDM2LjE1MzIzMzUzIC01Mi4yMDA4MjQ3NCAzMS40OTQ3NDMzNSBDLTUyLjIwNzU0NDMzIDI5LjcyMjg2NDkgLTUyLjIyMjc4NDg0IDI3Ljk1MDk5NzQ2IC01Mi4yNDY3MTU1NSAyNi4xNzkyNjc4OCBDLTUyLjI3ODI0NTQ0IDIzLjcwNjUwNDE3IC01Mi4yNzg0MjQ3IDIxLjIzNTYwNjIzIC01Mi4yNzA5OTYwOSAxOC43NjI2OTUzMSBDLTUyLjI4NzQwMTQzIDE4LjAzMjIzNDk1IC01Mi4zMDM4MDY3NiAxNy4zMDE3NzQ2IC01Mi4zMjA3MDkyMyAxNi41NDkxNzkwOCBDLTUyLjI3NDI4Mzk5IDEyLjc3OTMyMDU3IC01MS45OTI5NjQ3MyAxMS4zMDgzMjg2NSAtNDkuMjk1MDc0NDYgOC41ODUxNDQwNCBDLTQxLjMyMDE0MDEyIDMuNzM3MTgyOSAtMzIuMDYxNDk4MDQgMi4zNjUyOTE3MSAtMjMgMC43NSBDLTIyLjAyNjI3NDQxIDAuNTc0Njg3NSAtMjEuMDUyNTQ4ODMgMC4zOTkzNzUgLTIwLjA0OTMxNjQxIDAuMjE4NzUgQy01Ljg0NjMwMzUgLTIuMTc1MzY4NzQgLTUuODQ2MzAzNSAtMi4xNzUzNjg3NCAwIDAgWiBNLTIzLjY4NzUgMTggQy0yNC44MzEzNjg2OSAyMC4yODc3MzczOCAtMjQuODE0MTg2MjUgMjEuNTYyMDg4ODQgLTI0LjgxNjg5NDUzIDI0LjEwNDAwMzkxIEMtMjQuODIwMDQ2NjkgMjQuOTUzMTQzNjIgLTI0LjgyMzE5ODg1IDI1LjgwMjI4MzMzIC0yNC44MjY0NDY1MyAyNi42NzcxNTQ1NCBDLTI0LjgyNDQyMjMgMjcuNjAwOTU5MTcgLTI0LjgyMjM5ODA3IDI4LjUyNDc2Mzc5IC0yNC44MjAzMTI1IDI5LjQ3NjU2MjUgQy0yNC44MjEyNjkyMyAzMC40MzQ2MDc4NSAtMjQuODIyMjI1OTUgMzEuMzkyNjUzMiAtMjQuODIzMjExNjcgMzIuMzc5NzMwMjIgQy0yNC44MjM4OTM4MiAzNC40MTkxNjk3NyAtMjQuODIyMDM3MTMgMzYuNDU4NjExNDcgLTI0LjgxNzg3MTA5IDM4LjQ5ODA0Njg4IEMtMjQuODEyNjA1MDMgNDEuNTYzODU0NDggLTI0LjgxNzc3MTc0IDQ0LjYyOTUwOTk5IC0yNC44MjQyMTg3NSA0Ny42OTUzMTI1IEMtMjYuMTU0ODcwNjUgNjYuNjA2NjgwOTEgLTI2LjE1NDg3MDY1IDY2LjYwNjY4MDkxIC0yMS42ODc1IDg0IEMtMTQuNzg3ODY0MDEgODIuOTQ4MTQ5ODcgLTguNDgzMTI5MzUgNzkuNDM3MjE1MzMgLTMuMjUgNzQuODc1IEMzLjU2MjUxMDQ0IDYyLjMzOTk4MDggNS42MzgyMTkxNCA0Ny4zNDI4MTc5NyAxLjc3NTM5MDYyIDMzLjU4NTQ0OTIyIEMtMC4xNTgzODA0NCAyNy4zODQ4OTY1MSAtMi4yMTQxNzkwMSAyMS44MjY0Nzc5MSAtNi42ODc1IDE3IEMtMTIuMjE0MDQ2NDcgMTUuMTU3ODE3ODQgLTE4LjUxNDg4Mzk2IDE1LjA5MDQwMzQ4IC0yMy42ODc1IDE4IFogIiBmaWxsPSIjRkVFMDAxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0MTUuNjg3NSwyMjcpIj48L3BhdGg+CiAgPHBhdGggZD0iTTAgMCBDMS4xOTEwOTM3NSAwLjAyMTI2OTUzIDEuMTkxMDkzNzUgMC4wMjEyNjk1MyAyLjQwNjI1IDAuMDQyOTY4NzUgQzMuMjAwMzEyNSAwLjA0OTQxNDA2IDMuOTk0Mzc1IDAuMDU1ODU5MzggNC44MTI1IDAuMDYyNSBDNi45MDYyNSAwLjIzMDQ2ODc1IDYuOTA2MjUgMC4yMzA0Njg3NSA4LjkwNjI1IDEuMjMwNDY4NzUgQzEwLjIzMzI0MjA5IDYuNjIyNzc3NTMgMTAuMjIyMzQ5MzUgMTIuMjQzMTM3MzMgMTAuNDQxNDA2MjUgMTcuNzY5NTMxMjUgQzEwLjQ4NDU2NDY3IDE4Ljc5NjE4ODk2IDEwLjUyNzcyMzA4IDE5LjgyMjg0NjY4IDEwLjU3MjE4OTMzIDIwLjg4MDYxNTIzIEMxMC43MDk1OTg2OSAyNC4yMDUzNzk3NyAxMC44NDAxMDUyNCAyNy41MzAzNTQxMiAxMC45Njg3NSAzMC44NTU0Njg3NSBDMTEuMDEyOTQwNjcgMzEuOTgxODQ3NTMgMTEuMDU3MTMxMzUgMzMuMTA4MjI2MzIgMTEuMTAyNjYxMTMgMzQuMjY4NzM3NzkgQzExLjYxNDQ4NTI2IDQ3LjQ2MTUxMDc3IDEyLjEwMzcyOTc0IDYwLjY1MTY5MjEgMTIuMTU2MjUgNzMuODU1NDY4NzUgQzEyLjE2NTM1NCA3NC45Mjg3NzQ0MSAxMi4xNzQ0NTgwMSA3Ni4wMDIwODAwOCAxMi4xODM4Mzc4OSA3Ny4xMDc5MTAxNiBDMTIuMTI5NTg2NzcgOTAuNTk1NDAyOTUgMTIuMTI5NTg2NzcgOTAuNTk1NDAyOTUgOC4yMTg3NSA5NS4yMzA0Njg3NSBDNS4wNDY5NzE4OCA5Ni42MDIwNDg0OCAyLjMxOTA1MDYxIDk2LjQyNzM2MTA5IC0xLjA5Mzc1IDk2LjIzMDQ2ODc1IEMtMi4wODM3NSA5My45MjA0Njg3NSAtMy4wNzM3NSA5MS42MTA0Njg3NSAtNC4wOTM3NSA4OS4yMzA0Njg3NSBDLTQuNjg4MDA3ODEgODkuMzE2MTEwODQgLTUuMjgyMjY1NjIgODkuNDAxNzUyOTMgLTUuODk0NTMxMjUgODkuNDg5OTkwMjMgQy04LjYyNzQ5NTEgODkuODgzNDExNjQgLTExLjM2MDYyMDg4IDkwLjI3NTY5NzIxIC0xNC4wOTM3NSA5MC42Njc5Njg3NSBDLTE1LjAyODMyMDMxIDkwLjgwMjY3NTc4IC0xNS45NjI4OTA2MiA5MC45MzczODI4MSAtMTYuOTI1NzgxMjUgOTEuMDc2MTcxODggQy0xOS42NDc3MDE0IDkxLjQ2NjM3NzIxIC0yMi4zNzA0NTkzOCA5MS44NDk5NTYyOCAtMjUuMDkzNzUgOTIuMjMwNDY4NzUgQy0yNS44MDgyMTI4OSA5Mi4zMzI3MDc1MiAtMjYuNTIyNjc1NzggOTIuNDM0OTQ2MjkgLTI3LjI1ODc4OTA2IDkyLjU0MDI4MzIgQy0zMi4xMzA2MDczMiA5My4yMDE5NDAxOCAtMzYuOTM1MTM3ODYgOTMuNDc3NTc4NzEgLTQxLjg0Mzc1IDkzLjU0Mjk2ODc1IEMtNDIuOTU1NTY2NDEgOTMuNTg2NDc0NjEgLTQyLjk1NTU2NjQxIDkzLjU4NjQ3NDYxIC00NC4wODk4NDM3NSA5My42MzA4NTkzOCBDLTQ3LjUxNjc1OTk5IDkzLjY3MDg1MDMyIC00OS42NjYzMjk2NyA5My41MjA0MzA3IC01Mi41MzUxNTYyNSA5MS41NzQyMTg3NSBDLTYwLjk1NDU4ODAzIDc4LjkxMzQxOTA4IC01Ny4xODAwODM2NiA1MS40MDU4NzcxNyAtNTcuMjE4NzUgMzYuOTE3OTY4NzUgQy01Ny4yMjM0MjI4NSAzNS43MDg3NDc1NiAtNTcuMjI4MDk1NyAzNC40OTk1MjYzNyAtNTcuMjMyOTEwMTYgMzMuMjUzNjYyMTEgQy01Ny4xOTk2MTM5NyAxNC44MzQ0Njk2NSAtNTcuMTk5NjEzOTcgMTQuODM0NDY5NjUgLTU0LjM1OTM3NSAxMC43MTQ4NDM3NSBDLTQ4LjI5MTkzNzkxIDYuNzM5NjI2MzQgLTQwLjIyODc4Mzc5IDUuMzM4NTg5NTMgLTMzLjA5Mzc1IDYuMjMwNDY4NzUgQy0yNy41NjYwODQzMyAxMS42NjYzMjg3OSAtMjkuMTA1MjI3MzcgMjEuNDAxMDAwNjYgLTI5LjAzOTA2MjUgMjguNjc0ODA0NjkgQy0yOS4wMTc2NjU5NiAzNC4zMDI1Mzk1NiAtMjkuMDY3MTg0NTkgMzkuOTI5NjM3MDYgLTI5LjExNDI1NzgxIDQ1LjU1NzEyODkxIEMtMjkuMTk3Mzc5ODQgNTYuNTAwNzk5ODIgLTI4LjkzODE3MjUyIDY3LjMxNTE3Njc4IC0yOC4wOTM3NSA3OC4yMzA0Njg3NSBDLTI2LjgzNjU5MTggNzguMjM5NDkyMTkgLTI1LjU3OTQzMzU5IDc4LjI0ODUxNTYyIC0yNC4yODQxNzk2OSA3OC4yNTc4MTI1IEMtMjMuNTc3MDI4MiA3OC4yNjI4ODgxOCAtMjIuODY5ODc2NzEgNzguMjY3OTYzODcgLTIyLjE0MTI5NjM5IDc4LjI3MzE5MzM2IEMtMTkuNDY2NTg4MDggNzguMjE3MzgyMjMgLTE2Ljk1OTc0MDM4IDc3Ljc3NDgzNjY5IC0xNC4zNDM3NSA3Ny4yMzA0Njg3NSBDLTExLjA3NzEwOTc3IDc2LjU1ODQ3NDE5IC04LjQ2OTM2NTExIDc2LjIzMDQ2ODc1IC01LjA5Mzc1IDc2LjIzMDQ2ODc1IEMtNS4wODU2NjMxNSA3NS4zMDc4MzIzNCAtNS4wNzc1NzYyOSA3NC4zODUxOTU5MiAtNS4wNjkyNDQzOCA3My40MzQ2MDA4MyBDLTQuOTkxNDAyMzcgNjQuNzUyNTc2NSAtNC45MDQxNDM1MiA1Ni4wNzA3MDk0MyAtNC44MDYyMjI5MiA0Ny4zODg4ODc0MSBDLTQuNzU2MjExNjUgNDIuOTI1MTQyOTQgLTQuNzA5ODgyMjQgMzguNDYxNDIyNjkgLTQuNjcxODc1IDMzLjk5NzU1ODU5IEMtNC42MzUwODI5NCAyOS42OTIxNDU5NCAtNC41ODg3Mzk5OSAyNS4zODY5MzM2NiAtNC41MzU2ODY0OSAyMS4wODE2OTE3NCBDLTQuNTE3MTEwMDkgMTkuNDM2NjM5MTkgLTQuNTAyMDE0MjEgMTcuNzkxNTQzNjQgLTQuNDkwNDA2MDQgMTYuMTQ2NDI3MTUgQy00LjQ3MzU5ODcyIDEzLjg0NzU3MDc2IC00LjQ0NDU3ODIxIDExLjU0OTE3NjUxIC00LjQxMjU5NzY2IDkuMjUwNDg4MjggQy00LjM5OTI3Mzk5IDcuOTQwMzI3NDUgLTQuMzg1OTUwMzIgNi42MzAxNjY2MyAtNC4zNzIyMjI5IDUuMjgwMzAzOTYgQy00LjA1NTcwNTk4IDEuODEzODEwNjcgLTMuNjMyNjAwMTggMC4zOTk4NTcxMSAwIDAgWiAiIGZpbGw9IiNGRUUxMDEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDM0OC4wOTM3NSwyMjkuNzY5NTMxMjUpIj48L3BhdGg+CiAgPHBhdGggZD0iTTAgMCBDMi4yMjAzNjcwNiAwLjAwMzIxMDc2IDQuNDM5NDU5NjIgLTAuMDIwNTg1MDcgNi42NTk2Njc5NyAtMC4wNDU2NTQzIEM4LjA4ODA1MTczIC0wLjA0NzkyMzM4IDkuNTE2NDM5MDIgLTAuMDQ4NjMyNjEgMTAuOTQ0ODI0MjIgLTAuMDQ3NjA3NDIgQzEyLjIxODQxNzk3IC0wLjA1MDU4ODM4IDEzLjQ5MjAxMTcyIC0wLjA1MzU2OTM0IDE0LjgwNDE5OTIyIC0wLjA1NjY0MDYyIEMxOC40NTY0MTgyOSAwLjM0NDM5ODcgMjAuMjk5NjY2NjYgMS4wOTY0NjUyNiAyMy4xOTQ4MjQyMiAzLjMxNTY3MzgzIEMyNS43MjE1OTM1NyA3LjEwNTgyNzg2IDI1LjQ2NTY1NDY3IDEwLjExOTQyMTA5IDI1LjQyNTI5Mjk3IDE0LjUwNzA4MDA4IEMyNS40MjQ4MzQ3NSAxNS4zMjU3OTA4NiAyNS40MjQzNzY1MyAxNi4xNDQ1MDE2NSAyNS40MjM5MDQ0MiAxNi45ODgwMjE4NSBDMjUuNDIwODc5NjQgMTguNzMwNjM1OTggMjUuNDEyOTg2NjEgMjAuNDczMjQ3MzQgMjUuNDAwNjM0NzcgMjIuMjE1ODIwMzEgQzI1LjM4Mjc1IDI0LjgxNjI2NTc2IDI1LjM4MDEyMjc5IDI3LjQxNjM0NjExIDI1LjM4MDM3MTA5IDMwLjAxNjg0NTcgQzI1LjM2NDQzNzkgMzguNDIwMjUzMzggMjUuMjI0MjI4OTMgNDYuODIxNzI1NyAyNC44NzA2MDU0NyA1NS4yMTgwMTc1OCBDMjQuODQ4ODY3NjUgNTUuOTQ3MjY5NDQgMjQuODI3MTI5ODIgNTYuNjc2NTIxMyAyNC44MDQ3MzMyOCA1Ny40Mjc4NzE3IEMyNC41NzIyMTMyOCA2Mi4wNDk5MzAzOSAyMy43MzA2MjggNjUuNDI2OTU4IDIxLjE5NDgyNDIyIDY5LjMxNTY3MzgzIEMxNy45Njc1ODQwNiA3MS43NjEzMzA1OSAxNC42MzQ2OTIzIDcxLjYyMTg1OTI0IDEwLjY3OTE5OTIyIDcxLjcyOTczNjMzIEM4Ljk4ODc1NDg4IDcxLjc4MzE1MTg2IDguOTg4NzU0ODggNzEuNzgzMTUxODYgNy4yNjQxNjAxNiA3MS44Mzc2NDY0OCBDNS44Mzg3NzkzIDcxLjg3MTY0NTUxIDQuNDEzMzk4NDQgNzEuOTA1NjQ0NTMgMi45NDQ4MjQyMiA3MS45NDA2NzM4MyBDLTEuNTkyNjc1NzggNzIuMDY0NDIzODMgLTYuMTMwMTc1NzggNzIuMTg4MTczODMgLTEwLjgwNTE3NTc4IDcyLjMxNTY3MzgzIEMtMTEuMTM1MTc1NzggODMuMjA1NjczODMgLTExLjQ2NTE3NTc4IDk0LjA5NTY3MzgzIC0xMS44MDUxNzU3OCAxMDUuMzE1NjczODMgQy0xNS44MTIyNzIyNyAxMDcuMzE5MjIyMDcgLTE2Ljc0NjQ3OTM4IDEwNy41NDAyNDIzOCAtMjAuOTMwMTc1NzggMTA3LjA2NTY3MzgzIEMtMjEuNzk5MDAzOTEgMTA2Ljk3ODAxNzU4IC0yMi42Njc4MzIwMyAxMDYuODkwMzYxMzMgLTIzLjU2Mjk4ODI4IDEwNi44MDAwNDg4MyBDLTI1LjgwNTE3NTc4IDEwNi4zMTU2NzM4MyAtMjUuODA1MTc1NzggMTA2LjMxNTY3MzgzIC0yNy44MDUxNzU3OCAxMDQuMzE1NjczODMgQy0yOC43NTUwMzUyMyA5OS40NjM0MDM4IC0yOC45MjcyNTIzMiA5NC43NTM4Mzk0NCAtMjguOTE4NzAxMTcgODkuODE5ODI0MjIgQy0yOC45MTg4NDcyIDg5LjEwNjc5MTM4IC0yOC45MTg5OTMyMyA4OC4zOTM3NTg1NCAtMjguOTE5MTQzNjggODcuNjU5MTE4NjUgQy0yOC45MTg0NTI5MSA4NS4zMjcxNTcwMiAtMjguOTEwNzAwMDggODIuOTk1Mjc3NTcgLTI4LjkwMjgzMjAzIDgwLjY2MzMzMDA4IEMtMjguOTAwOTY0ODggNzkuMDM2NjU3MTQgLTI4Ljg5OTU0MjM4IDc3LjQwOTk4MzY0IC0yOC44OTg1NDQzMSA3NS43ODMzMDk5NCBDLTI4Ljg5NDc0MjU1IDcxLjUyMDUyMjI5IC0yOC44ODQ5MzI0NiA2Ny4yNTc3NjkyIC0yOC44NzM4NDAzMyA2Mi45OTQ5OTUxMiBDLTI4Ljg2MzU3NTY4IDU4LjYzNzcwMDA3IC0yOC44NTkwMzU5IDU0LjI4MDM5OTM4IC0yOC44NTQwMDM5MSA0OS45MjMwOTU3IEMtMjguODQzMzA3OTEgNDEuMzg3MjcyNjMgLTI4LjgyNjI1OTg3IDMyLjg1MTQ3NzU0IC0yOC44MDUxNzU3OCAyNC4zMTU2NzM4MyBDLTI5LjYwOTU1MDc4IDI0LjE3MTI5ODgzIC0zMC40MTM5MjU3OCAyNC4wMjY5MjM4MyAtMzEuMjQyNjc1NzggMjMuODc4MTczODMgQy0zMy44MDUxNzU3OCAyMy4zMTU2NzM4MyAtMzMuODA1MTc1NzggMjMuMzE1NjczODMgLTM0LjgwNTE3NTc4IDIyLjMxNTY3MzgzIEMtMzUuNTA2MTgyNjQgMTUuNzI2MjA5MzUgLTMzLjcwNzYyMjE4IDkuMDM4NDM5ODcgLTI5LjU4Mzc0MDIzIDMuNzQ5MDIzNDQgQy0yMi43NDgxMzQwMyAtMS43NTk4MDg5NiAtOC41NTYzMjg3NSAtMC4wMjU5MTY2MyAwIDAgWiBNLTExLjgwNTE3NTc4IDI2LjMxNTY3MzgzIEMtMTEuODMyMjU3NDggMjkuMDQ0OTA3NzEgLTExLjg1MjA1NDI2IDMxLjc3Mzg3MDE5IC0xMS44Njc2NzU3OCAzNC41MDMxNzM4MyBDLTExLjg4MDI0NDE0IDM1LjY1NjU2MjUgLTExLjg4MDI0NDE0IDM1LjY1NjU2MjUgLTExLjg5MzA2NjQxIDM2LjgzMzI1MTk1IEMtMTEuOTEwMDk1MTIgNDAuODAwOTQxNzIgLTExLjc5MTIxNjkzIDQ0LjQ0MTM4NjE3IC0xMC44MDUxNzU3OCA0OC4zMTU2NzM4MyBDLTguNzYzODExODMgNDguMzcwMTkwOTcgLTYuNzIyMDE3MjIgNDguNDA4Njk4NjggLTQuNjgwMTc1NzggNDguNDQwNjczODMgQy0zLjU0MzIyMjY2IDQ4LjQ2Mzg3Njk1IC0yLjQwNjI2OTUzIDQ4LjQ4NzA4MDA4IC0xLjIzNDg2MzI4IDQ4LjUxMDk4NjMzIEMyLjMwOTU3OTY2IDQ4LjMwOTEzODc4IDQuOTQ3MjQ5MDUgNDcuNzM3MDc2MjkgOC4xOTQ4MjQyMiA0Ni4zMTU2NzM4MyBDMTEuNDA2NjgzMjEgNDEuNDk3ODg1MzQgMTAuODU0NzcxNjcgMzUuNjMyNDc4NzEgOS43NDE2OTkyMiAzMC4wMzgzMzAwOCBDOS4yODU3NjAwMyAyOC40NDU3OTk2MiA4Ljc0OTc3MTk0IDI2Ljg3NjQ2NDI4IDguMTk0ODI0MjIgMjUuMzE1NjczODMgQzEuNjA3OTgwMTkgMjMuOTI4OTY5ODIgLTUuNzkzNDI1MzcgMjIuODExMTI4MDggLTExLjgwNTE3NTc4IDI2LjMxNTY3MzgzIFogIiBmaWxsPSIjRkVFMDAxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0MzMuODA1MTc1NzgxMjUsNzcuNjg0MzI2MTcxODc1KSI+PC9wYXRoPgogIDxwYXRoIGQ9Ik0wIDAgQzIuMDgzNjk3MzEgMi45MjA2MzYwMSAxLjcyNzM4NjU2IDUuMjg1MjQ3MTcgMS4yMzUxMDc0MiA4LjczMTIwMTE3IEMtMi4yODkzMjY4MSAxMS40MDAyNTI2NCAtNS43MzU5NTgwNyAxMi4zNzE1MTcwMSAtMTAuMDE0ODkyNTggMTMuMjkzNzAxMTcgQy0xMS45NDYwNzAwNSAxMy43MTA1NTI5IC0xMy44Njg5MTY2OCAxNC4xNzU3ODQ5MiAtMTUuNzY0ODkyNTggMTQuNzMxMjAxMTcgQy0xOS42NDYyNzc4MSAyMi40OTM5NzE2NCAtMTYuNjA2ODcxOTQgMzcuOTMwMDM3MDQgLTE2LjMyNzM5MjU4IDQ2LjQxODcwMTE3IEMtMTYuMjg3NTYwMDQgNDcuNzU1Mjg2MTcgLTE2LjI0Nzg0NjIzIDQ5LjA5MTg3NDcyIC0xNi4yMDgyNTE5NSA1MC40Mjg0NjY4IEMtMTUuOTk1NTA3MjcgNTcuMDMwMDk4MDUgLTE1LjY0MTU2NDI2IDYzLjU2OTYxMTEzIC0xNC45OTQxNDA2MiA3MC4xNDIwODk4NCBDLTE0LjU5ODc2NTc1IDc0LjYwNzQyNTk0IC0xNC40NjE4OTg3MyA3OS4wNjI5NTQ3OSAtMTQuMzg5ODkyNTggODMuNTQzNzAxMTcgQy0xNC4zMzM4MTgzNiA4NC44OTYyNSAtMTQuMzMzODE4MzYgODQuODk2MjUgLTE0LjI3NjYxMTMzIDg2LjI3NjEyMzA1IEMtMTQuMjIwMTEzODUgOTAuNTU0MjM3NjUgLTE0LjI1NDU1NjI1IDkzLjcyNTA2NjM2IC0xNi45NDQ1ODAwOCA5Ny4xODgyMzI0MiBDLTE5LjY3NTExMDQyIDk5LjY1MDI0ODAxIC0yMS45MDMyOTc0OCAxMDEuMTYxNDcwNjkgLTI1LjI2NDg5MjU4IDEwMi42MDYyMDExNyBDLTI2LjE4MjcwNTA4IDEwMy4wMTYxMjMwNSAtMjcuMTAwNTE3NTggMTAzLjQyNjA0NDkyIC0yOC4wNDYxNDI1OCAxMDMuODQ4Mzg4NjcgQy0zMC44ODY5NzAwNSAxMDQuNzcwODQxMjcgLTMyLjgwODE3MjUzIDEwNS4xNTIxOTExMSAtMzUuNzY0ODkyNTggMTA0LjczMTIwMTE3IEMtMzcuNTMwNTE3NTggMTAzLjM0MDU3NjE3IC0zNy41MzA1MTc1OCAxMDMuMzQwNTc2MTcgLTM5LjAxNDg5MjU4IDEwMS40ODEyMDExNyBDLTM5LjUxNTA0ODgzIDEwMC44Nzc5MTk5MiAtNDAuMDE1MjA1MDggMTAwLjI3NDYzODY3IC00MC41MzA1MTc1OCA5OS42NTMwNzYxNyBDLTQyLjkwNDcyODkxIDk1Ljk1NjUxOTI4IC00Mi45NzQzNTIxNiA5Mi4wMDAzMDgzNiAtNDMuMjY0ODkyNTggODcuNjkyMTM4NjcgQy00My4zODc5MTc0OCA4NS44ODA5NjU1OCAtNDMuMzg3OTE3NDggODUuODgwOTY1NTggLTQzLjUxMzQyNzczIDg0LjAzMzIwMzEyIEMtNDMuNTk2NDExMTMgODIuNzM3MjkyNDggLTQzLjY3OTM5NDUzIDgxLjQ0MTM4MTg0IC00My43NjQ4OTI1OCA4MC4xMDYyMDExNyBDLTQzLjgwODEzNjYgNzkuNDQxNDc3OTcgLTQzLjg1MTM4MDYyIDc4Ljc3Njc1NDc2IC00My44OTU5MzUwNiA3OC4wOTE4ODg0MyBDLTQ1LjE3NzE4OTQzIDU4LjMxNTI5ODEgLTQ1Ljk3OTgxNzcxIDM4LjU1MjA3NDkxIC00NS43NjQ4OTI1OCAxOC43MzEyMDExNyBDLTQ2LjM1Mjk0Njc4IDE4Ljc5OTc2MzE4IC00Ni45NDEwMDA5OCAxOC44NjgzMjUyIC00Ny41NDY4NzUgMTguOTM4OTY0ODQgQy02My4wNTAzNjkzMyAyMC43MTA5Mjg3NCAtNjMuMDUwMzY5MzMgMjAuNzEwOTI4NzQgLTY3LjM4OTg5MjU4IDE4LjIzMTIwMTE3IEMtNjkuMzY0MjgxNDMgMTQuNjQxNDAzMjYgLTY4Ljg1NjAyMjExIDExLjgwNzE3Njc1IC02OC43NjQ4OTI1OCA3LjczMTIwMTE3IEMtNTUuMjA0MzQzMzQgNS4zMDE4NjMxNSAtNDEuNjIyMTQ3NDggMy4yMzkwODIwNSAtMjcuOTUyMzkyNTggMS41NDM3MDExNyBDLTI3LjI3NjUyMSAxLjQ1OTM4ODQzIC0yNi42MDA2NDk0MSAxLjM3NTA3NTY4IC0yNS45MDQyOTY4OCAxLjI4ODIwODAxIEMtMjIuNjk1NzQ5MzUgMC44ODk4MjA4MyAtMTkuNDg2MjYzODkgMC41MDQ3ODA3NCAtMTYuMjc0MTY5OTIgMC4xMzU5ODYzMyBDLTE0LjAwNjQ3MzY0IC0wLjEyNTU4NTk5IC0xMS43NDA4MjM0OCAtMC40MDU4Nzg5NCAtOS40NzgyNzE0OCAtMC43MDg3NDAyMyBDLTguNDk2NDg5MjYgLTAuODI3ODE3MzggLTcuNTE0NzA3MDMgLTAuOTQ2ODk0NTMgLTYuNTAzMTczODMgLTEuMDY5NTgwMDggQy01LjY1NDA4NDQ3IC0xLjE4MDg0MjI5IC00LjgwNDk5NTEyIC0xLjI5MjEwNDQ5IC0zLjkzMDE3NTc4IC0xLjQwNjczODI4IEMtMS43NjQ4OTI1OCAtMS4yNjg3OTg4MyAtMS43NjQ4OTI1OCAtMS4yNjg3OTg4MyAwIDAgWiAiIGZpbGw9IiNGRUUxMDEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI4NS43NjQ4OTI1NzgxMjUsMjI3LjI2ODc5ODgyODEyNSkiPjwvcGF0aD4KICA8cGF0aCBkPSJNMCAwIEMxLjE4MjcxNDg0IDAuMDAzODY3MTkgMi4zNjU0Mjk2OSAwLjAwNzczNDM4IDMuNTgzOTg0MzggMC4wMTE3MTg3NSBDNS40MzE1MzMyIDAuMDQ4NDU3MDMgNS40MzE1MzMyIDAuMDQ4NDU3MDMgNy4zMTY0MDYyNSAwLjA4NTkzNzUgQzguNTQ0MjM4MjggMC4wODcyMjY1NiA5Ljc3MjA3MDMxIDAuMDg4NTE1NjMgMTEuMDM3MTA5MzggMC4wODk4NDM3NSBDMjAuOTgwNjExNTYgMC4xODcyNzYgMjAuOTgwNjExNTYgMC4xODcyNzYgMjUuODc4OTA2MjUgMi40NjA5Mzc1IEMyNi4wMDM5MDYyNSA1LjgzNTkzNzUgMjYuMDAzOTA2MjUgNS44MzU5Mzc1IDI1Ljg3ODkwNjI1IDkuNDYwOTM3NSBDMjUuMjE4OTA2MjUgMTAuMTIwOTM3NSAyNC41NTg5MDYyNSAxMC43ODA5Mzc1IDIzLjg3ODkwNjI1IDExLjQ2MDkzNzUgQzIyLjIyODkwNjI1IDExLjQ2MDkzNzUgMjAuNTc4OTA2MjUgMTEuNDYwOTM3NSAxOC44Nzg5MDYyNSAxMS40NjA5Mzc1IEMxOC4yMTg5MDYyNSAzMi45MTA5Mzc1IDE3LjU1ODkwNjI1IDU0LjM2MDkzNzUgMTYuODc4OTA2MjUgNzYuNDYwOTM3NSBDMTguNTI4OTA2MjUgNzcuMTIwOTM3NSAyMC4xNzg5MDYyNSA3Ny43ODA5Mzc1IDIxLjg3ODkwNjI1IDc4LjQ2MDkzNzUgQzIyLjE5MTQwNjI1IDgwLjc3MzQzNzUgMjIuMTkxNDA2MjUgODAuNzczNDM3NSAyMS44Nzg5MDYyNSA4My40NjA5Mzc1IEMxNi4xNTA4OTM4NCA4OC42MzQ2MjYxMyA2LjgxMjAxMTU3IDg3LjU3NzM0NzYgLTAuNDk2MDkzNzUgODcuNzEwOTM3NSBDLTEuNTQ5NTM5NzkgODcuNzQzMjA0MzUgLTEuNTQ5NTM5NzkgODcuNzQzMjA0MzUgLTIuNjI0MjY3NTggODcuNzc2MTIzMDUgQy03LjYxNDk1ODk3IDg3LjgwODA4NzYgLTcuNjE0OTU4OTcgODcuODA4MDg3NiAtMTAuMDg1OTM3NSA4Ni4xMTMyODEyNSBDLTExLjUwODc3NzQyIDgzLjg0MjEwNjU5IC0xMS4zMzM3NzMyMiA4Mi4wODM5ODQzNCAtMTEuMTIxMDkzNzUgNzkuNDYwOTM3NSBDLTguNzQ2MDkzNzUgNzguMzk4NDM3NSAtOC43NDYwOTM3NSA3OC4zOTg0Mzc1IC02LjEyMTA5Mzc1IDc3LjQ2MDkzNzUgQy01LjQ2MTA5Mzc1IDc3Ljc5MDkzNzUgLTQuODAxMDkzNzUgNzguMTIwOTM3NSAtNC4xMjEwOTM3NSA3OC40NjA5Mzc1IEMtNC4xMjYzMzA1NyA3Ny4zNTUwODMwMSAtNC4xMzE1NjczOCA3Ni4yNDkyMjg1MiAtNC4xMzY5NjI4OSA3NS4xMDk4NjMyOCBDLTQuMjI4NzMxNzYgNTMuODY4NjMyNjcgLTQuMjQzMDIzMzcgMzIuNjc5MTMzMTEgLTMuMTIxMDkzNzUgMTEuNDYwOTM3NSBDLTYuMDkxMDkzNzUgMTAuOTY1OTM3NSAtNi4wOTEwOTM3NSAxMC45NjU5Mzc1IC05LjEyMTA5Mzc1IDEwLjQ2MDkzNzUgQy05Ljg3MTA5Mzc1IDcuNzEwOTM3NSAtOS44NzEwOTM3NSA3LjcxMDkzNzUgLTEwLjEyMTA5Mzc1IDQuNDYwOTM3NSBDLTcuMTQ3NDE4NjYgMC40MjQ0MjYyNSAtNC44OTA1MDY3OSAtMC4wMzcyNjc5NiAwIDAgWiAiIGZpbGw9IiNGREUxMDEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ1MC4xMjEwOTM3NSwyMzkuNTM5MDYyNSkiPjwvcGF0aD4KICA8cGF0aCBkPSJNMCAwIEMxLjE2MDE1NjI1IC0wLjA0MzUwNTg2IDEuMTYwMTU2MjUgLTAuMDQzNTA1ODYgMi4zNDM3NSAtMC4wODc4OTA2MiBDOS4yODc4OTQ4NiAtMC4xNjM2MjM3NSAxNC41NTQxMDYxNCAxLjc1ODQ5NTI5IDE5LjYyNSA2LjU2MjUgQzI0LjcxNjUyNzYyIDE1LjE3ODkzMTM2IDI1LjkzOTMxMDM1IDI5LjgxNDU2MDk5IDIzLjc0MjE4NzUgMzkuNTY2NDA2MjUgQzIzLjU3OTc2NTYyIDQwLjE0MjYxNzE5IDIzLjQxNzM0Mzc1IDQwLjcxODgyODEzIDIzLjI1IDQxLjMxMjUgQy0zLjQwNjM2MTc5IDQ4LjE3NjExNDExIC0zLjQwNjM2MTc5IDQ4LjE3NjExNDExIC0xMi43NSA0NC4zMTI1IEMtMTkuNTQ1NDczNiAzNy41MTcwMjY0IC0xOS43ODQyMDcxMyAyOC4zNDA2MzY0NiAtMTkuODc1IDE5LjI1IEMtMTkuNjk2NDMxODMgNy40MzQ3Mzk2IC0xOS42OTY0MzE4MyA3LjQzNDczOTYgLTE3LjQ4ODI4MTI1IDQuODE2NDA2MjUgQy0xMi4wNTM1NjUyMyAtMC4wMTU5NzM0OCAtNi44ODY5MjY0NCAwLjA4NDM5ODYxIDAgMCBaICIgZmlsbD0iI0ZFRTEwMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTQ2Ljc1LDE1MS42ODc1KSI+PC9wYXRoPgogIDxwYXRoIGQ9Ik0wIDAgQzEuMDMyNTM5MDYgLTAuMDAzMjIyNjYgMi4wNjUwNzgxMyAtMC4wMDY0NDUzMSAzLjEyODkwNjI1IC0wLjAwOTc2NTYyIEMxMy45NTUxNzQ3NSAwLjA2NzA2NTk2IDEzLjk1NTE3NDc1IDAuMDY3MDY1OTYgMTguNjI1IDQuMTg3NSBDMjUuMTUwNTg3OTIgMTUuMDYzNDc5ODcgMjMuODM0NjM2MTcgMjguMTAwODUzODMgMjMuNSA0MC4zMTI1IEMtNS4zMzEyMjYxNyA0Ni44NTgxMzIxMyAtNS4zMzEyMjYxNyA0Ni44NTgxMzIxMyAtMTEuMjE0ODQzNzUgNDMuOTg4MjgxMjUgQy0xNi4xODYxNjQ5NSA0MC4zNDI2NDU3IC0xOC4zNTA4NjY3OSAzNS4yMTczNjIzOCAtMTkuNSAyOS4zMTI1IEMtMTkuNzk1NzMzMDIgMjUuOTUzMzkyOTIgLTE5LjgyNTAxMTMgMjIuNjIwNTQ1IC0xOS44MTI1IDE5LjI1IEMtMTkuODI4NjEzMjggMTguMzc3OTQ5MjIgLTE5Ljg0NDcyNjU2IDE3LjUwNTg5ODQ0IC0xOS44NjEzMjgxMiAxNi42MDc0MjE4OCBDLTE5Ljg2NTIyMzE4IDExLjQ2MjA2MDExIC0xOS41NDIwNTI3NyA3LjY2NjgxMDgzIC0xNi41IDMuMzEyNSBDLTExLjk0MjUxNTkzIC0wLjk4Mjc0Nzg5IC01Ljg3NjA2OTM0IC0wLjA5MTY5ODk2IDAgMCBaICIgZmlsbD0iI0ZFRTAwMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTQzLjUsNDIuNjg3NSkiPjwvcGF0aD4KPC9zdmc+Cg==";
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
