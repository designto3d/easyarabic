# Easy Arabic website — setup guide

The site has a **light and dark mode**. Visitors switch with the sun/moon button in the top bar; it starts in dark mode, and their choice is remembered. Dark colours live in `css/style.css`, light colours in `css/theme-light.css`.

Everything you need to change is in **`js/config.js`**. Open it in Notepad and edit the text between the quotes.

1. **Contact:** add your WhatsApp number (digits only, e.g. `923001234567`) and/or email. Booking requests and book orders are sent there.
2. **Videos:** paste your YouTube playlist ID into `youtubePlaylistId`, **or** paste each video's ID into `id` (the part after `v=` in the YouTube link). Rename the 16 lesson titles to match your videos.
3. **Book preview:** export the preview pages of the book (currently the first 10) as images, put them in `assets/book/`, and list them in `previewPages`. Until then, the site shows sample layout pages.
4. **Buying the book:** add a link (Amazon, Gumroad, etc.) to `buyPrintUrl` / `buyDigitalUrl`, plus prices if you want them shown. With no link, the buttons send an order message to your WhatsApp or email.
5. **Prices and social links:** optional. Leave them blank to hide them.
6. **Your photo:** put it at `assets/abdullah.jpg` and replace the `AMK` placeholder in `index.html` (search for "Replace with a photo").

## Publishing
The site is plain HTML, CSS and JS, so there's nothing to build. Upload the whole folder to any static host, for example Netlify (drag and drop), GitHub Pages (Settings → Pages → Deploy from branch → main), Vercel or cPanel hosting.
