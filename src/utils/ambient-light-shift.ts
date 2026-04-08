/**
 * ambientLightShift — maps a `timeOfDay` string (from mock-data) to a
 * CSS hex colour that gets blended into the ParallaxViewerBg fog layer.
 *
 * dawn/early morning → warm rose-gold
 * midday             → faint warm amber
 * dusk/sunset        → deep amber-orange
 * night/late night   → cold indigo-navy
 * default            → neutral purple (existing brand colour)
 */

export interface AmbientLight {
  fogColor:    string;   // hex colour for the mid-fog parallax layer
  rimColor:    string;   // subtle edge tint
  intensity:   number;   // 0–1, how strongly to blend the colour
  label:       string;   // human-readable description
}

const PRESETS: Record<string, AmbientLight> = {
  dawn: {
    fogColor:  "#7C3A2D",   // rose-terracotta
    rimColor:  "#C0724A",
    intensity: 0.55,
    label:     "dawn",
  },
  morning: {
    fogColor:  "#6B3F2A",   // warm amber-brown
    rimColor:  "#A06040",
    intensity: 0.35,
    label:     "morning",
  },
  midday: {
    fogColor:  "#4A3820",   // faint warm neutral
    rimColor:  "#705535",
    intensity: 0.25,
    label:     "midday",
  },
  afternoon: {
    fogColor:  "#5C3D20",   // golden hour approaching
    rimColor:  "#8C5A30",
    intensity: 0.35,
    label:     "afternoon",
  },
  dusk: {
    fogColor:  "#7A3B28",   // amber-orange
    rimColor:  "#B05830",
    intensity: 0.5,
    label:     "dusk",
  },
  evening: {
    fogColor:  "#2D2050",   // purple-indigo transition
    rimColor:  "#4A3070",
    intensity: 0.45,
    label:     "evening",
  },
  night: {
    fogColor:  "#0E0A2A",   // deep cold indigo
    rimColor:  "#1A1040",
    intensity: 0.65,
    label:     "night",
  },
  default: {
    fogColor:  "#2D1B4E",   // brand purple
    rimColor:  "#4A2870",
    intensity: 0.4,
    label:     "neutral",
  },
};

/**
 * Parses freeform timeOfDay strings like:
 *   "5:30 AM", "Dawn", "Late afternoon", "11:30 PM", "Midday"
 */
export function ambientLightShift(timeOfDay?: string): AmbientLight {
  if (!timeOfDay) return PRESETS.default;

  const t = timeOfDay.toLowerCase().trim();

  // Keyword matching first
  if (t.includes("dawn") || t.includes("sunrise"))    return PRESETS.dawn;
  if (t.includes("dusk") || t.includes("sunset"))     return PRESETS.dusk;
  if (t.includes("midnight") || t.includes("late night")) return PRESETS.night;
  if (t.includes("evening"))                          return PRESETS.evening;
  if (t.includes("afternoon"))                        return PRESETS.afternoon;
  if (t.includes("midday") || t.includes("noon"))     return PRESETS.midday;
  if (t.includes("morning"))                          return PRESETS.morning;
  if (t.includes("night"))                            return PRESETS.night;

  // Parse HH:MM AM/PM format
  const match = t.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/);
  if (match) {
    let hour = parseInt(match[1], 10);
    const isPm = match[3] === "pm";
    if (isPm && hour < 12) hour += 12;
    if (!isPm && hour === 12) hour = 0;

    if (hour >= 4  && hour < 7)  return PRESETS.dawn;
    if (hour >= 7  && hour < 11) return PRESETS.morning;
    if (hour >= 11 && hour < 14) return PRESETS.midday;
    if (hour >= 14 && hour < 17) return PRESETS.afternoon;
    if (hour >= 17 && hour < 20) return PRESETS.dusk;
    if (hour >= 20 && hour < 23) return PRESETS.evening;
    return PRESETS.night;
  }

  return PRESETS.default;
}
