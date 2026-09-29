/*
 * Booking page: venue → racket → date & time → details.
 * Link straight into it with ?venue=<id> and/or ?racket=<id> (used by QR codes
 * and the "Book" buttons on the landing page).
 */
(function () {
  const DR = window.DR;
  const $ = (sel) => document.querySelector(sel);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const STORE_KEY = "dr-bookings";

  const state = { venue: null, racket: null, date: null, time: null };
  const params = new URLSearchParams(location.search);
  let wantedRacket = params.get("racket");

  $("#year").textContent = new Date().getFullYear();
  document.querySelectorAll("[data-price]").forEach((el) => (el.textContent = DR.priceText()));
  $("#sum-price").textContent = DR.priceText();
  if (DR.paymentLink) $("#pay-note").textContent = "You'll be able to pay online once your booking is confirmed. Please let us know if you can no longer make it.";

  // ---------- helpers ----------
  const pad = (n) => String(n).padStart(2, "0");
  const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fromIso = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const fmtLong = (s) => fromIso(s).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  const endTime = (t) => {
    const [h, m] = t.split(":").map(Number);
    const total = h * 60 + m + DR.booking.slotMinutes;
    return `${pad(Math.floor(total / 60) % 24)}:${pad(total % 60)}`;
  };
  const visual = (r) => (r.image ? `<img src="${esc(r.image)}" alt="">` : DR.racketSVG(r));

  function loadBookings() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch (e) { return []; }
  }
  function saveBooking(b) {
    try {
      const all = loadBookings();
      all.push(b);
      localStorage.setItem(STORE_KEY, JSON.stringify(all));
    } catch (e) { /* storage unavailable: booking still sent to endpoint if configured */ }
  }
  const isTaken = (venue, racket, date, time) =>
    loadBookings().some((b) => b.venue === venue && b.racket === racket && b.date === date && b.time === time);

  // ---------- step 1: venue ----------
  function renderVenues() {
    $("#venue-options").innerHTML = DR.venues
      .map((v) => {
        const hasWanted = wantedRacket && v.rackets.includes(wantedRacket);
        return `<button type="button" class="opt" data-id="${esc(v.id)}" aria-pressed="${state.venue === v.id}">
          <strong>${esc(v.name)}</strong>
          <small>${esc(v.area)} · ${v.rackets.length} racket${v.rackets.length === 1 ? "" : "s"}</small>
          ${hasWanted ? `<small style="color:var(--green-700);font-weight:700">✓ Has your chosen racket</small>` : ""}
        </button>`;
      })
      .join("");
  }
  $("#venue-options").addEventListener("click", (e) => {
    const b = e.target.closest(".opt");
    if (!b) return;
    selectVenue(b.dataset.id);
  });
  function selectVenue(id) {
    if (!DR.venueById(id)) return;
    state.venue = id;
    const v = DR.venueById(id);
    // Keep the chosen racket if this venue has it; otherwise clear it.
    const keep = state.racket || wantedRacket;
    state.racket = keep && v.rackets.includes(keep) ? keep : null;
    state.time = null;
    renderVenues();
    renderRackets();
    renderTime();
    update();
  }

  // ---------- step 2: racket ----------
  function renderRackets() {
    const v = DR.venueById(state.venue);
    if (!v) { $("#racket-options").innerHTML = ""; return; }
    const list = v.rackets.map(DR.racketById).filter(Boolean);
    $("#racket-options").innerHTML = list
      .map(
        (r) => `<button type="button" class="opt" data-id="${esc(r.id)}" aria-pressed="${state.racket === r.id}">
          <div class="mini">${visual(r)}</div>
          <small style="margin:0;letter-spacing:.2em;text-transform:uppercase;font-size:10px;font-weight:700;color:var(--gold-dark)">${esc(r.brand)}</small>
          <strong>${esc(r.model)}</strong>
          <small>${esc(r.category)} · ${esc(r.specs.weight)}</small>
        </button>`
      )
      .join("");
    const hint = $("#racket-hint");
    if (wantedRacket && !v.rackets.includes(wantedRacket) && DR.racketById(wantedRacket)) {
      const r = DR.racketById(wantedRacket);
      const elsewhere = DR.venues.filter((x) => x.rackets.includes(wantedRacket)).map((x) => x.name);
      hint.textContent = `The ${r.brand} ${r.model} isn't kept at ${v.name}.` + (elsewhere.length ? ` Find it at: ${elsewhere.join(", ")}.` : "");
      hint.hidden = false;
    } else {
      hint.hidden = true;
    }
  }
  $("#racket-options").addEventListener("click", (e) => {
    const b = e.target.closest(".opt");
    if (!b) return;
    state.racket = b.dataset.id;
    wantedRacket = state.racket;
    state.time = null;
    renderRackets();
    renderTime();
    update();
  });

  // ---------- step 3: date & time ----------
  const dates = [];
  (function buildDates() {
    const today = new Date();
    for (let i = 0; i < DR.booking.daysAhead; i++) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      dates.push(isoDate(d));
    }
    state.date = dates[0];
  })();

  function renderTime() {
    $("#date-options").innerHTML = dates
      .map((iso, i) => {
        const d = fromIso(iso);
        const label = i === 0 ? "Today" : d.toLocaleDateString("en-GB", { weekday: "short" });
        return `<button type="button" class="date" data-date="${iso}" aria-pressed="${state.date === iso}" aria-label="${fmtLong(iso)}">
          <span>${label}</span><strong>${d.getDate()}</strong><span>${d.toLocaleDateString("en-GB", { month: "short" })}</span>
        </button>`;
      })
      .join("");

    const v = DR.venueById(state.venue);
    if (!v || !state.racket) { $("#slot-options").innerHTML = ""; $("#slot-hint").textContent = ""; return; }
    const slots = v.slots || DR.booking.defaultSlots;
    const now = new Date();
    const isToday = state.date === isoDate(now);
    const nowMins = now.getHours() * 60 + now.getMinutes();
    let free = 0;
    $("#slot-options").innerHTML = slots
      .map((t) => {
        const [h, m] = t.split(":").map(Number);
        const past = isToday && h * 60 + m <= nowMins;
        const taken = isTaken(state.venue, state.racket, state.date, t);
        const off = past || taken;
        if (!off) free++;
        return `<button type="button" class="slot" data-time="${t}" aria-pressed="${state.time === t}" ${off ? "disabled" : ""}>
          ${t}<small>${taken ? "Booked" : past ? "Passed" : "until " + endTime(t)}</small>
        </button>`;
      })
      .join("");
    $("#slot-hint").textContent = free
      ? `${DR.booking.slotMinutes}-minute sessions. Collect the racket from the club desk at the start of your slot.`
      : "No slots left on this day — try another date.";
  }
  $("#date-options").addEventListener("click", (e) => {
    const b = e.target.closest(".date");
    if (!b) return;
    state.date = b.dataset.date;
    state.time = null;
    renderTime();
    update();
  });
  $("#slot-options").addEventListener("click", (e) => {
    const b = e.target.closest(".slot");
    if (!b || b.disabled) return;
    state.time = b.dataset.time;
    renderTime();
    update();
  });

  // ---------- summary / progress ----------
  function setSum(id, text) {
    const el = $(id);
    el.textContent = text || "Not selected";
    el.classList.toggle("empty", !text);
  }
  function update() {
    const v = DR.venueById(state.venue);
    const r = DR.racketById(state.racket);
    setSum("#sum-venue", v && v.name);
    setSum("#sum-racket", r && `${r.brand} ${r.model}`);
    setSum("#sum-date", v && r && state.date ? fmtLong(state.date) : "");
    setSum("#sum-time", state.time ? `${state.time} – ${endTime(state.time)}` : "");

    $("#step-racket").classList.toggle("locked", !v);
    $("#step-time").classList.toggle("locked", !r);
    $("#step-details").classList.toggle("locked", !state.time);
    $("#submit-btn").disabled = !(v && r && state.time);

    const done = [v, r, state.time, v && r && state.time].map(Boolean);
    document.querySelectorAll(".progress span").forEach((s, i) => s.classList.toggle("done", done[i]));
  }

  // ---------- submit ----------
  const form = $("#step-details");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const err = $("#form-error");
    err.hidden = true;
    if (!form.checkValidity()) {
      err.textContent = "Please add your name, mobile and a valid email, and tick the box to continue.";
      err.hidden = false;
      form.reportValidity();
      return;
    }
    if (isTaken(state.venue, state.racket, state.date, state.time)) {
      err.textContent = "Sorry — that slot has just been taken. Please pick another time.";
      err.hidden = false;
      state.time = null;
      renderTime();
      update();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    const v = DR.venueById(state.venue);
    const r = DR.racketById(state.racket);
    const booking = {
      ref: "DR-" + Math.random().toString(36).slice(2, 7).toUpperCase(),
      venue: v.id, venueName: v.name,
      racket: r.id, racketName: `${r.brand} ${r.model}`,
      date: state.date, time: state.time, ends: endTime(state.time),
      name: data.name, email: data.email, phone: data.phone,
      price: DR.price, priceText: DR.priceText(),
      level: data.level, current: data.current || "", notes: data.notes || "",
      createdAt: new Date().toISOString(),
    };

    const btn = $("#submit-btn");
    btn.disabled = true;
    btn.textContent = "Confirming…";

    if (DR.bookingEndpoint) {
      try {
        const res = await fetch(DR.bookingEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ...booking, _subject: `Demo booking ${booking.ref}: ${booking.racketName} @ ${booking.venueName}` }),
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
      } catch (e2) {
        err.textContent = `We couldn't send your booking just now. Please try again, or email ${DR.business.email}.`;
        err.hidden = false;
        btn.disabled = false;
        btn.textContent = "Confirm booking";
        return;
      }
    }

    saveBooking(booking);
    showConfirmation(booking);
  });

  function showConfirmation(b) {
    $("#booking-shell").innerHTML = `
      <div class="panel confirm" style="grid-column:1/-1">
        <div class="seal">✓</div>
        <span class="eyebrow">Booking confirmed</span>
        <h2>See you on court, ${esc(b.name.split(" ")[0])}.</h2>
        <p>Your demo racket will be waiting at the club desk. Quote this reference when you collect it.</p>
        <div class="ref">${esc(b.ref)}</div>
        <ul class="spec-list confirm-details">
          <li><span>Venue</span><span>${esc(b.venueName)}</span></li>
          <li><span>Racket</span><span>${esc(b.racketName)}</span></li>
          <li><span>Date</span><span>${esc(fmtLong(b.date))}</span></li>
          <li><span>Time</span><span>${esc(b.time)} – ${esc(b.ends)}</span></li>
          <li><span>Demo fee</span><span>${esc(b.priceText)}</span></li>
        </ul>
        ${DR.paymentLink
          ? `<div class="confirm-actions" style="margin-bottom:16px"><a class="btn btn-gold" href="${esc(DR.paymentLink)}" target="_blank" rel="noopener">Pay ${esc(b.priceText)} now</a></div>`
          : `<div class="pay-box"><strong>Payment:</strong> please pay the ${esc(b.priceText)} demo fee at the club desk when you collect your racket.</div>`}
        <div class="confirm-actions">
          <a class="btn btn-green" href="book.html?venue=${encodeURIComponent(b.venue)}">Book another</a>
          <a class="btn btn-ghost" href="index.html#collection">Browse rackets</a>
        </div>
      </div>`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ---------- init from URL (QR codes / links) ----------
  renderVenues();
  const qVenue = params.get("venue");
  if (qVenue && DR.venueById(qVenue)) {
    selectVenue(qVenue);
    $("#hero-sub").textContent = `Booking at ${DR.venueById(qVenue).name}. Choose your racket and time — ${DR.priceText()} per session.`;
  } else if (DR.venues.length === 1) {
    selectVenue(DR.venues[0].id);
  } else {
    renderTime();
    update();
  }
})();
