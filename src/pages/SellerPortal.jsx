import React, { useState } from "react";
import {
  Home, Calendar, CircleDollarSign, FileText, ChevronRight, Star, TrendingUp
} from "lucide-react";

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');";

const INK = "#14304A";
const BRASS = "#C7A46A";
const IVORY = "#F6F7F5";
const LINE = "#E1E4E2";
const SLATE = "#56606B";
const SAGE = "#5F7A5A";
const CLAY = "#B4553C";

const SELLER = { name: "Marcus", agentName: "Tiru Kilari" };

const LISTING = {
  address: "312 Ashcroft Ln, Pflugerville, TX",
  listPrice: 615000,
  status: "Active",
  daysOnMarket: 18,
  views: 214,
};

const SHOWINGS = [
  { id: 1, date: "Aug 5, 4:30 PM", feedback: "Loved the backyard, thought the primary bath felt dated.", rating: 4 },
  { id: 2, date: "Aug 3, 11:00 AM", feedback: "Great light, but budget is closer to $580k.", rating: 3 },
  { id: 3, date: "Jul 30, 2:00 PM", feedback: "No feedback submitted yet", rating: null },
];

const OFFERS = [
  { id: 1, amount: 598000, status: "countered", buyer: "Grace Lin", date: "Aug 4" },
  { id: 2, amount: 605000, status: "submitted", buyer: "The Whitfield Family", date: "Aug 6" },
];

const DOCUMENTS = [
  { id: 1, name: "Seller's disclosure", status: "signed" },
  { id: 2, name: "Listing agreement", status: "signed" },
  { id: 3, name: "HOA addendum", status: "sent" },
];

const OFFER_STYLE = {
  submitted: { bg: "#E4F0F2", fg: "#3D8FA0", label: "New offer" },
  countered: { bg: "#EFE7D4", fg: "#8C6A34", label: "Countered" },
  accepted: { bg: "#E9EEE7", fg: SAGE, label: "Accepted" },
  rejected: { bg: "#F5E9E4", fg: CLAY, label: "Rejected" },
};

const DOC_STYLE = {
  signed: { bg: "#E9EEE7", fg: SAGE, label: "Signed" },
  sent: { bg: "#EFE7D4", fg: "#8C6A34", label: "Awaiting signature" },
  draft: { bg: "#F5E9E4", fg: CLAY, label: "Draft" },
};

function currency(n) {
  return "$" + n.toLocaleString("en-US");
}

function TabBar({ active, setActive }) {
  const tabs = [
    { key: "home", label: "Home", icon: Home },
    { key: "showings", label: "Showings", icon: Calendar },
    { key: "offers", label: "Offers", icon: CircleDollarSign },
    { key: "docs", label: "Documents", icon: FileText },
  ];
  return (
    <div style={{ position: "sticky", bottom: 0, display: "flex", background: "#FFFFFF", borderTop: `1px solid ${LINE}`, padding: "8px 4px calc(8px + env(safe-area-inset-bottom))" }}>
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = active === t.key;
        return (
          <button key={t.key} onClick={() => setActive(t.key)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "transparent", border: "none", padding: "6px 0", cursor: "pointer" }}>
            <Icon size={20} color={isActive ? INK : "#A8B0BA"} strokeWidth={isActive ? 2.2 : 1.8} />
            <span style={{ fontSize: 10.5, fontFamily: "Inter, sans-serif", color: isActive ? INK : "#A8B0BA", fontWeight: isActive ? 600 : 400 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function ListingStatusCard() {
  return (
    <div style={{ background: INK, borderRadius: 18, padding: "22px 20px", color: "#F6F7F5" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: "#E3D2AC", background: "rgba(201,166,113,0.16)", borderRadius: 20, padding: "4px 10px" }}>
          {LISTING.status}
        </span>
        <span style={{ fontSize: 12, color: "#8B93A0" }}>{LISTING.daysOnMarket} days on market</span>
      </div>
      <div style={{ fontFamily: "Fraunces, serif", fontSize: 26, fontWeight: 600 }}>{currency(LISTING.listPrice)}</div>
      <div style={{ fontSize: 13, color: "#8B93A0", marginTop: 4 }}>{LISTING.address}</div>
      <div style={{ display: "flex", gap: 20, marginTop: 18, paddingTop: 16, borderTop: "1px solid #1D3A54" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, fontFamily: "Fraunces, serif" }}>{SHOWINGS.length}</div>
          <div style={{ fontSize: 11.5, color: "#8B93A0" }}>Showings</div>
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, fontFamily: "Fraunces, serif" }}>{OFFERS.length}</div>
          <div style={{ fontSize: 11.5, color: "#8B93A0" }}>Active offers</div>
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, fontFamily: "Fraunces, serif" }}>{LISTING.views}</div>
          <div style={{ fontSize: 11.5, color: "#8B93A0" }}>Online views</div>
        </div>
      </div>
    </div>
  );
}

function ShowingCard({ showing }) {
  return (
    <div style={{ background: "#FFFFFF", borderRadius: 14, border: `1px solid ${LINE}`, padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13.5, fontWeight: 500, color: INK, fontFamily: "Inter, sans-serif" }}>{showing.date}</span>
        {showing.rating ? (
          <div style={{ display: "flex", gap: 1 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={13} color={i < showing.rating ? BRASS : LINE} fill={i < showing.rating ? BRASS : "none"} />
            ))}
          </div>
        ) : (
          <span style={{ fontSize: 11, color: "#A8B0BA", fontStyle: "italic" }}>Pending</span>
        )}
      </div>
      <div style={{ fontSize: 12.5, color: SLATE, marginTop: 6, lineHeight: 1.5 }}>{showing.feedback}</div>
    </div>
  );
}

function OfferCard({ offer }) {
  const style = OFFER_STYLE[offer.status];
  return (
    <div style={{ background: "#FFFFFF", borderRadius: 14, border: `1px solid ${LINE}`, padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontFamily: "Fraunces, serif", fontSize: 17, fontWeight: 600, color: INK }}>{currency(offer.amount)}</span>
        <span style={{ fontSize: 11, fontWeight: 600, fontFamily: "Inter, sans-serif", color: style.fg, background: style.bg, borderRadius: 20, padding: "4px 10px" }}>{style.label}</span>
      </div>
      <div style={{ fontSize: 12.5, color: SLATE, fontFamily: "Inter, sans-serif" }}>{offer.buyer} &middot; {offer.date}</div>
    </div>
  );
}

function DocumentRow({ doc }) {
  const style = DOC_STYLE[doc.status];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FFFFFF", borderRadius: 14, border: `1px solid ${LINE}`, padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: IVORY, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <FileText size={16} color={INK} />
        </div>
        <span style={{ fontSize: 13.5, fontFamily: "Inter, sans-serif", fontWeight: 500, color: INK }}>{doc.name}</span>
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, fontFamily: "Inter, sans-serif", color: style.fg, background: style.bg, borderRadius: 20, padding: "4px 10px" }}>{style.label}</span>
    </div>
  );
}

export default function SellerPortal() {
  const [tab, setTab] = useState("home");

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: IVORY, minHeight: "100vh", maxWidth: 420, margin: "0 auto", display: "flex", flexDirection: "column" }}>
      <style>{FONT_IMPORT}</style>

      <div style={{ padding: "20px 18px 8px" }}>
        <div style={{ fontSize: 13, color: SLATE }}>Good morning</div>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: 24, fontWeight: 600, color: INK }}>Hi, {SELLER.name}</div>
        <div style={{ fontSize: 12.5, color: "#8B94A0", marginTop: 2 }}>Listed with {SELLER.agentName}</div>
      </div>

      <div style={{ flex: 1, padding: "12px 18px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        {tab === "home" && (
          <>
            <ListingStatusCard />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "4px 0 -4px" }}>
              <span style={{ fontFamily: "Fraunces, serif", fontSize: 15, fontWeight: 600, color: INK }}>Recent showings</span>
              <button onClick={() => setTab("showings")} style={{ display: "flex", alignItems: "center", gap: 2, background: "none", border: "none", color: SLATE, fontSize: 12.5, fontFamily: "Inter, sans-serif", cursor: "pointer" }}>
                See all <ChevronRight size={13} />
              </button>
            </div>
            {SHOWINGS.slice(0, 2).map((s) => (
              <ShowingCard key={s.id} showing={s} />
            ))}
          </>
        )}

        {tab === "showings" && (
          <>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 18, fontWeight: 600, color: INK }}>Showings & feedback</div>
            {SHOWINGS.map((s) => (
              <ShowingCard key={s.id} showing={s} />
            ))}
          </>
        )}

        {tab === "offers" && (
          <>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 18, fontWeight: 600, color: INK }}>Active offers</div>
            {OFFERS.map((o) => (
              <OfferCard key={o.id} offer={o} />
            ))}
            {OFFERS.length === 0 && (
              <div style={{ fontSize: 13, color: "#8B94A0", fontStyle: "italic", padding: "10px 2px" }}>No offers yet — we'll notify you the moment one comes in.</div>
            )}
          </>
        )}

        {tab === "docs" && (
          <>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 18, fontWeight: 600, color: INK }}>Documents</div>
            {DOCUMENTS.map((d) => (
              <DocumentRow key={d.id} doc={d} />
            ))}
          </>
        )}
      </div>

      <TabBar active={tab} setActive={setTab} />
    </div>
  );
}
