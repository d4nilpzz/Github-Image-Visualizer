![icon](icons/icon128.png)

# GitHub Image Visualizer

A small Chrome extension that shows a real thumbnail of image files in the GitHub file tree, instead of the generic file icon.

## Features

- Thumbnails for `png`, `jpg`, `jpeg`, `gif`, `webp`, `bmp`, `ico`, `svg` and `avif` files
- Checkerboard background so transparent images are easy to see
- Small images (32×32 or less) are rendered pixelated so they stay sharp
- Falls back to the normal icon if an image can't be loaded
- Works with GitHub's dynamic navigation, no page reload needed
- No extra permissions, it only runs on `github.com`

## Instalation
You can download this extension from chromewebstore.google.com

Search for `GitHub Image Visualizer`

## Manual Installation

1. Clone or download this repository:
   ```bash
   git clone https://github.com/d4nilpzz/github-image-visualizer.git
   ```
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and select the project folder.

## Usage

Open any GitHub repository and browse its folders. Image files will show a preview thumbnail next to their name.

## Notes

Images are loaded from `raw.githubusercontent.com`, so thumbnails in private repositories may not show up. In that case the default file icon is kept.
