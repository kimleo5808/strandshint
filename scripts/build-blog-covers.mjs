// Generates SVG cover images for blog posts that have no artwork yet.
//
// The three newer posts referenced .webp covers that were never produced by
// scripts/screenshot-covers.mjs, so they 404'd. SVG keeps this dependency-free
// (no puppeteer / Chromium download) and matches the palette of the existing
// generated covers.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'public', 'images');

const COVERS = [
  {
    file: 'connections-solving-guide-cover.svg',
    eyebrow: 'NYT CONNECTIONS',
    title: 'How to Solve\nConnections',
    subtitle: 'Read the colors. Start from certainty.',
    accent: '#a78bfa',
    accent2: '#8b5cf6',
    tiles: ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'],
  },
  {
    file: 'wordle-starting-words-cover.svg',
    eyebrow: 'NYT WORDLE',
    title: 'The Best\nStarting Words',
    subtitle: 'Why CRANE beats ADIEU.',
    accent: '#34d399',
    accent2: '#10b981',
    tiles: ['#10b981', '#f59e0b', '#334155', '#10b981'],
  },
  {
    file: 'sharing-puzzle-results-cover.svg',
    eyebrow: 'PUZZLE CULTURE',
    title: 'Sharing Your\nResults',
    subtitle: 'How the emoji grid took over.',
    accent: '#34d399',
    accent2: '#3b82f6',
    tiles: ['#10b981', '#f59e0b', '#334155', '#10b981'],
  },
  {
    file: 'puzzle-accessibility-cover.svg',
    eyebrow: 'ACCESSIBILITY',
    title: 'Puzzles You\nCannot See',
    subtitle: 'Colour, grids and screen readers.',
    accent: '#60a5fa',
    accent2: '#a78bfa',
    tiles: ['#f59e0b', '#3b82f6', '#f59e0b', '#3b82f6'],
  },
  {
    file: 'puzzle-recap-channels-cover.svg',
    eyebrow: 'DAILY PUBLISHING',
    title: 'The Daily\nRecap',
    subtitle: 'Ship before they solve it.',
    accent: '#fb7185',
    accent2: '#f59e0b',
    tiles: ['#f59e0b', '#fb7185', '#3b82f6', '#10b981'],
  },
  {
    file: 'zodiac-words-cover.svg',
    eyebrow: 'VOCABULARY',
    title: 'Zodiac Words\nin Word Games',
    subtitle: 'Only three signs fit in Wordle.',
    accent: '#c084fc',
    accent2: '#60a5fa',
    tiles: ['#8b5cf6', '#3b82f6', '#f59e0b', '#8b5cf6'],
  },
  {
    file: 'strands-spangram-guide-cover.svg',
    eyebrow: 'NYT STRANDS',
    title: 'The Spangram,\nExplained',
    subtitle: 'Find the master key first, every time.',
    accent: '#f59e0b',
    accent2: '#fbbf24',
    tiles: ['#f59e0b', '#3b82f6', '#3b82f6', '#f59e0b'],
  },
];

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function render({ eyebrow, title, subtitle, accent, accent2, tiles }) {
  const lines = title.split('\n');
  const titleSpans = lines
    .map(
      (line, i) =>
        `      <tspan x="80" dy="${i === 0 ? 0 : 86}">${esc(line)}</tspan>`
    )
    .join('\n');

  const tileRects = tiles
    .map(
      (color, i) =>
        `  <rect x="${80 + i * 76}" y="520" width="60" height="60" rx="12" fill="${color}" opacity="0.9"/>`
    )
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-label="${esc(
    title.replace('\n', ' ')
  )}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${accent2}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="675" fill="url(#bg)"/>
  <circle cx="1020" cy="140" r="300" fill="url(#glow)"/>
  <rect x="0" y="0" width="10" height="675" fill="${accent}"/>

  <text x="80" y="150" font-family="'Segoe UI', system-ui, sans-serif"
        font-size="26" font-weight="700" letter-spacing="6" fill="${accent}">${esc(
    eyebrow
  )}</text>

  <text y="270" font-family="'Segoe UI', system-ui, sans-serif"
        font-size="76" font-weight="800" fill="#e2e8f0">
${titleSpans}
  </text>

  <text x="80" y="440" font-family="'Segoe UI', system-ui, sans-serif"
        font-size="32" fill="#94a3b8">${esc(subtitle)}</text>

${tileRects}

  <text x="1120" y="610" text-anchor="end" font-family="'Segoe UI', system-ui, sans-serif"
        font-size="24" font-weight="600" fill="#64748b">strandshint.app</text>
</svg>
`;
}

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const cover of COVERS) {
  const outPath = path.join(OUT_DIR, cover.file);
  fs.writeFileSync(outPath, render(cover), 'utf8');
  console.log(`  wrote public/images/${cover.file}`);
}

console.log(`build-blog-covers: ${COVERS.length} cover(s) generated`);
