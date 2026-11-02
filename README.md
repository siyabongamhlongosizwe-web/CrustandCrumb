# Crust & Crumb Artisan Bakery

**Module:** WEDO5020 | **Student:** Siyabonga Mhlongo
**Current version:** Part 3 - Adding Functionality and SEO

A three-page website for a family-owned artisan bakery in Cape Town: Home, About & Products, and Enquiries.

## Project Structure

```
crust-and-crumb-website/
├── index.html          Home page
├── about.html          About & Products page
├── contact.html        Enquiries page (form + map)
├── style.css           Shared base styles
├── script.js           NEW (Part 3) - all JavaScript
├── robots.txt          NEW (Part 3) - search engine rules
├── sitemap.xml         NEW (Part 3) - page list for search engines
└── styles/
    ├── index.css
    ├── about.css
    ├── contact.css
    └── animations.css  NEW (Part 3) - animations and interactive component styles
```

## Changes from Part 2 to Part 3

### 1. JavaScript and animations (`script.js`, `styles/animations.css`)

| Feature | Pages | Description |
|---|---|---|
| Scroll-reveal | All | Sections, cards and headings fade and slide in with staggered timing as they enter the viewport (IntersectionObserver). |
| Scroll progress bar | All | Gold bar at the top of the page shows how far the visitor has scrolled. |
| Sticky header shadow | All | Header gains a shadow once the page is scrolled. |
| Back-to-top button | All | Appears after scrolling down and smoothly returns to the top. |
| Mobile menu improvements | All | Menu closes when a link is clicked or Escape is pressed. |
| Page-header entrance | All | Hero and page-header text fades up in sequence on load. |
| Button ripple and hover lift | All | Click ripple effect and a slight lift on hover. |
| Animated hero loaf | Home | SVG loaf floats, gold scoring lines draw themselves, air pockets pulse, and the loaf tilts in 3D following the mouse. |
| Animated counters | Home | "15+" and "100%" hero stats count up when visible. |
| Live open/closed badge | Home | Shows "Open now" or "Closed" using South African time and the bakery hours (Tue-Sun, 7 am-3 pm; closed Mondays). |
| Product category filter | About | Filter buttons (All, Sourdough, Pastries, Custom Cakes, Catering) show or hide product groups with a pop-in animation. |
| Card hover effects | Home, About | Cards lift and product icons scale and rotate on hover. |
| Reduced-motion support | All | All animations are disabled for visitors who have `prefers-reduced-motion` enabled. |

### 2. Functional forms with client-side validation (`contact.html`, `script.js`)

- Added `novalidate` and an `id` to the form so validation is handled by JavaScript with custom messages.
- **Full name:** letters only, minimum 2 characters.
- **Email:** must match a valid email format.
- **Phone (optional):** must be a valid South African number (e.g. 021 555 1234, 082 123 4567, +27...).
- **Enquiry type:** must be selected.
- **Date needed:** cannot be in the past; becomes required for Custom Cake and Catering enquiries.
- **Message:** 10 to 1000 characters, with a live character counter.
- Errors appear inline under each field, are announced to screen readers (`role="alert"`, `aria-invalid`, `aria-describedby`), and clear as the user corrects them.
- Valid fields get a green border, invalid fields a red border.
- Submitting an invalid form shakes the form and moves focus to the first error.
- Submitting a valid form shows a "Sending..." state, then an animated success message with a "Send another enquiry" option.
- *Note:* the form is front-end only. No server or email service receives the data.

### 3. External service integration - Google Maps (`index.html`, `contact.html`)

- **Contact page:** replaced the generic "Cape Town City Centre" embed with a map pinned to the bakery address (45 Main Road, Cape Town, 8001), plus a **Get Directions** button.
- **Home page:** added a new "Visit our Cape Town bakery" section with the same map and Get Directions button.
- **All pages:** the footer "Get directions" link now opens Google Maps directions to the bakery instead of linking to the contact page.
- Maps are lazy-loaded (`loading="lazy"`) and have descriptive `title` attributes.

### 4. SEO optimisation (all HTML pages)

- **Keyword-focused titles and meta descriptions** on every page, using terms such as "artisan bakery Cape Town", "sourdough", "custom cakes" and "catering".
- **Meta tags added:** `keywords`, `robots`, `theme-color`.
- **Open Graph and Twitter Card tags** for better link previews when shared.
- **Structured data (JSON-LD, schema.org `Bakery`)** on the home page with name, address, phone, email, founding year and opening hours.
- **Alt text:** previously decorative SVGs now have `role="img"` and descriptive `aria-label` text (e.g. "Illustration of Butter Croissant"), including the hero and story illustrations.
- **Favicon** added (inline SVG).
- **`robots.txt` and `sitemap.xml`** added.

### 5. Existing files

- `index.html`, `about.html`, `contact.html`: edited as described above; content, layout and structure from Part 2 are unchanged.
- `style.css`, `styles/index.css`, `styles/about.css`, `styles/contact.css`: **not modified**.

## Things to update before going live

- Replace the placeholder address (45 Main Road, Cape Town, 8001) in the map `src` and Get Directions links if the real address differs.
- Replace `https://www.crustandcrumb.co.za` in `sitemap.xml` and `robots.txt` with the real domain.
- Replace the SVG icon placeholders with real product photos (and give each an `alt` attribute).
- Connect the enquiry form to a backend or email service.

## How to run (no Live Server needed)

1. In VS Code choose **File > Open Folder** and select `crust-and-crumb-website`.
2. Press **F5** (or **Run > Start Debugging**). The site opens straight away in Chrome. Choose "Run Website in Edge" from the dropdown in the Run panel if you prefer Edge.
3. Alternative for any browser: press **Ctrl+Shift+B** (Cmd+Shift+B on Mac) to open `index.html` in your default browser.

The launch settings live in the `.vscode` folder and open the pages directly from your files, so no server or extension is required. An internet connection is needed for Google Fonts and Google Maps.

To check the responsive layout, press **F12** in the browser and toggle the device toolbar (**Ctrl+Shift+M**), or simply resize the window.
