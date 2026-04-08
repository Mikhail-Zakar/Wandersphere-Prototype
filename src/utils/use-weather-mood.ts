/**
 * useWeatherMood — fetches LIVE weather at a destination via the Open-Meteo
 * free API (no API key required) and returns an AmbientLight colour config
 * that can be blended into the ParallaxViewerBg fog layer.
 *
 * Fails silently — if fetch fails or lat/lng are missing, returns null
 * so the component falls back to the AmbientLightShift values.
 *
 * Open-Meteo docs: https://open-meteo.com/en/docs
 * WMO weather codes: https://open-meteo.com/en/docs#weathervariables
 */

import { useState, useEffect } from "react";
import type { AmbientLight } from "./ambient-light-shift";

export interface WeatherMood extends AmbientLight {
  condition:   string;    // human-readable e.g. "Light rain"
  temperature: number;    // °C
  wmoCode:     number;
}

// WMO code → mood colour mapping
function wmoToMood(code: number, isDay: number): WeatherMood {
  // Clear sky
  if (code === 0) {
    return isDay
      ? { fogColor: "#5C3D20", rimColor: "#8C5A30", intensity: 0.3,
          label: "clear", condition: "Clear sky", temperature: 0, wmoCode: code }
      : { fogColor: "#0E0A2A", rimColor: "#1A1040", intensity: 0.5,
          label: "clear night", condition: "Clear night", temperature: 0, wmoCode: code };
  }
  // Mainly clear / partly cloudy
  if (code <= 3) {
    return { fogColor: "#3D3050", rimColor: "#5A4870", intensity: 0.35,
             label: "partly cloudy", condition: "Partly cloudy", temperature: 0, wmoCode: code };
  }
  // Fog
  if (code >= 45 && code <= 48) {
    return { fogColor: "#2A2A35", rimColor: "#404050", intensity: 0.6,
             label: "foggy", condition: "Foggy", temperature: 0, wmoCode: code };
  }
  // Drizzle
  if (code >= 51 && code <= 57) {
    return { fogColor: "#1A2840", rimColor: "#253A58", intensity: 0.5,
             label: "drizzle", condition: "Light drizzle", temperature: 0, wmoCode: code };
  }
  // Rain
  if (code >= 61 && code <= 67) {
    return { fogColor: "#152035", rimColor: "#1E3050", intensity: 0.6,
             label: "rainy", condition: "Rain", temperature: 0, wmoCode: code };
  }
  // Snow
  if (code >= 71 && code <= 77) {
    return { fogColor: "#1E2840", rimColor: "#2C3855", intensity: 0.45,
             label: "snowy", condition: "Snow", temperature: 0, wmoCode: code };
  }
  // Rain showers
  if (code >= 80 && code <= 82) {
    return { fogColor: "#10203A", rimColor: "#1A3052", intensity: 0.55,
             label: "showers", condition: "Rain showers", temperature: 0, wmoCode: code };
  }
  // Thunderstorm
  if (code >= 95) {
    return { fogColor: "#08111F", rimColor: "#121C30", intensity: 0.75,
             label: "storm", condition: "Thunderstorm", temperature: 0, wmoCode: code };
  }
  // Overcast
  return { fogColor: "#1E1E2E", rimColor: "#2A2A40", intensity: 0.45,
           label: "overcast", condition: "Overcast", temperature: 0, wmoCode: code };
}

export function useWeatherMood(lat?: number, lng?: number): WeatherMood | null {
  const [mood, setMood] = useState<WeatherMood | null>(null);

  useEffect(() => {
    if (!lat || !lng) return;

    const controller = new AbortController();

    async function fetchWeather() {
      try {
        const url = `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}` +
          `&current=weather_code,temperature_2m,is_day` +
          `&timezone=auto&forecast_days=1`;

        const res  = await fetch(url, { signal: controller.signal });
        const data = await res.json();

        const code  = data.current?.weather_code ?? 0;
        const temp  = data.current?.temperature_2m ?? 20;
        const isDay = data.current?.is_day ?? 1;

        const m = wmoToMood(code, isDay);
        setMood({ ...m, temperature: Math.round(temp) });
      } catch {
        // Silent fail — component falls back to AmbientLightShift
        setMood(null);
      }
    }

    fetchWeather();
    return () => controller.abort();
  }, [lat, lng]);

  return mood;
}
