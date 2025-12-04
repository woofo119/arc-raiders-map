# Handover Context: ARC Raiders Map Development

**Date:** 2025-11-29
**Status:** Landing Page Redesign & Skill Tree Sharing Completed

## 1. Key Accomplishments
- **Skill Tree Sharing:** Implemented Base36 URL encoding/decoding for sharing skill builds.
- **Landing Page Redesign:**
    - Replaced the feature grid with a "Masked Background" design.
    - All cards share a single fixed background image (`/banners/skill_tree.png`), creating a window effect.
    - Added rounded corners (`rounded-2xl`) and glass-morphism styling.
    - Implemented a new "Shooting Laser" animation for the hero section.

## 2. Current State & Known Issues
- **Background Image:** The user explicitly requested to use `skill_tree.png` as the background for the masked effect.
- **Resolution Issue:** The current `skill_tree.png` is a low-resolution banner (750x128) being stretched to cover the screen. This results in pixelation on larger displays, but the user has decided to proceed with it for now.

## 3. Next Steps (Immediate)
1.  **Deployment:**
    - The frontend code is committed and pushed.
    - Needs a redeploy on Cloudtype to see the changes live.

## 4. File Locations
- **Landing Page:** `client/src/components/LandingPage.jsx`
- **Background Images:** `client/public/banners/`
    - `skill_tree.png` (Current, low-res)
    - `dashboard_wallpaper.png` (High-res, vertical, unused)
    - `dashboard_bg.png` (High-res, unused)

## 5. User Preferences
- **Aesthetic:** Retro-futuristic, dark, diagonal neon stripes (Red, Yellow, Green, Cyan).
- **Layout:** Grid cards acting as transparent windows to a single background.
- **Specifics:** Prefers the "Skill Tree" visual theme.
- **Language:** Always use Korean for results and intermediate steps (process descriptions).
