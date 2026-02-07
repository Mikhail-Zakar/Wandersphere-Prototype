import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  isEnabled: boolean;
  onToggle?: () => void;
  showControl?: boolean;
  loop?: boolean;
  volume?: number;
}

export function AudioPlayer({ 
  audioUrl, 
  isEnabled, 
  onToggle, 
  showControl = true,
  loop = true,
  volume = 0.7
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Create audio element with better settings
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.preload = 'auto';
    audio.loop = loop;
    audio.volume = volume;
    
    // Set up event listeners before setting src
    audio.addEventListener('loadstart', () => {
      setIsLoading(true);
      console.log('Audio loading started');
    });

    audio.addEventListener('canplay', () => {
      setIsLoading(false);
      console.log('Audio can play');
    });
    
    audio.addEventListener('canplaythrough', () => {
      setIsLoading(false);
      console.log('Audio ready to play');
    });
    
    audio.addEventListener('playing', () => {
      setIsPlaying(true);
      setIsLoading(false);
      setError(false);
      console.log('Audio playing');
    });
    
    audio.addEventListener('pause', () => {
      setIsPlaying(false);
      console.log('Audio paused');
    });
    
    audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      setError(true);
      setIsPlaying(false);
      setIsLoading(false);
    });
    
    // Now set the source
    audio.src = audioUrl;
    audioRef.current = audio;

    // Cleanup
    return () => {
      audio.pause();
      audio.removeEventListener('loadstart', () => {});
      audio.removeEventListener('canplay', () => {});
      audio.removeEventListener('canplaythrough', () => {});
      audio.removeEventListener('playing', () => {});
      audio.removeEventListener('pause', () => {});
      audio.removeEventListener('error', () => {});
      audio.src = '';
    };
  }, [audioUrl, loop, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const playAudio = async () => {
      if (isEnabled) {
        try {
          setIsLoading(true);
          // Don't reset playback position - let it continue from where it was
          await audio.play();
          console.log('Audio playback started successfully');
        } catch (error) {
          console.error('Audio playback failed:', error);
          setError(true);
          setIsPlaying(false);
          setIsLoading(false);
        }
      } else {
        audio.pause();
        setIsPlaying(false);
        setIsLoading(false);
      }
    };

    playAudio();
  }, [isEnabled]);

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    }
  };

  if (!showControl) return null;

  return (
    <button
      onClick={handleToggle}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/40 backdrop-blur-sm border border-white/20 hover:bg-black/60 transition-colors"
      title={isEnabled ? "Mute ambient sound" : "Play ambient sound"}
    >
      {error ? (
        <>
          <VolumeX className="w-4 h-4 text-red-400" />
          <span className="text-xs text-red-300 font-medium">Error</span>
        </>
      ) : isEnabled && isPlaying ? (
        <>
          <Volume2 className="w-4 h-4 text-green-400 animate-pulse" />
          <span className="text-xs text-slate-300 font-medium">Audio On</span>
        </>
      ) : isEnabled && isLoading ? (
        <>
          <Volume2 className="w-4 h-4 text-yellow-400" />
          <span className="text-xs text-yellow-300 font-medium">Loading...</span>
        </>
      ) : (
        <>
          <VolumeX className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400">Audio Off</span>
        </>
      )}
    </button>
  );
}