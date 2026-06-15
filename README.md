# RobEdge — Mobile App (Capacitor project)

This is a ready-to-build Capacitor project that wraps the RobEdge client app
(Home, AI Scanner, MetaTrader) as an installable Android and iOS app.

**Status: not yet built or published.** This project hasn't been run through
`npm install` / `npx cap` here because this environment has no internet
access. Everything below works on a normal machine with Node.js installed.

---

## 0. What you need

- Node.js 18+ and npm — https://nodejs.org
- For Android: Android Studio (free) — https://developer.android.com/studio
- For iOS: a Mac with Xcode (free), plus a free Apple ID for device testing
  (an Apple Developer account, $99/yr, is only needed for TestFlight/App
  Store distribution)

No Mac? Skip to **Section 4 (cloud build)**.

---

## 1. Install dependencies

```bash
cd robedge-app
npm install
```

## 2. Run it in a browser first (sanity check)

```bash
npm run dev
```

Open the printed local URL — you should see the RobEdge app (Home / AI
Scanner / MetaTrader tabs, theme switcher, floating AI Command button).

## 3. Build the web app and add native platforms

```bash
npm run build
npx cap add android
npx cap add ios       # only on a Mac
npx cap sync
```

This creates `android/` and `ios/` folders containing full native projects.

### Android — produce an installable APK

```bash
npx cap open android
```

This opens Android Studio. Then:

1. Wait for Gradle sync to finish.
2. Menu: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
3. The APK appears under `android/app/build/outputs/apk/debug/app-debug.apk`
4. Copy that file to a phone and install it (enable "Install from unknown
   sources" in Android settings), or upload it somewhere and share the link.

For a "real" release build (smaller, optimized, required for the Play
Store), you'll need to generate a signing key — Android Studio's
**Build → Generate Signed Bundle / APK** wizard walks you through this.

### iOS — run on a device / TestFlight

```bash
npx cap open ios
```

This opens Xcode. Then:

1. Select your connected iPhone (or a simulator) as the run target.
2. Under **Signing & Capabilities**, select your Apple ID team (free
   personal team works for installing on your own device for 7 days at a
   time).
3. Press Run to install on a connected device.

For TestFlight (shareable install link for others), you need a paid Apple
Developer account, then: Xcode → **Product → Archive** → upload to App Store
Connect → add testers in TestFlight.

## 4. No Mac? Use a cloud build service

Services like **Codemagic**, **EAS (Expo Application Services)**, or
**Ionic Appflow** can build both Android APKs and iOS apps (including
TestFlight uploads) from this same project without you owning a Mac.
General flow:

1. Push this project to a GitHub/GitLab repo.
2. Connect the repo to the build service.
3. Configure a build for "Capacitor" — most have a preset.
4. Download the resulting APK, or let it push straight to TestFlight /
   Play Internal Testing.

---

## Free "download my app" links — realistic options

- **Android**: host the built APK file anywhere (Google Drive, your own
  site, GitHub Releases) and share the direct download link. No store
  review needed, but users must enable "install unknown apps."
- **iOS**: TestFlight is the standard free-to-users way to share a beta —
  but it requires the $99/yr Apple Developer Program on your end to set up.
  There is no equivalent "just send a link" option for iOS outside of
  TestFlight or full App Store release.

---

## What's mocked vs real in this build

Everything currently renders and is interactive (tabs, theme switching,
chart upload, settings sheet, draggable AI Command button, MetaTrader
connect form), but:

- **AI Scanner** returns a fixed sample result after a short delay — it
  does not actually analyze the uploaded image yet. Wiring this up needs a
  backend endpoint that sends the image to a vision-capable model.
- **MetaTrader connect** just simulates a successful connection — no real
  broker/account validation happens.
- **AI Command** chat gives a canned acknowledgement — no real bot control
  is wired up.
- **Execute trade / Start / Remove / Quotes** buttons don't call any
  trading API yet.

These are the pieces that need a real backend before this can safely go to
real users, especially given it's a financial/trading app (App Store and
Play Store apply extra scrutiny to anything that can place trades).
