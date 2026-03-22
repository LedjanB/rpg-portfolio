import GameCanvas from "./components/GameCanvas.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

// ─── FONT LOADER ─────────────────────────────────────────────────
if (typeof document !== "undefined") {
  const fl = document.createElement("link");
  fl.href = "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap";
  fl.rel = "stylesheet";
  document.head.appendChild(fl);
}

export default function App() {
  return (
    <ErrorBoundary>
      <GameCanvas />
    </ErrorBoundary>
  );
}
