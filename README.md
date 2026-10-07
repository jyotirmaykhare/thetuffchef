# The Tuff Chef Restaurant — website preview

A responsive, multi-page restaurant site built from plain HTML, CSS and JavaScript.

## Pages

- `index.html` — homepage / new Jalandhar opening
- `menu.html` — menu discovery page, ready for confirmed menu data
- `about.html` — Madhya Pradesh origin and Jalandhar expansion
- `experience.html` — restaurant experience
- `gallery.html` — filterable image gallery with lightbox
- `contact.html` — location details and reservation enquiry form

## Update confirmed restaurant details

Edit `site-data.js`. The location, hours, contact links, social URLs and menu are centralized there. Keep fields blank until the restaurant confirms them. The map link is a Google Maps search for the restaurant name and city, not an invented street address.

The menu page intentionally shows no invented menu categories, dishes or prices. To populate it, add confirmed entries to `menuCategories` in `site-data.js`, for example:

```js
menuCategories: [
  {
    name: "Confirmed category",
    items: [
      { name: "Confirmed dish", description: "Approved description", price: "₹000", diet: "Vegetarian" }
    ]
  }
]
```

The homepage signature section is also content-ready. Add only confirmed entries to `signatureDishes`, with `name`, `description`, and an approved local `image` path (optional `imageAlt`). Until then it uses an explicitly labelled illustrative image and no invented dish names.

The reservation form validates the enquiry and opens a prefilled email if `reservationEmail` (or `email`) is added. Until that value is configured, it clearly reports that the form is not connected; it does not pretend to send a reservation.

## Preview locally

From this directory, run:

```bash
python3 -m http.server 5173 --bind 0.0.0.0
```

Then open `http://localhost:5173` in a local browser.

## Images and launch notes

- `assets/images/tuff-chef-logo.jpg` is the logo supplied with the brief.
- The food and dining-room images are illustrative search-sourced stock previews, not confirmed photographs of The Tuff Chef Jalandhar or its menu. The pages label that distinction. Replace them with restaurant-owned or properly licensed location and dish photography before publishing.
- Check source licensing/attribution requirements before production use. Search result sources used for the local preview: [Vecteezy — Indian butter chicken](https://www.vecteezy.com/free-photos/indian-butter-chicken), [Pexels — restaurant interior search](https://www.pexels.com/search/indian%20restaurant%20interior/), [Getty Images — Indian kebab search](https://gettyimages.com/photos/indian-kebab), and [VistaCreate — tandoori search](https://create.vista.com/photos/tandoori/).
- Address, opening hours, telephone, WhatsApp, email and social links were not supplied, so the site uses transparent “coming soon” fallbacks rather than fictional contact information.
# thetuffchef
