import React from 'react';

interface AvatarProps {
  seed: string;
  size?: number;
  className?: string;
  src?: string;
  alt?: string;
}

const PALETTES: [string, string][] = [
  ['#FEF3C7', '#D97706'],
  ['#DBEAFE', '#2563EB'],
  ['#D1FAE5', '#059669'],
  ['#FCE7F3', '#DB2777'],
  ['#EDE9FE', '#7C3AED'],
  ['#FFEDD5', '#EA580C'],
  ['#CCFBF1', '#0D9488'],
  ['#FEE2E2', '#DC2626'],
];

const BAYER_4: number[][] = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export const Avatar: React.FC<AvatarProps> = ({
  seed,
  size = 40,
  className = '',
  src,
  alt = 'Avatar',
}) => {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`rounded-full object-cover border border-[#E4E2DD] shadow-sm ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  const h = hash(seed);
  const [bg, fg] = PALETTES[h % PALETTES.length];
  const gridSize = 6;
  const cellSize = size / gridSize;
  const half = Math.ceil(gridSize / 2);

  interface Cell { x: number; y: number; filled: boolean }
  const cells: Cell[] = [];

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < half; col++) {
      const idx = row * half + col;
      const byte = (h >> ((idx % 8) * 4)) & 0xFF;
      const value = byte / 255;
      const threshold = BAYER_4[row % 4][col % 4] / 16;
      const filled = value > threshold;

      cells.push({ x: col, y: row, filled });

      const mirror = gridSize - 1 - col;
      if (col !== mirror) {
        cells.push({ x: mirror, y: row, filled });
      }
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`rounded-full border border-[#E4E2DD] shadow-sm ${className}`}
      style={{ backgroundColor: bg }}
    >
      {cells.map((cell, i) =>
        cell.filled ? (
          <rect
            key={i}
            x={cell.x * cellSize}
            y={cell.y * cellSize}
            width={cellSize}
            height={cellSize}
            fill={fg}
            rx={1}
          />
        ) : null
      )}
    </svg>
  );
};

export default Avatar;
