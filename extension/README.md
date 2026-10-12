# ForwardCheck AI — Chrome Extension (Manifest V3)

## Overview
The ForwardCheck AI Chrome Extension enables one-click fact extraction directly from your browser. Highlight any suspicious claim or viral post on a website, open the extension, and immediately transfer it to ForwardCheck AI's TruthGraph verification laboratory.

## Installation Instructions (Developer Mode)
1. Open Google Chrome or any Chromium-based browser (Brave, Edge, etc.).
2. Navigate to `chrome://extensions/`.
3. Enable the **Developer mode** toggle in the top-right corner.
4. Click **Load unpacked**.
5. Select the `extension/` directory inside this repository (`c:\Users\Ajay Narayanan\Desktop\Hackathon-app\extension`).
6. The ForwardCheck AI icon will appear in your browser extension toolbar.

## Features
- **Zero Passive Surveillance**: The extension only accesses the current page when explicitly opened by the user (`activeTab`).
- **One-Click Text Grab**: Automatically reads your currently selected text into the verification box.
- **URL Context Transfer**: Securely hands off the source URL and text to `/investigations/new` via URL parameters for full human-in-the-loop inspection before verification starts.
