import { useState, useEffect, useRef, useCallback } from "react";

interface VisualizerData {
  frequencyData: Uint8Array;
  timeData: Uint8Array;
  isActive: boolean;
}

const useAudioVisualizer = (audioElement: HTMLAudioElement | null) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);

  const [frequencyData, setFrequencyData] = useState<Uint8Array>(
    new Uint8Array(128)
  );
  const [timeData, setTimeData] = useState<Uint8Array>(
    new Uint8Array(128)
  );
  const [isActive, setIsActive] = useState(false);

  const initializeAudio = useCallback(() => {
    if (!audioElement || audioContextRef.current) return;

    try {
      // Create Audio Context
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Create Analyser
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      // Connect audio element to analyser
      const source = audioContext.createMediaElementSource(audioElement);
      sourceRef.current = source;

      source.connect(analyser);
      analyser.connect(audioContext.destination);

      setIsActive(true);
    } catch (err) {
      console.error("Audio Visualizer init error:", err);
    }
  }, [audioElement]);

  const startVisualization = useCallback(() => {
    if (!analyserRef.current) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const freqData = new Uint8Array(bufferLength);
    const timeDomainData = new Uint8Array(bufferLength);

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      analyser.getByteFrequencyData(freqData);
      analyser.getByteTimeDomainData(timeDomainData);

      setFrequencyData(new Uint8Array(freqData));
      setTimeData(new Uint8Array(timeDomainData));
    };

    animate();
  }, []);

  const stopVisualization = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopVisualization();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    frequencyData,
    timeData,
    isActive,
    initializeAudio,
    startVisualization,
    stopVisualization,
  };
};

export default useAudioVisualizer;