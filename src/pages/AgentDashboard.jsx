import React, { useState, useMemo } from "react";
import {
  Home, Users, Building2, FileText, Calendar, Sparkles, Search, Plus, Bell,
  Phone, Mail, Clock, ChevronRight, TrendingUp, MapPin, CircleDollarSign,
  FileCheck2, FileClock, FilePenLine, MoreHorizontal, ArrowUpRight
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');";

const STAGES = [
  { key: "new_lead", label: "New leads" },
  { key: "active", label: "Active" },
  { key: "showing", label: "Showing" },
  { key: "under_contract", label: "Under contract" },
  { key: "past_client", label: "Past clients" },
];

const DEALS = [
  { id: 1, name: "Priya Chandran", type: "buyer", stage: "new_lead", value: 480000, sub: "Budget $450–520k · Round Rock", days: 2 },
  { id: 2, name: "Marcus Webb", type: "seller", stage: "new_lead", value: 615000, sub: "312 Ashcroft Ln · Listing prep", days: 4 },
  { id: 3, name: "The Okonkwo Family", type: "buyer", stage: "active", value: 710000, sub: "Pre-approved · Pflugerville", days: 11 },
  { id: 4, name: "Dana Feldstein", type: "seller", stage: "active", value: 389000, sub: "204 Birchwood Ct · Active MLS", days: 18 },
  { id: 5, name: "Ravi & Anjali Sethi", type: "buyer", stage: "showing", value: 555000, sub: "3 showings this week", days: 9 },
  { id: 6, name: "Tom Alvarado", type: "seller", stage: "under_contract", value: 442000, sub: "Closing Sep 2 · Inspection done", days: 26 },
  { id: 7, name: "Grace Lin", type: "buyer", stage: "under_contract", value: 601000, sub: "Appraisal scheduled", days: 21 },
  { id: 8, name: "Bill Hartman", type: "seller", stage: "past_client", value: 375000, sub: "Closed Mar 2026 · Anniversary due", days: 148 },
];

const LEDGER = [
  { id: 1, name: "Priya Chandran", action: "New lead captured", meta: "Intake form · budget $450–520k", time: "9:12 AM", tag: "lead" },
  { id: 2, name: "Dana Feldstein", action: "Showing feedback logged", meta: "\u201cLoved the kitchen, price feels high\u201d", time: "8:40 AM", tag: "showing" },
  { id: 3, name: "Tom Alvarado", action: "Disclosure packet signed", meta: "Seller's disclosure · e-signed", time: "Yesterday", tag: "doc" },
  { id: 4, name: "Ravi & Anjali Sethi", action: "Follow-up reminder", meta: "No contact in 14 days", time: "Yesterday", tag: "reminder" },
  { id: 5, name: "Grace Lin", action: "Offer countered", meta: "$601,000 · seller countered +$8k", time: "Mon", tag: "offer" },
  { id: 6, name: "Bill Hartman", action: "Anniversary check-in sent", meta: "Automated · Past Client Nurture", time: "Mon", tag: "auto" },
];

const STATS = [
  { label: "Active pipeline value", value: "$3.42M", delta: "+8.1%", trend: [4, 6, 5, 8, 7, 9, 11] },
  { label: "Open leads", value: "14", delta: "+3 this week", trend: [2, 3, 3, 5, 4, 6, 6] },
  { label: "Showings this week", value: "9", delta: "2 tomorrow", trend: [1, 3, 2, 4, 3, 5, 4] },
  { label: "Avg. days on market", value: "24", delta: "-6 vs last qtr", trend: [30, 29, 28, 27, 26, 25, 24] },
];

const NAV = [
  { key: "pipeline", label: "Pipeline", icon: Home },
  { key: "contacts", label: "Contacts", icon: Users },
  { key: "listings", label: "Listings", icon: Building2 },
  { key: "documents", label: "Documents", icon: FileText },
  { key: "calendar", label: "Calendar", icon: Calendar },
  { key: "ai", label: "AI Studio", icon: Sparkles },
];

const TAG_STYLE = {
  lead: { bg: "#EFE7D4", fg: "#8C6A34", label: "Lead" },
  showing: { bg: "#E9EEE7", fg: "#4F6A4A", label: "Showing" },
  doc: { bg: "#E4F0F2", fg: "#3D8FA0", label: "Document" },
  reminder: { bg: "#F5E9E4", fg: "#A5522F", label: "Reminder" },
  offer: { bg: "#EFE7D4", fg: "#8C6A34", label: "Offer" },
  auto: { bg: "#EEEBF2", fg: "#5B527A", label: "Automated" },
};

function currency(n) {
  return "$" + n.toLocaleString("en-US");
}

function initials(name) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function Sparkline({ data, color }) {
  const points = data.map((v, i) => ({ i, v }));
  return (
    <div style={{ width: 72, height: 28 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points}>
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.75} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function StatCard({ stat }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E1E4E2",
        borderRadius: 12,
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minWidth: 0,
      }}
    >
      <div style={{ fontSize: 12, letterSpacing: "0.02em", color: "#7A7568", fontFamily: "Inter, sans-serif" }}>
        {stat.label}
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 26, fontWeight: 500, color: "#132A40", lineHeight: 1 }}>
            {stat.value}
          </div>
          <div style={{ fontSize: 12, color: "#5F7A5A", marginTop: 6, fontFamily: "Inter, sans-serif" }}>
            {stat.delta}
          </div>
        </div>
        <Sparkline data={stat.trend} color="#C7A46A" />
      </div>
    </div>
  );
}

function DealCard({ deal }) {
  const isBuyer = deal.type === "buyer";
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E1E4E2",
        borderRadius: 10,
        padding: "14px 14px 12px",
        cursor: "pointer",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#D9BF8E")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E1E4E2")}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div
          style={{
            width: 30, height: 30, borderRadius: "50%", background: "#14304A", color: "#E3D2AC",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 600, fontFamily: "Inter, sans-serif", flexShrink: 0,
          }}
        >
          {initials(deal.name)}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 500, color: "#132A40", fontFamily: "Inter, sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {deal.name}
          </div>
          <div
            style={{
              fontSize: 10.5, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase",
              color: isBuyer ? "#3D8FA0" : "#8C6A34", marginTop: 1, fontFamily: "Inter, sans-serif",
            }}
          >
            {isBuyer ? "Buyer" : "Seller"}
          </div>
        </div>
      </div>
      <div style={{ fontSize: 12.5, color: "#56606B", marginBottom: 10, fontFamily: "Inter, sans-serif", lineHeight: 1.4 }}>
        {deal.sub}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: 15, fontWeight: 500, color: "#132A40" }}>
          {currency(deal.value)}
        </div>
        <div style={{ fontSize: 11, color: "#8B94A0", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
          <Clock size={11} />
          {deal.days}d in stage
        </div>
      </div>
    </div>
  );
}

function StageColumn({ stage, deals }) {
  const stageDeals = deals.filter((d) => d.stage === stage.key);
  const total = stageDeals.reduce((s, d) => s + d.value, 0);
  return (
    <div style={{ minWidth: 248, width: 248, display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "0 4px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: "#132A40", fontFamily: "Inter, sans-serif" }}>
            {stage.label}
          </span>
          <span
            style={{
              fontSize: 11, color: "#8C6A34", background: "#EFE7D4", borderRadius: 20,
              padding: "1px 7px", fontFamily: "Inter, sans-serif", fontWeight: 500,
            }}
          >
            {stageDeals.length}
          </span>
        </div>
      </div>
      <div style={{ fontSize: 11, color: "#8B94A0", padding: "0 4px 10px", fontFamily: "Inter, sans-serif" }}>
        {currency(total)} total
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {stageDeals.map((d) => (
          <DealCard key={d.id} deal={d} />
        ))}
        {stageDeals.length === 0 && (
          <div style={{ fontSize: 12, color: "#A8B0BA", padding: "14px 4px", fontStyle: "italic", fontFamily: "Inter, sans-serif" }}>
            No records in this stage
          </div>
        )}
      </div>
    </div>
  );
}

function LedgerEntry({ entry, index, isLast }) {
  const style = TAG_STYLE[entry.tag];
  return (
    <div style={{ display: "flex", gap: 12, position: "relative" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 20, flexShrink: 0 }}>
        <div
          style={{
            width: 7, height: 7, borderRadius: "50%", background: "#C7A46A", marginTop: 5, flexShrink: 0,
            boxShadow: "0 0 0 3px #F6F7F5",
          }}
        />
        {!isLast && <div style={{ flex: 1, width: 1, background: "#E1E4E2", marginTop: 2 }} />}
      </div>
      <div style={{ paddingBottom: 20, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "Fraunces, serif", fontSize: 11.5, color: "#A8B0BA" }}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            style={{
              fontSize: 10, fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase",
              color: style.fg, background: style.bg, borderRadius: 4, padding: "2px 6px", fontFamily: "Inter, sans-serif",
            }}
          >
            {style.label}
          </span>
          <span style={{ fontSize: 11, color: "#8B94A0", fontFamily: "Inter, sans-serif", marginLeft: "auto" }}>
            {entry.time}
          </span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#132A40", fontFamily: "Inter, sans-serif" }}>
          {entry.name}
        </div>
        <div style={{ fontSize: 12.5, color: "#56606B", marginTop: 2, fontFamily: "Inter, sans-serif" }}>
          {entry.action}
        </div>
        <div style={{ fontSize: 12, color: "#8B94A0", marginTop: 2, fontFamily: "Inter, sans-serif", fontStyle: "italic" }}>
          {entry.meta}
        </div>
      </div>
    </div>
  );
}

export default function AgentDashboard() {
  const [activeNav, setActiveNav] = useState("pipeline");
  const [query, setQuery] = useState("");

  const filteredDeals = useMemo(() => {
    if (!query.trim()) return DEALS;
    const q = query.toLowerCase();
    return DEALS.filter((d) => d.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#F6F7F5", minHeight: "100vh", color: "#132A40" }}>
      <style>{FONT_IMPORT}</style>

      <div style={{ display: "flex" }}>
        {/* Sidebar */}
        <div
          style={{
            width: 220, background: "#14304A", minHeight: "100vh", flexShrink: 0,
            display: "flex", flexDirection: "column", padding: "22px 14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "0 8px", marginBottom: 34 }}>
            <img src="/brand/navigation-realty-icon.png" alt="Navigation Realty" style={{ width: 26, height: 26, objectFit: "contain", flexShrink: 0 }} />
            <span style={{ fontFamily: "Fraunces, serif", fontSize: 17, color: "#F6F7F5", fontWeight: 500, letterSpacing: "0.01em" }}>
              Navigation Realty
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = activeNav === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveNav(item.key)}
                  style={{
                    display: "flex", alignItems: "center", gap: 11, padding: "9px 12px", borderRadius: 8,
                    border: "none", background: active ? "rgba(201,166,113,0.14)" : "transparent",
                    cursor: "pointer", textAlign: "left", position: "relative",
                    borderLeft: active ? "2px solid #D9BF8E" : "2px solid transparent",
                  }}
                >
                  <Icon size={16} color={active ? "#E3D2AC" : "#8B93A0"} />
                  <span
                    style={{
                      fontSize: 13.5, color: active ? "#F6F7F5" : "#8B93A0",
                      fontWeight: active ? 500 : 400, fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: "auto", padding: "14px 12px", borderTop: "1px solid #1D3A54" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div
                style={{
                  width: 30, height: 30, borderRadius: "50%", background: "#1D3A54", color: "#E3D2AC",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600,
                }}
              >
                TK
              </div>
              <div>
                <div style={{ fontSize: 12.5, color: "#F6F7F5", fontWeight: 500 }}>Tiru Kilari</div>
                <div style={{ fontSize: 11, color: "#6E7686" }}>Agent</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Top bar */}
          <div
            style={{
              display: "flex", alignItems: "center", gap: 16, padding: "16px 28px",
              borderBottom: "1px solid #E1E4E2", background: "#F6F7F5", position: "sticky", top: 0, zIndex: 5,
            }}
          >
            <div>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: 21, fontWeight: 500 }}>Pipeline</div>
              <div style={{ fontSize: 12.5, color: "#8B94A0", marginTop: 2 }}>Friday, August 7 &middot; 8 active records</div>
            </div>

            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 8, background: "#FFFFFF", border: "1px solid #E1E4E2",
                  borderRadius: 8, padding: "8px 12px", width: 240,
                }}
              >
                <Search size={15} color="#8B94A0" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search contacts..."
                  style={{ border: "none", outline: "none", background: "transparent", fontSize: 13, width: "100%", fontFamily: "Inter, sans-serif", color: "#132A40" }}
                />
              </div>
              <button
                style={{
                  display: "flex", alignItems: "center", gap: 6, background: "#FFFFFF", border: "1px solid #E1E4E2",
                  borderRadius: 8, padding: "8px 10px", cursor: "pointer",
                }}
              >
                <Bell size={15} color="#56606B" />
              </button>
              <button
                style={{
                  display: "flex", alignItems: "center", gap: 7, background: "#14304A", color: "#F6F7F5",
                  border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 500,
                  cursor: "pointer", fontFamily: "Inter, sans-serif",
                }}
              >
                <Plus size={15} />
                New contact
              </button>
            </div>
          </div>

          <div style={{ padding: "24px 28px", display: "flex", gap: 24, alignItems: "flex-start" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 26 }}>
                {STATS.map((s) => (
                  <StatCard key={s.label} stat={s} />
                ))}
              </div>

              {/* Pipeline board */}
              <div style={{ display: "flex", gap: 18, overflowX: "auto", paddingBottom: 12 }}>
                {STAGES.map((stage) => (
                  <StageColumn key={stage.key} stage={stage} deals={filteredDeals} />
                ))}
              </div>
            </div>

            {/* Right rail: The Ledger */}
            <div
              style={{
                width: 300, flexShrink: 0, background: "#FFFFFF", border: "1px solid #E1E4E2",
                borderRadius: 12, padding: "20px 20px 6px", position: "sticky", top: 88,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <div>
                  <div style={{ fontFamily: "Fraunces, serif", fontSize: 16, fontWeight: 500 }}>The ledger</div>
                  <div style={{ fontSize: 11.5, color: "#8B94A0", marginTop: 1 }}>Live activity across your book</div>
                </div>
                <MoreHorizontal size={16} color="#8B94A0" />
              </div>
              <div>
                {LEDGER.map((entry, i) => (
                  <LedgerEntry key={entry.id} entry={entry} index={i} isLast={i === LEDGER.length - 1} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
