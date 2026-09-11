const merchConfig = window.JUSTIN_SITE?.merch || {};
const shopUrl = String(merchConfig.shopUrl || "").replace(/\/$/, "");
const collection = merchConfig.collection || "all";
const shopLink = document.querySelector("[data-shop-link]");
const shopStatus = document.querySelector("[data-shop-status]");
const productGrid = document.querySelector("[data-product-grid]");

function productImage(product) {
  const image = product.featured_image?.src || product.featuredImage?.url || product.image || product.images?.[0];
  if (typeof image === "string") return image;
  return image?.src || image?.url || image?.transformedUrl || "";
}

function productPrice(product) {
  const price = product.variants?.[0]?.price || product.variants?.[0]?.unitPrice || product.min_price || product.price;
  if (!price) return "View price";
  if (typeof price === "object") {
    const value = price.cents !== undefined ? Number(price.cents) / 100 : price.value ?? price.amount;
    const currency = price.currency_iso || price.currency || "NZD";
    if (value !== undefined) return new Intl.NumberFormat("en-NZ", { style: "currency", currency }).format(Number(value));
  }
  if (typeof price === "number") return new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(price);
  return String(price).match(/[$£€]/) ? String(price) : `NZ$${price}`;
}

function productHref(product) {
  if (product.url?.startsWith("http")) return product.url;
  const slug = product.handle || product.slug;
  return slug ? `${shopUrl}/products/${slug}` : shopUrl;
}

async function loadMerch() {
  if (!shopUrl || !shopLink || !shopStatus || !productGrid) return;
  shopLink.href = shopUrl;
  shopLink.target = "_blank";
  shopLink.rel = "noopener";
  shopLink.textContent = "Open the shop ↗";
  shopLink.classList.remove("is-disabled");
  shopLink.removeAttribute("aria-disabled");
  shopStatus.textContent = "Loading the current Fourthwall collection…";

  try {
    const response = await fetch(`${shopUrl}/collections/${collection}.json`);
    if (!response.ok) throw new Error(`Fourthwall returned ${response.status}`);
    const data = await response.json();
    const products = data.products || data.results || (Array.isArray(data) ? data : []);
    if (!products.length) {
      shopStatus.textContent = "The Fourthwall shop is connected. The collection is currently empty.";
      return;
    }
    shopStatus.textContent = `${products.length} ${products.length === 1 ? "piece" : "pieces"} currently available.`;
    productGrid.innerHTML = products.map((product) => {
      const image = productImage(product);
      const imageMarkup = image ? `<img src="${image}" alt="" loading="lazy" />` : `<div class="product-no-image">Image on Fourthwall</div>`;
      return `<a class="product-card" href="${productHref(product)}" target="_blank" rel="noopener">${imageMarkup}<span><b>${product.title || product.name || "View product"}</b><small>${productPrice(product)}</small></span><i aria-hidden="true">↗</i></a>`;
    }).join("");
  } catch (error) {
    console.warn(error);
    shopStatus.textContent = "The shop is connected, but products couldn’t load here. You can still open Fourthwall directly.";
  }
}

loadMerch();
