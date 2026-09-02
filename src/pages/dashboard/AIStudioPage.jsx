import React, { useState } from "react";
import { Sparkles, Loader2, Copy, Check } from "lucide-react";
import { apiFetch } from "../../api";

const INK = "#132A40";
const SLATE = "#56606B";
const MUTED = "#8B94A0";
const LINE = "#E1E4E2";
const GOLD = "#C7A46A";

const CONTENT_TYPES = [
  { key: "follow_up_email", label: "Follow-up email" },
  { key: "follow_up_sms", label: "Follow-up SMS" },
  { key: "listing_description", label: "Listing description" },
  { key: "social_post", label: "Social media post" },
];

export default function AIStudioPage() {
  const [contentType, setContentType] = useState("follow_up_email");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    setError("");
    setDraft("");
    setLoading(true);
    try {
      const res = await apiFetch("/ai/generate", {
        method: "POST",
        body: JSON.stringify({ content_type: contentType, context }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || `Request failed (${res.status})`);
      }
      const data = await res.json();
      setDraft(data.draft);
    } catch (err) {
      setError(err.message || "Couldn't generate content. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      <div style={{ flex: 1, minWidth: 0, background: "#FFFFFF", border: `1px solid ${LINE}`, borderRadius: 12, padding: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <Sparkles size={17} color={GOLD} />
          <span style={{ fontFamily: "Fraunces, serif", fontSize: 16, fontWeight: 600, color: INK }}>
            Draft with AI
          </span>
        </div>

        <label style={{ display: "block", fontSize: 12.5, fontWeight: 500, color: SLATE, marginBottom: 8 }}>
          What are you writing?
        </label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
          {CONTENT_TYPES.map((t) => (
            <button
              key={t.key}
              onClick={() => setContentType(t.key)}
              style={{
                fontSize: 12.5, fontFamily: "Inter, sans-serif", padding: "8px 14px", borderRadius: 20,
                border: `1px solid ${contentType === t.key ? "#14304A" : LINE}`,
                background: contentType === t.key ? "#14304A" : "#FFFFFF",
                color: contentType === t.key ? "#F6F7F5" : SLATE,
                cursor: "pointer", fontWeight: 500,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <label style={{ display: "block", fontSize: 12.5, fontWeight: 500, color: SLATE, marginBottom: 8 }}>
          Context (client name, property, situation)
        </label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="e.g. Grace Lin, just had her offer countered on 204 Birchwood Ct, hasn't responded in 2 days"
          rows={4}
          style={{
            width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 10,
            border: `1px solid ${LINE}`, fontSize: 13.5, fontFamily: "Inter, sans-serif", color: INK,
            resize: "vertical", marginBottom: 16,
          }}
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%",
            background: "#14304A", color: "#F6F7F5", border: "none", borderRadius: 10, padding: "13px 0",
            fontSize: 13.5, fontWeight: 500, cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1,
            fontFamily: "Inter, sans-serif",
          }}
        >
          {loading ? <Loader2 size={16} className="spin" /> : <Sparkles size={15} />}
          {loading ? "Generating..." : "Generate draft"}
        </button>

        {error && (
          <div style={{ background: "#F5E9E4", color: "#A5522F", fontSize: 12.5, padding: "11px 13px", borderRadius: 10, marginTop: 14 }}>
            {error}
          </div>
        )}

        <style>{`.spin { animation: spin 0.8s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>

      <div style={{ flex: 1, minWidth: 0, background: "#FFFFFF", border: `1px solid ${LINE}`, borderRadius: 12, padding: 22, minHeight: 320 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontFamily: "Fraunces, serif", fontSize: 15, fontWeight: 600, color: INK }}>
            Draft
          </span>
          {draft && (
            <button
              onClick={handleCopy}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: SLATE, fontSize: 12 }}
            >
              {copied ? <Check size={14} color="#4F6A4A" /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>
          )}
        </div>
        {draft ? (
          <div style={{ fontSize: 13.5, color: INK, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{draft}</div>
        ) : (
          <div style={{ fontSize: 13, color: MUTED, fontStyle: "italic" }}>
            Your generated draft will appear here.
          </div>
        )}
      </div>
    </div>
  );
}
