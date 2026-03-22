# 🎮 RPG Portfolio

An interactive RPG town explorer that doubles as a developer portfolio. Built with React and HTML5 Canvas.

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)

### Setup

```bash
# 1. Navigate into the project folder
cd rpg-portfolio

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open **http://localhost:5173** in your browser.

### Build for Production

```bash
npm run build
```

Your built site will be in the `dist/` folder — ready to deploy to Vercel, Netlify, GitHub Pages, or any static host.

## 🎨 How to Customize

All customization happens in the **top section** of `src/App.jsx` (the CONFIG section). You don't need to touch anything below the `⚙️ ENGINE` banner.

### Change Your Info
```js
const YOUR_NAME = "Jane Doe";
const YOUR_TITLE = "Frontend Engineer & Creative Coder";
```

### Edit Portfolio Content
Find the `PORTFOLIO_CONTENT` object and update the text, projects, skills, and links.

### Add a Building
Push a new object to the `BUILDINGS` array:
```js
{ id: "blog", name: "BLOG", x: 20, y: 18, w: 5, h: 3, doorX: 22, doorY: 18,
  walls: ["#6A5A4A","#5A4A3A","#7A6A5A"], roof: ["#4A8A4A","#3A7A3A","#5A9A5A"] },
```
Then add matching content in `PORTFOLIO_CONTENT.blog`.

### Add an NPC
Push to the `NPCS` array:
```js
{ id: "myNpc", label: "STRANGER", x: 15, y: 20, dir: 0,
  hairC: "#FF8800", shirtC: "#2266AA",
  lines: ["Hello traveler!", "Nice weather today."] },
```

### Change Colors
Edit any value in the `COLORS` object to retheme everything.

### Add Coins
Push `[x, y]` pairs to `COIN_POSITIONS`.

## 🎮 Controls
- **WASD / Arrow Keys** — Move
- **Space / Enter** — Interact with buildings, NPCs, and the cat
- **+/- or Mouse Wheel** — Zoom in/out
- **Escape** — Close panels

## 📁 Project Structure
```
rpg-portfolio/
├── index.html          # HTML entry point
├── package.json        # Dependencies & scripts
├── vite.config.js      # Vite bundler config
├── README.md           # This file
└── src/
    ├── main.jsx        # React mount point
    └── App.jsx         # The entire game (config + engine)
```

## 🚢 Deploy

### Vercel
```bash
npm i -g vercel
vercel
```

### Netlify
Drag and drop the `dist/` folder after running `npm run build`.

### GitHub Pages
```bash
npm run build
# Push the dist/ folder to your gh-pages branch
```
