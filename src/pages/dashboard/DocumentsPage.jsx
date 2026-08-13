import React from "react";
import { FileText, Upload, Download, PenLine } from "lucide-react";

const INK = "#132A40";
const SLATE = "#56606B";
const MUTED = "#8B94A0";
const LINE = "#E1E4E2";

const DOCUMENTS = [
  { id: 1, name: "Seller's disclosure", contact: "Tom Alvarado", type: "Disclosure", status: "signed", date: "Aug 10" },
  { id: 2, name: "Listing agreement", contact: "Dana Feldstein", type: "Agreement", status: "signed", date: "Aug 8" },
  { id: 3, name: "Pre-approval letter", contact: "Priya Chandran", type: "Financing", status: "sent", date: "Aug 12" },
  { id: 4, name: "Buyer representation agreement", contact: "Grace Lin", type: "Agreement", status: "sent", date: "Aug 9" },
  { id: 5, name: "HOA addendum", contact: "Tom Alvarado", type: "Addendum", status: "draft", date: "Aug 11" },
  { id: 6, name: "Offer packet", contact: "The Okonkwo Family", type: "Offer", status: "draft", date: "Aug 12" },
];

const STATUS_STYLE = {
  signed: { bg: "#E9EEE7", fg: "#4F6A4A", label: "Signed" },
  sent: { bg: "#EFE7D4", fg: "#8C6A34", label: "Awaiting signature" },
  draft: { bg: "#F5E9E4", fg: "#A5522F", label: "Draft" },
};

export default function DocumentsPage() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <button
          style={{
            display: "flex", alignItems: "center", gap: 7, background: "#14304A", color: "#F6F7F5",
            border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer",
          }}
        >
          <Upload size={15} />
          Upload document
        </button>
      </div>

      <div style={{ background: "#FFFFFF", border: `1px solid ${LINE}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.4fr 1fr 1.2fr 1fr 90px", padding: "12px 18px", borderBottom: `1px solid ${LINE}`, fontSize: 11.5, fontWeight: 600, color: MUTED, letterSpacing: "0.03em", textTransform: "uppercase" }}>
          <span>Document</span>
          <span>Contact</span>
          <span>Type</span>
          <span>Status</span>
          <span>Date</span>
          <span />
        </div>
        {DOCUMENTS.map((d) => {
          const style = STATUS_STYLE[d.status];
          return (
            <div
              key={d.id}
              style={{ display: "grid", gridTemplateColumns: "2fr 1.4fr 1fr 1.2fr 1fr 90px", alignItems: "center", padding: "14px 18px", borderBottom: `1px solid ${LINE}` }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#F6F7F5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FileText size={15} color={INK} />
                </div>
                <span style={{ fontSize: 13.5, fontWeight: 500, color: INK }}>{d.name}</span>
              </div>
              <span style={{ fontSize: 12.5, color: SLATE }}>{d.contact}</span>
              <span style={{ fontSize: 12.5, color: SLATE }}>{d.type}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: style.fg, background: style.bg, borderRadius: 20, padding: "4px 10px", width: "fit-content" }}>
                {style.label}
              </span>
              <span style={{ fontSize: 12, color: MUTED }}>{d.date}</span>
              <div style={{ display: "flex", gap: 8 }}>
                {d.status === "draft" ? (
                  <button title="Send for signature" style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                    <PenLine size={15} color={MUTED} />
                  </button>
                ) : (
                  <button title="Download" style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                    <Download size={15} color={MUTED} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
