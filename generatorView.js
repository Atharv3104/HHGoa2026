/**
 * FrameInGoa - Builder & Team Graphic Generator
 * Official Hacker Goa House 2026 ID Generator
 */

const GeneratorView = {
  state: {
    formatMode: "vertical", // 'vertical' (Format A: Builder ID Card) or 'team' (Format B: Team Picture Frame)
    photoUrl: "",
    photoElement: null,
    userName: "",
    role: "",
    teamName: "",
    college: "",
    location: "",
    instagram: "",
    email: "",
    linkedin: "",
    phone: "",
    builderId: "HHG26-EKP03Q",
    techStack: [],
    frameId: "frame1",
    zoom: 1.0,
    offsetX: 0,
    offsetY: 0,
    isGenerating: false,
    previewDataUrl: null
  },

  render() {
    const isTeamMode = this.state.formatMode === "team";

    return `
      <div class="generator-container">
        <!-- Main Header -->
        <div class="generator-header text-center">
          <div class="event-pill">
            <span class="pulse-dot"></span> NO SIGNUP GATE • 100% CLIENT-SIDE &amp; PRIVACY MASKED
          </div>
          <h2>Hacker Goa House <span class="gradient-text">ID Generator</span></h2>
          <p>Instantly create your official Hacker Goa House graphics for personal builders or full teams.</p>

          <!-- Format Mode Switcher Tabs -->
          <div class="format-mode-switcher" style="display: flex; justify-content: center; gap: 16px; margin-top: 20px;">
            <button class="mode-btn ${!isTeamMode ? 'active' : ''}" id="tab-vertical" onclick="GeneratorView.setFormatMode('vertical')">
              <i class="fas fa-id-badge"></i> Format A: Builder ID Card (Vertical)
            </button>

            <button class="mode-btn ${isTeamMode ? 'active' : ''}" id="tab-team" onclick="GeneratorView.setFormatMode('team')">
              <i class="fas fa-users"></i> Format B: Team Picture Frame
            </button>
          </div>
        </div>

        <div class="generator-layout">
          <!-- Left Panel: Form Inputs -->
          <div class="generator-form-panel">
            
            <!-- 1. Photo Upload & Controls -->
            <div class="form-section-card">
              <div class="section-title-sm">
                <i class="fas fa-camera"></i> 
                ${isTeamMode ? '1. Upload Team / Squad Photo' : '1. Upload Personal Photo'} (JPG, PNG, iPhone HEIC)
              </div>
              
              <input type="file" id="selfie-file-input" accept="image/*,.heic,.heif" class="file-input-hidden" style="display:none;" />

              <div class="upload-dropzone" id="upload-dropzone">
                ${this.state.previewDataUrl ? `
                  <div class="upload-preview-active">
                    <img src="${this.state.previewDataUrl}" alt="Uploaded photo preview" class="upload-thumb-preview" />
                    <div class="upload-preview-overlay">
                      <i class="fas fa-redo"></i>
                      <span>Click to change photo</span>
                    </div>
                  </div>
                ` : `
                  <div class="upload-prompt">
                    <i class="fas fa-cloud-upload-alt upload-icon"></i>
                    <p><strong>${isTeamMode ? 'Click or Drag Team Group Photo Here' : 'Click or Drag Photo Here'}</strong></p>
                    <span>Supports iPhone HEIC, JPG, PNG &amp; Off-Center Crops</span>
                  </div>
                `}
              </div>

              <!-- Photo Controls -->
              <div class="crop-controls-box">
                <div class="crop-control-row">
                  <label><i class="fas fa-search-plus"></i> Photo Zoom:</label>
                  <input type="range" id="zoom-slider" min="0.8" max="2.5" step="0.05" value="${this.state.zoom}" oninput="GeneratorView.updateZoom(this.value)" />
                  <span id="zoom-val">${Math.round(this.state.zoom * 100)}%</span>
                </div>
                <div class="crop-control-row">
                  <label><i class="fas fa-arrows-alt-v"></i> Vertical Offset:</label>
                  <input type="range" id="offsety-slider" min="-120" max="120" step="2" value="${this.state.offsetY}" oninput="GeneratorView.updateOffsetY(this.value)" />
                  <button class="btn btn-xs btn-outline" onclick="GeneratorView.autoDetectFace()"><i class="fas fa-magic"></i> Auto Center</button>
                </div>
              </div>
            </div>

            <!-- 2. Personal or Team Details -->
            <div class="form-section-card">
              <div class="section-title-sm"><i class="fas fa-user-edit"></i> 2. ${isTeamMode ? 'Team Squad Name' : 'Personal & Team Details'}</div>

              <div class="form-group">
                <label><i class="fas fa-flag text-pink"></i> Team / Squad Name *</label>
                <input type="text" id="gen-team" class="form-control" placeholder="" value="${this.state.teamName}" oninput="GeneratorView.updateField('teamName', this.value)" />
              </div>

              ${!isTeamMode ? `
                <div class="form-grid-2">
                  <div class="form-group">
                    <label>Full Name *</label>
                    <input type="text" id="gen-name" class="form-control" placeholder="" value="${this.state.userName}" oninput="GeneratorView.updateField('userName', this.value)" />
                  </div>

                  <div class="form-group">
                    <label>Role / Role Title *</label>
                    <input type="text" id="gen-role" class="form-control" placeholder="" value="${this.state.role}" oninput="GeneratorView.updateField('role', this.value)" />
                  </div>
                </div>

                <div class="form-grid-2">
                  <div class="form-group">
                    <label>Location / Address</label>
                    <input type="text" id="gen-location" class="form-control" placeholder="" value="${this.state.location}" oninput="GeneratorView.updateField('location', this.value)" />
                  </div>

                  <div class="form-group">
                    <label>College / University</label>
                    <input type="text" id="gen-college" class="form-control" placeholder="" value="${this.state.college}" oninput="GeneratorView.updateField('college', this.value)" />
                  </div>
                </div>

                <div class="section-title-xs"><i class="fas fa-share-alt"></i> Contact &amp; Handles</div>

                <div class="form-grid-2">
                  <div class="form-group">
                    <label><i class="fab fa-instagram text-pink"></i> Instagram Handle</label>
                    <input type="text" id="gen-insta" class="form-control" placeholder="" value="${this.state.instagram}" oninput="GeneratorView.updateField('instagram', this.value)" />
                  </div>

                  <div class="form-group">
                    <label><i class="fas fa-envelope text-yellow"></i> Personal Email</label>
                    <input type="email" id="gen-email" class="form-control" placeholder="" value="${this.state.email}" oninput="GeneratorView.updateField('email', this.value)" />
                  </div>
                </div>

                <div class="form-grid-2">
                  <div class="form-group">
                    <label><i class="fab fa-linkedin text-blue"></i> LinkedIn Handle / Profile</label>
                    <input type="text" id="gen-linkedin" class="form-control" placeholder="" value="${this.state.linkedin}" oninput="GeneratorView.updateField('linkedin', this.value)" />
                  </div>

                  <div class="form-group">
                    <label>Phone Number (Auto Masked) 🔒</label>
                    <input type="text" id="gen-phone" class="form-control" placeholder="" value="${this.state.phone}" oninput="GeneratorView.updateField('phone', this.value)" />
                  </div>
                </div>
              ` : ''}
            </div>

            ${!isTeamMode ? `
              <!-- 3. Tech Stack Select -->
              <div class="form-section-card">
                <div class="section-title-sm"><i class="fas fa-code"></i> 3. Select Tech Stack Tags</div>
                
                <div class="tech-stack-picker">
                  ${APP_CONFIG.techStacks.map(t => `
                    <button class="tech-chip ${this.state.techStack.includes(t.name) ? 'active' : ''}" onclick="GeneratorView.toggleTech('${t.name}')">
                      ${t.name}
                    </button>
                  `).join("")}
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Right Panel: Canvas Preview -->
          <div class="generator-preview-panel">
            <div class="preview-sticky-box">
              <div class="preview-header">
                <h3><i class="fas fa-eye"></i> Live ${isTeamMode ? 'Format B: Team Picture Frame' : 'Format A: Builder ID Card'} Preview</h3>
                <span class="preview-status-pill"><span class="pulse-dot"></span> Instant Render</span>
              </div>

              <!-- Stable ID Card Preview Container -->
              <div id="id-card-preview" class="canvas-preview-wrapper vertical" style="position: relative;">
                <canvas id="builder-card-canvas"></canvas>
              </div>

              <!-- Helper Tip for Mobile & Touch Devices -->
              <div class="mobile-save-tip" style="margin-top: 10px; background: rgba(0, 77, 46, 0.4); border: 1px solid #FFE600; border-radius: 10px; padding: 10px 14px; text-align: center; color: #FFE600; font-size: 13px; font-weight: 600;">
                <i class="fas fa-lightbulb" style="color: #FFE600;"></i> <strong>Mobile / Desktop Tip:</strong> Right-Click or Long-Press the ID Card image above to select <em>"Save Image As..."</em>
              </div>

              <!-- Dedicated 2 Download Options Section -->
              <div class="download-id-card-section" style="margin-top: 16px; display: flex; flex-direction: column; gap: 10px;">
                <!-- Hidden Form for HTTP Attachment Download -->
                <form id="server-download-form" action="/download-image" method="POST" target="_self" style="display:none;">
                  <input type="hidden" id="server-img-data" name="imgData" value="" />
                </form>

                <!-- Option A: Direct Attachment File Download -->
                <button id="btn-download-id-card" type="button" class="btn btn-primary btn-block btn-lg" style="background: linear-gradient(135deg, #FFE600 0%, #FFB800 100%); color: #00321E; font-weight: 800; font-size: 17px; border: none; border-radius: 12px; padding: 15px; box-shadow: 0 6px 20px rgba(255, 230, 0, 0.35); width: 100%; cursor: pointer;" onclick="GeneratorView.downloadIdCard(event)">
                  <i class="fas fa-download" style="margin-right: 8px;"></i> Option 1: Direct File Download (PNG)
                </button>

                <!-- Option B: Open Full-Res Image in New Tab -->
                <button type="button" class="btn btn-outline btn-block" style="border: 2px solid #FFE600; color: #FFE600; font-weight: 700; font-size: 15px; border-radius: 12px; padding: 12px; cursor: pointer; background: transparent;" onclick="GeneratorView.openImageInNewTab()">
                  <i class="fas fa-external-link-alt" style="margin-right: 8px;"></i> Option 2: Open Image in New Tab (View &amp; Save)
                </button>
              </div>

              <!-- Export Actions -->
              <div class="card-export-actions" style="margin-top: 10px;">
                <button class="btn btn-secondary btn-block btn-lg btn-share-x" onclick="GeneratorView.shareOnX()">
                  <i class="fab fa-twitter"></i> Share on X (#FrameInGoa)
                </button>

                <div class="task-requirement-notice" style="margin-top: 12px;">
                  <i class="fas fa-shield-alt text-success"></i> Includes mandatory hashtag <strong>#FrameInGoa</strong> • Client-side Privacy Masked
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Image Download Lightbox Modal for Mobile & Desktop Backup -->
      <div id="image-download-modal" class="modal-overlay" style="display:none; position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.88); z-index:9999; justify-content:center; align-items:center; padding:20px; overflow-y:auto;">
        <div style="background:#00321E; border:2px solid #FFE600; border-radius:20px; max-width:92%; width:480px; padding:24px; text-align:center; box-shadow:0 10px 40px rgba(0,0,0,0.85); margin:auto;">
          <h3 style="color:#FFE600; margin-bottom:10px; font-size:22px; font-weight:800;"><i class="fas fa-check-circle"></i> Graphic Download Ready!</h3>
          <p style="color:#A3D9C3; font-size:14px; margin-bottom:15px;">Click <strong>"Save PNG Image"</strong> below or long-press the image to save directly to your device.</p>
          
          <img id="modal-download-img" src="" alt="Hacker Goa House Graphic" style="width:100%; max-height:55vh; object-fit:contain; border-radius:12px; border:2px solid #FFE600; margin-bottom:20px; display:block;" />
          
          <div style="display:flex; gap:12px;">
            <a id="modal-download-btn" class="btn btn-primary" style="flex:1; text-align:center; text-decoration:none; font-weight:800; font-size:16px; padding:12px;" download="HHGOA_ID_CARD.png" href="#">
              <i class="fas fa-download"></i> Save PNG Image
            </a>
            <button class="btn btn-outline" style="padding:12px 20px;" onclick="document.getElementById('image-download-modal').style.display='none'">
              Close
            </button>
          </div>
        </div>
      </div>
    `;
  },

  mounted() {
    this._setupDropzone();
    this._setupFileInput();
    this.refreshCanvas();
  },

  setFormatMode(mode) {
    this.state.formatMode = mode;
    App.render();
  },

  updateField(key, value) {
    this.state[key] = value;
    this.refreshCanvas();
  },

  toggleTech(techName) {
    const idx = this.state.techStack.indexOf(techName);
    if (idx >= 0) {
      this.state.techStack.splice(idx, 1);
    } else {
      if (this.state.techStack.length < 5) {
        this.state.techStack.push(techName);
      } else {
        App.showToast("Maximum 5 tech stack tags allowed", "warning");
      }
    }
    App.render();
  },

  selectFrame(frameId) {
    this.state.frameId = frameId;
    App.render();
  },

  updateZoom(val) {
    this.state.zoom = parseFloat(val);
    const label = document.getElementById("zoom-val");
    if (label) label.textContent = `${Math.round(this.state.zoom * 100)}%`;
    this.refreshCanvas();
  },

  updateOffsetY(val) {
    this.state.offsetY = parseFloat(val);
    this.refreshCanvas();
  },

  autoDetectFace() {
    this.state.zoom = 1.0;
    this.state.offsetY = 0;
    App.showToast("Photo position reset & centered", "info");
    App.render();
  },

  generateRandomId() {
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.state.builderId = `HHG26-${randomHex}`;
    App.showToast(`New Builder ID Generated: ${this.state.builderId}`, "success");
    App.render();
  },

  _setupDropzone() {
    const dropzone = document.getElementById("upload-dropzone");
    const fileInput = document.getElementById("selfie-file-input");

    if (!dropzone || !fileInput) return;

    dropzone.onclick = () => fileInput.click();

    dropzone.ondragover = (e) => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    };

    dropzone.ondragleave = () => dropzone.classList.remove("dragover");

    dropzone.ondrop = (e) => {
      e.preventDefault();
      dropzone.classList.remove("dragover");
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        this._handleFile(e.dataTransfer.files[0]);
      }
    };
  },

  _setupFileInput() {
    const fileInput = document.getElementById("selfie-file-input");
    if (!fileInput) return;

    fileInput.onchange = (e) => {
      if (e.target.files && e.target.files[0]) {
        this._handleFile(e.target.files[0]);
      }
    };
  },

  async _handleFile(file) {
    App.showToast("Processing photo...", "info");

    try {
      let imageFile = file;
      if (file.name.toLowerCase().endsWith(".heic") || file.name.toLowerCase().endsWith(".heif")) {
        if (window.heic2any) {
          const convertedBlob = await window.heic2any({ blob: file, toType: "image/jpeg" });
          imageFile = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        }
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        this.state.previewDataUrl = dataUrl;
        this.state.photoUrl = dataUrl;

        const img = new Image();
        img.onload = () => {
          this.state.photoElement = img;
          this.refreshCanvas();
          App.showToast("Photo uploaded successfully! 📸", "success");
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(imageFile);
    } catch (err) {
      console.error("Photo processing error:", err);
      App.showToast("Failed to process photo file. Please try JPG or PNG.", "error");
    }
  },

  async refreshCanvas() {
    const canvas = document.getElementById("builder-card-canvas");
    if (!canvas) return;

    await CanvasEngine.render(canvas, this.state, this.state.formatMode);

    const isTeam = this.state.formatMode === "team";
    let fileName = "";
    if (isTeam) {
      const teamClean = (this.state.teamName || "SQUAD").trim().replace(/[^a-zA-Z0-9]/g, "_").toUpperCase();
      fileName = `HHGOA_TEAM_FRAME_${teamClean}.png`;
    } else {
      const idCodeClean = (this.state.builderId || "HHG26-EKP03Q").trim().replace(/[^a-zA-Z0-9]/g, "-").toUpperCase();
      fileName = `HHGOA_ID_CARD_${idCodeClean}.png`;
    }

    try {
      const dataUrl = canvas.toDataURL("image/png", 1.0);
      const blob = this._dataURItoBlob(dataUrl);
      const href = blob ? URL.createObjectURL(blob) : dataUrl;

      const btn = document.getElementById("btn-download-id-card");
      if (btn) {
        btn.download = fileName;
      }
    } catch (e) {}
  },

  _dataURItoBlob(dataURI) {
    try {
      const byteString = atob(dataURI.split(',')[1]);
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    } catch (e) {
      console.error("dataURItoBlob error:", e);
      return null;
    }
  },

  /**
   * Option 1: Direct File Download via Server HTTP Attachment Endpoint
   */
  downloadIdCard(e) {
    if (e && e.preventDefault) e.preventDefault();
    console.log("Option 1 download triggered");

    const canvas = document.getElementById("builder-card-canvas");
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png", 1.0);

    const isTeamMode = this.state.formatMode === "team";
    let fileName = "";
    if (isTeamMode) {
      const teamClean = (this.state.teamName || "SQUAD").trim().replace(/[^a-zA-Z0-9]/g, "_").toUpperCase();
      fileName = `HHGOA_TEAM_FRAME_${teamClean}.png`;
    } else {
      const idCodeClean = (this.state.builderId || "HHG26-EKP03Q").trim().replace(/[^a-zA-Z0-9]/g, "-").toUpperCase();
      fileName = `HHGOA_ID_CARD_${idCodeClean}.png`;
    }

    // Submit hidden POST form to /download-image for HTTP Attachment Stream
    const form = document.getElementById("server-download-form");
    const input = document.getElementById("server-img-data");

    if (form && input) {
      input.value = dataUrl;
      form.submit();
      App.showToast(`Downloading ${fileName}... 🚀`, "success");
    } else {
      const blob = this._dataURItoBlob(dataUrl);
      const objectUrl = blob ? URL.createObjectURL(blob) : dataUrl;
      const link = document.createElement("a");
      link.download = fileName;
      link.href = objectUrl;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => { if (link.parentNode) link.parentNode.removeChild(link); }, 3000);
    }

    if (window.confetti) {
      try { window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } }); } catch (err) {}
    }

    this._showDownloadModal(dataUrl, fileName);
  },

  /**
   * Option 2: Open High-Res Image in New Tab for 100% Reliable View & Save
   */
  openImageInNewTab() {
    const canvas = document.getElementById("builder-card-canvas");
    if (!canvas) return;

    const isTeamMode = this.state.formatMode === "team";
    let fileName = "";
    if (isTeamMode) {
      const teamClean = (this.state.teamName || "SQUAD").trim().replace(/[^a-zA-Z0-9]/g, "_").toUpperCase();
      fileName = `HHGOA_TEAM_FRAME_${teamClean}.png`;
    } else {
      const idCodeClean = (this.state.builderId || "HHG26-EKP03Q").trim().replace(/[^a-zA-Z0-9]/g, "-").toUpperCase();
      fileName = `HHGOA_ID_CARD_${idCodeClean}.png`;
    }

    try {
      const dataUrl = canvas.toDataURL("image/png", 1.0);
      const newWin = window.open("", "_blank");
      if (newWin) {
        newWin.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Hacker Goa House - ${fileName}</title>
              <style>
                body { margin:0; background:#002415; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; font-family:sans-serif; color:#FFE600; padding:20px; text-align:center; }
                img { max-width:92%; max-height:75vh; border:3px solid #FFE600; border-radius:16px; box-shadow:0 10px 40px rgba(0,0,0,0.8); }
                .tip { margin-top:20px; font-size:18px; font-weight:bold; color:#A3D9C3; }
                .btn { margin-top:16px; background:#FFE600; color:#00321E; padding:14px 28px; font-size:16px; font-weight:bold; border-radius:8px; text-decoration:none; display:inline-block; }
              </style>
            </head>
            <body>
              <img src="${dataUrl}" alt="Hacker Goa House ID Card" />
              <div class="tip">💡 Press &amp; Hold (or Right-Click) the image above &amp; select "Save Image As..."</div>
              <a class="btn" download="${fileName}" href="${dataUrl}">📥 Click Here to Download PNG</a>
            </body>
          </html>
        `);
        newWin.document.close();
        App.showToast("Opened ID Card in new tab! 🚀", "success");
      } else {
        this._showDownloadModal(dataUrl, fileName);
      }
    } catch (e) {
      console.error("Open in new tab error:", e);
      this._showDownloadModal(canvas.toDataURL("image/png", 1.0), fileName);
    }
  },

  downloadGraphic(e) {
    this.downloadIdCard(e);
  },

  _showDownloadModal(imgSrc, fileName) {
    const modal = document.getElementById("image-download-modal");
    const img = document.getElementById("modal-download-img");
    const btn = document.getElementById("modal-download-btn");
    const canvas = document.getElementById("builder-card-canvas");

    if (modal && img && btn) {
      const src = imgSrc || (canvas ? canvas.toDataURL("image/png", 1.0) : "");
      img.src = src;
      btn.href = src;
      btn.download = fileName;
      modal.style.display = "flex";
    }
  },

  shareOnX() {
    const isTeam = this.state.formatMode === "team";
    const text = encodeURIComponent(isTeam ? `Check out official Hacker Goa House 2026 Team Frame for squad ${this.state.teamName}! 🚩🌴` : `Just generated my official Hacker Goa House 2026 Builder ID! 🌴 Excited to build in Goa! 🚀`);
    const hashtags = encodeURIComponent(`FrameInGoa,HackerGoaHouse2026`);
    const shareUrl = `https://twitter.com/intent/tweet?text=${text}&hashtags=${hashtags}`;

    window.open(shareUrl, "_blank");
    App.showToast("Opening X with pre-filled caption & #FrameInGoa hashtag!", "success");
  }
};
