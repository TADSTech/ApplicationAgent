import { useState, useEffect, useCallback, useRef } from 'react';
import { TerminalLine } from '../types';

interface TypingOptions {
  charDelay?: number;
  linePause?: number;
  restartPause?: number;
  autoLoop?: boolean;
}

export function useTerminalTyping(lines: TerminalLine[], options?: TypingOptions) {
  const {
    charDelay = 32,
    linePause = 600,
    restartPause = 4000,
    autoLoop = true,
  } = options ?? {};

  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fullText = useCallback((idx: number) => {
    const l = lines[idx];
    if (!l) return '';
    return l.message + (l.highlight ? l.highlight.text : '');
  }, [lines]);

  useEffect(() => {
    if (finished) {
      if (autoLoop) {
        timerRef.current = setTimeout(() => {
          setLineIndex(0);
          setCharIndex(0);
          setFinished(false);
        }, restartPause);
      }
      return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }

    const currentFull = fullText(lineIndex);

    if (charIndex < currentFull.length) {
      timerRef.current = setTimeout(() => setCharIndex(c => c + 1), charDelay);
    } else if (lineIndex < lines.length - 1) {
      timerRef.current = setTimeout(() => {
        setLineIndex(l => l + 1);
        setCharIndex(0);
      }, linePause);
    } else {
      setFinished(true);
    }

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [lineIndex, charIndex, finished, lines.length, fullText, charDelay, linePause, restartPause, autoLoop]);

  return { lineIndex, charIndex, finished, fullText };
}
