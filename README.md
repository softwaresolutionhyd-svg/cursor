# Zam Zam Pizza & Cafe Online Menu

Mobile-friendly online menu for **Zam Zam Pizza & Cafe**. Customers can scan a
QR code and view the restaurant menu on their phone.

## Files

- `index.html` - main restaurant menu page
- `styles.css` - responsive styling for mobile and desktop
- `qr.html` - printable QR page that points to the hosted menu URL
- `admin.html` - browser-based admin panel for editing menu data
- `menu-data.js` - editable restaurant details, categories, items, and prices
- `app.js` / `admin.js` - page rendering and admin editing behavior

## How to use

1. Update `menu-data.js` with the real phone number, address, items, and prices.
2. Host the site with GitHub Pages, Netlify, Vercel, or any static hosting.
3. Open `qr.html` on the hosted website.
4. Click **Print QR** and place the QR code on tables, flyers, or packaging.

The QR page automatically uses the live hosted URL, so the printed QR opens the
online `index.html` menu.

## Admin panel

Open `admin.html` to edit restaurant details, categories, menu items, and
prices. The admin panel is locked with default PIN `1234` (change `ADMIN_PIN` in
`admin.js` if you want a different PIN). Edits auto-save while you type, so
`index.html` shows the updated menu on the same device/browser.

Because this is a static website, browser edits do not automatically update the
public hosted menu for every customer. To publish edited data permanently:

1. Open `admin.html`.
2. Enter the admin PIN.
3. Make changes; they auto-save in the browser.
4. Click **Download menu-data.js**.
5. Replace the existing `menu-data.js` file in the repository/hosting with the
   downloaded file.
