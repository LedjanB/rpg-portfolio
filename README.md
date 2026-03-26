# 🎮 Quest: Portfolio — A Developer's Journey

> An interactive 2D RPG village built with React & HTML5 Canvas, where every building is a section of a developer portfolio. Walk around, talk to NPCs, collect coins, ride a horse, and explore a hand-crafted pixel-art world — all in your browser.

![Made with React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Canvas](https://img.shields.io/badge/HTML5-Canvas-E34F26?logo=html5&logoColor=white)

---

## 🗺️ The World

A **44×32 tile village** with cobblestone paths, a river with bridges, a crystal lake, forests, flower gardens, and 30 lampposts that light up the roads. The world is rendered on a 2D canvas with depth-sorted drawing, smooth camera scrolling, and retro pixel-art aesthetics using the **Press Start 2P** font.

### Buildings (Portfolio Sections)

| Building | Section | What's Inside |
|----------|---------|---------------|
| 🏛️ **Town Hall** | Resume / Quest Log | Work experience timeline & education |
| 🍺 **Tavern** | About / Player One | Developer bio, class, level & stats |
| 📚 **Library** | Projects / High Scores | Featured projects with tech stacks |
| 🔥 **Forge** | Skills / Power-Ups | Animated skill bars across Frontend, Backend & DevOps |
| 📮 **Post Office** | Contact / Send Message | Email, GitHub, LinkedIn & Twitter links |

### Characters

- **Village Guide** — Welcomes you to the village and gives tips
- **Scholar** — Hangs out near the Library, points you to projects
- **Fisher** — Sits by Crystal Lake, hints at a hidden coin
- **Traveler** — Arrived from the east, directs you to the Post Office
- **Merchant** — Runs a market stall, knows about hidden coins
- **Blacksmith** — Works the Forge, talks about skills and tools
- **🐱 Cat** — Wanders the town square, meows and purrs
- **🐴 Horse** — Mount it with `M` for a 2.5× speed boost

### Points of Interest

- **Crystal Lake** — A peaceful body of water in the northwest with docks and lily pads
- **River & Bridges** — Runs through the east side with two crossable bridges
- **Town Square** — Central cobblestone plaza with a fountain and market stalls
- **Forest Groves** — Four wooded zones for atmosphere and exploration
- **6 Signposts** — Readable signs that guide you around the village
- **10 Hidden Coins** — Collect them all to unlock a secret easter egg ★

---

## 🎮 Controls

| Input | Action |
|-------|--------|
| `WASD` / `Arrow Keys` | Move |
| `Space` / `Enter` | Talk to NPCs, read signs, enter buildings |
| `M` | Mount / dismount horse |
| `+` / `-` / `Scroll` | Zoom (0.75× → 1× → 1.5× → 2×) |
| `Escape` | Close panels |
| 🔊 Button | Toggle sound on/off |

Full **mobile support** with a touch D-pad and action button.

---

## 🔊 Sound Design

All sounds are synthesized in real-time with the Web Audio API — no audio files needed:

- **Coin pickup** — 3-note ascending chime
- **NPC dialogue** — Retro square-wave chatter
- **Door entry** — Descending triangle tones
- **Footsteps** — Subtle randomized tones
- **Secret unlock** — 4-note victory fanfare

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/LedjanB/rpg-portfolio.git
cd rpg-portfolio

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Build for Production

```bash
npm run build
```

The built site goes into `dist/` — ready for any static host.

---

## 📁 Project Structure

```
rpg-portfolio/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              # React mount
    ├── styles.js             # Styled-components
    ├── config/
    │   ├── map.js            # 44×32 tile map, buildings, NPCs, coins
    │   ├── portfolio.js      # Portfolio section content
    │   └── theme.js          # Centralized color palette
    ├── engine/
    │   ├── input.js          # Keyboard & touch input
    │   ├── collision.js      # Tile-based collision detection
    │   └── sound.js          # Web Audio API synthesizer
    ├── hooks/
    │   └── useGameLoop.js    # 60fps game loop with delta time
    ├── render/
    │   ├── world.js          # Terrain, water, buildings, props
    │   ├── entities.js       # Player, NPCs, horse, cat rendering
    │   └── ui.js             # In-game HUD overlays
    └── components/
        ├── GameCanvas.jsx    # Main canvas + game orchestration
        ├── IntroScreen.jsx   # "Insert Coin" title screen
        ├── DialogueBox.jsx   # NPC conversation UI
        ├── PortfolioPanel.jsx # Building content panels
        ├── HUD.jsx           # Coin counter, zoom, sound toggle
        ├── Minimap.jsx       # Live overhead minimap
        ├── MobileControls.jsx # Touch D-pad for mobile
        └── ErrorBoundary.jsx  # Graceful crash recovery
```

---

## 🎨 How to Customize

### Your Info
Edit `src/config/portfolio.js` to change your name, title, projects, skills, work history, and contact links.

### Add a Building
Push a new entry to the `BUILDINGS` array in `src/config/map.js` and add matching content in `portfolio.js`.

### Add an NPC
Push to the `NPCS` array in `src/config/map.js`:
```js
{ id: "myNpc", label: "STRANGER", x: 15, y: 20, dir: 0,
  hairC: "#FF8800", shirtC: "#2266AA",
  lines: ["Hello traveler!", "Nice weather today."] }
```

### Change Colors
Edit `src/config/theme.js` — all UI colors are centralized there.

### Add Coins
Push `[x, y]` pairs to `COIN_POSITIONS` in `src/config/map.js`.

---

## 🚢 Deploy

### GitHub Pages (automatic)
This repo includes a GitHub Actions workflow that builds and deploys on every push to `main`. Just enable **GitHub Actions** as the Pages source in your repo settings.

**Live at:** `https://yourusername.github.io/rpg-portfolio/`

### Vercel
```bash
npm i -g vercel && vercel
```

### Netlify
Drag and drop the `dist/` folder at [netlify.com/drop](https://app.netlify.com/drop).

---

## ✨ Features

- 🗺️ Hand-crafted 44×32 tile map with 5 explorable buildings
- 🧑‍🤝‍🧑 6 NPCs with unique dialogue + a wandering cat
- 🐴 Rideable horse with 2.5× speed boost
- 🪙 10 collectible coins with a secret easter egg
- 🔊 Synthesized retro sound effects (no audio files)
- 📱 Full mobile support with touch controls
- 🗺️ Live minimap with player tracking
- 🎨 Retro pixel-art aesthetic with "Press Start 2P" font
- ♿ Accessibility: aria labels, focus outlines, reduced-motion support
- 💾 Progress saved to localStorage (coins, sound preference)
- 📐 4 zoom levels (0.75× to 2×) with high-DPI canvas support
- 🌙 Atmospheric lampposts, torch glows, and animated water

---

## 🥚 Easter Eggs

The village is packed with hidden secrets. Here's the full list:

| # | Easter Egg | How to Trigger | What Happens |
|---|-----------|----------------|--------------|
| 1 | **Konami Code** | Type ↑↑↓↓←→←→BA | "SYSTEM" grants you +30 lives (not really) |
| 2 | **Wishing Fountain** | Press Space near the fountain | Toss a coin and receive a random dev fortune |
| 3 | **Wishing Well** | Press Space near any well | Funny echo messages ("404: Wish Not Found") |
| 4 | **Secret Words** | Type "hello", "debug", or "hire" anytime | The game reacts to hidden keyboard words |
| 5 | **Cat Obsessed** | Pet the cat 5 times | Cat gets concerned, hints at the secret word trick |
| 6 | **Master Angler** | Catch 5 fish | Fishing achievement unlocked |
| 7 | **Legendary Fisher** | Catch 10 fish | You could open a fish restaurant |
| 8 | **Social Butterfly** | Talk to all 8+ NPCs | You're the most popular person in the village |
| 9 | **Marathon Runner** | Walk 500 steps | Your pixel character is in peak physical condition |
| 10 | **Property Damage** | Break all 8 crates and pots | Village maintenance crew is NOT happy |
| 11 | **Coin Magnet** | Collect 3 coins within ~5 seconds | "Are you speedrunning this portfolio?" |
| 12 | **Rodeo Clown** | Mount/dismount the horse 6 times quickly | The horse gets annoyed |
| 13 | **Explorer Milestone** | Enter 4 of 8 buildings | Halfway encouragement message |
| 14 | **Almost There** | Enter 7 of 8 buildings | "Just ONE more building!" |
| 15 | **Keyboard Warrior** | Mash movement keys very rapidly | DJ Pixel is impressed, WPM: Over 9000 |
| 16 | **Master Gardener** | Grow all garden flowers to full bloom | Green thumb achievement |
| 17 | **All Coins** | Collect all 12 coins | Secret star + "does this mean I'm hired??" |

---

## 📄 License

MIT
