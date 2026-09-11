const menuButton = document.querySelector(".menu-button");
const siteNav = document.querySelector(".site-nav");

function closeMenu() {
  if (!menuButton) return;
  document.body.classList.remove("menu-open");
  menuButton.setAttribute("aria-expanded", "false");
}

if (menuButton && siteNav) {
  menuButton.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
  siteNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
}

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const toolList = document.querySelector("[data-tool-list]");
if (toolList) {
  const tools = window.JUSTIN_SITE?.tools || [];
  toolList.innerHTML = tools.map((tool, index) => {
    const number = String(index + 1).padStart(2, "0");
    const action = tool.url
      ? `<a href="${tool.url}" target="_blank" rel="noopener">Open tool <span aria-hidden="true">↗</span></a>`
      : `<span class="tool-coming">Link coming</span>`;
    return `<article class="tool-row"><span>${number}</span><div><h3>${tool.name}</h3><p>${tool.description}</p></div>${action}</article>`;
  }).join("");
}

document.querySelectorAll("form[data-query-booking-form]").forEach((form) => {
  const typeInputs = [...form.querySelectorAll('input[name="request_type"]')];
  const subject = form.querySelector('input[name="_subject"]');
  const submitButton = form.querySelector('button[type="submit"]');
  const lightingService = form.querySelector('input[name="services"][value="Lighting hire"]');
  const lightingOptions = form.querySelector("[data-lighting-options]");

  function updateLightingOptions() {
    if (!lightingOptions) return;
    const bookingActive = typeInputs.find((input) => input.checked)?.value === "booking";
    const active = bookingActive && Boolean(lightingService?.checked);
    lightingOptions.hidden = !active;
    lightingOptions.querySelectorAll("input, select, textarea").forEach((field) => { field.disabled = !active; });
  }

  function updateFormType() {
    const type = typeInputs.find((input) => input.checked)?.value || "booking";
    form.querySelectorAll("[data-purpose-fields]").forEach((group) => {
      const active = group.dataset.purposeFields === type;
      group.hidden = !active;
      group.querySelectorAll("input, select, textarea").forEach((field) => { field.disabled = !active; });
    });
    if (subject) subject.value = type === "booking" ? "New Justin Creative Project Enquiry" : "New Justin Creative General Query";
    if (submitButton) submitButton.firstChild.textContent = type === "booking" ? "Send project enquiry " : "Send query ";
    updateLightingOptions();
  }

  typeInputs.forEach((input) => input.addEventListener("change", updateFormType));
  lightingService?.addEventListener("change", updateLightingOptions);
  form.addEventListener("reset", () => window.setTimeout(updateFormType, 0));
  updateFormType();

  const params = new URLSearchParams(window.location.search);
  const requestedType = params.get("type");
  const requestedService = params.get("service");
  const requestedPackage = params.get("package");
  if (requestedType) {
    const match = typeInputs.find((input) => input.value === requestedType);
    if (match) { match.checked = true; updateFormType(); }
  }
  if (requestedService) {
    const match = [...form.querySelectorAll('input[name="services"]')].find((input) => input.value === requestedService);
    if (match) { match.checked = true; updateLightingOptions(); }
  }
  if (requestedPackage) {
    const packageSelect = form.querySelector("[data-lighting-package-select]");
    if (packageSelect && [...packageSelect.options].some((option) => option.value === requestedPackage)) packageSelect.value = requestedPackage;
  }
});
