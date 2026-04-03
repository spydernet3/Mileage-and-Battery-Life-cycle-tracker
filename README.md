# 🚗 Vehicle & Battery Health Monitor

A professional, high-efficiency digital ecosystem built with **Google Apps Script** to track vehicle mileage and battery health. Featuring a modern **Glassmorphism (Water Glass)** UI, this tool provides precise analytics on fuel consumption and battery charging cycles.

---

## 🌟 Key Features

* **Glassmorphism UI:** A sleek, semi-transparent interface designed for mobile and desktop (ChromeOS/Android optimized).
* **Precise Battery Tracking:** Calculates exact usage duration (e.g., `2.15 days`) by comparing the date and time between charge cycles.
* **Smart Mileage Logging:** Track fuel density, bunk names, and driving modes (**City**, **Urban**, **Highways**, **City + Highways**).
* **12-Hour Time Logic:** Simple text-based 12-hour input (`HH:MM AM/PM`) that automatically converts to 24-hour format for backend calculations.
* **Zero-Cost Hosting:** Powered entirely by Google Apps Script and Google Sheets.

---

## 🚀 Deployment Instructions

### 1. Prepare the Spreadsheet
1. Create a new [Google Sheet](https://sheets.new).
2. Go to **Extensions** > **Apps Script**.
3. Rename the project to `Vehicle Monitor`.

### 2. Add the Backend (`Code.gs`)
1. Copy the provided `Code.gs` logic into the editor.
2. Ensure the `doGet()` function is at the top to prevent "Script function not found" errors.
3. Save the file.

### 3. Add the Frontend (`Index.html`)
1. In the Apps Script editor, click **+** > **HTML**.
2. Name the file `Index` (do not add .html).
3. Paste the provided `Index.html` code containing the "Water Glass" CSS and 12-hour input logic.
4. Save the file.

### 4. Authorize and Deploy
1. Click **Deploy** > **New deployment**.
2. Select **Web app**.
    * **Execute as:** Me
    * **Who has access:** Anyone
3. Click **Deploy** and **Authorize Access**. 
4. *Important:* If you see a "Google hasn't verified this app" screen, click **Advanced** > **Go to Vehicle Monitor (unsafe)**.
5. Copy the **Web App URL**. This is your personal tracking link.

---

## 🛠️ Usage Guide

### 🔋 Battery Tracking
* **Input:** Type the time manually in the format `05:15 PM`.
* **Logic:** The system uses the **Plug Out** time of your current entry and compares it against the **Plug Out** time of your previous entry to calculate "Days Used at Last."
* **Cycles:** Calculated as `(Total % Charged / 100)`.

### ⛽ Mileage Tracking
* **Data Points:** Enter Odometer readings, Petrol Liters, and Fuel Density.
* **Modes:** Use the dropdown to categorize your driving environment for better average analysis.

---

## ⚠️ Troubleshooting & Maintenance

* **NaN days Used:** This occurs if the time format in the sheet is corrupted. Ensure you use the provided text-mask input in the web app to save records.
* **Updating Code:** If you modify the script, you **must** go to **Deploy** > **Manage Deployments** > **Edit** > **New Version** to push changes to your live URL.
* **Deleting Records:** Use the **Dashboard** tab to view history and click the **✕** button to remove incorrect entries directly from the sheet.

---

**Developed for:** High-efficiency personal asset tracking.  
**Platform:** Google Workspace / ChromeOS / Android.
