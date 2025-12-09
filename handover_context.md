# Handover Context: ARC Raiders Map Development

**Date:** 2025-12-09
**Status:** Skill Tree Refinement & Feature Implementation

## 1. Key Accomplishments
- **Skill Tree Refinement:**
    - **Spacing & Layout:** Vertically shifted entire tree up by **5%** (Bottom 75% -> 70%) to close the gap between headers and icons. Increased header font size to **5xl**.
    - **Data Fixes:** Corrected overlapping coordinates for `m7` ("힘들이지 않고 구르기").
- **Post Recommendation System:**
    - **Backend:** Added `likes` field to `Post` model and `toggleLike` API.
    - **Frontend:**
        - **Detail Page:** Added a large, interactive Like button.
        - **Community Page:** Displayed like usage counts on list items.
- **Deployment:**
    - Frontend build artifacts committed and pushed.
    - Ready for full stack redeploy on Cloudtype.

## 2. Current State
- **Frontend:** Built and pushed to `main`.
- **Backend:** Code updated and pushed to `main`.
- **Database:** `Post` schema updated (backward compatible, no migration needed).

## 3. Next Steps (Immediate)
1.  **Deployment:**
    - Deploy **both** `arc-server` and `arc-map` on Cloudtype.
    - Verify the Like system in production.
2.  **Verification:**
    - Check the skill tree layout on different screen sizes (especially mobile lock icons).

## 4. File Locations
- **Skill Data:** `client/src/data/skills.js`
- **Post Logic:** 
    - Server: `server/models/Post.js`, `server/controllers/postController.js`
    - Client: `client/src/store/useStore.js`
