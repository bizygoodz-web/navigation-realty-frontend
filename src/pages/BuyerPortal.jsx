import React, { useState } from "react";
import {
  Home, Heart, FileText, MessageCircle, X, Check, MapPin, BedDouble, Bath,
  Ruler, Upload, ChevronRight, Circle, CheckCircle2
} from "lucide-react";

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');";

const INK = "#14304A";
const BRASS = "#C7A46A";
const BRASS_LIGHT = "#D9BF8E";
const IVORY = "#F6F7F5";
const LINE = "#E1E4E2";
const SLATE = "#56606B";
const SAGE = "#5F7A5A";
const CLAY = "#B4553C";

// Pipeline stage -> friendly tracker label. Maps the `deals.stage` enum
// from the backend onto the buyer-facing progress tracker.
const STAGE_LABELS = {
  lead: "Inquiry",
  nurture: "Touring",
  showing: "Touring",
  offer: "Offer made",
  under_contract: "Under contract",
  closed: "Closed",
  lost: "Closed",
};
const STAGES = ["Inquiry", "Touring", "Offer made", "Under contract", "Closed"];

const STATUS_STYLE = {
  signed: { bg: "#E9EEE7", fg: SAGE, label: "Complete" },
  sent: { bg: "#EFE7D4", fg: "#8C6A34", label: "Awaiting you" },
  draft: { bg: "#F5E9E4", fg: CLAY, label: "Needed" },
};

function currency(n) {
  return "$" + n.toLocaleString("en-US");
}

function TabBar({ active, setActive }) {
  const tabs = [
    { key: "home", label: "Home", icon: Home },
    { key: "saved", label: "Saved", icon: Heart },
    { key: "docs", label: "Documents", icon: FileText },
    { key: "messages", label: "Messages", icon: MessageCircle },
  ];
  return (
    <div
      style={{
        position: "sticky", bottom: 0, display: "flex", background: "#FFFFFF",
        borderTop: `1px solid ${LINE}`, padding: "8px 4px calc(8px + env(safe-area-inset-bottom))",
      }}
    >
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              background: "transparent", border: "none", padding: "6px 0", cursor: "pointer",
            }}
          >
            <Icon size={20} color={isActive ? INK : "#A8B0BA"} strokeWidth={isActive ? 2.2 : 1.8} />
            <span style={{ fontSize: 10.5, fontFamily: "Inter, sans-serif", color: isActive ? INK : "#A8B0BA", fontWeight: isActive ? 600 : 400 }}>
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ProgressTracker({ currentStage }) {
  return (
    <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "20px 18px", border: `1px solid ${LINE}` }}>
      <div style={{ fontFamily: "Fraunces, serif", fontSize: 16, fontWeight: 600, color: INK, marginBottom: 18 }}>
        Your home search
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        {STAGES.map((stage, i) => (
          <React.Fragment key={stage}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: i === STAGES.length - 1 ? "0 0 auto" : 1 }}>
              {i < currentStage ? (
                <CheckCircle2 size={20} color={BRASS} fill={BRASS} strokeWidth={0} />
              ) : i === currentStage ? (
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: INK, border: `3px solid ${BRASS_LIGHT}` }} />
              ) : (
                <Circle size={20} color={LINE} strokeWidth={2} />
              )}
              <span style={{ fontSize: 10, fontFamily: "Inter, sans-serif", color: i <= currentStage ? INK : "#A8B0BA", marginTop: 6, textAlign: "center", maxWidth: 60, fontWeight: i === currentStage ? 600 : 400 }}>
                {stage}
              </span>
            </div>
            {i < STAGES.length - 1 && (
              <div style={{ flex: 1, height: 2, background: i < currentStage ? BRASS : LINE, marginBottom: 18 }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function ListingCard({ listing, onFeedback }) {
  return (
    <div style={{ background: "#FFFFFF", borderRadius: 16, border: `1px solid ${LINE}`, overflow: "hidden" }}>
      <div style={{ height: 140, background: "linear-gradient(135deg, #1E2733, #14304A)", position: "relative" }}>
        {listing.status === "interested" && (
          <div style={{ position: "absolute", top: 10, left: 10, background: "#FFFFFF", borderRadius: 20, padding: "4px 10px", fontSize: 11, fontFamily: "Inter, sans-serif", fontWeight: 600, color: SAGE }}>
            You liked this
          </div>
        )}
      </div>
      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: 18, fontWeight: 600, color: INK }}>
          {currency(listing.price)}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4, color: SLATE, fontSize: 13, fontFamily: "Inter, sans-serif" }}>
          <MapPin size={13} />
          {listing.address}, {listing.city}
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 10, color: SLATE, fontSize: 12.5, fontFamily: "Inter, sans-serif" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><BedDouble size={14} />{listing.beds} bd</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Bath size={14} />{listing.baths} ba</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Ruler size={14} />{listing.sqft.toLocaleString()} sqft</span>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button
            onClick={() => onFeedback(listing.id, "pass")}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "11px 0", borderRadius: 10, border: `1px solid ${LINE}`, background: "#FFFFFF", color: SLATE, fontFamily: "Inter, sans-serif", fontSize: 13.5, fontWeight: 500, cursor: "pointer" }}
          >
            <X size={16} /> Pass
          </button>
          <button
            onClick={() => onFeedback(listing.id, "interested")}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "11px 0", borderRadius: 10, border: "none", background: INK, color: "#F6F7F5", fontFamily: "Inter, sans-serif", fontSize: 13.5, fontWeight: 500, cursor: "pointer" }}
          >
            <Heart size={16} /> I like this
          </button>
        </div>
      </div>
    </div>
  );
}

function DocumentRow({ doc }) {
  const style = STATUS_STYLE[doc.status];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FFFFFF", borderRadius: 14, border: `1px solid ${LINE}`, padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: IVORY, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <FileText size={16} color={INK} />
        </div>
        <span style={{ fontSize: 13.5, fontFamily: "Inter, sans-serif", fontWeight: 500, color: INK }}>{doc.name}</span>
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, fontFamily: "Inter, sans-serif", color: style.fg, background: style.bg, borderRadius: 20, padding: "4px 10px" }}>
        {style.label}
      </span>
    </div>
  );
}

export default function BuyerPortal() {
  const [tab, setTab] = useState("home");
  const [listings, setListings] = useState(LISTINGS);

  function handleFeedback(id, status) {
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  }

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: IVORY, minHeight: "100vh", maxWidth: 420, margin: "0 auto", display: "flex", flexDirection: "column" }}>
      <style>{FONT_IMPORT}</style>

      <div style={{ padding: "20px 18px 8px" }}>
        <div style={{ fontSize: 13, color: SLATE, fontFamily: "Inter, sans-serif" }}>Good morning</div>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: 24, fontWeight: 600, color: INK }}>Hi, {BUYER.name}</div>
        <div style={{ fontSize: 12.5, color: "#8B94A0", marginTop: 2 }}>Working with {BUYER.agentName}</div>
      </div>

      <div style={{ flex: 1, padding: "12px 18px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        {tab === "home" && (
          <>
            <ProgressTracker />
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 15, fontWeight: 600, color: INK, margin: "4px 0 -4px" }}>
              New for you
            </div>
            {listings.slice(0, 2).map((l) => (
              <ListingCard key={l.id} listing={l} onFeedback={handleFeedback} />
            ))}
          </>
        )}

        {tab === "saved" && (
          <>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 18, fontWeight: 600, color: INK }}>
              Curated for you
            </div>
            {listings.map((l) => (
              <ListingCard key={l.id} listing={l} onFeedback={handleFeedback} />
            ))}
          </>
        )}

        {tab === "docs" && (
          <>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 18, fontWeight: 600, color: INK }}>
              Documents
            </div>
            {DOCUMENTS.map((d) => (
              <DocumentRow key={d.id} doc={d} />
            ))}
            <button
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px 0", borderRadius: 12, border: `1.5px dashed ${LINE}`, background: "transparent", color: SLATE, fontFamily: "Inter, sans-serif", fontSize: 13.5, fontWeight: 500, cursor: "pointer" }}
            >
              <Upload size={16} /> Upload a document
            </button>
          </>
        )}

        {tab === "messages" && (
          <>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 18, fontWeight: 600, color: INK }}>
              Messages
            </div>
            <div style={{ background: "#FFFFFF", borderRadius: 16, border: `1px solid ${LINE}`, padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: INK, color: "#E3D2AC", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600 }}>
                  TK
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: INK }}>{BUYER.agentName}</div>
                  <div style={{ fontSize: 12.5, color: SLATE, marginTop: 1 }}>Sent you 3 new listings to review</div>
                </div>
                <ChevronRight size={16} color="#A8B0BA" />
              </div>
            </div>
          </>
        )}
      </div>

      <TabBar active={tab} setActive={setTab} />
    </div>
  );
}
