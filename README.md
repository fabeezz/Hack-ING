# Accessibility Enhancer - HackITAll 2025

## 📘 Project Overview  
**Accessibility Enhancer** is a browser extension and server-side solution designed to improve web accessibility for users with diverse needs, including low vision, motor difficulties, and colorblindness. Built for the **HackITAll** hackathon, this tool empowers users to customize their browsing experience with features like text-to-speech, high-contrast modes, zoom functionality, brightness control, and more.

The project combines a Chrome extension with a Flask server to provide both client-side accessibility adjustments and system-level controls (e.g., screen brightness and audio volume). Our goal is to make the web more inclusive, one tab at a time! 🌐

---

## ✨ Features

- 🧑‍💻 **User Profiles**: Select from _Low Vision_, _Motor Difficulty_, _Colorblind_, or _None_ to tailor the experience.
  
- 👁️ **Low Vision Tools**:
  - 🔊 Text-to-speech for selected text (press `r` or use the "Read Selected Text" button).
  - 🌓 Toggle high-contrast mode (white or yellow background).
  - 🔍 Zoom webpages to 150%.
  - 💡 Adjust screen brightness via a local Flask server.

- 🖐️ **Motor Difficulty Tools**:
  - ⌨️ Keyboard navigation (press `n` to scroll down).
  - ⚠️ Click detection to prevent repetitive clicking in the same spot (alerts after 5 clicks).

- 🎨 **Colorblind Mode**:
  - 🎛️ Applies an inverted color filter with hue rotation for better visibility.

- 🎯 **Cursor Outline**:
  - 🔴 Optional red circular outline around the cursor for improved tracking.

- 💾 **Persistent Settings**:
  - Preferences are saved using Chrome storage and restored across sessions.

---

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Chrome Extension)  
- **Backend**: Python (Flask) for system-level controls  
- **Libraries**:
  - `screen_brightness_control` 💡
  - `pycaw` 🔊
  - `flask_cors` 🔗
- **Permissions**: Chrome APIs (`activeTab`, `storage`, `tabs`, `scripting`) 🔐

---

## 🚀 Usage

1. 🔘 **Open the Popup**: Click the extension icon in Chrome.
2. 👤 **Select a Profile**: Choose your accessibility need from the dropdown.
3. 💾 **Save Settings**: Click "Save" to apply changes to the active tab.
4. 🧭 **Vision Controls**: If "Low Vision" is selected, use buttons to read text, toggle contrast, or adjust brightness.
5. 🧩 **Toggle Features**: Enable click detection or cursor outline as needed.

---

## ⚠️ Limitations

- 🖥️ The Flask server must be running locally for brightness and audio features to work.
- 🪟 Some features (e.g., brightness control) are Windows-specific due to library dependencies.
- 🔄 The extension requires manual reloading of tabs to apply changes initially.

---

## 🌟 Future Improvements

- 🍎 Add support for macOS/Linux brightness and audio controls.
- ⚡ Implement real-time accessibility updates without page reloads.
- 🎨 Expand colorblind filters for specific types (e.g., deuteranopia, protanopia).
- 🤖 Integrate AI to auto-detect accessibility needs based on user behavior.
