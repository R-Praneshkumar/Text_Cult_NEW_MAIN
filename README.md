# TexCult React Native Application

This repository contains the mobile frontend application for the TexCult platform, built using React Native and Expo. 

## 📱 App Status & Features (April 2026)

### 1. Authentication & Security (Live)
- **SMS OTP Flow:** Integrated with the backend API (`/login-otp`, `/signup-otp`, `/verify-otp`).
- **Session Persistence:** Utilizing `expo-secure-store` to securely store Access and Refresh tokens to maintain active user sessions across app restarts.
- **Developer Skip:** The app retains a "Developer Skip" mechanism on the login screen to allow UI debugging without burning Vonage SMS credits.

### 2. UI & Navigation Architecture
- **Design System:** Transitioned to a clean, premium "Light Theme" incorporating typography from Google Fonts (`Inter`, `PlayfairDisplay`, `Manrope`).
- **Sidebar (Drawer):** Cleaned up to solely feature functional screens: **Profile**, **Orders**, and **Logout**. Fixed Android routing bugs where nested stack navigation failed to trigger from the root Drawer.
- **Responsive Sizing:** Explicit sizing configuration added to the Drawer menu (280 width) to prevent it from consuming the full screen on longer Android aspect ratios.

### 3. Dynamic Products & Home Screen
- Only **Rayon (Product ID: 1)** is fully integrated into the backend and accessible in the UI.
- **"Coming Soon" Handlers:** Cotton and Polyester cards on the Home screen are dynamically wired to throw "under development" alerts to prevent API crashes, waiting for future backend implementation.

### 4. Product Details & Live Pricing Engine
- **Smart Defaults:** The pricing calculator features "Smart Defaults". It dynamically compares the app's wishlist (e.g., 30s Count, Weaving, Ring Spun) against the actual backend-provided attributes. It selects the preferred options if they exist, or falls back to the first available backend option to prevent crashes.
- Race conditions causing the initial price to fail on component mount have been resolved.
- **Frontend Safety:** Added safety checks to prevent `TypeError (price?.includes)` during APK compilation when the backend successfully passes number types. Currency updated to ₹ (INR).

### 5. Profile Edit Mode
- **Inline Editing:** Rebuilt `MyProfileScreen` to support real-time editing.
- **API Mapping:** Inputs correctly map to the backend-supported update schema (`firstname`, `lastname`, `companyName`, `phoneno`), while unsupported UI fields (like Email or Business Address) are cleanly locked to prevent `/update` payload rejections.

---

## ⚠️ Action Required: Next Backend Steps

For the frontend application to scale effectively to more products, the Backend API requires the following patches:

### 1. Payload Dynamic SKU Architecture
The current price calculator payload requires a `prodSku` (Base SKU) and `prodName`. 
**Current State:** The payload hardcodes `"YR"` and `"Rayon Yarn"`. Option SKUs (like `30S`) map dynamically and correctly to uppercase standardizations.
**Backend Fix Required:** The `GET /product/{id}/attributes` endpoint MUST be updated to return the Product Name and Base SKU (e.g., `"baseSku": "YC"`) alongside the attribute arrays. This will decouple the frontend from Rayon and allow it to price Cotton and Polyester automatically.

### 2. Render Database Connection Pool
The free-tier Render backend database frequently times out (`500 - Connect timed out`), causing silent loading failures on the Profile and Pricing screens. A database keep-alive script or connection pool restructure is highly recommended.

### 3. Unconnected Screens
The frontend UI expects data formatting for the following endpoints that are not yet built or connected:
- `Order History / Pending Orders`
- `My Cart & Checkout Flow`
- `Notifications`
