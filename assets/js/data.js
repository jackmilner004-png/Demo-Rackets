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

  booking: {
    // How far ahead people can book, in days.
    daysAhead: 14,
    // Length of one demo session, in minutes.
    slotMinutes: 90,
    // Slot start times offered at every venue unless the venue overrides them.
    defaultSlots: ["08:00", "09:30", "11:00", "12:30", "14:00", "15:30", "17:00", "18:30", "20:00"],
  },

  /*
   * Rackets. `frame` / `accent` colour the illustration used when there is no
   * photo. Add `image: "assets/photos/rackets/pro-staff-97.jpg"` to use a photo.
   */
  rackets: [
    {
      id: "wilson-pro-staff-97",
      brand: "Wilson",
      model: "Pro Staff 97 v14",
      category: "Control",
      frame: "#1B1B1B", accent: "#8A1C2B",
      specs: { head: "97 sq in", weight: "315 g", balance: "31 cm", pattern: "16×19" },
      blurb: "Classic feel and pinpoint precision. A thin, solid beam for players who build points with clean, full strokes.",
      level: "Advanced",
    },
    {
      id: "babolat-pure-aero",
      brand: "Babolat",
      model: "Pure Aero 98",
      category: "Spin",
      frame: "#F2C500", accent: "#1C1C1C",
      specs: { head: "98 sq in", weight: "305 g", balance: "32 cm", pattern: "16×20" },
      blurb: "Built for heavy topspin from the baseline. Fast through the air with a lively, forgiving response.",
      level: "Intermediate – Advanced",
    },
    {
      id: "head-speed-mp",
      brand: "Head",
      model: "Speed MP",
      category: "All-court",
      frame: "#F4F4F4", accent: "#101010",
      specs: { head: "100 sq in", weight: "300 g", balance: "32 cm", pattern: "16×19" },
      blurb: "A modern all-rounder. Stable, quick to swing and comfortable from every part of the court.",
      level: "Intermediate – Advanced",
    },
    {
      id: "yonex-ezone-100",
      brand: "Yonex",
      model: "EZONE 100",
      category: "Power & comfort",
      frame: "#1F4FB8", accent: "#7FC8F8",
      specs: { head: "100 sq in", weight: "300 g", balance: "32 cm", pattern: "16×19" },
      blurb: "Easy depth and a plush, arm-friendly feel. Generous sweet spot for confident hitting.",
      level: "All levels",
    },
    {
      id: "wilson-blade-98",
      brand: "Wilson",
      model: "Blade 98 v9",
      category: "Feel",
      frame: "#2E7D5B", accent: "#C79B61",
      specs: { head: "98 sq in", weight: "305 g", balance: "32 cm", pattern: "16×19" },
      blurb: "Flexible and connected. Exceptional touch at the net with the control to go after your shots.",
      level: "Intermediate – Advanced",
    },
    {
      id: "babolat-pure-drive",
      brand: "Babolat",
      model: "Pure Drive",
      category: "Power",
      frame: "#1560BD", accent: "#FFFFFF",
      specs: { head: "100 sq in", weight: "300 g", balance: "32 cm", pattern: "16×19" },
      blurb: "Effortless power and plenty of spin. One of the most popular frames on tour and at the club.",
      level: "All levels",
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
      rackets: ["wilson-pro-staff-97", "babolat-pure-aero", "head-speed-mp", "yonex-ezone-100", "wilson-blade-98", "babolat-pure-drive"],
    },
    {
      id: "headingley",
      name: "Headingley Tennis Centre",
      area: "Headingley, LS6",
      rackets: ["wilson-pro-staff-97", "babolat-pure-aero", "yonex-ezone-100", "babolat-pure-drive"],
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
      rackets: ["babolat-pure-aero", "head-speed-mp", "yonex-ezone-100", "wilson-blade-98"],
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

window.DR.racketById = function (id) {
  return window.DR.rackets.find(r => r.id === id);
};
window.DR.venueById = function (id) {
  return window.DR.venues.find(v => v.id === id);
};
