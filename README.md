# Muhammad Musab — Portfolio

A single, offline personal portfolio site with **7 switchable premium themes**
(Royal Blue, Emerald Green, Purple Luxury, Ocean Cyan, Crimson Red, Golden
Premium, Modern Monochrome), each with its own Light and Dark mode.

## How to use

1. Unzip the folder.
2. Double-click `index.html` — it opens directly in your browser, no server
   or internet connection required.
3. Use the floating palette icon (top-right) to switch between the 7 themes
   and toggle light/dark mode. Your choice is saved in the browser's local
   storage, so it's remembered next time you open the file.
4. The floating WhatsApp button (bottom-right) opens a chat with
   +92 334 1686292.

## Structure

```
index.html
assets/
  css/style.css      – layout, components, animations
  css/themes.css      – the 7 theme × light/dark color palettes
  js/main.js          – theme switching, nav, scroll reveal, counters
  images/             – favicon + social preview image (SVG, no external assets)
  resume/             – downloadable resume PDF
```

## Notes

- Built only with HTML5, CSS3 and vanilla JavaScript — no frameworks,
  build tools, or CDN dependencies.
- The hero uses a monogram avatar (no photo was included in the source CV).
  Drop a real photo into `assets/images/` and swap the `<svg class="avatar-monogram">`
  block in `index.html` for an `<img>` tag if you'd like to use one later.
- LinkedIn icon is shown without a link since that profile isn't live yet —
  update the `social-icon--disabled` element in `index.html` once it is.
