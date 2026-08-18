# 🕒 Chrome Clock Extensions

[![Chrome Web Store - Hours](https://img.shields.io/badge/Chrome_Web_Store-Clock:_Hours-2563EB?style=for-the-badge&logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/omigfhdlcimjomiibfjadagalehikfco?utm_source=item-share-cb)
[![Chrome Web Store - Minutes](https://img.shields.io/badge/Chrome_Web_Store-Clock:_Minutes-7C3AED?style=for-the-badge&logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/jkhbhhbacjmgjokjeifmlhkbcijbliab?utm_source=item-share-cb)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-10B981?style=for-the-badge&logo=googlechrome&logoColor=white)](#-architecture--tech-stack)
[![License](https://img.shields.io/badge/License-All_Rights_Reserved-94A3B8?style=for-the-badge)](#-license--copyright)

**Chrome Clock** is a pair of lightweight, elegant Manifest V3 Chrome extensions—**Clock: Hours** and **Clock: Minutes**—that turn your browser toolbar icons into live, customizable digital clocks with analog progress rings.

---

## 🛍️ Chrome Web Store Links

Directly install the extensions from the official Chrome Web Store:

- 💙 [**Clock: Hours** on Chrome Web Store](https://chromewebstore.google.com/detail/omigfhdlcimjomiibfjadagalehikfco?utm_source=item-share-cb)
- 💜 [**Clock: Minutes** on Chrome Web Store](https://chromewebstore.google.com/detail/jkhbhhbacjmgjokjeifmlhkbcijbliab?utm_source=item-share-cb)

---

## 📥 Installation Guide

### Option 1: Chrome Web Store (Recommended)

1. Open the store page for the extension you wish to install:
   - 👉 [Get Clock: Hours](https://chromewebstore.google.com/detail/omigfhdlcimjomiibfjadagalehikfco?utm_source=item-share-cb)
   - 👉 [Get Clock: Minutes](https://chromewebstore.google.com/detail/jkhbhhbacjmgjokjeifmlhkbcijbliab?utm_source=item-share-cb)
2. Click the **Add to Chrome** button.
3. Confirm by clicking **Add Extension** when prompted by Chrome.
4. **Pin to Toolbar** for constant visibility:
   - Click the Extensions puzzle piece icon (🧩) in the top-right corner of Chrome.
   - Click the **Pin** icon next to **Clock: Hours** and/or **Clock: Minutes**.

### Option 2: Local Developer / Unpacked Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/ViralTaco/chrome-clock.git
   ```
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** using the toggle switch in the top-right corner.
4. Click the **Load unpacked** button.
5. Select either the `hours` or `minutes` folder from the cloned project directory.

---

## 🎨 Customization Guide

Both extensions feature a dedicated, live-preview settings page allowing full control over visual appearance.

### How to Open Options
- **Toolbar Menu**: Right-click the extension icon in your Chrome toolbar and select **Options**.
- **Extensions Page**: Go to `chrome://extensions`, locate the extension card, and click **Details** ➔ **Extension options**.

### Available Settings

#### 1. Time & Typography
- **Time Format** *(Hours extension only)*: Switch between **24-Hour (0 - 23)** and **12-Hour (1 - 12)** formats.
- **Leading Zero Toggle**: Enable or disable leading zeros (e.g. `09` vs `9` or `05` vs `5`).
- **Font Family**: Select from clean, highly legible font families:
  - *IBM Plex Mono*
  - *Fira Code*
  - *JetBrains Mono*
  - *Hack*
  - *Courier New*
  - *Monospace* / *System UI*
- **Text Size / Overflow Scale**: Fine-tune font scaling from `0.5x` to `1.6x` for optimal fitting inside toolbar dimensions.

#### 2. Background & Color Palette
- **Transparent Background**: Toggle transparent background mode for seamless integration with custom browser themes.
- **Background Color**: Pick any background color using the visual color picker or enter HEX values (e.g. `#2563eb` or `#7c3aed`).
- **Text Color**: Choose custom text color for high contrast and readability.

#### 3. Border & Geometry
- **Border Style**: Choose from `None`, `Solid`, `Dashed`, `Dotted`, `Double`, `Groove`, or `Ridge`.
- **Border Color**: Set a custom border color.
- **Corner Radius**: Adjust outer border rounding from `0px` (square) to `8px` (rounded square / pill).

#### 4. Analog Progress Ring
- **12 o'clock Progress Ring**: Render a smooth circular track around the icon starting from top-center (12 o'clock).
  - **Hours**: Tracks elapsed progress through the current 12 or 24 hour cycle.
  - **Minutes**: Tracks elapsed progress through the current minute cycle (0–60s / hourly ratio).
- **Progress Ring Color**: Customize the accent color of the active progress arc.

---

## 🛠️ Architecture & Tech Stack

- **Manifest V3 Compliant**: Uses modern background Service Workers and Web APIs.
- **OffscreenCanvas Rendering**: High-performance canvas rendering directly inside service workers without requiring visible DOM windows.
- **Battery & CPU Efficient**: Utilizes `chrome.alarms` to minimize idle CPU consumption.

---

## 📄 License & Copyright

Copyright © 2026 **viraltaco_** ([anth.pro](https://anth.pro)). All rights reserved.  
Repository: [https://viraltaco.com/chrome-clock](https://viraltaco.com/chrome-clock)
