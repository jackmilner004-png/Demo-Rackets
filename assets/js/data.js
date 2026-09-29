/*
 * Demo Rackets — site data.
 * Edit this file to change the rackets, venues and booking times.
 * Everything on the landing page and booking page is generated from here.
 */
window.DR = {
  business: {
    name: "Demo Rackets",
    city: "Leeds",
    email: "hello@demorackets.co.uk",
    phone: "",
    instagram: "",
  },

  /*
   * Optional: where booking requests are sent.
   * Leave empty to keep bookings in the visitor's browser only (demo mode).
   * Set to a form service URL that accepts JSON POSTs (e.g. a Formspree
   * form: "https://formspree.io/f/xxxxxxx") to receive every booking by email.
   */
  bookingEndpoint: "",

  /*
   * Price per demo session, in pounds.
   * `paymentLink` (optional): a Stripe / SumUp / PayPal payment link. When set,
   * the confirmation screen shows a "Pay now" button that opens it. When empty,
   * customers are told to pay at the club desk when they collect the racket.
   */
  price: 5.99,
  paymentLink: "",

  booking: {
    // How far ahead people can book, in days.
    daysAhead: 14,
    // Session lengths customers can choose from, in minutes (same price for each).
    durations: [60, 90, 120],
    // Length that is pre-selected on the booking page.
    defaultDuration: 90,
    // Slot start times offered at every venue unless the venue overrides them.
    defaultSlots: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"],
  },

  /*
   * Rackets. `frame` / `accent` colour the illustration used when there is no
   * photo. `image` is a cut-out racket photo with a transparent background (.webp or .png).
   */
  rackets: [
    {
      id: "babolat-pure-aero",
      brand: "Babolat",
      model: "Pure Aero",
      category: "Spin",
      frame: "#5A5F63", accent: "#E4F222",
      image: "assets/photos/rackets/babolat-pure-aero.webp",
      specs: { head: "100 sq in", weight: "300 g", balance: "32 cm", pattern: "16×19" },
      blurb: "Built for heavy topspin from the baseline. Fast through the air with a lively, forgiving response.",
      level: "Intermediate – Advanced",
    },
    {
      id: "wilson-blade-98",
      brand: "Wilson",
      model: "Blade 98 v9",
      category: "Feel",
      frame: "#1F6B5C", accent: "#1B1B1B",
      image: "assets/photos/rackets/wilson-blade-98.webp",
      specs: { head: "98 sq in", weight: "305 g", balance: "32 cm", pattern: "16×19" },
      blurb: "Flexible and connected. Exceptional touch at the net with the control to go after your shots.",
      level: "Intermediate – Advanced",
    },
    {
      id: "babolat-pure-drive",
      brand: "Babolat",
      model: "Pure Drive",
      category: "Power",
      frame: "#1E9BD7", accent: "#1C2A3A",
      image: "assets/photos/rackets/babolat-pure-drive.webp",
      specs: { head: "100 sq in", weight: "300 g", balance: "32 cm", pattern: "16×19" },
      blurb: "Effortless power and plenty of spin. One of the most popular frames on tour and at the club.",
      level: "All levels",
    },
    {
      id: "head-speed-mp",
      brand: "Head",
      model: "Speed MP",
      category: "All-court",
      frame: "#F4F4F4", accent: "#3A3A3A",
      image: "assets/photos/rackets/head-speed-mp.webp",
      specs: { head: "100 sq in", weight: "300 g", balance: "32 cm", pattern: "16×19" },
      blurb: "A modern all-rounder. Stable, quick to swing and comfortable from every part of the court.",
      level: "Intermediate – Advanced",
    },
  ],

  /*
   * Venues (the clubs where rackets are placed).
   * `rackets` lists the racket ids kept at that venue.
   * `slots` (optional) overrides the default start times for that venue.
   * The venues below are placeholders — replace them with your partner clubs.
   */
  venues: [
    {
      id: "roundhay",
      name: "Roundhay Lawn Tennis Club",
      area: "Roundhay, LS8",
      rackets: ["babolat-pure-aero", "wilson-blade-98", "babolat-pure-drive", "head-speed-mp"],
    },
    {
      id: "headingley",
      name: "Headingley Tennis Centre",
      area: "Headingley, LS6",
      rackets: ["babolat-pure-aero", "babolat-pure-drive"],
    },
    {
      id: "chapel-allerton",
      name: "Chapel Allerton Racquets",
      area: "Chapel Allerton, LS7",
      rackets: ["head-speed-mp", "wilson-blade-98", "babolat-pure-drive"],
      slots: ["09:00", "10:30", "12:00", "13:30", "17:00", "18:30"],
    },
    {
      id: "city-centre",
      name: "Leeds City Indoor Courts",
      area: "City Centre, LS1",
      rackets: ["babolat-pure-aero", "wilson-blade-98", "head-speed-mp"],
    },
  ],
};

/* Draws a racket illustration as an inline SVG string. */
window.DR.racketSVG = function (r) {
  const f = r.frame, a = r.accent;
  let strings = "";
  for (let x = 58; x <= 142; x += 12) strings += `<line x1="${x}" y1="40" x2="${x}" y2="210"/>`;
  for (let y = 52; y <= 200; y += 12) strings += `<line x1="46" y1="${y}" x2="154" y2="${y}"/>`;
  return `
<svg viewBox="0 0 200 420" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <clipPath id="c-${r.id}"><ellipse cx="100" cy="125" rx="58" ry="88"/></clipPath>
    <linearGradient id="g-${r.id}" x1="0" x2="1"><stop offset="0" stop-color="${f}"/><stop offset=".55" stop-color="${f}"/><stop offset="1" stop-color="${a}"/></linearGradient>
  </defs>
  <g clip-path="url(#c-${r.id})" stroke="rgba(255,255,255,.55)" stroke-width="1.4">${strings}</g>
  <ellipse cx="100" cy="125" rx="62" ry="92" fill="none" stroke="url(#g-${r.id})" stroke-width="11"/>
  <ellipse cx="100" cy="125" rx="62" ry="92" fill="none" stroke="${a}" stroke-width="1.5" stroke-dasharray="40 260" stroke-dashoffset="-120"/>
  <path d="M78 208 Q100 250 100 262 Q100 250 122 208" fill="none" stroke="${f}" stroke-width="10" stroke-linejoin="round"/>
  <rect x="91" y="258" width="18" height="30" fill="${f}"/>
  <rect x="89" y="286" width="22" height="116" rx="6" fill="#1A1A1A"/>
  <g stroke="#3A3A3A" stroke-width="2">${[300, 316, 332, 348, 364, 380].map(y => `<line x1="90" y1="${y}" x2="110" y2="${y + 8}"/>`).join("")}</g>
  <rect x="87" y="398" width="26" height="10" rx="4" fill="${a}"/>
</svg>`;
};

window.DR.priceText = function () {
  return "£" + window.DR.price.toFixed(2);
};

/* "60–120 min", built from the durations above. */
window.DR.durationText = function () {
  const ds = window.DR.booking.durations;
  const lo = Math.min(...ds), hi = Math.max(...ds);
  return lo === hi ? `${lo} min` : `${lo}–${hi} min`;
};

window.DR.racketById = function (id) {
  return window.DR.rackets.find(r => r.id === id);
};
window.DR.venueById = function (id) {
  return window.DR.venues.find(v => v.id === id);
};
