// src/utils/canvasDraw.js
// 공통 Canvas 드로잉 유틸리티 — CCTV 장면 렌더링용

// ── 배경/환경 ──────────────────────────────────────────

export function drawBackground(ctx, W, H, color = '#060a0e') {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, W, H);
}

export function drawScanlines(ctx, W, H) {
  for (let y = 0; y < H; y += 3) {
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(0, y, W, 1);
  }
}

export function drawSweep(ctx, W, H, tick, color = 'rgba(0,200,120,0.05)') {
  const sy = (tick * 0.35) % H;
  ctx.fillStyle = color;
  ctx.fillRect(0, Math.max(0, sy - 6), W, 12);
}

export function drawNoiseLine(ctx, W, y, alpha) {
  ctx.fillStyle = `rgba(255,255,255,${alpha})`;
  ctx.fillRect(0, y, W, 1);
}

export function drawGrid(ctx, W, H) {
  ctx.strokeStyle = 'rgba(0,180,100,0.04)';
  ctx.lineWidth = 0.5;
  for (let x = 0; x < W; x += 20) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 20) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
}

export function drawTimestamp(ctx, H, ch, tick) {
  ctx.fillStyle = 'rgba(74,222,128,0.5)';
  ctx.font = '8px monospace';
  const s = String(Math.floor(tick / 60) % 60).padStart(2, '0')
    + ':' + String(Math.floor(tick) % 60).padStart(2, '0');
  ctx.fillText(`CH${ch} ${s}`, 4, H - 5);
}

// ── 테이블 ────────────────────────────────────────────

export function drawRectTable(ctx, x, y, w, h, color = '#0f1e30') {
  ctx.fillStyle = color;
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, 3); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = 'rgba(37,99,235,0.2)'; ctx.lineWidth = 0.5;
  for (let i = 1; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(x + w * i / 4, y + 2);
    ctx.lineTo(x + w * i / 4, y + h - 2);
    ctx.stroke();
  }
}

export function drawRoundTable(ctx, cx, cy, r) {
  ctx.fillStyle = '#0f1e30';
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = 'rgba(37,99,235,0.2)'; ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.6, 0, Math.PI * 2); ctx.stroke();
}

// ── 사람 실루엣 (상면뷰, 얼굴 비식별) ────────────────

export function drawPerson(ctx, x, y, tick, idx = 0) {
  const bob = Math.sin(tick * 0.05 + idx * 1.7) * 0.8;
  ctx.fillStyle = '#263548'; ctx.strokeStyle = '#374155'; ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.ellipse(x, y + bob, 5, 7, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#1e2d3d';
  ctx.beginPath(); ctx.arc(x, y - 7 + bob, 4, 0, Math.PI * 2); ctx.fill();
}

// ── 식기류 ────────────────────────────────────────────

export function drawBowl(ctx, x, y, r = 5, fill = '#92400e', inner = '#7c3300') {
  ctx.fillStyle = fill; ctx.strokeStyle = inner; ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = inner;
  ctx.beginPath(); ctx.arc(x, y, r * 0.55, 0, Math.PI * 2); ctx.fill();
}

export function drawPlate(ctx, x, y, r = 8) {
  ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#334155'; ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = 'rgba(51,65,85,0.4)';
  ctx.beginPath(); ctx.arc(x, y, r * 0.7, 0, Math.PI * 2); ctx.stroke();
}

export function drawChopsticks(ctx, x, y, angle = 0, fallen = false) {
  ctx.save(); ctx.translate(x, y);
  ctx.rotate(fallen ? 0.4 : angle);
  ctx.strokeStyle = '#d97706'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(6, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-6, 2.5); ctx.lineTo(6, 2.5); ctx.stroke();
  ctx.restore();
}

export function drawSpoon(ctx, x, y) {
  ctx.strokeStyle = '#b45309'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x, y + 3); ctx.lineTo(x, y + 8); ctx.stroke();
}

export function drawHotPot(ctx, x, y, r, tick) {
  const steam = Math.sin(tick * 0.08) * 0.3 + 0.7;
  ctx.fillStyle = '#450a0a'; ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#7f1d1d';
  ctx.beginPath(); ctx.arc(x, y, r * 0.65, 0, Math.PI * 2); ctx.fill();
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = `rgba(239,68,68,${steam * 0.35})`;
    ctx.beginPath(); ctx.arc(x - 4 + i * 4, y - r - 3 - i * 2, 1.5, 0, Math.PI * 2); ctx.fill();
  }
}

export function drawGrillPlate(ctx, x, y, w, h, tick) {
  const glow = Math.sin(tick * 0.06) * 0.2 + 0.5;
  ctx.fillStyle = '#431407'; ctx.strokeStyle = '#f97316'; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, 2); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = `rgba(249,115,22,${glow * 0.6})`; ctx.lineWidth = 0.5;
  for (let i = 1; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(x + i * w / 4, y + 2); ctx.lineTo(x + i * w / 4, y + h - 2); ctx.stroke();
  }
  for (let m = 0; m < 3; m++) {
    ctx.fillStyle = `rgba(185,28,28,${0.6 + glow * 0.3})`;
    ctx.beginPath(); ctx.roundRect(x + 3 + m * 8, y + 3, 6, h - 6, 1); ctx.fill();
  }
}

// ── 음료/주류 ─────────────────────────────────────────

export function drawBottle(ctx, x, y, empty = false, color = '#065f46') {
  ctx.fillStyle = empty ? `${color}40` : color;
  ctx.strokeStyle = '#10b981'; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.roundRect(x, y, 5, 12, 2); ctx.fill(); ctx.stroke();
  if (empty) {
    ctx.strokeStyle = 'rgba(16,185,129,0.4)'; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 5, y + 12); ctx.stroke();
  }
}

export function drawGlass(ctx, x, y, level = 0.7) {
  ctx.fillStyle = `rgba(147,197,253,${level * 0.4})`;
  ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.roundRect(x, y, 6, 8, 1); ctx.fill(); ctx.stroke();
}

export function drawShotGlass(ctx, x, y) {
  ctx.fillStyle = 'rgba(147,197,253,0.3)';
  ctx.strokeStyle = '#93c5fd'; ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.roundRect(x, y, 4, 5, 1); ctx.fill(); ctx.stroke();
}

// ── 개인 소지품 ───────────────────────────────────────

export function drawJacket(ctx, x, y) {
  ctx.fillStyle = 'rgba(71,85,105,0.7)';
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(x, y); ctx.lineTo(x + 10, y + 2);
  ctx.lineTo(x + 12, y + 10); ctx.lineTo(x + 2, y + 12);
  ctx.lineTo(x - 2, y + 8); ctx.closePath();
  ctx.fill(); ctx.stroke();
}

export function drawBag(ctx, x, y) {
  ctx.fillStyle = '#3b1f6e'; ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.roundRect(x, y, 10, 9, 2); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#a78bfa'; ctx.lineWidth = 0.6;
  ctx.beginPath(); ctx.moveTo(x + 2, y); ctx.quadraticCurveTo(x + 5, y - 5, x + 8, y); ctx.stroke();
}

export function drawPhone(ctx, x, y) {
  ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.roundRect(x, y, 5, 9, 1); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#3730a3';
  ctx.beginPath(); ctx.roundRect(x + 0.5, y + 0.5, 4, 6, 0.5); ctx.fill();
}

export function drawCard(ctx, x, y) {
  ctx.fillStyle = '#1d3461'; ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.roundRect(x, y, 20, 13, 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#2563eb'; ctx.fillRect(x + 2, y + 4, 16, 3);
}

// ── 바닥 분실물 ───────────────────────────────────────

export function drawFloorItem(ctx, x, y, type, tick) {
  const pulse = 0.5 + 0.5 * Math.sin(tick * 0.1);
  ctx.strokeStyle = `rgba(239,68,68,${pulse * 0.8})`; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = `rgba(239,68,68,${pulse * 0.3})`; ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.arc(x, y, 13, 0, Math.PI * 2); ctx.stroke();

  if (type === 'wallet') {
    ctx.fillStyle = '#92400e'; ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.roundRect(x - 4, y - 3, 8, 6, 1); ctx.fill(); ctx.stroke();
  } else if (type === 'phone') {
    drawPhone(ctx, x - 2.5, y - 4.5);
  } else if (type === 'key') {
    ctx.strokeStyle = '#b45309'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(x, y - 2, 3, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y + 1); ctx.lineTo(x, y + 5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 2, y + 3); ctx.lineTo(x + 2, y + 3); ctx.stroke();
  } else if (type === 'umbrella') {
    ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x, y - 5); ctx.lineTo(x, y + 5); ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y - 3, 4, Math.PI, 0); ctx.stroke();
  }
}

// ── AI 감지 박스 ─────────────────────────────────────

export function drawDetectionBox(ctx, x, y, w, h, color, label, tick) {
  const p = 0.55 + 0.45 * Math.sin(tick * 0.13);
  ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.globalAlpha = p;
  ctx.strokeRect(x, y, w, h);
  const cs = 7; ctx.lineWidth = 2.5;
  [[x, y], [x + w, y], [x, y + h], [x + w, y + h]].forEach(([px, py], ci) => {
    const dx = ci % 2 === 0 ? 1 : -1, dy = ci < 2 ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(px, py + dy * cs); ctx.lineTo(px, py); ctx.lineTo(px + dx * cs, py);
    ctx.stroke();
  });
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = color;
  const lw = label.length * 5.5 + 8;
  ctx.beginPath(); ctx.roundRect(x, y - 12, lw, 11, 2); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = '7px monospace';
  ctx.fillText(label, x + 4, y - 3);
  ctx.globalAlpha = 1;
}
