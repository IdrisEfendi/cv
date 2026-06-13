# Portfolio CV — John Doe

Personal portfolio and CV website for recruiters, clients, and business partners.

## Features

- Modern, minimal, dark-first design with light mode toggle
- Fully responsive (mobile-first)
- Smooth scroll, AOS animations, glassmorphism cards
- Portfolio filter by category (Web, Backend, Automation, AI, Personal)
- Counter animation on scroll
- Auto-sliding testimonials carousel
- Loading screen
- SEO meta tags (Open Graph)
- No build process — runs by opening `index.html`

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | Tailwind CSS (CDN) |
| Icons | Font Awesome 6 (CDN) |
| Animation | AOS (Animate On Scroll) |
| Logic | Vanilla JavaScript |

## Project Structure

```
cv/
├── index.html
├── assets/
│   ├── images/
│   ├── cv/
│   └── projects/
├── css/
│   └── custom.css
└── js/
    └── app.js
```

## Getting Started

1. Clone or download this repository
2. Add your images to `assets/images/`, `assets/projects/`, and `assets/cv/cv.pdf`
3. Open `index.html` in a browser

No `npm install`, no build step required.

## Customization

- **Colors** — Edit `tailwind.config` inside `<script>` tag in `index.html`
- **Content** — Edit text, links, and data directly in `index.html`
- **Styles** — Add overrides in `css/custom.css`
- **Scripts** — Modify interactions in `js/app.js`

## Sections

1. Hero
2. About Me
3. Skills (6 categories with animated progress bars)
4. Experience Timeline
5. Portfolio (filterable grid)
6. Statistics (counter animation)
7. Certificates
8. Testimonials (auto-slider)
9. Contact Form
10. Footer

## License

MIT
