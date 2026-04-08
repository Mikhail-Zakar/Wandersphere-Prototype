/**
 * ImmersiveAudioPlayer — Drop-in replacement for AudioPlayer in the viewers.
 *
 * Adds a real-time canvas waveform visualisation using the Web Audio API's
 * AnalyserNode. The waveform reacts to the actual audio frequencies being
 * played, giving a living, breathing presence to the ambient soundscape.
 *
 * Features:
 *  - Frequency bar chart (bottom-up) that pulses with the actual audio
 *  - Subtle purple→pink gradient colouring on the bars
 *  - Graceful fallback: if AudioContext is blocked (browser policy), the
 *    waveform shows a gentle CSS animation instead
 *  - Play/pause button with existing audio-on/off styling to match nav
 *  - Crossfade when switching experiences
 *
 * Usage: replaces <AudioPlayer> + the inline audio button in viewers.
 *
 *   <ImmersiveAudioPlayer
 *     audioUrl={experience.audioUrl}
 *     isEnabled={audioEnabled}
 *     onToggle={() => setAudioEnabled(!audioEnabled)}
 *   />
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "motion/react";
import { Volume2, VolumeX } from "lucide-react";

interface ImmersiveAudioPlayerProps {
  audioUrl:   string;
  isEnabled:  boolean;
  onToggle:   () => void;
  /** Height of the waveform visualiser in pixels (default 36) */
  barHeight?: number;
  /** Number of frequency bars (default 48) */
  barCount?:  number;
  className?: string;
}

const BAR_COLORS = [
  "rgba(168, 85, 247, 0.7)",   // purple-500
  "rgba(192, 132, 252, 0.75)", // purple-400
  "rgba(216, 180, 254, 0.65)", // purple-300
  "rgba(244, 114, 182, 0.7)",  // pink-400
  "rgba(251, 182, 206, 0.6)",  // pink-300
];

export default function ImmersiveAudioPlayer({
  audioUrl,
  isEnabled,
  onToggle,
  barHeight = 36,
  barCount  = 48,
  className = "",
}: ImmersiveAudioPlayerProps) {
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const audioRef       = useRef<HTMLAudioElement | null>(null);
  const analyserRef    = useRef<AnalyserNode | null>(null);
  const contextRef     = useRef<AudioContext | null>(null);
  const sourceRef      = useRef<MediaElementAudioSourceNode | null>(null);
  const rafRef         = useRef(0);
  const [ready,  setReady ] = useState(false);
  const [useFake, setFake ] = useState(false);  // fallback when AC blocked
  const fakePhaseRef   = useRef(0);

  // ── Set up audio + analyser ────────────────────────────────────────────────
  useEffect(() => {
    if (!audioUrl) return;

    // Create/reuse audio element
    const audio = new Audio();
    audio.src          = audioUrl;
    audio.crossOrigin  = "anonymous";
    audio.loop         = true;
    audio.volume       = 0.65;
    audio.preload      = "auto";
    audioRef.current   = audio;

    // Try to create AudioContext + AnalyserNode
    try {
      const ctx      = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = ctx.createAnalyser();
      analyser.fftSize           = barCount * 4;
      analyser.smoothingTimeConstant = 0.82;
      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(ctx.destination);

      contextRef.current  = ctx;
      analyserRef.current = analyser;
      sourceRef.current   = source;
    } catch {
      setFake(true);
    }

    setReady(true);

    return () => {
      audio.pause();
      audio.src = "";
      cancelAnimationFrame(rafRef.current);
      contextRef.current?.close().catch(() => {});
    };
  }, [audioUrl, barCount]);

  // ── Play / pause when isEnabled changes ───────────────────────────────────
  useEffect(() => {
    if (!audioRef.current || !ready) return;
    if (isEnabled) {
      contextRef.current?.resume().catch(() => {});
      audioRef.current.play().catch(() => setFake(true));
    } else {
      audioRef.current.pause();
    }
  }, [isEnabled, ready]);

  // ── Canvas draw loop ───────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W   = canvas.offsetWidth;
    const H   = barHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    const dataArray  = analyserRef.current
      ? new Uint8Array(analyserRef.current.frequencyBinCount)
      : new Uint8Array(barCount);

    function draw() {
      ctx.clearRect(0, 0, W, H);

      if (!isEnabled) {
        // Draw a flat dim line when paused
        ctx.fillStyle = "rgba(139,92,246,0.15)";
        ctx.fillRect(0, H / 2 - 1, W, 2);
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      if (analyserRef.current && !useFake) {
        analyserRef.current.getByteFrequencyData(dataArray);
      } else {
        // Fake sinusoidal waveform when AC is unavailable
        fakePhaseRef.current += 0.04;
        for (let i = 0; i < barCount; i++) {
          const v = Math.sin(fakePhaseRef.current + i * 0.45) * 0.5 + 0.5;
          dataArray[i] = Math.round(v * 200 * (0.4 + 0.6 * Math.sin(i * 0.3 + fakePhaseRef.current * 0.7)));
        }
      }

      const barW   = W / barCount;
      const gap    = Math.max(1, barW * 0.25);
      const bW     = barW - gap;

      for (let i = 0; i < barCount; i++) {
        const value  = dataArray[Math.floor(i * dataArray.length / barCount)];
        const norm   = value / 255;
        const bH     = Math.max(2, norm * H * 0.95);
        const x      = i * barW;
        const y      = H - bH;

        // Gradient color cycling across bars
        const colorIdx = Math.floor((i / barCount) * BAR_COLORS.length);
        ctx.fillStyle = BAR_COLORS[Math.min(colorIdx, BAR_COLORS.length - 1)];

        // Rounded top
        const r = Math.min(bW / 2, 2);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + bW - r, y);
        ctx.quadraticCurveTo(x + bW, y, x + bW, y + r);
        ctx.lineTo(x + bW, H);
        ctx.lineTo(x, H);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnabled, useFake, barCount, barHeight]);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/40 backdrop-blur-sm border border-white/20 hover:bg-black/60 transition-colors flex-shrink-0"
        title={isEnabled ? "Mute ambient sound" : "Play ambient sound"}
      >
        {isEnabled ? (
          <>
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Volume2 className="w-4 h-4 text-green-400" />
            </motion.div>
            <span className="text-xs text-slate-300 font-medium">Audio On</span>
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400">Audio Off</span>
          </>
        )}
      </button>

      {/* Waveform canvas */}
      <div
        className="flex-1 overflow-hidden rounded"
        style={{ height: barHeight }}
      >
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ height: barHeight, display: "block" }}
        />
      </div>
    </div>
  );
}
