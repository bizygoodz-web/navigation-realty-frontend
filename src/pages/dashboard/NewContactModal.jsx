import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { apiFetch } from "../../api";

const INK = "#132A40";
const SLATE = "#56606B";
const MUTED = "#8B94A0";
const LINE = "#E1E4E2";
const GOLD = "#C7A46A";
const CLAY = "#A5522F";

export default function NewContactModal({ isOpen, onClose, onCreated }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [contactType, setContactType] = useState("buyer");
  const [leadSource, setLeadSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  function resetForm() {
    setFirstName(""); setLastName(""); setEmail(""); setPhone("");
    setContactType("buyer"); setLeadSource(""); setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await apiFetch("/contacts", {
        method: "POST",
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email || null,
          phone: phone || null,
          contact_type: contactType,
          lead_source: leadSource || null,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || `Couldn't create contact (${res.status})`);
      }
      const contact = await res.json();
      resetForm();
      onCreated?.(contact);
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(19,42,64,0.45)", zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#FFFFFF", borderRadius: 16, width: "100%", maxWidth: 440,
          padding: "24px 26px 26px", boxShadow: "0 20px 60px rgba(19,42,64,0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <span style={{ fontFamily: "Fraunces, serif", fontSize: 19, fontWeight: 600, color: INK }}>
            New contact
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <X size={18} color={MUTED} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <Field label="First name" required>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required style={inputStyle} />
            </Field>
            <Field label="Last name" required>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} required style={inputStyle} />
            </Field>
          </div>

          <Field label="Email">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          </Field>

          <Field label="Phone">
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(512) 555-0100" style={inputStyle} />
          </Field>

          <Field label="Type">
            <div style={{ display: "flex", gap: 8 }}>
              {["buyer", "seller", "both"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setContactType(t)}
                  style={{
                    flex: 1, padding: "9px 0", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer",
                    border: `1px solid ${contactType === t ? "#14304A" : LINE}`,
                    background: contactType === t ? "#14304A" : "#FFFFFF",
                    color: contactType === t ? "#F6F7F5" : SLATE,
                    textTransform: "capitalize",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Lead source (optional)">
            <input value={leadSource} onChange={(e) => setLeadSource(e.target.value)} placeholder="Referral, Zillow, open house..." style={inputStyle} />
          </Field>

          {error && (
            <div style={{ background: "#F5E9E4", color: CLAY, fontSize: 12.5, padding: "10px 12px", borderRadius: 8, marginBottom: 14 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "#14304A", color: "#F6F7F5", border: "none", borderRadius: 10, padding: "12px 0",
              fontSize: 13.5, fontWeight: 500, cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1,
              fontFamily: "Inter, sans-serif", marginTop: 4,
            }}
          >
            {loading && <Loader2 size={15} className="spin" />}
            {loading ? "Creating..." : "Create contact"}
          </button>
        </form>

        <style>{`.spin { animation: spin 0.8s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom: 14, flex: 1 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: SLATE, marginBottom: 5 }}>
        {label}{required && <span style={{ color: GOLD }}> *</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", boxSizing: "border-box", padding: "9px 11px", borderRadius: 8,
  border: `1px solid ${LINE}`, fontSize: 13, fontFamily: "Inter, sans-serif", color: INK,
};
