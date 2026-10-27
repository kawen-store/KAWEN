const SUPABASE_URL = "https://lirxbicrfbvyscitorod.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_PgkIG5OHYloA2gp_GUJ86g_a9aX0Ww5";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);




const products = [
  {
    id: 1, name: "سماعات لاسلكية Premium",
    category: "electronics", label: "إلكترونيات",
    price: 1299, oldPrice: 1699, rating: 4.8,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2, name: "ساعة ذكية بتصميم عصري",
    category: "accessories", label: "إكسسوارات",
    price: 1899, oldPrice: 2399, rating: 4.7,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3, name: "حذاء رياضي Everyday",
    category: "fashion", label: "أزياء",
    price: 1499, oldPrice: 1999, rating: 4.6,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4, name: "كاميرا فورية للذكريات",
    category: "electronics", label: "إلكترونيات",
    price: 2799, oldPrice: 3299, rating: 4.8,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5, name: "هاتف ذكي بتصميم أنيق",
    category: "phones", label: "هواتف",
    price: 12499, oldPrice: 13999, rating: 4.9,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6, name: "مصباح ديكوري للمنزل",
    category: "home", label: "المنزل",
    price: 799, oldPrice: 999, rating: 4.5,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7, name: "سماعة رأس للألعاب",
    category: "electronics", label: "إلكترونيات",
    price: 2199, oldPrice: 2799, rating: 4.7,
    image: "https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8, name: "نظارة شمسية كلاسيكية",
    category: "accessories", label: "إكسسوارات",
    price: 599, oldPrice: 799, rating: 4.4,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 9, name: "حقيبة يومية عملية",
    category: "fashion", label: "أزياء",
    price: 899, oldPrice: 1199, rating: 4.6,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 10, name: "سماعة ذكية للمنزل",
    category: "electronics", label: "إلكترونيات",
    price: 1599, oldPrice: 1999, rating: 4.5,
    image: "https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 11, name: "كرسي مريح للمكتب",
    category: "home", label: "المنزل",
    price: 3499, oldPrice: 4299, rating: 4.8,
    image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 12, name: "هاتف بتصميم Minimal",
    category: "phones", label: "هواتف",
    price: 8999, oldPrice: 10499, rating: 4.6,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
  }
];



async function loadProductsFromSupabase() {
  const { data, error } = await supabaseClient
    .from("products")
    .select("id, name, category, label, price, old_price, rating, image, description, stock, is_active")
    .eq("is_active", true)
    .order("id", { ascending: true });

  if (error) {
    console.error("تعذر تحميل المنتجات من Supabase:", error.message);
    return;
  }

  if (!Array.isArray(data) || data.length === 0) {
    console.warn("قاعدة البيانات لا تحتوي على منتجات نشطة.");
    return;
  }

  products.splice(
    0,
    products.length,
    ...data.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      label: product.label || product.category,
      price: Number(product.price),
      oldPrice: Number(product.old_price ?? 0),
      rating: Number(product.rating ?? 0),
image: product.image || "",
description: product.description || "",
stock: Number(product.stock ?? 0)
    }))
  );

  renderProducts();
}



const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const productGrid = $("#productGrid");
const searchInput = $("#searchInput");
const resultsInfo = $("#resultsInfo");
const emptyState = $("#emptyState");
const cartDrawer = $("#cartDrawer");
const overlay = $("#overlay");
const toast = $("#toast");

let activeCategory = "all";
let searchTerm = "";
let sortMode = "featured";
let toastTimer;
let showingWishlist = false;


const cart = new Map(
  JSON.parse(localStorage.getItem("kawen-cart") || "[]")
);

const wishlist = new Set(
  JSON.parse(localStorage.getItem("kawen-wishlist") || "[]")
);

function saveCart() {
  localStorage.setItem(
    "kawen-cart",
    JSON.stringify([...cart.entries()])
  );
}

function saveWishlist() {
  localStorage.setItem(
    "kawen-wishlist",
    JSON.stringify([...wishlist])
  );
}



let currentCountry = localStorage.getItem("kawen-country") || "EG";

const countryCurrencies = {
  EG: { currency: "EGP", locale: "ar-EG", rate: 1 },
  SA: { currency: "SAR", locale: "ar-SA", rate: 0.075 },
  AE: { currency: "AED", locale: "ar-AE", rate: 0.0735 },
  KW: { currency: "KWD", locale: "ar-KW", rate: 0.023 },
  QA: { currency: "QAR", locale: "ar-QA", rate: 0.73 },
  BH: { currency: "BHD", locale: "ar-BH", rate: 0.0075 },
  OM: { currency: "OMR", locale: "ar-OM", rate: 0.0077 },
  JO: { currency: "JOD", locale: "ar-JO", rate: 0.0142 },
  PS: { currency: "ILS", locale: "ar-IL", rate: 0.071 },
  IQ: { currency: "IQD", locale: "ar-IQ", rate: 1.31 },
  LB: { currency: "LBP", locale: "ar-LB", rate: 1340 },
  SY: { currency: "SYP", locale: "ar-SY", rate: 250 },
  YE: { currency: "YER", locale: "ar-YE", rate: 13.4 },
  MA: { currency: "MAD", locale: "ar-MA", rate: 0.19 },
  DZ: { currency: "DZD", locale: "ar-DZ", rate: 2.65 },
  TN: { currency: "TND", locale: "ar-TN", rate: 0.061 },
  LY: { currency: "LYD", locale: "ar-LY", rate: 0.14 },
  SD: { currency: "SDG", locale: "ar-SD", rate: 3.2 },
  MR: { currency: "MRU", locale: "ar-MR", rate: 1.35 },
  SO: { currency: "SOS", locale: "ar-SO", rate: 15 },
  DJ: { currency: "DJF", locale: "ar-DJ", rate: 2.7 },
  KM: { currency: "KMF", locale: "ar-KM", rate: 3.1 }
};


let currentLanguage =
  localStorage.getItem("kawen-language") === "en" ? "en" : "ar";


const money = (value) => {
  const settings = countryCurrencies[currentCountry]
    || countryCurrencies.EG;

  const locale = currentLanguage === "en"
    ? "en-US"
    : settings.locale;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: settings.currency,
    maximumFractionDigits: 2
  }).format(value * settings.rate);
};





const discountPercent = (product) =>
  Math.round((1 - product.price / product.oldPrice) * 100);

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function getVisibleProducts() {
  let list = products.filter((product) => {
    const matchesCategory =
      activeCategory === "all" || product.category === activeCategory;

    const matchesSearch =
      `${product.name} ${product.label}`.toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (sortMode === "low") {
    list.sort((a, b) => a.price - b.price);
  } else if (sortMode === "high") {
    list.sort((a, b) => b.price - a.price);
  } else if (sortMode === "discount") {
    list.sort((a, b) =>
      discountPercent(b) - discountPercent(a)
    );
  }

  return list;
}

function renderProducts() {
  const list = showingWishlist
    ? products.filter(product => wishlist.has(product.id))
    : getVisibleProducts();

  productGrid.innerHTML = list.map((product) => {
    const isFavorite = wishlist.has(product.id);

    return `
      <article class="product-card" data-product-id="${product.id}">
        <div class="product-image">
          <img
            src="${product.image}"
            alt="${product.name}"
            loading="lazy"
          >
          <span class="discount">-${discountPercent(product)}%</span>
          <button
            class="wish-btn ${isFavorite ? "selected" : ""}"
            data-wish="${product.id}"
            aria-label="${isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}"
            aria-pressed="${isFavorite}"
          >${isFavorite ? "♥" : "♡"}</button>
        </div>
        <div class="product-details">
          <span class="product-category">${product.label}</span>
          <h3 class="product-name">${product.name}</h3>
          <div class="rating">★ ${product.rating}
            <small> / 5</small>
          </div>
          <div class="price-line">
            <strong class="price">${money(product.price)}</strong>
            <del class="old-price">${money(product.oldPrice)}</del>
          </div>
          <button class="btn btn-yellow add-cart" data-add="${product.id}">
            🛒 أضف إلى السلة
          </button>
        </div>
      </article>
    `;
  }).join("");

  resultsInfo.textContent = `عرض ${list.length} من ${products.length} منتجًا`;

  
  emptyState.hidden = list.length !== 0;
  productGrid.hidden = list.length === 0;

  const emptyTitle = emptyState.querySelector("h3");
  const emptyMessage = emptyState.querySelector("p");

  if (showingWishlist && list.length === 0) {
    emptyTitle.textContent = "قائمة المفضلة فارغة";
    emptyMessage.textContent = "أضف المنتجات التي تعجبك إلى المفضلة لتجدها هنا.";
  } else {
    emptyTitle.textContent = "ما لقيناش المنتج ده";
    emptyMessage.textContent = "جرّب كلمة بحث مختلفة أو اختار قسم تاني.";
  }

  $("#productsTitle").textContent = showingWishlist
    ? "المنتجات المفضلة ❤️"
    : activeCategory === "all"
      ? "أفضل المنتجات"
      : "المنتجات المختارة";

}

function updateCounters() {
  const cartCount = [...cart.values()]
    .reduce((total, item) => total + item.quantity, 0);

  $("#cartCount").textContent = cartCount;
  $("#wishlistCount").textContent = wishlist.size;
}

function renderCart() {
  if (cart.size === 0) {
    $("#cartItems").innerHTML =
      `<div class="cart-empty">
        <div style="font-size:40px">🛒</div>
        <h3>سلتك لسه فاضية</h3>
        <p>اختار المنتجات اللي عجبتك وهنلاقيها هنا.</p>
      </div>`;

    $("#cartTotal").textContent = money(0);
    updateCounters();
    return;
  }

  $("#cartItems").innerHTML = [...cart.values()].map((item) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div>
        <strong>${item.name}</strong>
        <small>${money(item.price)}</small>
        <div class="quantity">
          <button data-quantity="${item.id}" data-change="1"
            aria-label="زيادة الكمية">+</button>
          <span>${item.quantity}</span>
          <button data-quantity="${item.id}" data-change="-1"
            aria-label="تقليل الكمية">−</button>
        </div>
      </div>
      <button class="remove-item" data-remove="${item.id}"
        aria-label="حذف المنتج">✕</button>
    </div>
  `).join("");

  const total = [...cart.values()].reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  $("#cartTotal").textContent = money(total);
  updateCounters();
}



function addToCart(id, quantity = 1) {
  const product = products.find(
    (item) => String(item.id) === String(id)
  );

  if (!product) return;

  const stock = Number(product.stock ?? 0);

  if (stock <= 0) {
    showToast("عذرًا، المنتج نفد من المخزون");
    return;
  }

  const amount = Math.max(
    1,
    Math.floor(Number(quantity) || 1)
  );

  const cartId = product.id;
  const currentQuantity = cart.has(cartId)
    ? cart.get(cartId).quantity
    : 0;

  if (currentQuantity >= stock) {
    showToast(`المتاح من المنتج ${stock} قطعة فقط`);
    return;
  }

  if (currentQuantity + amount > stock) {
    showToast(`المتاح من المنتج ${stock - currentQuantity} قطعة فقط`);
    return;
  }

  if (cart.has(cartId)) {
    cart.get(cartId).quantity += amount;
  } else {
    cart.set(cartId, {
      ...product,
      quantity: amount
    });
  }

  saveCart();
  renderCart();
  showToast("اتضاف المنتج لسلتك بنجاح 🛒");
}




function openCart() {
  const isEnglish = document.documentElement.lang === "en";

  cartDrawer.classList.toggle("cart-left", isEnglish);
  cartDrawer.classList.toggle("cart-right", !isEnglish);

  cartDrawer.classList.add("open");
  overlay.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  $("#closeCart").focus();
}

function closeCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  $("#cartBtn").focus();
}


function setCategory(category) {
  activeCategory = category;

  $$(".category").forEach((button) => {
    const selected = button.dataset.category === category;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", selected);
  });

  renderProducts();
}

productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const wishButton = event.target.closest("[data-wish]");

  if (addButton) {
    addToCart(Number(addButton.dataset.add));
  }

  if (wishButton) {
    const id = Number(wishButton.dataset.wish);

    if (wishlist.has(id)) {
      wishlist.delete(id);
      showToast("تمت إزالة المنتج من المفضلة");
    } else {
      wishlist.add(id);
      showToast("اتضاف المنتج للمفضلة ♥");
    }

    saveWishlist();
    updateCounters();
    renderProducts();
  }
});


/* KAWEN: Product Details Modal */
const productModal = document.getElementById("productModal");
const productModalImage = document.getElementById("productModalImage");
const productModalName = document.getElementById("productModalName");
const productModalCategory = document.getElementById("productModalCategory");
const productModalRating = document.getElementById("productModalRating");
const productModalDescription = document.getElementById("productModalDescription");
const productModalPrice = document.getElementById("productModalPrice");
const productModalOldPrice = document.getElementById("productModalOldPrice");
const productModalQuantity = document.getElementById("productModalQuantity");
const productModalAdd = document.getElementById("productModalAdd");

let activeProductId = null;

function openProductDetails(productId) {
  const product = products.find(
    (item) => String(item.id) === String(productId)
  );

  if (!product || !productModal) return;

  activeProductId = product.id;

  productModalImage.src = product.image || "";
  productModalImage.alt = product.name || "";
  productModalName.textContent = kawenTranslateText(product.name || "");
  productModalCategory.textContent = kawenTranslateText(product.label || "");
  productModalRating.textContent = `★ ${product.rating ?? "—"} / 5`;
  const productModalStock = document.getElementById("productModalStock");
const stock = Number(product.stock ?? 0);

if (productModalStock) {
  productModalStock.textContent =
    stock > 0 ? `✓ متوفر (${stock} قطعة)` : "✕ نفد المخزون";

  productModalStock.classList.toggle("is-available", stock > 0);
  productModalStock.classList.toggle("is-out-of-stock", stock <= 0);
}

productModalQuantity.max = String(Math.max(stock, 1));

productModalAdd.disabled = stock <= 0;
productModalAdd.textContent =
  stock > 0 ? "🛒 أضف إلى السلة" : "نفد المخزون";

  productModalDescription.textContent = product.description
    ? kawenTranslateText(product.description)
    : "";

  productModalPrice.textContent = money(product.price);

  productModalOldPrice.textContent =
    product.oldPrice && product.oldPrice > product.price
      ? money(product.oldPrice)
      : "";

  productModalQuantity.value = "1";
  productModal.classList.add("is-open");
  productModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeProductDetails() {
  if (!productModal) return;

  productModal.classList.remove("is-open");
  productModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  activeProductId = null;
}

productGrid.addEventListener("click", (event) => {
  if (event.target.closest("[data-add], [data-wish]")) return;

  const card = event.target.closest(".product-card");
  if (!card) return;

  const productId = card.dataset.productId;
  if (productId !== undefined) {
    openProductDetails(productId);
  }
});

productModal?.addEventListener("click", (event) => {
  if (event.target.closest("[data-close-product]")) {
    closeProductDetails();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && productModal?.classList.contains("is-open")) {
    closeProductDetails();
  }
});


document.getElementById("productQuantityMinus")?.addEventListener("click", () => {
  const current = Number(productModalQuantity.value) || 1;
  productModalQuantity.value = String(Math.max(1, current - 1));
});

document.getElementById("productQuantityPlus")?.addEventListener("click", () => {
  const current = Number(productModalQuantity.value) || 1;
  const maxStock = Number(productModalQuantity.max) || 1;

  if (current >= maxStock) {
    showToast(`المتاح ${maxStock} قطعة فقط`);
    return;
  }

  productModalQuantity.value = String(current + 1);
});


productModalQuantity?.addEventListener("change", () => {
  const quantity = Number(productModalQuantity.value) || 1;
  productModalQuantity.value = String(Math.max(1, Math.min(99, quantity)));
});




productModalAdd?.addEventListener("click", () => {
  if (activeProductId === null) return;

  const quantity = Math.max(
    1,
    Math.min(99, Math.floor(Number(productModalQuantity.value) || 1))
  );

  addToCart(activeProductId, quantity);
  closeProductDetails();
});



$("#cartItems").addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");

  if (quantityButton) {
  const id = Number(quantityButton.dataset.quantity);
  const change = Number(quantityButton.dataset.change);
  const item = cart.get(id);

  if (item) {
    if (change > 0) {
      const product = products.find(
        (product) => String(product.id) === String(id)
      );

      const stock = Number(product?.stock ?? 0);

      if (item.quantity >= stock) {
        showToast(`المتاح من المنتج ${stock} قطعة فقط`);
        return;
      }

      item.quantity += 1;
    } else {
      item.quantity -= 1;

      if (item.quantity <= 0) {
        cart.delete(id);
      }
    }

    saveCart();
    renderCart();
  }
}

  
  if (removeButton) {
    cart.delete(Number(removeButton.dataset.remove));
    saveCart();
    renderCart();
    showToast("تم حذف المنتج من السلة");
  }

});

$("#searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  searchTerm = searchInput.value.trim();
  renderProducts();
  $("#products").scrollIntoView({ behavior: "smooth" });
});

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim();
  renderProducts();
});


$$(".category").forEach((button) => {
  button.addEventListener("click", () => {
    showingWishlist = false;
    setCategory(button.dataset.category);
    $("#products").scrollIntoView({ behavior: "smooth" });
  });
});


$("#sortSelect").addEventListener("change", (event) => {
  sortMode = event.target.value;
  renderProducts();
});

$("#resetSearch").addEventListener("click", () => {
  showingWishlist = false;
  searchInput.value = "";
  searchTerm = "";
  setCategory("all");
  $("#sortSelect").value = "featured";
  sortMode = "featured";
  renderProducts();
});

$("#cartBtn").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cartDrawer.classList.contains("open")) {
    closeCart();
  }
});



$("#wishlistBtn").addEventListener("click", () => {
  if (wishlist.size === 0) {
    showToast("لسه ما أضفتش منتجات للمفضلة");
    return;
  }

  showingWishlist = true;

  searchInput.value = "";
  searchTerm = "";
  activeCategory = "all";
  sortMode = "featured";
  $("#sortSelect").value = "featured";

  $$(".category").forEach((button) => {
    const selected = button.dataset.category === "all";
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", selected);
  });

  renderProducts();

  $("#products").scrollIntoView({ behavior: "smooth" });
});




$("#accountBtn").addEventListener("click", async () => {
  await supabaseClient.auth.getSession();
  $("#accountDialog").showModal();
});

$("#closeAccount").addEventListener("click", () => {
  $("#accountDialog").close();
});

$("#menuToggle").addEventListener("click", () => {
  const menu = $("#navLinks");
  const isOpen = menu.classList.toggle("open");
  $("#menuToggle").setAttribute("aria-expanded", isOpen);
});

$$(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    $("#navLinks").classList.remove("open");
    $("#menuToggle").setAttribute("aria-expanded", "false");
  });
});




const checkoutDialCodes = {
  EG: "+20",
  SA: "+966",
  AE: "+971",
  KW: "+965",
  QA: "+974",
  BH: "+973",
  OM: "+968",
  JO: "+962",
  PS: "+970",
  IQ: "+964",
  LB: "+961",
  SY: "+963",
  YE: "+967",
  MA: "+212",
  DZ: "+213",
  TN: "+216",
  LY: "+218",
  SD: "+249",
  MR: "+222",
  SO: "+252",
  DJ: "+253",
  KM: "+269"
};

function updateCheckoutPhoneCode() {
  const country = $("#checkoutCountry").value;
  const phoneCode = $("#phoneCountryCode");

  if (phoneCode) {
    phoneCode.textContent = checkoutDialCodes[country] || "+20";
  }
}



// KAWEN — Custom country picker for checkout
const checkoutCountryPicker = $("#checkoutCountryPicker");
const checkoutCountryButton = $("#checkoutCountryButton");
const checkoutCountryName = $("#checkoutCountryName");
const checkoutCountryList = $("#checkoutCountryList");
const checkoutCountryInput = $("#checkoutCountry");

function renderCheckoutCountryPicker() {
  if (
    !checkoutCountryPicker ||
    !checkoutCountryButton ||
    !checkoutCountryName ||
    !checkoutCountryList ||
    !checkoutCountryInput
  ) return;

  const language = currentLanguage;
  const selectedCode = checkoutCountryInput.value || "EG";
  const selectedCountry = kawenCountryFlags[selectedCode];

  if (selectedCountry) {
    checkoutCountryName.textContent = selectedCountry[language];
  }

  checkoutCountryList.innerHTML = Object.entries(kawenCountryFlags)
    .map(([code, country]) => `
      <button
        type="button"
        class="checkout-country-option"
        role="option"
        data-checkout-country="${code}"
        aria-selected="${code === selectedCode}"
      >
        <img
          src="https://flagcdn.com/w40/${country.flag}.png"
          alt=""
          loading="lazy"
        >
        <span>${country[language]}</span>
      </button>
    `)
    .join("");
}

if (
  checkoutCountryButton &&
  checkoutCountryList &&
  checkoutCountryInput
) {
  

  checkoutCountryButton.addEventListener("click", () => {
    const isOpen = !checkoutCountryList.hidden;
    checkoutCountryList.hidden = isOpen;
    checkoutCountryButton.setAttribute("aria-expanded", String(!isOpen));
  });

  checkoutCountryList.addEventListener("click", event => {
    const option = event.target.closest("[data-checkout-country]");
    if (!option) return;

    const code = option.dataset.checkoutCountry;
    checkoutCountryInput.value = code;

    renderCheckoutCountryPicker();
    updateCheckoutPhoneCode();

    if ($("#countrySelect")) {
      $("#countrySelect").value = code;
      $("#countrySelect").dispatchEvent(new Event("change", {
        bubbles: true
      }));
    }

    renderCheckoutSummary();

    checkoutCountryList.hidden = true;
    checkoutCountryButton.setAttribute("aria-expanded", "false");
  });

  document.addEventListener("click", event => {
    if (!event.target.closest("#checkoutCountryPicker")) {
      checkoutCountryList.hidden = true;
      checkoutCountryButton.setAttribute("aria-expanded", "false");
    }
  });
}





function renderCheckoutSummary() {
  const checkoutItems = $("#checkoutItems");
  const checkoutTotal = $("#checkoutTotal");

  checkoutItems.innerHTML = [...cart.values()]
    .map((item) => `
      <div class="checkout-item">
        <span>${kawenTranslateText(item.name)} × ${item.quantity}</span>
        <span>${money(item.price * item.quantity)}</span>
      </div>
    `)
    .join("");

  const total = [...cart.values()].reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  checkoutTotal.textContent = money(total);
}


$("#checkoutBtn").addEventListener("click", () => {
  if (cart.size === 0) {
    showToast("أضف منتجًا إلى السلة أولًا");
    return;
  }

  const checkoutDialog = $("#checkoutDialog");
  const checkoutForm = $("#checkoutForm");
  const checkoutConfirmation = $("#checkoutConfirmation");
  if (demoCardPayment) {
  demoCardPayment.hidden = true;
}

  // إظهار نموذج الطلب وإخفاء التأكيد السابق
  checkoutForm.hidden = false;
  checkoutConfirmation.hidden = true;

  // إخفاء أي رسالة خطأ قديمة
  if (checkoutNotice) {
    checkoutNotice.hidden = true;
    checkoutNotice.textContent = "";
  }

  $("#checkoutCountry").value = $("#countrySelect").value;

  renderCheckoutCountryPicker();
  updateCheckoutPhoneCode();
  renderCheckoutSummary();

  checkoutDialog.showModal();
});


$("#closeCheckout").addEventListener("click", () => {
  $("#checkoutDialog").close();
});


$("#checkoutDialog").addEventListener("click", (event) => {
  if (event.target === $("#checkoutDialog")) {
    const rect = $("#checkoutDialog").getBoundingClientRect();

    const clickedInsideDialog =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (!clickedInsideDialog) {
      $("#checkoutDialog").close();
    }
  }
});



$("#checkoutCountry").addEventListener("change", () => {
  updateCheckoutPhoneCode();

  $("#countrySelect").value = $("#checkoutCountry").value;
  $("#countrySelect").dispatchEvent(new Event("change"));

  renderCheckoutSummary();
});









const checkoutNotice = $("#checkoutNotice");


function showCheckoutNotice(message) {
  if (!checkoutNotice) {
    showToast(message);
    return;
  }

  checkoutNotice.textContent = message;
  checkoutNotice.hidden = false;

  requestAnimationFrame(() => {
    checkoutNotice.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  });
}




const demoCardPayment = $("#demoCardPayment");
const demoCardContinue = $("#demoCardContinue");

$("#checkoutPayment").addEventListener("change", () => {
  if (demoCardPayment) {
    demoCardPayment.hidden =
      $("#checkoutPayment").value !== "card";
  }
});

let isCreatingOrder = false;


async function getKawenIdempotencyKey(payload) {
  const storageKey = "kawen-pending-order";
  const serialized = JSON.stringify(payload);

  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(serialized)
  );

  const fingerprint = Array.from(new Uint8Array(hashBuffer))
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");

  let pending = null;

  try {
    pending = JSON.parse(localStorage.getItem(storageKey));
  } catch {
    pending = null;
  }

  if (
    !pending ||
    pending.fingerprint !== fingerprint ||
    !pending.key
  ) {
    pending = {
      key: crypto.randomUUID(),
      fingerprint
    };

    localStorage.setItem(
      storageKey,
      JSON.stringify(pending)
    );
  }

  return pending.key;
}


$("#checkoutForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = $("#checkoutName").value.trim();
  const phone = $("#checkoutPhone").value.trim();
  const country = $("#checkoutCountry").value;
  const city = $("#checkoutCity").value.trim();
  const address = $("#checkoutAddress").value.trim();
  const paymentMethod = $("#checkoutPayment").value;

  if (!name || !phone || !country || !city || !address) {
    showCheckoutNotice("من فضلك أكمل جميع بيانات الطلب.");
    return;
  }

  if (cart.size === 0) {
    showCheckoutNotice("السلة فارغة، أضف منتجات أولًا.");
    return;
  }

  

  // طرق الدفع الأخرى تظل تجريبية ولا تُحفظ كطلبات حقيقية.
  if (paymentMethod !== "cod") {
    const paymentMessages = {
      card: "البطاقات البنكية — تجربة فقط، لم يتم الدفع.",
      wallet: "المحافظ الإلكترونية — تجربة فقط، لم يتم الدفع.",
      bank: "التحويل البنكي — تجربة فقط، لم يتم الدفع."
    };

    if (paymentMethod === "card" && demoCardPayment) {
      demoCardPayment.hidden = false;
      demoCardPayment.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
      return;
    }

    showCheckoutNotice(
      paymentMessages[paymentMethod] ||
      "طريقة الدفع دي غير متاحة حاليًا."
    );
    return;
  }


  // التحقق من Cloudflare Turnstile قبل إرسال الطلب
const turnstileToken = window.turnstile?.getResponse();

if (!turnstileToken) {
  showCheckoutNotice(
    "من فضلك أكمل التحقق الأمني قبل تأكيد الطلب."
  );
  return;
}

  const submitButton = $("#checkoutForm").querySelector(
    'button[type="submit"]'
  );

  if (isCreatingOrder) return;

isCreatingOrder = true;

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "جارٍ حفظ الطلب...";
  }

  try {
    const items = [...cart.values()].map((item) => ({
      id: Number(item.id),
      quantity: Number(item.quantity)
    }));

    const orderPayload = {
  name: name.trim(),
  phone: phone.trim(),
  country,
  city: city.trim(),
  address: address.trim(),
  items
};

const idempotencyKey = await getKawenIdempotencyKey(orderPayload);

const { data, error } = await supabaseClient.functions.invoke(
  "create-order",
  {
    body: {
      ...orderPayload,
      idempotencyKey,
      turnstileToken
    }
  }
);

    if (error) {
      let details = error.message || "تعذّر الاتصال بخدمة الطلبات.";

      if (typeof error.context?.json === "function") {
        const response = await error.context.json().catch(() => null);
        if (response?.error) details = response.error;
      }

      throw new Error(details);
    }

    if (!data?.success || !data?.order?.order_number) {
      throw new Error(
        data?.error || "لم نتأكد من حفظ الطلب في قاعدة البيانات."
      );
    }

localStorage.removeItem("kawen-pending-order");

    // نفرّغ السلة فقط بعد تأكيد نجاح الحفظ.
    cart.clear();
    saveCart();
    renderCart();
    renderCheckoutSummary();

    showDemoCheckoutConfirmation("الدفع عند الاستلام", data.order);

  } catch (error) {
    console.error("KAWEN checkout error:", error);
    window.turnstile?.reset();
    showCheckoutNotice(
      `لم يتم تأكيد حفظ الطلب: ${error.message || "حدث خطأ غير متوقع"}. السلة لم تُمسح؛ حاول مرة أخرى بعد التأكد من الاتصال.`
    );
 } finally {
  isCreatingOrder = false;

  if (submitButton) {
    submitButton.disabled = false;
    submitButton.textContent = "تأكيد الطلب";
  }
}
});



function showDemoCheckoutConfirmation(paymentMessage, order = null) {
  const confirmation = $("#checkoutConfirmation");
  const confirmationTotal = $("#confirmationTotal");
  const confirmationPayment = $("#confirmationPayment");
  const checkoutForm = $("#checkoutForm");

  if (
    !confirmation ||
    !confirmationTotal ||
    !confirmationPayment ||
    !checkoutForm
  ) {
    showCheckoutNotice("تعذّر عرض تأكيد الطلب.");
    return;
  }

  // الطلب الحقيقي يستخدم إجمالي الطلب الذي أعادته قاعدة البيانات.
  if (order && order.total != null) {
    confirmationTotal.textContent = new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: order.currency || "EGP"
    }).format(Number(order.total));

    confirmationPayment.textContent =
      `تم حفظ الطلب رقم ${order.order_number} — ${paymentMessage}`;
  } else {
    // تبقى التأكيدات التجريبية كما هي.
    confirmationTotal.textContent = $("#checkoutTotal").textContent;
    confirmationPayment.textContent = paymentMessage;
  }

  checkoutForm.hidden = true;
  confirmation.hidden = false;
}



const demoCardNumber = $("#demoCardNumber");
const demoCardExpiry = $("#demoCardExpiry");
const demoCardCvv = $("#demoCardCvv");
const demoCardNotice = $("#demoCardNotice");

function showDemoCardNotice(message) {
  demoCardNotice.textContent = message;
  demoCardNotice.hidden = false;
}

function formatDemoCardNumber(value) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

demoCardNumber.addEventListener("input", () => {
  demoCardNumber.value = formatDemoCardNumber(
    demoCardNumber.value
  );

  $("#demoCardPreviewNumber").textContent =
    demoCardNumber.value || "•••• •••• •••• ••••";

  demoCardNotice.hidden = true;
});

demoCardExpiry.addEventListener("input", () => {
  let value = demoCardExpiry.value.replace(/\D/g, "").slice(0, 4);

  if (value.length > 2) {
    value = value.slice(0, 2) + "/" + value.slice(2);
  }

  demoCardExpiry.value = value;

  $("#demoCardPreviewExpiry").textContent =
    value || "MM/YY";

  demoCardNotice.hidden = true;
});

demoCardCvv.addEventListener("input", () => {
  demoCardCvv.value = demoCardCvv.value
    .replace(/\D/g, "")
    .slice(0, 4);

  demoCardNotice.hidden = true;
});

if (demoCardContinue) {
  demoCardContinue.addEventListener("click", () => {
    const number = demoCardNumber.value.replace(/\D/g, "");
    const expiry = demoCardExpiry.value.trim();
    const cvv = demoCardCvv.value.trim();

    if (!/^\d{16}$/.test(number)) {
      showDemoCardNotice(
        "أدخل رقم بطاقة تجريبيًا مكوّنًا من 16 رقمًا."
      );
      demoCardNumber.focus();
      return;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      showDemoCardNotice(
        "أدخل تاريخ الانتهاء بالشكل MM/YY."
      );
      demoCardExpiry.focus();
      return;
    }

    const [month, year] = expiry.split("/").map(Number);
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (
      year < currentYear ||
      (year === currentYear && month < currentMonth)
    ) {
      showDemoCardNotice(
        "تاريخ الانتهاء التجريبي يجب أن يكون في المستقبل."
      );
      demoCardExpiry.focus();
      return;
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      showDemoCardNotice(
        "أدخل رمز CVV تجريبيًا مكوّنًا من 3 أو 4 أرقام."
      );
      demoCardCvv.focus();
      return;
    }

    demoCardNotice.hidden = true;

    showDemoCheckoutConfirmation(
      "البطاقات البنكية — تجربة فقط، لم يتم الدفع"
    );
  });
}





$("#backToStore").addEventListener("click", () => {
  const checkoutForm = $("#checkoutForm");
  const confirmation = $("#checkoutConfirmation");
  const checkoutDialog = $("#checkoutDialog");

    confirmation.hidden = true;
  checkoutForm.hidden = false;

  if (demoCardPayment) {
    demoCardPayment.hidden = true;
  }

  checkoutForm.reset();

  if (checkoutNotice) {
    checkoutNotice.hidden = true;
    checkoutNotice.textContent = "";
  }

  if (checkoutDialog.open) {
    checkoutDialog.close();
  }
});











$("#newsletterForm").addEventListener("submit", (event) => {
  event.preventDefault();
  showToast("النموذج تجريبي ولم يتم حفظ بريدك الإلكتروني");
  $("#newsletterEmail").value = "";
});

$("#year").textContent = new Date().getFullYear();

renderProducts();
renderCart();








const countrySelect = document.querySelector("#countrySelect");
const countryLabel = document.querySelector("#countryLabel");

function updateCountry(countryCode) {
  if (!countryCurrencies[countryCode]) return;

  currentCountry = countryCode;
  localStorage.setItem("kawen-country", countryCode);

  if (countrySelect) {
    countrySelect.value = countryCode;
  }

  if (countryLabel && countrySelect) {
  const selectedOption =
    countrySelect.options[countrySelect.selectedIndex];

  countryLabel.textContent = selectedOption.textContent
    .replace(/[\u{1F1E6}-\u{1F1FF}]{2}/gu, "")
    .replace(/\b[A-Z]{2}\b/g, "")
    .trim();

  
}

  renderProducts();
  renderCart();
}

if (countrySelect) {
  countrySelect.value = countryCurrencies[currentCountry]
    ? currentCountry
    : "EG";

  countrySelect.addEventListener("change", (event) => {
    updateCountry(event.target.value);
  });

  updateCountry(countrySelect.value);
}




/* KAWEN: Real country flag picker */

const countryPickerButton = document.querySelector("#countryPickerButton");
const countryPickerFlag = document.querySelector("#countryPickerFlag");
const countryPickerName = document.querySelector("#countryPickerName");
const countryPickerList = document.querySelector("#countryPickerList");

const kawenCountryFlags = {
  EG: { ar: "مصر", en: "Egypt", flag: "eg" },
  SA: { ar: "السعودية", en: "Saudi Arabia", flag: "sa" },
  AE: { ar: "الإمارات", en: "United Arab Emirates", flag: "ae" },
  KW: { ar: "الكويت", en: "Kuwait", flag: "kw" },
  QA: { ar: "قطر", en: "Qatar", flag: "qa" },
  BH: { ar: "البحرين", en: "Bahrain", flag: "bh" },
  OM: { ar: "عُمان", en: "Oman", flag: "om" },
  JO: { ar: "الأردن", en: "Jordan", flag: "jo" },
  PS: { ar: "فلسطين", en: "Palestine", flag: "ps" },
  IQ: { ar: "العراق", en: "Iraq", flag: "iq" },
  LB: { ar: "لبنان", en: "Lebanon", flag: "lb" },
  SY: { ar: "سوريا", en: "Syria", flag: "sy" },
  YE: { ar: "اليمن", en: "Yemen", flag: "ye" },
  MA: { ar: "المغرب", en: "Morocco", flag: "ma" },
  DZ: { ar: "الجزائر", en: "Algeria", flag: "dz" },
  TN: { ar: "تونس", en: "Tunisia", flag: "tn" },
  LY: { ar: "ليبيا", en: "Libya", flag: "ly" },
  SD: { ar: "السودان", en: "Sudan", flag: "sd" },
  MR: { ar: "موريتانيا", en: "Mauritania", flag: "mr" },
  SO: { ar: "الصومال", en: "Somalia", flag: "so" },
  DJ: { ar: "جيبوتي", en: "Djibouti", flag: "dj" },
  KM: { ar: "جزر القمر", en: "Comoros", flag: "km" }
};

function kawenRenderCountryPicker() {
  if (!countrySelect || !countryPickerList) return;

  const language = currentLanguage;
  const selectedCode = countrySelect.value;
  const selectedCountry = kawenCountryFlags[selectedCode];

  if (selectedCountry && countryPickerFlag && countryPickerName) {
    countryPickerFlag.src =
      `https://flagcdn.com/w40/${selectedCountry.flag}.png`;
    countryPickerFlag.alt = "";
    countryPickerName.textContent = selectedCountry[language];
  }

  countryPickerList.innerHTML = Object.entries(kawenCountryFlags)
    .map(([code, country]) => `
      <button
        type="button"
        class="country-option"
        role="option"
        data-country="${code}"
        aria-selected="${code === selectedCode}"
      >
        <img
          src="https://flagcdn.com/w40/${country.flag}.png"
          alt=""
          loading="lazy"
        >
        <span>${country[language]}</span>
      </button>
    `)
    .join("");
}

if (countryPickerButton && countryPickerList && countrySelect) {
  kawenRenderCountryPicker();

  countryPickerButton.addEventListener("click", () => {
    const isOpen = !countryPickerList.hidden;
    countryPickerList.hidden = isOpen;
    countryPickerButton.setAttribute("aria-expanded", String(!isOpen));
  });

  countryPickerList.addEventListener("click", (event) => {
    const option = event.target.closest("[data-country]");
    if (!option) return;

    const code = option.dataset.country;

    countrySelect.value = code;
    updateCountry(code);
    kawenRenderCountryPicker();

    countryPickerList.hidden = true;
    countryPickerButton.setAttribute("aria-expanded", "false");

    countrySelect.dispatchEvent(new Event("change", { bubbles: true }));
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest("#countryPicker")) {
      countryPickerList.hidden = true;
      countryPickerButton.setAttribute("aria-expanded", "false");
    }
  });
}

















/* KAWEN: Safe Arabic / English language system */

const languageToggle = document.querySelector("#languageToggle");

const kawenTranslations = {
  "⚡ عروض جديدة كل يوم": "⚡ New deals every day",
  "تسوّق بذكاء، ووفّر أكثر": "Shop smart, save more",
  "حسابي": "My Account",
  "المفضلة": "Wishlist",
  "السلة": "Cart",
  "الرئيسية": "Home",
  "الأقسام": "Categories",
  "المنتجات": "Products",
  "العروض": "Offers",
  "لماذا KAWEN؟": "Why KAWEN?",
  "اختر الدولة": "Choose country",
  "بحث": "Search",
  "فتح القائمة": "Open menu",
  "إغلاق": "Close",
  "كل اللي بتحبه.": "Everything you love.",
  "في مكان واحد.": "All in one place.",
  "اختيارات تستحق التجربة": "Worth exploring",
  "اكتشف أحدث التقنيات والمنتجات والعروض المختارة بعناية، وخلّي تجربة التسوّق أسهل وأمتع.": "Discover the latest technology, products, and carefully selected deals for an easier, better shopping experience.",
  "اكتشف المنتجات": "Explore products",
  "تصفّح الأقسام": "Browse categories",
  "وجهتك للتسوّق": "Your shopping destination",
  "اختيارات متنوعة": "Plenty of choices",
  "تصفّح في أي وقت": "Browse anytime",
  "مجموعة من الأجهزة الإلكترونية الحديثة": "A collection of modern electronic devices",
  "اختيارات مميزة": "Featured picks",
  "اكتشف جديدنا": "Discover what's new",
  "منتجات من أقسام مختلفة": "Products across categories",
  "بحث سهل وسريع": "Quick and easy search",
  "اعثر على ما تريد": "Find what you need",
  "قائمة المفضلة": "Wishlist",
  "احتفظ بما يعجبك": "Save what you like",
  "سلة مشتريات": "Shopping cart",
  "رتّب اختياراتك بسهولة": "Organize your picks easily",
  "تسوّق على مزاجك": "Shop your way",
  "اكتشف الأقسام": "Explore categories",
  "كل شيء أقرب مما تتخيّل": "Everything is closer than you think",
  "كل المنتجات": "All products",
  "إلكترونيات": "Electronics",
  "هواتف": "Phones",
  "أزياء": "Fashion",
  "المنزل": "Home",
  "إكسسوارات": "Accessories",
  "اختياراتنا لك": "Picked for you",
  "أفضل المنتجات": "Top products",
  "المنتجات المختارة": "Selected products",
  "ترتيب المنتجات": "Sort products",
  "ترتيب مميز": "Featured",
  "السعر: من الأقل للأعلى": "Price: Low to high",
  "السعر: من الأعلى للأقل": "Price: High to low",
  "أكبر خصم": "Biggest discount",
  "ما لقيناش المنتج ده": "We couldn't find that product",
  "جرّب كلمة بحث مختلفة أو اختار قسم تاني.": "Try another search term or choose a different category.",
  "عرض كل المنتجات": "Show all products",
  "اختيارك الجاي": "Your next favorite",
  "ممكن يكون هنا.": "could be right here.",
  "تصفّح المنتجات واكتشف اختيارات تناسب يومك.": "Explore products and discover picks that fit your day.",
  "ابدأ التسوّق": "Start shopping",
  "ابدأ التسوّق ←": "Start Shopping ←",
  "ابدأ التسوقّ←": "Start Shopping ←",
  "خليك على اطلاع": "Stay in the loop",
  "الجديد يوصلك أول بأول.": "Stay up to date with what's new.",
  "اشترك لتصلك أخبار العروض والمنتجات الجديدة.": "Subscribe for updates on deals and new products.",
  "بريدك الإلكتروني": "Your email address",
  "اشترك الآن": "Subscribe now",
  "تجربة تسوّق بطابع مختلف.": "A different kind of shopping experience.",
  "عن المتجر": "About us",
  "جميع الحقوق محفوظة.": "All rights reserved.",
  "نسخة تجريبية — الأسعار والمنتجات للعرض فقط.": "Demo version — prices and products are for display only.",
  "اختياراتك": "Your picks",
  "سلة المشتريات": "Shopping cart",
  "سلتك لسه فاضية": "Your cart is empty",
  "اختار المنتجات اللي عجبتك وهنلاقيها هنا.": "Add products you like and they'll appear here.",
  "زيادة الكمية": "Increase quantity",
  "تقليل الكمية": "Decrease quantity",
  "حذف المنتج": "Remove product",
  "الإجمالي": "Total",
  "متابعة الطلب": "Continue to checkout",
  "الاسم الكامل": "Full Name",
  "اكتب اسمك الكامل": "Enter your full name",
  "رقم الهاتف مع مفتاح الدولة": "Phone Number with Country Code",
  "رقم الهاتف": "Phone Number",
  "الدولة": "Country",
  "المدينة": "City",
  "اسم المدينة": "Enter your city",
  "العنوان بالتفصيل": "Full Address",
  "الحي، الشارع، رقم المبنى وأي تفاصيل تساعد في التوصيل": "District, street, building number, and delivery details",
  "طريقة الدفع": "Payment Method",
  "ملخص طلبك": "Order Summary",
  "تكلفة الشحن وتأكيد توفر الخدمة يُحددان حسب الدولة والعنوان.": "Shipping cost and service availability will be confirmed based on your country and address.",
  "متابعة تأكيد الطلب": "Continue to Confirm Order",
  "نموذج تجريبي؛ لن يُرسل الطلب أو تُحصّل أي مدفوعات قبل ربط نظام الطلبات.": "Demo form; no order will be submitted and no payment will be collected until an order system is connected.",
  "ابدأ التسوق": "Start Shopping",
  "ابدأ التسوّق": "Start Shopping",
  "إتمام الطلب": "Checkout",
  "إتمام الشراء": "Complete Purchase",
  "بيانات التوصيل": "Delivery Details",
  "أدخل بياناتك لمتابعة طلبك": "Enter your details to continue with your order",
  "الاسم الكامل": "Full Name",
  "رقم الهاتف مع مفتاح الدولة": "Phone Number with Country Code",
  "اختر الدولة": "Choose Country",
  "المدينة": "City",
  "العنوان بالتفصيل": "Full Address",
  "طريقة الدفع": "Payment Method",
  "الدفع عند الاستلام": "Cash on Delivery",
  "البطاقات البنكية": "Bank Cards",
  "المحافظ الإلكترونية": "E-Wallets",
  "التحويل البنكي": "Bank Transfer",
  "تجريبي": "Demo",
  "ملخص الطلب": "Order Summary",
  "تكلفة الشحن": "Shipping Cost",
  "متابعة تأكيد الطلب": "Continue to Confirm Order",
  "نموذج تجريبي؛ لن يُرسل الطلب أو تُحصّل أي مدفوعات قبل ربط نظام الطلبات.": "Demo form; no order will be sent and no payment will be collected until an order system is connected.",
  "هذه نسخة تجريبية ولا تتم عمليات دفع حقيقية.": "This is a demo. No real payments are processed.",
  "أهلًا بك في KAWEN": "Welcome to KAWEN",
  "أهلًا بك في تجربة التسوّق الجديدة.": "Welcome to a new shopping experience.",
  "تسجيل الحساب غير مفعّل في النسخة التجريبية.": "Account registration is disabled in this demo.",
  "تمام": "OK",
  "إزالة من المفضلة": "Remove from wishlist",
  "إضافة للمفضلة": "Add to wishlist",
  "🛒 أضف إلى السلة": "🛒 Add to cart",
  "تمت إزالة المنتج من المفضلة": "Removed from wishlist",
  "اتضاف المنتج للمفضلة ♥": "Added to wishlist ♥",
  "اتضاف المنتج لسلتك بنجاح 🛒": "Product added to your cart 🛒",
  "تم حذف المنتج من السلة": "Product removed from cart",
  "لسه ما أضفتش منتجات للمفضلة": "You haven't added any favorites yet",
  "أضف منتجًا إلى السلة أولًا": "Add a product to your cart first",
  "معاينة فقط: الدفع والطلبات يحتاجان إعدادًا إضافيًا": "Demo only: checkout requires additional setup",
  "النموذج تجريبي ولم يتم حفظ بريدك الإلكتروني": "Demo form: your email has not been saved",
  "منتجاتك المفضلة": "Your wishlist",
  "المنتجات المفضلة ❤️": "Favorite Products ❤️",
  "قائمة المفضلة فارغة": "Your wishlist is empty",
  "أضف المنتجات التي تعجبك إلى المفضلة لتجدها هنا.": "Add products you like to your wishlist to find them here.",
  "ابحث عن منتج، هاتف، لابتوب...": "Search products, phones, laptops...",
  "مصر": "Egypt",
  "السعودية": "Saudi Arabia",
  "الإمارات": "United Arab Emirates",
  "الكويت": "Kuwait",
  "قطر": "Qatar",
  "البحرين": "Bahrain",
  "عُمان": "Oman",
  "الأردن": "Jordan",
  "فلسطين": "Palestine",
  "العراق": "Iraq",
  "لبنان": "Lebanon",
  "سوريا": "Syria",
  "اليمن": "Yemen",
  "المغرب": "Morocco",
  "الجزائر": "Algeria",
  "تونس": "Tunisia",
  "ليبيا": "Libya",
  "السودان": "Sudan",
  "موريتانيا": "Mauritania",
  "الصومال": "Somalia",
  "جيبوتي": "Djibouti",
  "جزر القمر": "Comoros",
  "سماعات لاسلكية Premium": "Premium Wireless Headphones",
  "ساعة ذكية بتصميم عصري": "Modern Smartwatch",
  "حذاء رياضي Everyday": "Everyday Sports Shoes",
  "كاميرا فورية للذكريات": "Instant Camera",
  "هاتف ذكي بتصميم أنيق": "Elegant Smartphone",
  "مصباح ديكوري للمنزل": "Decorative Home Lamp",
  "سماعة رأس للألعاب": "Gaming Headset",
  "نظارة شمسية كلاسيكية": "Classic Sunglasses",
  "حقيبة يومية عملية": "Everyday Bag",
  "سماعة ذكية للمنزل": "Smart Home Speaker",
  "كرسي مريح للمكتب": "Comfortable Office Chair",
  "هاتف بتصميم Minimal": "Minimal Design Phone"
};

const kawenEnglishToArabic = Object.fromEntries(
  Object.entries(kawenTranslations).map(([ar, en]) => [en, ar])
);



function kawenTranslateText(value) {
  const trimmed = value.trim();
  if (!trimmed) return value;

  let translated = trimmed;

  if (currentLanguage === "en") {
    translated = kawenTranslations[trimmed] || trimmed;

    let match = trimmed.match(/^عرض (\d+) من (\d+) منتجًا$/);
    if (match) {
      translated = `Showing ${match[1]} of ${match[2]} products`;
    }

    match = trimmed.match(/^منتجاتك المفضلة: (\d+)$/);
    if (match) {
      translated = `Your wishlist: ${match[1]} products`;
    }
  } else {
    translated = kawenEnglishToArabic[trimmed] || trimmed;

    let match = trimmed.match(/^Showing (\d+) of (\d+) products$/);
    if (match) {
      translated = `عرض ${match[1]} من ${match[2]} منتجًا`;
    }

    match = trimmed.match(/^Your wishlist: (\d+) products$/);
    if (match) {
      translated = `منتجاتك المفضلة: ${match[1]}`;
    }
  }

  if (translated === trimmed) return value;

  const leading = value.match(/^\s*/)?.[0] || "";
  const trailing = value.match(/\s*$/)?.[0] || "";

  return leading + translated + trailing;
}

function applyKawenLanguage() {
  document.documentElement.lang = currentLanguage;
  document.documentElement.dir =
    currentLanguage === "ar" ? "rtl" : "ltr";

  if (languageToggle) {
    languageToggle.textContent =
      currentLanguage === "ar" ? "EN" : "AR";

    languageToggle.setAttribute(
      "aria-label",
      currentLanguage === "ar" ? "Switch to English" : "التبديل إلى العربية"
    );
  }

  document.querySelectorAll("body *").forEach((element) => {
    for (const attribute of ["placeholder", "aria-label", "alt", "title"]) {
      const value = element.getAttribute(attribute);
      if (value) {
        element.setAttribute(attribute, kawenTranslateText(value));
      }
    }
  });


  
  // Translate select options without losing their original values
  const selectTranslations = {
    "cod": {
      ar: "💵 الدفع عند الاستلام",
      en: "💵 Cash on Delivery"
    },
    "card": {
      ar: "💳 البطاقات البنكية (Visa / Mastercard) — تجريبي",
      en: "💳 Bank Cards (Visa / Mastercard) — Demo"
    },
    "wallet": {
      ar: "📱 المحافظ الإلكترونية — تجريبي",
      en: "📱 E-Wallets — Demo"
    },
    "bank": {
      ar: "🏦 التحويل البنكي — تجريبي",
      en: "🏦 Bank Transfer — Demo"
    }
  };

  document.querySelectorAll(
    "#checkoutPayment option"
  ).forEach((option) => {
    const translation = selectTranslations[option.value];

    if (translation) {
      option.textContent = translation[currentLanguage];
    }
  });


  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT
  );

  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  textNodes.forEach((node) => {
    const parent = node.parentElement;
    if (!parent) return;

    if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) return;

    node.nodeValue = kawenTranslateText(node.nodeValue);
  });


  // Update custom checkout country picker language
if (typeof renderCheckoutCountryPicker === "function") {
  renderCheckoutCountryPicker();
}
 






const checkoutSubtitle = document.querySelector(
  "#checkoutDialog p"
);

if (checkoutSubtitle) {
  checkoutSubtitle.textContent =
    currentLanguage === "en"
      ? "Enter your details to continue with your order"
      : "أدخل بياناتك لمتابعة طلبك";
}





  document.title = currentLanguage === "en"
    ? "KAWEN | Shop Smart"
    : "KAWEN | تسوّق بذكاء";

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.content = currentLanguage === "en"
      ? "KAWEN - Discover the latest products and deals in one place."
      : "KAWEN - اكتشف أحدث المنتجات والعروض في مكان واحد.";
  }
}

/* Translate newly rendered product and cart content without an observer. */
const kawenOriginalRenderProducts = renderProducts;
renderProducts = function () {
  kawenOriginalRenderProducts();
  applyKawenLanguage();
};

const kawenOriginalRenderCart = renderCart;
renderCart = function () {
  kawenOriginalRenderCart();
  applyKawenLanguage();
};

if (languageToggle) {
  languageToggle.addEventListener("click", () => {
    currentLanguage = currentLanguage === "ar" ? "en" : "ar";
    localStorage.setItem("kawen-language", currentLanguage);

    applyKawenLanguage();
    renderProducts();
    renderCart();
  });
}

applyKawenLanguage();
renderCheckoutCountryPicker();

loadProductsFromSupabase();




// KAWEN: تسجيل الدخول والخروج عبر Supabase Auth
(() => {
  const loginForm = document.getElementById("accountLoginForm");
  const emailInput = document.getElementById("accountEmail");
  const passwordInput = document.getElementById("accountPassword");
  const notice = document.getElementById("accountNotice");
  const loginButton = document.getElementById("accountLoginBtn");
  const logoutButton = document.getElementById("accountLogoutBtn");
  const accountDialog = document.getElementById("accountDialog");

  if (
    !loginForm ||
    !emailInput ||
    !passwordInput ||
    !notice ||
    !loginButton ||
    !logoutButton ||
    !accountDialog
  ) return;

  function showAccountNotice(message, isError = true) {
    notice.textContent = message;
    notice.hidden = false;
    notice.style.color = isError ? "#ff7777" : "#8be9a8";
  }



async function refreshAccountState() {
  const { data, error } = await supabaseClient.auth.getSession();

  if (error) {
    showAccountNotice("تعذّر التحقق من جلسة الحساب.");
    return;
  }

  const session = data.session;
  const accountTitle = document.getElementById("accountTitle");
  const accountDescription = document.getElementById("accountDescription");
  const accountLogo = document.getElementById("accountLogo");

  if (accountTitle) {
    accountTitle.textContent = session
      ? "تم تسجيل دخولك إلى KAWEN"
      : "تسجيل الدخول إلى KAWEN";
  }

  if (accountDescription) {
    accountDescription.textContent = session
      ? `أنت مسجّل الدخول حاليًا: ${session.user.email || ""}`
      : "سجّل الدخول باستخدام بريدك الإلكتروني وكلمة المرور.";
  }

  if (accountLogo) {
    accountLogo.hidden = !session;
  }

  loginButton.hidden = Boolean(session);
  emailInput.disabled = Boolean(session);
  passwordInput.disabled = Boolean(session);
  logoutButton.hidden = !session;

  emailInput.hidden = Boolean(session);
passwordInput.hidden = Boolean(session);


  const emailLabel = document.querySelector('label[for="accountEmail"]');
  const passwordLabel = document.querySelector('label[for="accountPassword"]');

  if (emailLabel) emailLabel.hidden = Boolean(session);
  if (passwordLabel) passwordLabel.hidden = Boolean(session);

  if (session) {
    emailInput.value = session.user.email || "";
    passwordInput.value = "";
    notice.hidden = true;
  } else {
    showAccountNotice(
      "أدخل بريدك الإلكتروني وكلمة المرور لتسجيل الدخول.",
      false
    );
  }
}



  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    loginButton.disabled = true;
    showAccountNotice("جارٍ تسجيل الدخول...", false);

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: emailInput.value.trim(),
        password: passwordInput.value
      });

      if (error) throw error;

      const { data: admin, error: adminError } = await supabaseClient
        .from("admin_users")
        .select("user_id")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (adminError || !admin) {
        await supabaseClient.auth.signOut();
        throw new Error("هذا الحساب ليس لديه صلاحية مدير.");
      }

      passwordInput.value = "";
      await refreshAccountState();
accountDialog.close();
    } catch (error) {
      showAccountNotice(error.message || "تعذّر تسجيل الدخول.");
    } finally {
      loginButton.disabled = false;
    }
  });

  logoutButton.addEventListener("click", async () => {
    logoutButton.disabled = true;

    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;

      loginForm.reset();
      notice.hidden = true;
      await refreshAccountState();
    } catch (error) {
      showAccountNotice(error.message || "تعذّر تسجيل الخروج.");
    } finally {
      logoutButton.disabled = false;
    }
  });

  supabaseClient.auth.onAuthStateChange(() => {
    refreshAccountState();
  });

  refreshAccountState();
})();









