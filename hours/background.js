/**
 * Clock: Hours Extension - Service Worker
 * Copyright © 2026 viraltaco_ <https://anth.pro>
 * All rights reserved.
 * @see https://viraltaco.com/chrome-clock
 */

const DEFAULT_SETTINGS = {
  format: '24',
  padZero: false,
  transparentBg: false,
  bgColor: '#2563eb',
  textColor: '#ffffff',
  fontFamily: 'IBM Plex Mono',
  fontWeight: 'bold',
  fontSizeScale: 1.0,
  borderStyle: 'none',
  borderColor: '#ffffff',
  borderWidth: 2,
  borderRadius: 4,
  showProgressBorder: false,
  progressColor: '#38bdf8',
  progressWidth: 2
};

const loadedFonts = new Set();
async function loadCustomFont(fontName) {
  if (loadedFonts.has(fontName) || ['monospace', 'sans-serif', 'serif', 'system-ui', 'Courier New'].includes(fontName)) return;
  try {
    if (fontName === 'IBM Plex Mono') {
      const font = new FontFace('IBM Plex Mono', 'url(https://fonts.gstatic.com/s/ibmplexmono/v19/-F63WptTw3-qdGIGiB0acdZpTN1g.woff2)');
      await font.load();
      if (self.fonts) self.fonts.add(font);
      loadedFonts.add(fontName);
    } else if (fontName === 'Fira Code') {
      const font = new FontFace('Fira Code', 'url(https://fonts.gstatic.com/s/firacode/v22/u5k3CBQhpR32QI2bf93ySMm3-68.woff2)');
      await font.load();
      if (self.fonts) self.fonts.add(font);
      loadedFonts.add(fontName);
    } else if (fontName === 'JetBrains Mono') {
      const font = new FontFace('JetBrains Mono', 'url(https://fonts.gstatic.com/s/jetbrainsmono/v18/tUB3-YrWsgGUWW85W37aor8n7vQ.woff2)');
      await font.load();
      if (self.fonts) self.fonts.add(font);
      loadedFonts.add(fontName);
    }
  } catch (e) {
    // Ignore font loading errors gracefully
  }
}

async function getSettings() {
  const settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  return { ...DEFAULT_SETTINGS, ...settings };
}

function drawRoundRectPath(ctx, x, y, w, h, r) {
  r = Math.max(0, Math.min(r, Math.min(w, h) / 2));
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}

function drawBordersAndProgress(ctx, size, settings, progressRatio) {
  const scale = size / 16;
  const bWidth = Math.max(1, settings.borderWidth * scale);
  const radius = Math.min(settings.borderRadius * scale, size / 2);
  const pad = bWidth / 2;
  const drawWidth = size - bWidth;

  // 1. Standard CSS Border Styles
  if (settings.borderStyle && settings.borderStyle !== 'none') {
    ctx.lineWidth = bWidth;
    ctx.strokeStyle = settings.borderColor;

    if (settings.borderStyle === 'solid') {
      ctx.setLineDash([]);
      drawRoundRectPath(ctx, pad, pad, drawWidth, drawWidth, radius);
      ctx.stroke();
    } else if (settings.borderStyle === 'dashed') {
      ctx.setLineDash([scale * 3, scale * 2]);
      drawRoundRectPath(ctx, pad, pad, drawWidth, drawWidth, radius);
      ctx.stroke();
    } else if (settings.borderStyle === 'dotted') {
      ctx.setLineDash([scale * 1, scale * 2]);
      drawRoundRectPath(ctx, pad, pad, drawWidth, drawWidth, radius);
      ctx.stroke();
    } else if (settings.borderStyle === 'double') {
      ctx.setLineDash([]);
      ctx.lineWidth = Math.max(1, bWidth / 3);
      drawRoundRectPath(ctx, pad / 2, pad / 2, size - pad, size - pad, radius);
      ctx.stroke();
      drawRoundRectPath(ctx, pad * 1.5, pad * 1.5, size - pad * 3, size - pad * 3, Math.max(0, radius - pad));
      ctx.stroke();
    } else if (settings.borderStyle === 'groove' || settings.borderStyle === 'ridge') {
      ctx.setLineDash([]);
      ctx.lineWidth = bWidth;
      ctx.strokeStyle = settings.borderStyle === 'groove' ? '#333333' : settings.borderColor;
      drawRoundRectPath(ctx, pad, pad, drawWidth, drawWidth, radius);
      ctx.stroke();
    }
  }

  // 2. Progress Ring Border (Clock path from 12 o'clock)
  if (settings.showProgressBorder) {
    const pWidth = Math.max(1, (settings.progressWidth || 2) * scale);
    const pRadius = (size - pWidth) / 2;
    const center = size / 2;
    const startAngle = -Math.PI / 2; // 12 o'clock top
    const endAngle = startAngle + (2 * Math.PI * progressRatio);

    ctx.save();
    ctx.setLineDash([]);
    ctx.lineWidth = pWidth;
    ctx.lineCap = 'round';

    // Base track ring
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(center, center, pRadius, 0, 2 * Math.PI);
    ctx.stroke();

    // Progress arc
    if (progressRatio > 0) {
      ctx.strokeStyle = settings.progressColor || '#38bdf8';
      ctx.beginPath();
      ctx.arc(center, center, pRadius, startAngle, endAngle);
      ctx.stroke();
    }
    ctx.restore();
  }
}

async function updateIcon() {
  const settings = await getSettings();
  if (settings.fontFamily) {
    await loadCustomFont(settings.fontFamily);
  }

  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();

  if (settings.format === '12') {
    hours = hours % 12 || 12;
  }

  let text = String(hours);
  if (settings.padZero && text.length < 2) {
    text = '0' + text;
  }

  // Progress ratio from 0/12 o'clock
  const progressRatio = settings.format === '12'
    ? ((hours % 12) * 60 + minutes) / 720
    : (hours * 60 + minutes) / 1440;

  const sizes = [16, 32, 48, 96, 128];
  const imageDataMap = {};

  sizes.forEach(size => {
    const canvas = new OffscreenCanvas(size, size);
    const ctx = canvas.getContext('2d');
    const scale = size / 16;
    const radius = Math.min(settings.borderRadius * scale, size / 2);

    // Draw background (unless transparentBg is enabled)
    if (!settings.transparentBg) {
      ctx.fillStyle = settings.bgColor;
      drawRoundRectPath(ctx, 0, 0, size, size, radius);
      ctx.fill();
    }

    // Draw borders & analog progress ring
    drawBordersAndProgress(ctx, size, settings, progressRatio);

    // Draw text (utilizing canvas / allowed to overflow)
    ctx.fillStyle = settings.textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const baseSize = text.length > 2 ? size * 0.5 : size * 0.65;
    const fontSize = Math.round(baseSize * (settings.fontSizeScale || 1.0));
    const family = settings.fontFamily ? `'${settings.fontFamily}', Hack, monospace` : 'system-ui, sans-serif';
    const weight = settings.fontWeight || 'bold';

    ctx.font = `${weight} ${fontSize}px ${family}`;
    ctx.fillText(text, size / 2, size / 2 + (size * 0.04));

    imageDataMap[size] = ctx.getImageData(0, 0, size, size);
  });

  chrome.action.setIcon({ imageData: imageDataMap });
}

function scheduleNextTick() {
  const now = new Date();
  const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
  setTimeout(() => {
    updateIcon();
    scheduleNextTick();
  }, msUntilNextMinute);
}

// Lifecycle listeners
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('clockTick', { periodInMinutes: 1 });
  updateIcon();
});

chrome.runtime.onStartup.addListener(updateIcon);
chrome.alarms.onAlarm.addListener(updateIcon);
chrome.storage.onChanged.addListener(updateIcon);

// Initial execution
updateIcon();
scheduleNextTick();
