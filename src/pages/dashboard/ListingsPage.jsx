import React, { useEffect, useState } from "react";
import { MapPin, BedDouble, Bath, Ruler, TrendingUp, Loader2, Plus, X } from "lucide-react";
import { apiFetch } from "../../api";

const INK = "#132A40";
const SLATE = "#56606B";
const MUTED = "#8B94A0";
const LINE = "#E1E4E2";
const CLAY = "#A5522F";
const GOLD = "#C7A46A";

const STATUS_STYLE = {
  active: { bg: "#E9EEE7", fg: "#4F6A4A", label: "Active" },
  pending: { bg: "#EFE7D4", fg: "#8C6A34", label: "Pending" },
  closed: { bg: "#EEEBF2", fg: "#5B527A", label: "Closed" },
  withdrawn: { bg: "#F5E9E4", fg: CLAY, label: "Withdrawn" },
};

function currency(n) {
  if (n === null || n === undefined) return "—";
  return "$" + Number(n).toLocaleString("en-US");
}

function PropertyCard({ p }) {
  const style = STATUS_STYLE[p.status] || STATUS_STYLE.active;
  return (
    <div style={{ background: "#FFFFFF", border: `1px solid ${LINE}`, borderRadius: 12, overflow: "hidden" }}>
      <div style={{ height: 120, background: "linear-gradient(135deg, #1D3A54, #14304A)", position: "relative" }}>
        <span style={{ position: "absolute", top: 10, left: 10, fontSize: 11, fontWeight: 600, color: style.fg, background: style.bg, borderRadius: 20, padding: "4px 10px" }}>
          {style.label}
        </span>
      </div>
      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: 17, fontWeight: 600, color: INK }}>{currency(p.list_price)}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4, color: SLATE, fontSize: 12.5 }}>
          <MapPin size={13} />{p.address}
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 10, color: SLATE, fontSize: 12.5 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><BedDouble size={14} />{p.beds ?? "—"} bd</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Bath size={14} />{p.baths ?? "—"} ba</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Ruler size={14} />{p.sqft ? p.sqft.toLocaleString() : "—"} sqft</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: `1px solid ${LINE}` }}>
          <span style={{ fontSize: 11.5, color: MUTED }}>{p.mls_number ? `MLS# ${p.mls_number}` : "No MLS#"}</span>
          <span style={{ fontSize: 11.5, color: MUTED, display: "flex", alignItems: "center", gap: 4 }}>
            <TrendingUp size={12} />{p.days_on_market ?? 0}d on market
          </span>
        </div>
      </div>
    </div>
  );
}

function NewListingModal({ isOpen, onClose, onCreated }) {
  const [address, setAddress] = useState("");
  const [listPrice, setListPrice] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [sqft, setSqft] = useState("");
  const [mlsNumber, setMlsNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await apiFetch("/properties", {
        method: "POST",
        body: JSON.stringify({
          address,
          list_price: listPrice ? Number(listPrice) : null,
          beds: beds ? Number(beds) : null,
          baths: baths ? Number(baths) : null,
          sqft: sqft ? Number(sqft) : null,
          mls_number: mlsNumber || null,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || `Couldn't create listing (${res.status})`);
      }
      const property = await res.json();
      setAddress(""); setListPrice(""); setBeds(""); setBaths(""); setSqft(""); setMlsNumber("");
      onCreated?.(property);
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(19,42,64,0.45)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ background: "#FFFFFF", borderRadius: 16, width: "100%", maxWidth: 420, padding: "24px 26px 26px" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <span style={{ fontFamily: "Fraunces, serif", fontSize: 19, fontWeight: 600, color: INK }}>New listing</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} color={MUTED} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          {[
            { label: "Address", value: address, set: setAddress, required: true, placeholder: "312 Ashcroft Ln, Pflugerville, TX" },
            { label: "List price", value: listPrice, set: setListPrice, type: "number", placeholder: "615000" },
            { label: "MLS #", value: mlsNumber, set: setMlsNumber },
          ].map((f) => (
            <div key={f.label} style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: SLATE, marginBottom: 5 }}>{f.label}</label>
              <input
                value={f.value} onChange={(e) => f.set(e.target.value)} required={f.required} type={f.type || "text"}
                placeholder={f.placeholder}
                style={{ width: "100%", boxSizing: "border-box", padding: "9px 11px", borderRadius: 8, border: `1px solid ${LINE}`, fontSize: 13 }}
              />
            </div>
          ))}
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            {[
              { label: "Beds", value: beds, set: setBeds },
              { label: "Baths", value: baths, set: setBaths },
              { label: "Sqft", value: sqft, set: setSqft },
            ].map((f) => (
              <div key={f.label} style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: SLATE, marginBottom: 5 }}>{f.label}</label>
                <input
                  value={f.value} onChange={(e) => f.set(e.target.value)} type="number"
                  style={{ width: "100%", boxSizing: "border-box", padding: "9px 11px", borderRadius: 8, border: `1px solid ${LINE}`, fontSize: 13 }}
                />
              </div>
            ))}
          </div>
          {error && <div style={{ background: "#F5E9E4", color: CLAY, fontSize: 12.5, padding: "10px 12px", borderRadius: 8, marginBottom: 14 }}>{error}</div>}
          <button
            type="submit" disabled={loading}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#14304A", color: "#F6F7F5", border: "none", borderRadius: 10, padding: "12px 0", fontSize: 13.5, fontWeight: 500, cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1 }}
          >
            {loading && <Loader2 size={15} className="spin" />}
            {loading ? "Creating..." : "Create listing"}
          </button>
        </form>
        <style>{`.spin { animation: spin 0.8s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

export default function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNew, setShowNew] = useState(false);

  async function loadProperties() {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/properties");
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || `Couldn't load listings (${res.status})`);
      }
      setProperties(await res.json());
    } catch (err) {
      setError(err.message || "Couldn't load listings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProperties();
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <button
          onClick={() => setShowNew(true)}
          style={{ display: "flex", alignItems: "center", gap: 7, background: "#14304A", color: "#F6F7F5", border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}
        >
          <Plus size={15} />
          New listing
        </button>
      </div>

      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "32px 0", justifyContent: "center", color: MUTED, fontSize: 13 }}>
          <Loader2 size={16} className="spin" />
          Loading listings...
          <style>{`.spin { animation: spin 0.8s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {!loading && error && (
        <div style={{ background: "#F5E9E4", color: CLAY, fontSize: 13, padding: "14px 16px", borderRadius: 10 }}>{error}</div>
      )}

      {!loading && !error && (
        <>
          {properties.length === 0 ? (
            <div style={{ padding: "32px 18px", textAlign: "center", fontSize: 13, color: MUTED, fontStyle: "italic", background: "#FFFFFF", border: `1px solid ${LINE}`, borderRadius: 12 }}>
              No listings yet — create your first one above.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
              {properties.map((p) => (
                <PropertyCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </>
      )}

      <NewListingModal isOpen={showNew} onClose={() => setShowNew(false)} onCreated={loadProperties} />
    </div>
  );
}
