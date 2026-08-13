import React from "react";
import { MapPin, BedDouble, Bath, Ruler, TrendingUp } from "lucide-react";

const INK = "#132A40";
const SLATE = "#56606B";
const MUTED = "#8B94A0";
const LINE = "#E1E4E2";

const PROPERTIES = [
  { id: 1, address: "312 Ashcroft Ln", city: "Pflugerville, TX", price: 615000, status: "coming_soon", dom: 0, beds: 4, baths: 3, sqft: 2680, seller: "Marcus Webb" },
  { id: 2, address: "204 Birchwood Ct", city: "Round Rock, TX", price: 389000, status: "active", dom: 18, beds: 3, baths: 2, sqft: 1940, seller: "Dana Feldstein" },
  { id: 3, address: "77 Ashwood Terrace", city: "Round Rock, TX", price: 442000, status: "pending", dom: 26, beds: 4, baths: 3, sqft: 2310, seller: "Tom Alvarado" },
  { id: 4, address: "1502 Lakeview Dr", city: "Cedar Park, TX", price: 725000, status: "active", dom: 6, beds: 5, baths: 4, sqft: 3120, seller: "—" },
  { id: 5, address: "89 Hollow Creek Rd", city: "Pflugerville, TX", price: 375000, status: "closed", dom: 34, beds: 3, baths: 2, sqft: 1780, seller: "Bill Hartman" },
];

const STATUS_STYLE = {
  active: { bg: "#E9EEE7", fg: "#4F6A4A", label: "Active" },
  pending: { bg: "#EFE7D4", fg: "#8C6A34", label: "Pending" },
  closed: { bg: "#EEEBF2", fg: "#5B527A", label: "Closed" },
  coming_soon: { bg: "#E4F0F2", fg: "#3D8FA0", label: "Coming soon" },
};

function currency(n) {
  return "$" + n.toLocaleString("en-US");
}

function PropertyCard({ p }) {
  const style = STATUS_STYLE[p.status];
  return (
    <div style={{ background: "#FFFFFF", border: `1px solid ${LINE}`, borderRadius: 12, overflow: "hidden" }}>
      <div style={{ height: 120, background: "linear-gradient(135deg, #1D3A54, #14304A)", position: "relative" }}>
        <span style={{ position: "absolute", top: 10, left: 10, fontSize: 11, fontWeight: 600, color: style.fg, background: style.bg, borderRadius: 20, padding: "4px 10px" }}>
          {style.label}
        </span>
      </div>
      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: 17, fontWeight: 600, color: INK }}>{currency(p.price)}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4, color: SLATE, fontSize: 12.5 }}>
          <MapPin size={13} />{p.address}, {p.city}
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 10, color: SLATE, fontSize: 12.5 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><BedDouble size={14} />{p.beds} bd</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Bath size={14} />{p.baths} ba</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Ruler size={14} />{p.sqft.toLocaleString()} sqft</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: `1px solid ${LINE}` }}>
          <span style={{ fontSize: 11.5, color: MUTED }}>Seller: {p.seller}</span>
          <span style={{ fontSize: 11.5, color: MUTED, display: "flex", alignItems: "center", gap: 4 }}>
            <TrendingUp size={12} />{p.dom}d on market
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ListingsPage() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
        {PROPERTIES.map((p) => (
          <PropertyCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}
