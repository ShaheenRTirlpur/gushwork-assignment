# Two For One Twister | Mangalam HDPE Pipes

Static marketing/product demo page for a HDPE pipe and coil supplier.

## Project structure

- `index.html` - page markup and content
- `styles.css` - responsive layout, styling, visibility states, and interactive UI
- `script.js` - JavaScript interaction logic (carousel, zoom, sticky header, accordion, tabs, mobile menu)

## Features

- Hero product detail section with image carousel and thumbnail navigation
- Mouse-over zoom preview for desktop (large screens)
- Swipe + keyboard carousel navigation
- Sticky top bar when page scrolls
- Responsive mobile menu with accessible toggle
- Dropdown navigation at desktop size
- FAQ accordion with keyboard support (Enter/Space), single-open behavior
- Industry cards carousel with touch/swipe and prev/next controls
- Tabbed manufacturing details component
- CTA actions (quote request and catalogue download buttons)

## Setup and run

1. Clone repository

   ```bash
   git clone <YOUR_REPO_URL>
   cd "D:/Gushwork Assignment"
   ```

2. Open `index.html` in browser (double-click or use local server):

   - File system: `index.html`
   - Optional local server (recommended for best behavior):

     ```bash
     npx http-server .
     # or
     python -m http.server 8080
     ```

3. Test interactions:

   - Click carousel arrows and thumbnails
   - Hover on product image for zoom panel
   - Resize screen and open mobile menu
   - Use FAQ accordions and tabs

## Customization

- Update image URLs in `index.html` inside `.carousel__slide` and thumbnail blocks.
- Modify product text and specifications in HTML.
- Adjust or extend CSS variables and breakpoints in `styles.css`.
- Enhance JS functionality in `script.js` (add autoplay, an API endpoint, form submit handlers).

## Accessibility notes

- Keyboard controls supported (carousel left/right, FAQ expand/collapse, tabs with arrow keys)
- `aria` attributes present for menus, expandable controls, and dialog triggers
- Progressive enhancement works without JS (core content still visible)

## Known issues / future improvements

- `Download Catalogue` and `Request a Free Quote` are static links 
- Form submission is not implemented (can add AJAX/`mailto`/backend API)
- Better image loading strategy (lazy loading) for performance
- Additional global error boundary/feature flags in JS

---

Created for the Gushwork Assignment responsive landing page demo.