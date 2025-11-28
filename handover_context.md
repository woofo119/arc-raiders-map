# Handover Context: ARC Raiders Map Development

**Date:** 2025-11-29
**Status:** Landing Page Redesign & Skill Tree Sharing Completed (Pending Background Resolution)

## 1. Key Accomplishments
- **Skill Tree Sharing:** Implemented Base36 URL encoding/decoding for sharing skill builds.
- **Landing Page Redesign:**
    - Replaced the feature grid with a "Masked Background" design.
    - All cards share a single fixed background image (`/banners/skill_tree.png`), creating a window effect.
    - Added rounded corners (`rounded-2xl`) and glass-morphism styling.
    - Implemented a new "Shooting Laser" animation for the hero section.

## 2. Current State & Known Issues
- **Background Image:** The user explicitly requested to use `skill_tree.png` as the background for the masked effect.
- **Resolution Issue:** The current `skill_tree.png` is a low-resolution banner (750x128) being stretched to cover the screen. This results in pixelation on larger displays.
- **Quota Limit:** Attempted to generate a high-res 4K version (`skill_tree_wallpaper.png`) but hit the image generation quota.

## 3. Next Steps (Immediate)
1.  **Resolve Background Resolution:**
    - **Option A:** Wait for the image generation quota to reset (approx. 4 hours) and generate a high-res version of the skill tree interface.
    - **Option B:** User uploads a custom high-res image.
    - **Option C:** Revert to the high-res `dashboard_wallpaper.png` (already generated) if the user changes their mind.
2.  **Deployment:**
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
- **Specifics:** Prefers the "Skill Tree" visual theme over the generic "Dashboard" theme.
