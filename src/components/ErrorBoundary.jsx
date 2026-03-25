import { Component } from "react";
import { C } from "../engine/constants.js";
import { f1, f2 } from "../styles.js";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={{ width: "100%", height: "100vh", background: C.pageBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 480, padding: 32 }}>
          <div style={{ ...f1, fontSize: 24, color: C.error, marginBottom: 16 }}>GAME OVER</div>
          <div style={{ ...f2, fontSize: 22, color: C.uiText, marginBottom: 24, lineHeight: 1.5 }}>
            Something went wrong. The quest has encountered an unexpected error.
          </div>
          <div style={{ ...f2, fontSize: 16, color: C.gray3, marginBottom: 24, background: "rgba(255,255,255,0.05)", padding: 12, borderRadius: 6, textAlign: "left", wordBreak: "break-word" }}>
            {this.state.error?.message || "Unknown error"}
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{ ...f1, fontSize: 10, color: C.uiGold, background: "none", border: `2px solid ${C.uiGold}`, padding: "12px 24px", borderRadius: 6, cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.background = C.uiGold; e.currentTarget.style.color = "#000"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = C.uiGold; }}
          >
            CONTINUE? (RELOAD)
          </button>
        </div>
      </div>
    );
  }
}
