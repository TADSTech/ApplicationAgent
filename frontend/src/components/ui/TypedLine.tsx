import React from 'react';
import { TerminalLine } from '../../types';

interface TypedLineProps {
  line: TerminalLine;
  visibleChars: number;
  showCursor: boolean;
}

export const TypedLine: React.FC<TypedLineProps> = ({ line, visibleChars, showCursor }) => {
  const full = line.message + (line.highlight ? line.highlight.text : '');
  const visible = full.slice(0, visibleChars);

  const msgPart = visible.slice(0, Math.min(visibleChars, line.message.length));
  const hlPart = visibleChars > line.message.length
    ? visible.slice(line.message.length)
    : '';

  return (
    <div className="flex space-x-2">
      <span className={line.labelColor}>{line.label}</span>
      <span className={line.messageClassName ?? 'text-[#00FFCC]'}>
        {msgPart}
        {line.highlight && hlPart && (
          <span className={line.highlight.color}>{hlPart}</span>
        )}
        {showCursor && (
          <span className="inline-block w-1.5 h-3.5 bg-[#00FF88] ml-0.5 align-middle animate-blink" />
        )}
      </span>
    </div>
  );
};

export default TypedLine;
