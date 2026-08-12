import React, { useMemo, useState } from "react";
import { Search, Phone, Mail, Clock, ChevronRight } from "lucide-react";

const INK = "#132A40";
const SLATE = "#56606B";
const MUTED = "#8B94A0";
const LINE = "#E1E4E2";
const GOLD = "#C7A46A";

const CONTACTS = [
  { id: 1, name: "Priya Chandran", type: "buyer", status: "new_lead", email: "priya.c@email.com", phone: "(512) 555-0142", lastContact: "Today" },
  { id: 2, name: "Marcus Webb", type: "seller", status: "new_lead", email: "marcus.webb@email.com", phone: "(512) 555-0188", lastContact: "2 days ago" },
  { id: 3, name: "The Okonkwo Family", type: "buyer", status: "active", email: "okonkwo.family@email.com", phone: "(737) 555-0119", lastContact: "Yesterday" },
  { id: 4, name: "Dana Feldstein", type: "seller", status: "active", email: "dana.f@email.com", phone: "(512) 555-0173", lastContact: "Today" },
  { id: 5, name: "Ravi & Anjali Sethi", type: "buyer", status: "showing", email: "sethi.family@email.com", phone: "(737) 555-0201", lastContact: "14 days ago" },
  { id: 6, name: "Tom Alvarado", type: "seller", status: "under_contract", email: "t.alvarado@email.com", phone: "(512) 555-0165", lastContact: "3 days ago" },
  { id: 7, name: "Grace Lin", type: "buyer", status: "under_contract", email: "grace.lin@email.com", phone: "(737) 555-0144", lastContact: "1 day ago" },
  { id: 8, name: "Bill Hartman", type: "seller", status: "past_client", email: "bhartman@email.com", phone: "(512) 555-0198", lastContact: "5 months ago" },
];

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

export default function ContactsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    let list = CONTACTS;
    if (filter !== "all") list = list.filter((c) => c.status === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
    }
    return list;
  }, [query, filter]);

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
          const style = STATUS_STYLE[c.status];
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
                  <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: c.type === "buyer" ? "#3D8FA0" : "#8C6A34" }}>
                    {c.type === "buyer" ? "Buyer" : "Seller"}
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
            No contacts match your search.
          </div>
        )}
      </div>
    </div>
  );
}
