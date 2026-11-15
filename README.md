# Rayver S. Reyes — Developer Portfolio

A modern, responsive developer portfolio built with **HTML5**, **CSS3**, **Bootstrap 5**, and **vanilla JavaScript**. Designed as a static site for effortless Vercel deployment.

---

## 🗂 File Structure

```
portfolio/
├── index.html          # Main page (all sections)
├── css/
│   └── style.css       # Custom design system & component styles
├── js/
│   └── main.js         # Interactions, animations, form handling
├── assets/             # Images, screenshots, resume (add your own)
│   └── (empty — add project screenshots here)
└── README.md           # This file
```

---

## 🖥 Preview Locally

Since this is a **static site**, you can preview it in multiple ways:

### Option A — Direct File Open
Simply **double-click `index.html`** in your file explorer to open it in a browser.

### Option B — Using XAMPP (since it's in `htdocs/`)
1. Start **Apache** in the XAMPP Control Panel
2. Navigate to `http://localhost/portfolio/`

### Option C — Using a Simple HTTP Server

**Python:**
```bash
cd portfolio
python -m http.server 8000
# Open http://localhost:8000
```

**Node.js (npx):**
```bash
cd portfolio
npx serve .
```

---

## 🚀 Deploy to Vercel

### Method 1 — Vercel CLI
```bash
npm i -g vercel
cd portfolio
vercel
```
Follow the prompts. Vercel will auto-detect it as a static site.

### Method 2 — GitHub + Vercel Dashboard
1. Push this folder to a **GitHub repository**
2. Go to [vercel.com](https://vercel.com) and click **"New Project"**
3. Import your GitHub repo
4. Vercel will auto-detect the static files — no build settings needed
5. Click **Deploy** ✅

---

## ✏️ How to Customize

### Replace Placeholder Content

Search for these markers in `index.html` and replace them with your real info:

| Marker | Where | What to Add |
|--------|-------|-------------|
| `[ADD SCREENSHOT]` | Project cards | Replace the placeholder `<div>` with an `<img src="assets/your-image.png">` |
| `[ADD GITHUB LINK]` | Project cards | Replace `href="#"` with your GitHub repo URL |
| `[ADD LIVE DEMO LINK]` | Project cards | Replace `href="#"` with your live demo URL |
| `[ADD YOUR EMAIL]` | Contact section & footer | Replace `your.email@example.com` |
| `[ADD YOUR LINKEDIN]` | Contact section & footer | Replace `linkedin.com/in/your-profile` |
| `[ADD YOUR GITHUB]` | Contact section & footer | Replace `github.com/your-username` |
| `[ADD YOUR PHONE]` | Contact section | Replace `+63 9XX XXX XXXX` |

### Hook Up the Contact Form

The form is ready for either **EmailJS** or **Formspree**:

**Formspree (easiest):**
1. Sign up at [formspree.io](https://formspree.io)
2. Add `action="https://formspree.io/f/YOUR_FORM_ID"` and `method="POST"` to the `<form>` tag
3. Remove the `e.preventDefault()` in `main.js`

**EmailJS:**
1. Sign up at [emailjs.com](https://emailjs.com)
2. Add the EmailJS SDK script
3. Replace the `console.log` in `main.js` with `emailjs.send(...)` call

### Add Project Screenshots
1. Save images to the `assets/` folder
2. Replace the `project-image-placeholder` `<div>` in each project card with:
   ```html
   <img src="assets/your-screenshot.png" alt="Project Name" style="width:100%; height:100%; object-fit:cover;" />
   ```

---

## 🎨 Design Features

- **Color Palette**: Deep indigo/near-black base with cyan & violet accents
- **Typography**: Inter (body) + JetBrains Mono (code/labels)
- **Glassmorphism** cards with subtle backdrop blur
- **Particle animation** on hero canvas (auto-pauses when off-screen)
- **Typed text effect** cycling through role titles
- **Scroll-reveal animations** via IntersectionObserver
- **Fully responsive** with mobile-first breakpoints
- **Sticky navbar** with active section highlighting

---

## 📄 License

This portfolio is for personal use by Rayver S. Reyes. Feel free to use it as inspiration for your own portfolio.
