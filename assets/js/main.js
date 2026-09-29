/* Landing page: renders the racket collection, venues and racket detail modal. */
(function () {
  const DR = window.DR;
  const $ = (sel) => document.querySelector(sel);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const venuesFor = (racketId) => DR.venues.filter((v) => v.rackets.includes(racketId));
  const visual = (r) => (r.image ? `<img src="${esc(r.image)}" alt="${esc(r.brand + " " + r.model)}">` : DR.racketSVG(r));

  // Header turns solid once you scroll past the top of the hero.
  const header = $(".site-header");
  const onScroll = () => header.classList.toggle("solid", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Counts in the hero.
  $('[data-count="rackets"]').textContent = DR.rackets.length;
  $('[data-count="venues"]').textContent = DR.venues.length;
  document.querySelectorAll("[data-duration]").forEach((el) => (el.textContent = DR.durationText()));
  document.querySelectorAll("[data-price]").forEach((el) => (el.textContent = DR.priceText()));
  $("#year").textContent = new Date().getFullYear();
  const email = $("#footer-email");
  email.href = "mailto:" + DR.business.email;
  email.textContent = DR.business.email;

  // Filters
  const categories = ["All", ...new Set(DR.rackets.map((r) => r.category))];
  let activeCat = "All";
  $("#filters").innerHTML = categories
    .map((c) => `<button type="button" class="chip${c === "All" ? " active" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`)
    .join("");
  $("#filters").addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    activeCat = btn.dataset.cat;
    document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c === btn));
    renderRackets();
  });

  function renderRackets() {
    const list = DR.rackets.filter((r) => activeCat === "All" || r.category === activeCat);
    $("#racket-grid").innerHTML = list
      .map((r) => {
        const count = venuesFor(r.id).length;
        return `
      <article class="racket-card" tabindex="0" data-id="${esc(r.id)}" aria-label="${esc(r.brand + " " + r.model)}">
        <div class="racket-visual">
          <span class="racket-tag">${esc(r.category)}</span>
          ${visual(r)}
        </div>
        <div class="racket-body">
          <span class="racket-brand">${esc(r.brand)}</span>
          <h3>${esc(r.model)}</h3>
          <p>${esc(r.blurb)}</p>
          <div class="spec-row">
            <div><strong>${esc(r.specs.head)}</strong>Head</div>
            <div><strong>${esc(r.specs.weight)}</strong>Weight</div>
            <div><strong>${esc(r.specs.balance)}</strong>Balance</div>
            <div><strong>${esc(r.specs.pattern)}</strong>Strings</div>
          </div>
          <div class="racket-foot">
            <small><strong class="price">${DR.priceText()}</strong> / session<br>At ${count} club${count === 1 ? "" : "s"}</small>
            <a class="btn btn-green" href="book.html?racket=${encodeURIComponent(r.id)}" data-book>Book demo</a>
          </div>
        </div>
      </article>`;
      })
      .join("");
  }
  renderRackets();

  // Racket modal
  const modal = $("#racket-modal");
  let lastFocus = null;
  function openModal(id) {
    const r = DR.racketById(id);
    if (!r) return;
    lastFocus = document.activeElement;
    $("#modal-visual").innerHTML = visual(r);
    $("#modal-brand").textContent = r.brand;
    $("#modal-title").textContent = r.model;
    $("#modal-blurb").textContent = r.blurb;
    const specs = [
      ["Demo price", DR.priceText() + " per session (" + DR.durationText() + ")"],
      ["Style", r.category],
      ["Player level", r.level],
      ["Head size", r.specs.head],
      ["Weight (unstrung)", r.specs.weight],
      ["Balance", r.specs.balance],
      ["String pattern", r.specs.pattern],
    ];
    $("#modal-specs").innerHTML = specs.map(([k, v]) => `<li><span>${esc(k)}</span><span>${esc(v)}</span></li>`).join("");
    const vs = venuesFor(r.id);
    $("#modal-venues").innerHTML = vs.length
      ? vs.map((v) => `<span>${esc(v.name)}</span>`).join("")
      : "<span>Coming soon</span>";
    $("#modal-book").href = "book.html?racket=" + encodeURIComponent(r.id);
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    modal.querySelector(".modal-close").focus();
  }
  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  $("#racket-grid").addEventListener("click", (e) => {
    if (e.target.closest("[data-book]")) return; // let the Book link navigate
    const card = e.target.closest(".racket-card");
    if (card) openModal(card.dataset.id);
  });
  $("#racket-grid").addEventListener("keydown", (e) => {
    const card = e.target.closest(".racket-card");
    if (card && e.target === card && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      openModal(card.dataset.id);
    }
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.closest(".modal-close")) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });

  // Venues
  $("#venue-grid").innerHTML = DR.venues
    .map(
      (v) => `
    <div class="venue-card">
      <span class="eyebrow">Partner club</span>
      <h3>${esc(v.name)}</h3>
      <div class="area">${esc(v.area)}</div>
      <div class="count">${v.rackets.length} demo racket${v.rackets.length === 1 ? "" : "s"} on site</div>
      <a class="link" href="book.html?venue=${encodeURIComponent(v.id)}">Book at this club →</a>
    </div>`
    )
    .join("");
})();
