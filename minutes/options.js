/**
 * Clock: Minutes Extension - Options Controller
 * Copyright © 2026 viraltaco_ <https://anth.pro>
 * All rights reserved.
 * @see https://viraltaco.com/chrome-clock
 */

const DEFAULT_SETTINGS = {
  padZero: true,
  transparentBg: false,
  bgColor: '#7c3aed',
  textColor: '#ffffff',
  fontFamily: 'IBM Plex Mono',
  fontWeight: 'bold',
  fontSizeScale: 1.0,
  borderStyle: 'none',
  borderColor: '#ffffff',
  borderWidth: 2,
  borderRadius: 4,
  showProgressBorder: true,
  progressColor: '#a855f7',
  progressWidth: 2
};

const elements = {
  padZero: document.getElementById('padZero'),
  transparentBg: document.getElementById('transparentBg'),
  bgColorPicker: document.getElementById('bgColorPicker'),
  bgColorText: document.getElementById('bgColorText'),
  textColorPicker: document.getElementById('textColorPicker'),
  textColorText: document.getElementById('textColorText'),
  fontFamily: document.getElementById('fontFamily'),
  fontSizeScale: document.getElementById('fontSizeScale'),
  sizeVal: document.getElementById('sizeVal'),
  borderStyle: document.getElementById('borderStyle'),
  borderColorPicker: document.getElementById('borderColorPicker'),
  borderColorText: document.getElementById('borderColorText'),
  borderRadius: document.getElementById('borderRadius'),
  radiusVal: document.getElementById('radiusVal'),
  showProgressBorder: document.getElementById('showProgressBorder'),
  progressColorPicker: document.getElementById('progressColorPicker'),
  progressColorText: document.getElementById('progressColorText'),
  preview: document.getElementById('preview'),
  toast: document.getElementById('toast')
};

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

function drawPreview(settings) {
  const canvas = elements.preview;
  const ctx = canvas.getContext('2d');
  const size = 48;
  const scale = size / 16;
  const radius = Math.min(settings.borderRadius * scale, size / 2);

  ctx.clearRect(0, 0, size, size);

  // Background
  if (!settings.transparentBg) {
    ctx.fillStyle = settings.bgColor;
    drawRoundRectPath(ctx, 0, 0, size, size, radius);
    ctx.fill();
  }

  // Sample minute and progress ratio
  const now = new Date();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  let text = String(minutes);
  if (settings.padZero && text.length < 2) text = '0' + text;

  const progressRatio = (minutes * 60 + seconds) / 3600;

  // Borders
  const bWidth = Math.max(1, (settings.borderWidth || 2) * scale);
  const pad = bWidth / 2;
  const drawWidth = size - bWidth;

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

  // Analog progress ring (path from 12 o'clock)
  if (settings.showProgressBorder) {
    const pWidth = Math.max(1, (settings.progressWidth || 2) * scale);
    const pRadius = (size - pWidth) / 2;
    const center = size / 2;
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (2 * Math.PI * progressRatio);

    ctx.save();
    ctx.setLineDash([]);
    ctx.lineWidth = pWidth;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(center, center, pRadius, 0, 2 * Math.PI);
    ctx.stroke();

    if (progressRatio > 0) {
      ctx.strokeStyle = settings.progressColor || '#a855f7';
      ctx.beginPath();
      ctx.arc(center, center, pRadius, startAngle, endAngle);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Text
  ctx.fillStyle = settings.textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const baseSize = text.length > 2 ? size * 0.5 : size * 0.65;
  const fontSize = Math.round(baseSize * (settings.fontSizeScale || 1.0));
  const family = settings.fontFamily ? `'${settings.fontFamily}', Hack, monospace` : 'system-ui, sans-serif';

  ctx.font = `bold ${fontSize}px ${family}`;
  ctx.fillText(text, size / 2, size / 2 + (size * 0.04));
}

function showToast() {
  elements.toast.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => elements.toast.classList.remove('show'), 1200);
}

async function loadSettings() {
  const settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  const s = { ...DEFAULT_SETTINGS, ...settings };

  elements.padZero.checked = s.padZero;
  elements.transparentBg.checked = s.transparentBg;
  elements.bgColorPicker.value = s.bgColor;
  elements.bgColorText.value = s.bgColor;
  elements.textColorPicker.value = s.textColor;
  elements.textColorText.value = s.textColor;
  elements.fontFamily.value = s.fontFamily;
  elements.fontSizeScale.value = s.fontSizeScale;
  elements.sizeVal.textContent = s.fontSizeScale;
  elements.borderStyle.value = s.borderStyle;
  elements.borderColorPicker.value = s.borderColor;
  elements.borderColorText.value = s.borderColor;
  elements.borderRadius.value = s.borderRadius;
  elements.radiusVal.textContent = s.borderRadius;
  elements.showProgressBorder.checked = s.showProgressBorder;
  elements.progressColorPicker.value = s.progressColor;
  elements.progressColorText.value = s.progressColor;

  drawPreview(s);
}

function getFormSettings() {
  return {
    padZero: elements.padZero.checked,
    transparentBg: elements.transparentBg.checked,
    bgColor: elements.bgColorText.value,
    textColor: elements.textColorText.value,
    fontFamily: elements.fontFamily.value,
    fontSizeScale: parseFloat(elements.fontSizeScale.value),
    borderStyle: elements.borderStyle.value,
    borderColor: elements.borderColorText.value,
    borderWidth: 2,
    borderRadius: parseInt(elements.borderRadius.value, 10),
    showProgressBorder: elements.showProgressBorder.checked,
    progressColor: elements.progressColorText.value,
    progressWidth: 2
  };
}

function saveSettings() {
  const settings = getFormSettings();
  chrome.storage.sync.set(settings, () => {
    drawPreview(settings);
    showToast();
  });
}

// Sync color inputs
function bindColorPair(picker, text) {
  picker.addEventListener('input', (e) => {
    text.value = e.target.value;
    saveSettings();
  });
  text.addEventListener('change', (e) => {
    picker.value = e.target.value;
    saveSettings();
  });
}

bindColorPair(elements.bgColorPicker, elements.bgColorText);
bindColorPair(elements.textColorPicker, elements.textColorText);
bindColorPair(elements.borderColorPicker, elements.borderColorText);
bindColorPair(elements.progressColorPicker, elements.progressColorText);

elements.padZero.addEventListener('change', saveSettings);
elements.transparentBg.addEventListener('change', saveSettings);
elements.fontFamily.addEventListener('change', saveSettings);
elements.borderStyle.addEventListener('change', saveSettings);
elements.showProgressBorder.addEventListener('change', saveSettings);

elements.fontSizeScale.addEventListener('input', (e) => {
  elements.sizeVal.textContent = e.target.value;
  saveSettings();
});
elements.borderRadius.addEventListener('input', (e) => {
  elements.radiusVal.textContent = e.target.value;
  saveSettings();
});

document.addEventListener('DOMContentLoaded', loadSettings);
