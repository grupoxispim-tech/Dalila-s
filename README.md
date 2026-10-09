# Dalila's Cleaning Services

Responsive, single-page website for Dalila's Cleaning Services. The site uses the supplied logo, photos, videos, and locally stored background music.

## Video soundtracks

Each video plays with a quiet jazz instrumental from Mixkit; the original video audio is muted. Tracks (Mixkit tracks 1033, 1112, 24, 39, 40 and 493) are included locally in `musicas/` under the Mixkit Stock Music Free License.

Source: [Mixkit Jazz](https://mixkit.co/free-stock-music/jazz/). See the [Mixkit license](https://mixkit.co/license/#musicFree).

## Run locally

Open `index.html` in a browser. No build step or third-party JavaScript is required. Google Fonts are optional; system fallbacks are included.

## Business contact setup

The quote form validates its required fields but does not pretend to send a request while no delivery method is configured. To enable email handoff, set `contactConfig.email` in `js/script.js` to the real business email. The form then prepares a message in the visitor's default email app. For server-side delivery, connect the form to the business's chosen form provider instead.

Phone, WhatsApp, service area, social links, reviews, and business hours were not present in the supplied project files, so the site does not invent them. Update the contact copy and add those details when the business provides them.