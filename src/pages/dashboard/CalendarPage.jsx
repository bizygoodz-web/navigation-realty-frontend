import React, { useEffect, useState } from "react";
import { Clock, MapPin, User, Home, Loader2 } from "lucide-react";
import { apiFetch } from "../../api";

const INK = "#132A40";
const SLATE = "#56606B";
const MUTED = "#8B94A0";
const LINE = "#E1E4E2";
const CLAY = "#A5522F";

function formatDay(iso) {
  const d = new Date(iso);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const label = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  return isToday ? `Today · ${label}` : label;
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function CalendarPage() {
  const [showings, setShowings] = useState([]);
  const [properties, setProperties] = useState({});
  const [contacts, setContacts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [showingsRes, propsRes, contactsRes] = await Promise.all([
          apiFetch("/showings"),
          apiFetch("/properties"),
          apiFetch("/contacts"),
        ]);
        if (!showingsRes.ok) {
          const body = await showingsRes.json().catch(() => ({}));
          throw new Error(body.detail || `Couldn't load showings (${showingsRes.status})`);
        }
        setShowings(await showingsRes.json());

        if (propsRes.ok) {
          const props = await propsRes.json();
          const lookup = {};
          props.forEach((p) => { lookup[p.id] = p.address; });
          setProperties(lookup);
        }
        if (contactsRes.ok) {
          const cs = await contactsRes.json();
          const lookup = {};
          cs.forEach((c) => { lookup[c.id] = `${c.first_name} ${c.last_name}`; });
          setContacts(lookup);
        }
      } catch (err) {
        setError(err.message || "Couldn't load your calendar.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Group showings by calendar day for the day-by-day layout
  const days = {};
  showings.forEach((s) => {
    const key = new Date(s.scheduled_at).toDateString();
    if (!days[key]) days[key] = [];
    days[key].push(s);
  });
  const sortedDayKeys = Object.keys(days).sort((a, b) => new Date(a) - new Date(b));

  return (
    <div>
      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "32px 0", justifyContent: "center", color: MUTED, fontSize: 13 }}>
          <Loader2 size={16} className="spin" />
          Loading calendar...
          <style>{`.spin { animation: spin 0.8s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {!loading && error && (
        <div style={{ background: "#F5E9E4", color: CLAY, fontSize: 13, padding: "14px 16px", borderRadius: 10 }}>{error}</div>
      )}

      {!loading && !error && (
        <>
          {sortedDayKeys.length === 0 ? (
            <div style={{ padding: "32px 18px", textAlign: "center", fontSize: 13, color: MUTED, fontStyle: "italic", background: "#FFFFFF", border: `1px solid ${LINE}`, borderRadius: 12 }}>
              No showings scheduled yet.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {sortedDayKeys.map((dayKey) => (
                <div key={dayKey}>
                  <div style={{ fontFamily: "Fraunces, serif", fontSize: 15, fontWeight: 600, color: INK, marginBottom: 10 }}>
                    {formatDay(days[dayKey][0].scheduled_at)}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {days[dayKey].map((s) => (
                      <div
                        key={s.id}
                        style={{ display: "flex", alignItems: "center", gap: 14, background: "#FFFFFF", border: `1px solid ${LINE}`, borderRadius: 10, padding: "12px 16px" }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 6, width: 100, flexShrink: 0, color: INK, fontSize: 13, fontWeight: 500 }}>
                          <Clock size={13} color={MUTED} />{formatTime(s.scheduled_at)}
                        </div>
                        <div style={{ width: 1, height: 24, background: LINE }} />
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0, fontSize: 13, color: INK }}>
                          <MapPin size={13} color={MUTED} />{properties[s.property_id] || "Unknown property"}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: SLATE }}>
                          {s.type === "open_house" ? <Home size={13} color={MUTED} /> : <User size={13} color={MUTED} />}
                          {s.type === "open_house" ? "Open house" : (contacts[s.buyer_contact_id] || "—")}
                        </div>
                        <span
                          style={{
                            fontSize: 10.5, fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase",
                            color: s.type === "open_house" ? "#3D8FA0" : "#8C6A34",
                            background: s.type === "open_house" ? "#E4F0F2" : "#EFE7D4",
                            borderRadius: 20, padding: "3px 9px", flexShrink: 0,
                          }}
                        >
                          {s.type === "open_house" ? "Open house" : "Private showing"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
