import * as THREE from 'three';

/**
 * UI screens painted on a 2D canvas and used as textures in the 3D hero.
 * Drawn in the same schematic style as the case-study mocks (no real data).
 */
export type ScreenKind = 'dashboard' | 'mobile' | 'planner' | 'approval' | 'chart';

type Palette = { bg: string; surface: string; line: string; sk: string; text: string; muted: string; teal: string; coral: string; green: string };

const DARK: Palette = { bg: '#0d1513', surface: '#15211e', line: 'rgba(255,255,255,0.09)', sk: 'rgba(255,255,255,0.13)', text: '#e3f1ed', muted: '#8fb1a8', teal: '#1fd1b2', coral: '#ff7a59', green: '#4ccf8a' };
const LIGHT: Palette = { bg: '#ffffff', surface: '#f2f8f6', line: 'rgba(12,31,27,0.1)', sk: 'rgba(12,31,27,0.1)', text: '#0c1f1b', muted: '#5d7a73', teal: '#0d9c84', coral: '#e2552f', green: '#22a565' };

/** Width / height of each screen. */
export const SCREEN_ASPECT: Record<ScreenKind, number> = { dashboard: 1.6, mobile: 0.48, planner: 1.72, approval: 2.1, chart: 1.38 };

function rr(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string | CanvasGradient, stroke?: string) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
  c.fillStyle = fill;
  c.fill();
  if (stroke) {
    c.strokeStyle = stroke;
    c.lineWidth = 2;
    c.stroke();
  }
}

let fontFamily = 'system-ui, sans-serif';

function label(c: CanvasRenderingContext2D, text: string, x: number, y: number, size: number, color: string, weight = 600) {
  c.font = `${weight} ${size}px ${fontFamily}`;
  c.fillStyle = color;
  c.fillText(text, x, y);
}

function windowChrome(c: CanvasRenderingContext2D, W: number, p: Palette, title: string) {
  [0, 1, 2].forEach((i) => {
    c.beginPath();
    c.arc(34 + i * 22, 34, 6, 0, Math.PI * 2);
    c.fillStyle = p.sk;
    c.fill();
  });
  label(c, title, 112, 41, 20, p.muted, 500);
  c.fillStyle = p.line;
  c.fillRect(0, 66, W, 2);
}

function drawDashboard(c: CanvasRenderingContext2D, W: number, H: number, p: Palette) {
  windowChrome(c, W, p, 'Corporate MIS');
  const kpis = ['Revenue', 'EBITDA', 'Gross Margin', 'YoY'];
  const kw = (W - 48 - 3 * 18) / 4;
  kpis.forEach((k, i) => {
    const x = 24 + i * (kw + 18);
    rr(c, x, 92, kw, 120, 16, p.surface, p.line);
    label(c, k, x + 18, 128, 18, p.muted, 500);
    rr(c, x + 18, 146, kw * 0.62, 24, 6, p.sk);
    rr(c, x + 18, 184, kw * 0.36, 8, 4, i === 3 ? p.coral : p.teal);
  });
  // line chart
  const cx = 24, cy = 236, cw = W * 0.6, ch = H - cy - 24;
  rr(c, cx, cy, cw, ch, 16, p.surface, p.line);
  const pts = [0.75, 0.62, 0.66, 0.45, 0.5, 0.3, 0.34, 0.16].map((v, i, a) => [cx + 24 + (i / (a.length - 1)) * (cw - 48), cy + 20 + v * (ch - 40)]);
  c.beginPath();
  pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.lineTo(pts[pts.length - 1][0], cy + ch - 16);
  c.lineTo(pts[0][0], cy + ch - 16);
  c.closePath();
  const g = c.createLinearGradient(0, cy, 0, cy + ch);
  g.addColorStop(0, p.teal + '55');
  g.addColorStop(1, p.teal + '00');
  c.fillStyle = g;
  c.fill();
  c.beginPath();
  pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.strokeStyle = p.teal;
  c.lineWidth = 5;
  c.lineJoin = 'round';
  c.stroke();
  // bars
  const bx = cx + cw + 18, bw = W - bx - 24;
  rr(c, bx, cy, bw, ch, 16, p.surface, p.line);
  [0.55, 0.8, 0.42, 0.68, 0.92, 0.6].forEach((v, i, a) => {
    const w = (bw - 40) / a.length - 10;
    const h = v * (ch - 40);
    const x = bx + 20 + i * (w + 10);
    const gg = c.createLinearGradient(0, cy + ch - 20 - h, 0, cy + ch - 20);
    gg.addColorStop(0, i === 4 ? p.coral : p.teal);
    gg.addColorStop(1, (i === 4 ? p.coral : p.teal) + '33');
    rr(c, x, cy + ch - 20 - h, w, h, 6, gg);
  });
}

function drawMobile(c: CanvasRenderingContext2D, W: number, H: number, p: Palette) {
  rr(c, W / 2 - 60, 22, 120, 26, 13, '#000');
  label(c, 'Renewals due', 32, 112, 34, p.text, 700);
  const states = [p.coral, p.teal, p.green, p.teal, p.green];
  states.forEach((col, i) => {
    const y = 140 + i * 132;
    rr(c, 24, y, W - 48, 114, 22, p.surface, p.line);
    rr(c, 48, y + 30, (W - 96) * 0.55, 16, 8, p.sk);
    rr(c, 48, y + 62, (W - 96) * 0.38, 12, 6, p.sk);
    rr(c, W - 128, y + 28, 70, 22, 11, col);
  });
  rr(c, 24, H - 104, W - 48, 72, 22, p.teal);
  label(c, 'Review', W / 2 - 46, H - 58, 28, '#06110f', 700);
}

function drawPlanner(c: CanvasRenderingContext2D, W: number, H: number, p: Palette) {
  windowChrome(c, W, p, 'MANTRA · Production Planner');
  const rows = [[0, 3, 0], [1, 4, 1], [2, 2, 2], [3, 3, 0], [1, 2, 1], [4, 2, 2]] as const;
  const colors = [p.sk, p.teal, p.green];
  const top = 92, rh = (H - top - 64) / rows.length, tx = 120, tw = W - tx - 24;
  rows.forEach(([s, w, st], i) => {
    const y = top + i * rh;
    label(c, `B-0${i + 1}`, 24, y + rh / 2 + 7, 20, p.muted, 500);
    rr(c, tx, y + 8, tw, rh - 16, 10, p.surface);
    rr(c, tx + (s * tw) / 6 + 4, y + 14, (w * tw) / 6 - 12, rh - 28, 8, colors[st] === p.sk ? p.sk : colors[st]);
  });
  [['Planned', p.sk], ['In progress', p.teal], ['Completed', p.green]].forEach(([t, col], i) => {
    rr(c, 24 + i * 190, H - 40, 18, 18, 4, col);
    label(c, t, 52 + i * 190, H - 25, 18, p.muted, 500);
  });
}

function drawApproval(c: CanvasRenderingContext2D, W: number, H: number, p: Palette) {
  const r = H * 0.3, cx = 40 + r, cy = H / 2;
  c.lineWidth = 22;
  c.lineCap = 'round';
  c.beginPath();
  c.arc(cx, cy, r, 0, Math.PI * 2);
  c.strokeStyle = p.sk;
  c.stroke();
  c.beginPath();
  c.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * 0.72);
  c.strokeStyle = p.teal;
  c.stroke();
  const x = cx + r + 48;
  label(c, 'Approval flow', x, cy - 26, 32, p.text, 700);
  rr(c, x, cy + 4, W - x - 40, 14, 7, p.sk);
  rr(c, x, cy + 34, 132, 36, 18, p.green + '33');
  label(c, 'Approved', x + 18, cy + 59, 20, p.green, 700);
}

function drawChart(c: CanvasRenderingContext2D, W: number, H: number, p: Palette) {
  label(c, 'Monthly orders', 32, 58, 28, p.text, 700);
  rr(c, 32, 76, 120, 12, 6, p.sk);
  const base = H - 40;
  [0.4, 0.62, 0.5, 0.78, 0.66, 0.95].forEach((v, i, a) => {
    const w = (W - 64) / a.length - 14;
    const h = v * (base - 120);
    const g = c.createLinearGradient(0, base - h, 0, base);
    g.addColorStop(0, i === a.length - 1 ? p.coral : p.teal);
    g.addColorStop(1, (i === a.length - 1 ? p.coral : p.teal) + '30');
    rr(c, 32 + i * (w + 14), base - h, w, h, 8, g);
  });
}

const DRAW: Record<ScreenKind, (c: CanvasRenderingContext2D, W: number, H: number, p: Palette) => void> = {
  dashboard: drawDashboard,
  mobile: drawMobile,
  planner: drawPlanner,
  approval: drawApproval,
  chart: drawChart,
};

export function makeScreenTexture(kind: ScreenKind, light: boolean, maxAniso = 4): THREE.CanvasTexture {
  const p = light ? LIGHT : DARK;
  // next/font gives Manrope a hashed family name; read it from the CSS variable.
  fontFamily = getComputedStyle(document.documentElement).getPropertyValue('--font-manrope').trim() || fontFamily;
  const aspect = SCREEN_ASPECT[kind];
  const W = aspect >= 1 ? 1024 : Math.round(1024 * aspect);
  const H = aspect >= 1 ? Math.round(1024 / aspect) : 1024;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const c = canvas.getContext('2d')!;
  rr(c, 0, 0, W, H, kind === 'mobile' ? 64 : 28, p.bg);
  DRAW[kind](c, W, H, p);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAniso;
  return tex;
}
