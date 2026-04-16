# Texcult App - Project Status & Technical Documentation

**Date:** February 3, 2026
**Version:** 1.0 (Production Ready)
**Build Status:** ✅ Ready for Build

---

## 1. Project Overview
Texcult is a React Native mobile application connecting buyers (Weavers, Retailers, etc.) with textile resources. The application features a secure, OTP-based authentication system integrated with a RESTful backend.

---

## 2. Authentication & Security

### Secure Storage
*   **Library:** `expo-secure-store`
*   **Implementation:** `utils/secureStorage.js`
*   **Security:** Tokens (Access & Refresh) are stored in the device's hardware-backed secure enclave (Keychain/Keystore).

### Authentication Flow
1.  **Auto-Login:** On app launch, `AuthContext` checks strictly for existing tokens.
    *   **Valid Tokens:** Redirects immediately to `BuyerHomeScreen`.
    *   **No Tokens:** Redirects to `LoginScreen`.
2.  **Persistence:** Tokens are persisted across app restarts. Logging out clears secure storage.

---

## 3. Backend Integration (API)

The application is successfully integrated with the **Texcult Backend**.

*   **Base URL:** `https://texcult-backend-latest-1.onrender.com/texcultv1`
*   **Config File:** `api/config.js`

### Implemented Endpoints

| Feature | Endpoint | Method | Payload | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Login OTP** | `/user/action/login-otp` | `POST` | `{ phoneno }` | ✅ Verified |
| **Signup OTP** | `/user/action/signup-otp` | `POST` | `{ username, phoneno, buyerType, category ... }` | ✅ Verified |
| **Verify OTP** | `/user/action/verify-otp` | `POST` | `{ phoneno, token }` | ✅ Verified |
| **Refresh Token** | `/user/action/refresh-token/{token}` | `POST` | `(URL Param)` | ✅ Verified |

### Key Implementation Details
*   **Phone Formatting:** All phone numbers are automatically formatted with the `+91` country code before sending.
*   **Verification Key:** The App sends the OTP code using the key `token` (compliant with API Spec).
*   **Signup Logic:** Sends `category: 'General'` to satisfy backend constraints.
*   **Crash Prevention:** `secureStorage` handles optional refresh tokens gracefully.

---

## 4. Known Environment Behaviors

### ℹ️ SMS Gateway Limitation (Sandbox Mode)
If you observe that some phone numbers receive OTPs while others do not, despite the App and Backend showing "Success":

*   **Cause:** The SMS Provider (e.g., Twilio/Vonage) is in **Sandbox/Test Mode**.
*   **Behavior:** SMS is **ONLY** delivered to "Verified" or "Whitelisted" numbers.
*   **Verified Numbers:** `+91 8012180211` (Receives SMS ✅)
*   **Unverified Numbers:** `+91 8438748276` (Backend sends successfully, Gateway drops it ❌)
*   **Solution:** Add target numbers to the Allowed/Test list in the SMS Provider's dashboard.

---

## 5. Build Instructions

### Prerequisites
*   Expo CLI (`npm install -g eas-cli`)
*   Expo Account

### Commands

**1. Run Locally:**
```bash
npx expo start --clear
```

**2. Build Android APK:**
```bash
eas build -p android --profile preview
```

**3. Build Production Bundle:**
```bash
eas build -p android --profile production
```
