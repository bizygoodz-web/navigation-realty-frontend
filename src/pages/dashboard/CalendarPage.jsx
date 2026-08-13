import React from "react";
import { Clock, MapPin, User, Home } from "lucide-react";

const INK = "#132A40";
const SLATE = "#56606B";
const MUTED = "#8B94A0";
const LINE = "#E1E4E2";

const DAYS = [
  {
    label: "Today · Fri, Aug 12",
    events: [
      { time: "10:00 AM", property: "204 Birchwood Ct", contact: "The Whitfield Family", type: "private" },
      { time: "2:30 PM", property: "1502 Lakeview Dr", contact: "Open house", type: "open_house" },
    ],
  },
  {
    label: "Sat, Aug 13",
    events: [
      { time: "11:00 AM", property: "77 Ashwood Terrace", contact: "Ravi & Anjali Sethi", type: "private" },
      { time: "1:00 PM", property: "204 Birchwood Ct", contact: "Grace Lin", type: "private" },
      { time: "3:00 PM", property: "312 Ashcroft Ln", contact: "Open house", type: "open_house" },
    ],
  },
  {
    label: "Mon, Aug 15",
    events: [
      { time: "9:30 AM", property: "89 Hollow Creek Rd", contact: "Priya Chandran", type: "private" },
    ],
  },
];

export default function CalendarPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {DAYS.map((day) => (
        <div key={day.label}>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 15, fontWeight: 600, color: INK, marginBottom: 10 }}>
            {day.label}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {day.events.map((e, i) => (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "center", gap: 14, background: "#FFFFFF", border: `1px solid ${LINE}`,
                  borderRadius: 10, padding: "12px 16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, width: 100, flexShrink: 0, color: INK, fontSize: 13, fontWeight: 500 }}>
                  <Clock size={13} color={MUTED} />{e.time}
                </div>
                <div style={{ width: 1, height: 24, background: LINE }} />
                <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0, fontSize: 13, color: INK }}>
                  <MapPin size={13} color={MUTED} />{e.property}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: SLATE }}>
                  {e.type === "open_house" ? <Home size={13} color={MUTED} /> : <User size={13} color={MUTED} />}
                  {e.contact}
                </div>
                <span
                  style={{
                    fontSize: 10.5, fontWeight: 600, letterSpacing: "0.03em", textTransform: "uppercase",
                    color: e.type === "open_house" ? "#3D8FA0" : "#8C6A34",
                    background: e.type === "open_house" ? "#E4F0F2" : "#EFE7D4",
                    borderRadius: 20, padding: "3px 9px", flexShrink: 0,
                  }}
                >
                  {e.type === "open_house" ? "Open house" : "Private showing"}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
