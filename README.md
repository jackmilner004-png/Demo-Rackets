# Demo Rackets — Leeds

Website for Demo Rackets: premium tennis rackets placed at clubs across Leeds,
booked online for demo sessions.

A static site — plain HTML, CSS and JavaScript, no build step. Host it anywhere
(GitHub Pages, Netlify, any web host).

## Pages

| Page        | Purpose |
|-------------|---------|
| `index.html`| Landing page: hero, how it works, racket collection (click a racket for details), gallery, partner clubs. |
| `book.html` | The single booking page: **venue → racket → date & time → details**. This is the page QR codes point to. |
| `qr.html`   | Printable QR codes — one general code plus one per club (pre-selects that venue). |

### Deep links (for QR codes and buttons)

- `book.html` — general booking
- `book.html?venue=roundhay` — venue pre-selected
- `book.html?racket=babolat-pure-aero` — racket pre-selected once a club that has it is chosen
- `book.html?venue=roundhay&racket=head-speed-mp` — both

## Editing content

Everything — rackets, specs, clubs, which rackets are at which club, time slots,
session length, contact email — lives in **`assets/js/data.js`**.

Photos: see `assets/photos/README.md` for file names and image rights.

## Pricing & payment

Demos cost **£5.99 per 90-minute session**, set by `price` in `assets/js/data.js`
(every price shown on the site comes from it).

By default customers are told to pay at the club desk when they collect the
racket. To take payment online, create a payment link (Stripe Payment Links,
SumUp or PayPal) for £5.99 and paste it into `paymentLink` — the confirmation
screen then shows a "Pay £5.99 now" button.

## Receiving bookings

Out of the box the site runs in **demo mode**: bookings are confirmed on screen and
remembered in that visitor's browser only (so a slot shows as "Booked" on that
device, but you won't be notified).

To receive every booking by email, create a free form at a service such as
[Formspree](https://formspree.io), then set `bookingEndpoint` in `assets/js/data.js`
to its URL. For real shared availability (slots disappearing for everyone once
booked), the booking page needs a small backend or a booking service — the data
format sent is already structured for that.

## Brand

- **Greens:** `#06231A` · `#0B3B2A` · `#006039` · `#1F7A50`
- **Champagne gold:** `#C6A15B` · `#E3CD9A` · `#9C7A3C`
- **Lawn cream / ivory:** `#F4EEDF` · `#FBF8F1`
- **Accents:** ball yellow `#D8E26A`, championship purple `#4B2A6E`
- **Type:** Cormorant Garamond (headings), Manrope (text)
- **Logo:** `assets/img/logo.svg` — laurel emblem with racket and ball.

## Local preview

```sh
python3 -m http.server 8000
# open http://localhost:8000
```
