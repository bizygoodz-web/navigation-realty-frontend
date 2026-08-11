import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const INK = "#14304A";
const BRASS = "#C7A46A";
const BRASS_LIGHT = "#D9BF8E";
const IVORY = "#F6F7F5";
const LINE = "#E1E4E2";
const SLATE = "#56606B";
const CLAY = "#B4553C";

export default function ClientLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/client/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || "Invalid email or password");
      }
      const data = await res.json();
      localStorage.setItem("realtyflow_client_token", data.access_token);
      onLoginSuccess?.(data);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: "Inter, sans-serif", minHeight: "100vh", background: IVORY, maxWidth: 420, margin: "0 auto", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 24px" }}>
      <style>{FONT_IMPORT}</style>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40, justifyContent: "center" }}>
        <img src="/brand/navigation-realty-icon.png" alt="Navigation Realty" style={{ width: 34, height: 34, objectFit: "contain" }} />
        <span style={{ fontFamily: "Fraunces, serif", fontSize: 20, fontWeight: 500, color: INK }}>Navigation Realty</span>
      </div>

      <div style={{ fontFamily: "Fraunces, serif", fontSize: 22, fontWeight: 600, color: INK, textAlign: "center", marginBottom: 6 }}>
        Welcome to your portal
      </div>
      <div style={{ fontSize: 13, color: SLATE, textAlign: "center", marginBottom: 32 }}>
        Sign in to track your home search or listing
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 12.5, fontWeight: 500, color: SLATE, marginBottom: 6 }}>Email</label>
          <div style={{ position: "relative" }}>
            <Mail size={16} color="#8B94A0" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              placeholder="you@email.com"
              style={{ ...inputStyle, paddingLeft: 40 }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", fontSize: 12.5, fontWeight: 500, color: SLATE, marginBottom: 6 }}>Password</label>
          <div style={{ position: "relative" }}>
            <Lock size={16} color="#8B94A0" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type={showPassword ? "text" : "password"}
              value={password} onChange={(e) => setPassword(e.target.value)} required
              placeholder="••••••••"
              style={{ ...inputStyle, paddingLeft: 40, paddingRight: 40 }}
            />
            <button
              type="button" onClick={() => setShowPassword((s) => !s)}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 4 }}
            >
              {showPassword ? <EyeOff size={16} color="#8B94A0" /> : <Eye size={16} color="#8B94A0" />}
            </button>
          </div>
        </div>

        <div style={{ textAlign: "right", marginBottom: 20 }}>
          <span style={{ fontSize: 12.5, color: BRASS, fontWeight: 500 }}>Forgot password?</span>
        </div>

        {error && (
          <div style={{ background: "#F5E9E4", color: CLAY, fontSize: 12.5, padding: "11px 13px", borderRadius: 10, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: INK, color: "#F6F7F5", border: "none", borderRadius: 12, padding: "15px 0",
            fontSize: 14.5, fontWeight: 500, cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1,
            fontFamily: "Inter, sans-serif",
          }}
        >
          {loading ? <Loader2 size={17} className="spin" /> : "Sign in"}
        </button>
      </form>

      <div style={{ textAlign: "center", marginTop: 28, fontSize: 12.5, color: "#8B94A0", lineHeight: 1.6 }}>
        New here? Your agent will send you an invite with your sign-in details.
      </div>

      <style>{`
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input:focus { outline: none; border-color: ${BRASS_LIGHT} !important; }
      `}</style>
    </div>
  );
}

const inputStyle = {
  width: "100%", boxSizing: "border-box", padding: "13px 12px", borderRadius: 12,
  border: `1px solid ${LINE}`, fontSize: 14, fontFamily: "Inter, sans-serif", color: INK, background: "#FFFFFF",
};
