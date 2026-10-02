# YouTube Thumbnail Downloader

A free, client-side web app to download high-quality YouTube video thumbnails in seconds — no sign-up, no backend, everything runs in your browser.

## Features

- Download YouTube thumbnails in all available resolutions (maxresdefault 1920×1080, sddefault, hqdefault, mqdefault, default)
- Paste any YouTube video URL or video ID — thumbnails resolve instantly
- One-click download of the selected resolution
- Preview panel with resolution picker
- Responsive, mobile-friendly UI
- 100% client-side — no servers, no tracking, no accounts

## Tech stack

- Plain HTML5 / CSS3 / JavaScript (single self-contained page, no build step)
- Fetches thumbnails directly from YouTube's public thumbnail CDN (`i.ytimg.com`)

## Quick start

Just open `index.html` in any modern browser — that's it. Or use the live demo below.

Alternatively, serve the folder with any static server:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Project structure

```
.
├── index.html                                # The complete app (styles + logic, self-contained)
├── "YouTube Thumbnail Downloader Web App.html" # Original standalone copy
├── youtube-thumbnail-downloader.tsx           # React/TSX reference version
└── LICENSE
```

## How it works

The app extracts the 11-character video ID from any YouTube URL, then builds thumbnail URLs against `https://i.ytimg.com/vi/<VIDEO_ID>/<QUALITY>.jpg` and lets the browser download the image — no API key needed.

## Deploy

Deployed via GitHub Pages from the `main` branch.

## License

See `LICENSE`.

---

Built by Girish Lade — https://ladestack.in
