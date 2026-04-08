/**
 * PresenceContextBar — Shows two pieces of live context for each experience:
 *
 *  1. LIVE LOCAL TIME in the destination (e.g. "It's 5:32 AM in Kandy")
 *     Using the IANA timezone string for each location.
 *
 *  2. DISTANCE from the viewer's browser location (via Geolocation API)
 *     e.g. "8,241 km from you"  — reinforces the "reaching across" emotion.
 *
 * Falls back gracefully if location is denied or unavailable.
 *
 * Usage:
 *   <PresenceContextBar timezone="Asia/Colombo" lat={7.29} lng={80.63} location="Kandy" />
 */

import { useEffect, useState } from "react";
import { Clock, Navigation } from "lucide-react";

interface PresenceContextBarProps {
  timezone: string;    // IANA e.g. "Asia/Colombo"
  lat: number;         // destination latitude
  lng: number;         // destination longitude
  location: string;    // display name e.g. "Kandy"
  className?: string;
}

export default function PresenceContextBar({
  timezone,
  lat,
  lng,
  location,
  className = "",
}: PresenceContextBarProps) {
  const [localTime, setLocalTime] = useState("");
  const [distance,  setDistance ] = useState<string | null>(null);

  // ── Live clock ────────────────────────────────────────────────────────────
  useEffect(() => {
    function tick() {
      const t = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        hour:     "numeric",
        minute:   "2-digit",
        hour12:   true,
      }).format(new Date());
      setLocalTime(t);
    }
    tick();
    const id = setInterval(tick, 10_000);   // update every 10 s
    return () => clearInterval(id);
  }, [timezone]);

  // ── Distance via Geolocation ──────────────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const km = haversineKm(
          pos.coords.latitude,
          pos.coords.longitude,
          lat,
          lng
        );
        setDistance(
          km < 100
            ? `${Math.round(km)} km away`
            : `${Math.round(km / 100) * 100 >= 1000
                ? (Math.round(km / 100) / 10).toFixed(1) + "k"
                : Math.round(km / 100) * 100
              } km from you`
        );
      },
      () => setDistance(null),   // silently ignore if denied
      { timeout: 6000 }
    );
  }, [lat, lng]);

  if (!localTime) return null;

  return (
    <div className={`flex items-center gap-4 flex-wrap ${className}`}>
      {/* Time */}
      <div className="flex items-center gap-1.5 text-slate-400 text-xs">
        <Clock className="w-3 h-3 text-purple-400/70" />
        <span>
          It&apos;s{" "}
          <span className="text-slate-200 font-medium">{localTime}</span>
          {" "}in {location}
        </span>
      </div>

      {/* Distance */}
      {distance && (
        <>
          <span className="text-white/10">·</span>
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <Navigation className="w-3 h-3 text-purple-400/70" />
            <span className="text-slate-300">{distance}</span>
          </div>
        </>
      )}
    </div>
  );
}

// ── Haversine formula ─────────────────────────────────────────────────────────
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R   = 6371;
  const φ1  = (lat1 * Math.PI) / 180;
  const φ2  = (lat2 * Math.PI) / 180;
  const dφ  = ((lat2 - lat1) * Math.PI) / 180;
  const dλ  = ((lon2 - lon1) * Math.PI) / 180;
  const a   = Math.sin(dφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(dλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
