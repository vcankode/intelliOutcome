import { ArrowRight } from "lucide-react";

// Navy gradient palette — same family as the login page, but leaned into
// harder here since the whole page is now the brand moment (no seal image).
const C = {
  navyDeep: "#0E2038",
  navy: "#152C4C",
  navyMid: "#1B3A6B",
  blue: "#3D6FB4",
  sky: "#6B9FD4",
  skyLight: "#AFC9E8",
  cream: "#EDE6D8",
  border: "rgba(255,255,255,0.12)",
};

export default function Landing({ onLogin, onSignup } = {}) {
  const goLogin = onLogin || (() => {});
  const goSignup = onSignup || (() => {});

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', system-ui, sans-serif",
        background: `linear-gradient(160deg, ${C.navy} 0%, ${C.navyDeep} 55%, #081426 100%)`,
      }}
    >
      {/* soft radial glow for depth */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 20% 15%, rgba(107,159,212,0.18), transparent 45%)`,
          pointerEvents: "none",
        }}
      />

      {/* Top nav */}
      <div
        style={{
          position: "relative",
          padding: "22px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            color: "#fff",
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "0.03em",
          }}
        >
          IntelliOutcome
        </span>
        <div style={{ display: "flex", gap: 30, fontSize: 12.5, fontWeight: 600, letterSpacing: "0.04em" }}>
          <button
            onClick={goLogin}
            style={{ background: "none", border: "none", color: C.skyLight, cursor: "pointer", padding: 0 }}
          >
            LOGIN
          </button>
          <button
            onClick={goSignup}
            style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 0 }}
          >
            SIGN UP
          </button>
        </div>
      </div>

      {/* Hero */}
      <div
        style={{
          position: "relative",
          maxWidth: 760,
          margin: "0 auto",
          padding: "90px 40px 110px",
        }}
      >
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: "4rem",
            lineHeight: 1.05,
            color: C.cream,
            margin: "0 0 18px 0",
          }}
        >
          IntelliOutcome
        </h1>

        <p
          style={{
            color: C.sky,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: "0.02em",
            lineHeight: 1.6,
            margin: "0 0 28px 0",
          }}
        >
          AI-Driven Outcome-Based Education Management System
        </p>

        <p
          style={{
            color: "rgba(237,230,216,0.75)",
            fontSize: 15.5,
            lineHeight: 1.8,
            maxWidth: 560,
            margin: "0 0 40px 0",
          }}
        >
          IntelliOutcome brings clarity to outcome-based education. Map course
          outcomes to program outcomes, track attainment automatically, and
          generate accreditation-ready reports — replacing manual
          spreadsheets with a system built for accuracy, consistency, and
          speed.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
          <button
            onClick={goLogin}
            style={{
              background: C.cream,
              color: C.navyDeep,
              border: "none",
              padding: "13px 32px",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.03em",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            LOGIN <ArrowRight size={15} />
          </button>

          <button
            onClick={goSignup}
            style={{
              background: "transparent",
              color: "#fff",
              border: `1px solid ${C.border}`,
              padding: "13px 28px",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.03em",
              cursor: "pointer",
            }}
          >
            Sign up
          </button>
        </div>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700&display=swap');`}</style>
    </div>
  );
}