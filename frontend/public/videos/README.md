# Task Management Background Video

This directory is where you should place your dark-themed task management background video for the login page.

## How to Add Your Video

1. Place your video file in this directory (`frontend/public/videos/`)
2. Rename it to `task-management-bg.mp4` (or update the path in the Login.vue component)
3. In `frontend/src/views/Login.vue`, uncomment the video source line and update with:
   ```html
   <source src="/videos/task-management-bg.mp4" type="video/mp4">
   ```

## Recommended Video Specifications

- **Format**: MP4
- **Resolution**: 1920x1080 (HD) or higher
- **Duration**: 10-30 seconds (looping)
- **Theme**: Dark-themed task management visualization
- **File Size**: 5-10 MB recommended for quick loading

## Content Suggestions

- Abstract visualization of tasks moving/completing
- Dark-colored productivity workflow
- Minimal office environment with dark lighting
- Abstract digital dashboard with data flowing

## Tips for Good Results

1. Choose a video with a **dark theme** (dark blues, purples, or blacks)
2. The video should be subtle enough not to distract from the login form
3. Ensure the video can loop seamlessly without obvious jumps
4. Apply a simple color grading to match your brand colors if needed

## Finding Videos

If you don't have a custom video:
1. Search for royalty-free dark-themed productivity/task management videos
2. Use sites like Pexels, Pixabay, or Envato Elements
3. Make sure you have proper licensing for any video you use

## Current Fallback

If no video is available, the application displays a dark gradient background as a fallback. 