import React, { useEffect, useMemo, useState } from "react";
import { Search, Phone, Mail, Clock, ChevronRight, Loader2 } from "lucide-react";

const INK = "#132A40";
const SLATE = "#56606B";
const MUTED = "#8B94A0";
const LINE = "#E1E4E2";
const CLAY = "#A5522F";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const STATUS_STYLE = {
  new_lead: { bg: "#EFE7D4", fg: "#8C6A34", label: "New lead" },
  active: { bg: "#E4F0F2", fg: "#3D8FA0", label: "Active" },
  showing: { bg: "#E4F0F2", fg: "#3D8FA0", label: "Showing" },
  under_contract: { bg: "#E9EEE7", fg: "#4F6A4A", label: "Under contract" },
  past_client: { bg: "#EEEBF2", fg: "#5B527A", label: "Past client" },
};

function initials(name) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function formatDate(iso) {
  if (!iso) return "Never";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function loadContacts() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("realtyflow_agent_token");
        const res = await fetch(`${API_BASE_URL}/contacts`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.detail || `Couldn't load contacts (${res.status})`);
        }
        const data = await res.json();
        setContacts(
          data.map((c) => ({
            id: c.id,
            name: `${c.first_name} ${c.last_name}`,
            type: c.contact_type,
            status: c.status,
            email: c.email || "—",
            phone: c.phone || "—",
            lastContact: formatDate(c.last_contacted_at || c.created_at),
          }))
        );
      } catch (err) {
        setError(err.message || "Couldn't load contacts.");
      } finally {
        setLoading(false);
      }
    }
    loadContacts();
  }, []);

  const filtered = useMemo(() => {
    let list = contacts;
    if (filter !== "all") list = list.filter((c) => c.status === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
    }
    return list;
  }, [contacts, query, filter]);

  const filters = [
    { key: "all", label: "All" },
    { key: "new_lead", label: "New leads" },
    { key: "active", label: "Active" },
    { key: "showing", label: "Showing" },
    { key: "under_contract", label: "Under contract" },
    { key: "past_client", label: "Past clients" },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <div
          style={{
            display: "flex", alignItems: "center", gap: 8, background: "#FFFFFF", border: `1px solid ${LINE}`,
            borderRadius: 8, padding: "8px 12px", width: 260,
          }}
        >
          <Search size={15} color={MUTED} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search contacts..."
            style={{ border: "none", outline: "none", background: "transparent", fontSize: 13, width: "100%", fontFamily: "Inter, sans-serif", color: INK }}
          />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                fontSize: 12.5, fontFamily: "Inter, sans-serif", padding: "7px 12px", borderRadius: 20,
                border: `1px solid ${filter === f.key ? "#14304A" : LINE}`,
                background: filter === f.key ? "#14304A" : "#FFFFFF",
                color: filter === f.key ? "#F6F7F5" : SLATE,
                cursor: "pointer", fontWeight: 500,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "32px 0", justifyContent: "center", color: MUTED, fontSize: 13 }}>
          <Loader2 size={16} className="spin" />
          Loading contacts...
          <style>{`.spin { animation: spin 0.8s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {!loading && error && (
        <div style={{ background: "#F5E9E4", color: CLAY, fontSize: 13, padding: "14px 16px", borderRadius: 10, marginBottom: 16 }}>
          {error}
          {error.toLowerCase().includes("credential") && (
            <div style={{ marginTop: 4, fontStyle: "italic" }}>Your session may have expired — try logging in again.</div>
          )}
        </div>
      )}

      {!loading && !error && (
        <div style={{ background: "#FFFFFF", border: `1px solid ${LINE}`, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr 1.6fr 1.4fr 1fr 20px", padding: "12px 18px", borderBottom: `1px solid ${LINE}`, fontSize: 11.5, fontWeight: 600, color: MUTED, letterSpacing: "0.03em", textTransform: "uppercase" }}>
            <span>Contact</span>
            <span>Status</span>
            <span>Email</span>
            <span>Phone</span>
            <span>Last contact</span>
            <span />
          </div>
          {filtered.map((c) => {
            const style = STATUS_STYLE[c.status] || STATUS_STYLE.new_lead;
            return (
              <div
                key={c.id}
                style={{
                  display: "grid", gridTemplateColumns: "2.2fr 1fr 1.6fr 1.4fr 1fr 20px", alignItems: "center",
                  padding: "14px 18px", borderBottom: `1px solid ${LINE}`, cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFBF9")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#14304A", color: "#E3D2AC", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
                    {initials(c.name)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                    <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: c.type === "buyer" ? "#3D8FA0" : c.type === "seller" ? "#8C6A34" : "#5B527A" }}>
                      {c.type === "buyer" ? "Buyer" : c.type === "seller" ? "Seller" : "Buyer & Seller"}
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: style.fg, background: style.bg, borderRadius: 20, padding: "4px 10px", width: "fit-content" }}>
                  {style.label}
                </span>
                <span style={{ fontSize: 12.5, color: SLATE, display: "flex", alignItems: "center", gap: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  <Mail size={12} color={MUTED} />{c.email}
                </span>
                <span style={{ fontSize: 12.5, color: SLATE, display: "flex", alignItems: "center", gap: 6 }}>
                  <Phone size={12} color={MUTED} />{c.phone}
                </span>
                <span style={{ fontSize: 12, color: MUTED, display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock size={11} />{c.lastContact}
                </span>
                <ChevronRight size={15} color={MUTED} />
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ padding: "32px 18px", textAlign: "center", fontSize: 13, color: MUTED, fontStyle: "italic" }}>
              {contacts.length === 0 ? "No contacts yet — create your first one above." : "No contacts match your search."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
