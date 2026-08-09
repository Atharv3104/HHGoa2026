# 🌴 FrameInGoa — Hacker Goa House 2026

> **Create. Customize. Represent. 🚀**
> A fast, privacy-first graphic generator for **Hacker Goa House 2026** participants.

FrameInGoa lets participants upload their photo, enter their personal and technical details, and instantly generate a branded **Profile Picture Frame** or **Builder ID Card**.

Everything runs **100% client-side** — no login, no database, and no photo upload to a server.

---

## ✨ Features

### 🖼️ Two Graphic Formats

#### Format A — PFP Frame

Create a social-media-ready profile picture with:

* Circular photo frame
* Tropical Goa green background
* Yellow and pink accent rings
* High-resolution 2× rendering
* Optimized for profile pictures and social sharing

#### Format B — Builder ID Card

Generate a complete Hacker Goa House Builder ID containing:

* 📸 Profile Photo
* 👤 Name
* 🏷️ Generated Builder Title
* 💻 Role
* 🛠️ Tech Stack
* 🎓 College
* 📍 Location / Address
* 📧 Email
* 📱 Masked Phone Number
* 📸 Instagram
* 🐙 GitHub
* 💼 LinkedIn
* 🆔 Builder ID
* 📊 Barcode
* 🔳 QR Code
* `#FrameInGoa`
* Hacker Goa House 2026 branding

---

## 🔐 Privacy First

FrameInGoa is designed with a **100% client-side architecture**.

Your personal information and photos remain inside your browser.

### No:

* ❌ Login
* ❌ Account creation
* ❌ Backend server
* ❌ Database
* ❌ Photo uploads
* ❌ Personal-data storage

### Phone Number Protection

Phone numbers are automatically masked before being displayed on the generated card.

Example:

```text
+91 9876543210
        ↓
+91 98****3210
```

---

## 🎨 Event Branding

FrameInGoa follows the official **Hacker Goa House 2026** visual direction.

### Color Palette

| Color                    | Hex       | Usage                |
| ------------------------ | --------- | -------------------- |
| 🌴 Tropical Forest Green | `#005A36` | Primary background   |
| 🌲 Deep Green            | `#004D2E` | Secondary background |
| ☀️ Sunny Yellow          | `#FFE600` | Highlights & borders |
| 💗 Hot Pink              | `#FF007A` | Accent & branding    |

The interface combines:

* Tropical Goa aesthetics
* Glassmorphism
* Neon accents
* Modern typography
* Responsive layouts
* High-contrast UI elements

---

## 🧑‍💻 Builder Information

Participants can customize their generated card with:

```text
Name
Role
Tech Stack
Builder Title
College
Location / Address
Email
Instagram
GitHub
LinkedIn
Phone Number
Builder ID
```

The application provides predefined role and technology options while also allowing personalized information.

---

## 🏗️ Application Architecture

FrameInGoa uses a lightweight browser-based architecture:

```text
                  ┌──────────────────────┐
                  │     User Browser     │
                  └──────────┬───────────┘
                             │
              ┌──────────────▼──────────────┐
              │      Generator Interface    │
              │       HTML + CSS + JS       │
              └──────────────┬──────────────┘
                             │
              ┌──────────────▼──────────────┐
              │      Canvas Engine          │
              │   Photo + Text + Graphics   │
              └──────────────┬──────────────┘
                             │
              ┌──────────────▼──────────────┐
              │       PNG Generator         │
              │       High-DPI 2×           │
              └──────────────┬──────────────┘
                             │
                  ┌──────────▼───────────┐
                  │ Download / Copy / X  │
                  └──────────────────────┘
```

No application backend is required.

---

# 📁 Project Structure

```text
FrameInGoa/
│
├── index.html
├── config.js
├── canvasEngine.js
├── generatorView.js
├── styles.css
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── samples/
│
├── README.md
└── LICENSE
```

---

## ⚙️ Core Files

### `index.html`

Application entry point.

Responsible for:

* Page structure
* SEO metadata
* Open Graph metadata
* Google Fonts
* External libraries
* Generator UI container

Fonts used:

* Syne
* Outfit
* Plus Jakarta Sans
* Cinzel

---

### `config.js`

Central application configuration.

Contains:

* Event branding
* Color palette
* Default builder roles
* Tech stack options
* Builder title rules
* Default theme
* Generator configuration

Example:

```javascript
const EVENT_CONFIG = {
    name: "Hacker Goa House",
    year: 2026,
    hashtag: "#FrameInGoa",
    colors: {
        forestGreen: "#005A36",
        deepGreen: "#004D2E",
        yellow: "#FFE600",
        pink: "#FF007A"
    }
};
```

---

### `canvasEngine.js`

The main graphic rendering engine.

Responsible for:

* Photo rendering
* Photo cropping
* Zoom
* Pan
* Rotation
* Text rendering
* Frame rendering
* Builder ID Card rendering
* PFP frame rendering
* Barcode generation
* QR code generation
* High-DPI PNG export

---

### `generatorView.js`

Controls the interactive generator interface.

Handles:

* Form inputs
* Photo upload
* Drag & drop
* Sample photos
* Format switching
* Live preview
* Zoom controls
* Pan controls
* Rotation
* Auto-center
* Download
* Copy image
* X sharing

---

### `styles.css`

Contains the complete visual design system.

Includes:

* Tropical green theme
* Glassmorphic cards
* Responsive layouts
* Neon yellow/pink accents
* Buttons
* Form controls
* Chips
* Mobile layouts
* Generator panels
* Canvas preview

---

# 🖼️ Photo Upload

Supported formats:

```text
JPG
JPEG
PNG
HEIC
```

Users can either:

* Click to upload
* Drag and drop an image
* Select a sample builder photo

HEIC images are converted inside the browser using `heic2any`.

---

# 🎛️ Photo Controls

Users can adjust their uploaded photo before generating the graphic.

### Controls

```text
Zoom
Pan X
Pan Y
Rotation
Auto Center
```

The preview updates instantly as the controls change.

---

# 🪪 Builder ID

Each generated Builder ID can follow the Hacker Goa House format:

```text
HHG26-EKP03
```

The Builder ID is displayed on the ID card together with:

* Barcode
* QR Code

---

# 📱 Responsive Design

FrameInGoa is designed for:

### Desktop

```text
┌─────────────────────────────────────────┐
│              Generator                  │
├──────────────────┬──────────────────────┤
│                  │                      │
│   Form Controls  │    Live Preview      │
│                  │                      │
└──────────────────┴──────────────────────┘
```

### Mobile

```text
┌────────────────────┐
│      Preview       │
├────────────────────┤
│      Controls      │
├────────────────────┤
│      Form          │
└────────────────────┘
```

The interface automatically adapts to smaller screens.

---

# 📤 Export

Generated graphics can be exported directly from the browser.

### Download PNG

The canvas uses **2× rendering** to produce a crisp, high-resolution PNG.

```text
Canvas
  ↓
2× Resolution
  ↓
PNG Export
  ↓
Download
```

This helps maintain image quality when the generated graphic is shared on social media.

---

# 📋 Copy Image

The **Copy Image** feature allows users to copy the generated graphic directly to their clipboard where browser permissions support image clipboard access.

This makes it easy to paste the graphic into:

* Social media
* Messaging applications
* Documents
* Design tools

---

# 𝕏 Share on X

FrameInGoa provides a direct X sharing action.

The generated post contains the event hashtag:

```text
#FrameInGoa
```

Example caption:

```text
Building, creating & hacking at Hacker Goa House 2026 🌴🚀

Meet the builder behind the build.

#FrameInGoa #HackerGoaHouse
```

The application opens the X sharing intent with the caption pre-filled.

---

# 🧪 Verification & Testing

Before deployment, verify the following.

### Photo Upload

* [ ] JPG upload works
* [ ] PNG upload works
* [ ] HEIC upload works
* [ ] Drag & drop works
* [ ] Sample photo selection works

### Photo Controls

* [ ] Zoom works
* [ ] Pan X works
* [ ] Pan Y works
* [ ] Rotation works
* [ ] Auto-center works
* [ ] Circular crop works

### Form

* [ ] Name
* [ ] Role
* [ ] Tech Stack
* [ ] Builder Title
* [ ] College
* [ ] Location / Address
* [ ] Email
* [ ] Instagram
* [ ] GitHub
* [ ] LinkedIn
* [ ] Phone
* [ ] Builder ID

### Privacy

* [ ] Phone automatically masks
* [ ] No phone number is sent to a server
* [ ] No photo is uploaded to a backend
* [ ] No login is required

### Builder ID Card

* [ ] Photo renders correctly
* [ ] Builder title renders correctly
* [ ] Name renders correctly
* [ ] All details render correctly
* [ ] Barcode renders correctly
* [ ] QR code renders correctly
* [ ] Builder ID renders correctly

### Formats

* [ ] Format A — PFP Frame
* [ ] Format B — Builder ID Card
* [ ] Switching between formats works

### Export

* [ ] Download PNG works
* [ ] PNG is high resolution
* [ ] Copy Image works
* [ ] X share opens correctly
* [ ] `#FrameInGoa` is included

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/FrameInGoa.git
```

---

## 2. Open the Project

```bash
cd FrameInGoa
```

---

## 3. Run Locally

Because the project is client-side, it can be served using any static web server.

For example, with VS Code **Live Server**:

```text
Right Click index.html
        ↓
Open with Live Server
```

Or using Python:

```bash
python -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

---

# 🌐 Deployment

FrameInGoa can be deployed to any static hosting platform.

Suitable options include:

* Vercel
* Netlify
* GitHub Pages
* Cloudflare Pages

No backend server is required.

---

# 🔒 Security & Privacy

FrameInGoa follows a privacy-first approach.

### Data Flow

```text
User Photo
    │
    ▼
Browser Memory
    │
    ▼
Canvas Renderer
    │
    ▼
Generated PNG
```

The photo does **not** need to leave the user's device.

Personal details are used only for generating the graphic within the browser.

---

# 🛠️ Technologies

| Technology      | Purpose                |
| --------------- | ---------------------- |
| HTML5           | Application structure  |
| CSS3            | UI & responsive design |
| JavaScript      | Application logic      |
| Canvas API      | Graphic generation     |
| `heic2any`      | HEIC conversion        |
| QR Code Library | QR generation          |
| Barcode Library | Barcode generation     |
| Google Fonts    | Typography             |
| Canvas Confetti | Celebration animation  |

---

# 🎯 Project Goals

FrameInGoa is built to provide:

* ⚡ Fast graphic generation
* 📱 Mobile-first experience
* 🔐 Privacy-first processing
* 🎨 Hacker Goa House branding
* 🖼️ High-quality PNG exports
* 🚀 Zero backend dependency
* 🌴 Goa-inspired visual identity
* 📣 Easy social sharing

---

# 🌴 Hacker Goa House 2026

**GOA, INDIA**

**HACKER GOA HOUSE**

**28 – 31 OCT 2026**

Create your identity.
Show your stack.
Represent your build.

### `#FrameInGoa`

---

## 📜 License

This project is intended for the **Hacker Goa House 2026** event and its participants.

Add the appropriate project license here if this repository is intended for public reuse.

---

## 🤝 Contributing

Contributions, improvements, UI enhancements, and bug fixes are welcome.

### Suggested workflow

```bash
git checkout -b feature/your-feature
```

Make your changes, test them locally, then:

```bash
git add .
git commit -m "Add your feature"
git push origin feature/your-feature
```

Open a Pull Request with a clear description of your changes.

---

# ⭐ Support

If you like the project, consider giving the repository a ⭐ on GitHub.

**Built for builders. Built in Goa. 🌴💻**

`#FrameInGoa` `#HackerGoaHouse` `#HackerGoaHouse2026`

