import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');";

// Point this at your deployed API. Falls back to same-origin /api if unset.
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const INK = "#14304A";
const BRASS = "#C7A46A";
const BRASS_LIGHT = "#D9BF8E";
const IVORY = "#F6F7F5";
const LINE = "#E1E4E2";
const SLATE = "#56606B";
const CLAY = "#B4553C";

export default function AgentLogin({ onLoginSuccess }) {
  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [brokerage, setBrokerage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        const res = await fetch(`${API_BASE_URL}/auth/agent/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.detail || "Invalid email or password");
        }
        const data = await res.json();
        localStorage.setItem("realtyflow_agent_token", data.access_token);
        onLoginSuccess?.(data);
      } else {
        // Signup hits your own agent-creation endpoint - add one to auth_router.py
        // (POST /auth/agent/signup) that hashes the password and creates the Agent
        // row, then log the agent in the same way as above.
        const res = await fetch(`${API_BASE_URL}/auth/agent/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, brokerage }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.detail || "Could not create account");
        }
        const data = await res.json();
        localStorage.setItem("realtyflow_agent_token", data.access_token);
        onLoginSuccess?.(data);
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: "Inter, sans-serif", minHeight: "100vh", display: "flex", background: IVORY }}>
      <style>{FONT_IMPORT}</style>

      {/* Brand side */}
      <div
        style={{
          flex: 1, background: INK, display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "0 64px", color: "#F6F7F5", minWidth: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 28 }}>
          <img src="/brand/navigation-realty-icon.png" alt="Navigation Realty" style={{ width: 32, height: 32, objectFit: "contain" }} />
          <span style={{ fontFamily: "Fraunces, serif", fontSize: 22, fontWeight: 500 }}>Navigation Realty</span>
        </div>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: 34, fontWeight: 500, lineHeight: 1.25, maxWidth: 420 }}>
          Welcoming the world home.
        </div>
        <div style={{ fontSize: 14.5, color: "#8B93A0", marginTop: 16, maxWidth: 380, lineHeight: 1.6 }}>
          Pipeline, follow-ups, documents, and client portals — built for agents who
          run their whole book from one place.
        </div>
      </div>

      {/* Form side */}
      <div style={{ width: 460, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 340 }}>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 22, fontWeight: 600, color: INK, marginBottom: 6 }}>
            {mode === "login" ? "Welcome back" : "Create your agent account"}
          </div>
          {/* TEMPORARY DEBUG LINE - remove once VITE_API_URL is confirmed working */}
          <div style={{ fontSize: 10, color: "#B4553C", marginBottom: 12, fontFamily: "monospace", wordBreak: "break-all" }}>
            DEBUG API_BASE_URL = "{API_BASE_URL}"
          </div>
          <div style={{ fontSize: 13, color: SLATE, marginBottom: 28 }}>
            {mode === "login" ? "Sign in to your dashboard" : "Set up Navigation Realty for your brokerage"}
          </div>

          {mode === "signup" && (
            <>
              <Field label="Full name">
                <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Jordan Reyes" style={inputStyle} />
              </Field>
              <Field label="Brokerage (optional)">
                <input value={brokerage} onChange={(e) => setBrokerage(e.target.value)} placeholder="Reyes Realty Group" style={inputStyle} />
              </Field>
            </>
          )}

          <Field label="Email">
            <div style={{ position: "relative" }}>
              <Mail size={15} color="#8B94A0" style={iconStyle} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@brokerage.com" style={{ ...inputStyle, paddingLeft: 36 }} />
            </div>
          </Field>

          <Field label="Password">
            <div style={{ position: "relative" }}>
              <Lock size={15} color="#8B94A0" style={iconStyle} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="••••••••"
                style={{ ...inputStyle, paddingLeft: 36, paddingRight: 36 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 2 }}
              >
                {showPassword ? <EyeOff size={15} color="#8B94A0" /> : <Eye size={15} color="#8B94A0" />}
              </button>
            </div>
          </Field>

          {error && (
            <div style={{ background: "#F5E9E4", color: CLAY, fontSize: 12.5, padding: "10px 12px", borderRadius: 8, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: INK, color: "#F6F7F5", border: "none", borderRadius: 10, padding: "13px 0",
              fontSize: 14, fontWeight: 500, cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1,
              fontFamily: "Inter, sans-serif", marginTop: 6,
            }}
          >
            {loading ? <Loader2 size={16} className="spin" /> : mode === "login" ? "Sign in" : "Create account"}
            {!loading && <ArrowRight size={15} />}
          </button>

          <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: SLATE }}>
            {mode === "login" ? (
              <>Don't have an account?{" "}
                <button type="button" onClick={() => setMode("signup")} style={linkStyle}>Sign up</button>
              </>
            ) : (
              <>Already have an account?{" "}
                <button type="button" onClick={() => setMode("login")} style={linkStyle}>Sign in</button>
              </>
            )}
          </div>
        </form>
      </div>

      <style>{`
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input:focus { outline: none; border-color: ${BRASS_LIGHT} !important; }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12.5, fontWeight: 500, color: SLATE, marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", boxSizing: "border-box", padding: "11px 12px", borderRadius: 9,
  border: `1px solid ${LINE}`, fontSize: 13.5, fontFamily: "Inter, sans-serif", color: INK, background: "#FFFFFF",
};

const iconStyle = { position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" };

const linkStyle = {
  background: "none", border: "none", color: BRASS, fontWeight: 600, cursor: "pointer",
  fontSize: 13, fontFamily: "Inter, sans-serif", padding: 0,
};

