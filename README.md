# CBHI Portal Auto-Filler 🚀

A robust Google Chrome Extension (Manifest V3) designed to automate data entry for the Central Bureau of Health Intelligence (CBHI) web portal. It reads monthly communicable disease reports from Excel/CSV files and intelligently maps the data directly into the portal's dynamic grid.

## ✨ Features
* **Absolute Cell Mapping:** Injects data precisely into the correct HTML table cells (`<td>`), ignoring dynamic UI shifts.
* **Smart Bypass Filters:** Automatically skips aggregate rows (e.g., "TOTAL: ALL AGES") to allow the portal to calculate its own totals organically.
* **Read-Only Lock Picking:** Programmatically unlocks disabled/read-only input fields (like Overall Cases) to force data injection.
* **Framework Compatible:** Dispatches native JavaScript UI events (`input`, `change`, `keyup`) to mimic human typing speed so modern frameworks (React/Angular) register the data without crashing.
* **Visual Feedback:** Highlights successfully injected cells so users can verify data alignment in real-time.

## 🛠️ Built With
* **JavaScript** (Chrome Extension Manifest V3)
* **[SheetJS](https://sheetjs.com/)** (xlsx.full.min.js) for local, client-side Excel/CSV parsing.
* **HTML/CSS** for the popup interface.

## 📦 Installation
1. Download or clone this repository to your local machine.
2. Ensure `xlsx.full.min.js` is present in the root directory.
3. Open Google Chrome and navigate to `chrome://extensions/`.
4. Enable **Developer mode** in the top right corner.
5. Click **Load unpacked** and select the folder containing this repository.
6. Pin the extension to your Chrome toolbar.

## 🚀 Usage
1. Navigate to the specific data entry page on the CBHI web portal.
2. Click the extension icon in your Chrome toolbar.
3. Upload your monthly CSV/Excel report.
4. Click **Inject Data to Portal**.
5. Watch as the extension maps the data and highlights the updated fields. 

*Note: Always ensure your Excel sheet structure matches the expected portal grid before injecting.*

## ⚠️ Disclaimer
This tool is built to assist with tedious data entry. It is a client-side automation script and is not officially affiliated with the CBHI. Always verify the injected data before finalizing submissions on the portal.
