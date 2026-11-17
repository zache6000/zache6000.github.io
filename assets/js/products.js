/* ============================================================
   OFFGRID — store settings & products
   Edit this file to change prices, contact info or products.
   ============================================================ */

window.OFFGRID_CONFIG = {
  brand: "OFFGRID",
  currency: "MAD",
  instagram: "offgrid.storeoficiel",
  // WhatsApp number in international format, digits only (e.g. "2126XXXXXXXX").
  // Leave empty "" to send orders through Instagram DM instead.
  whatsapp: "",
  // Contact email shown on the site. Leave empty "" to hide it.
  email: "",
  sizes: ["S", "M", "L", "XL", "XXL"]
};

window.OFFGRID_PRODUCTS = [
  {
    id: "new-future",
    name: "New Future Hoodie",
    short: "New Future",
    model: "Model 02",
    tagline: "Same people. New dreams. Bigger goals.",
    price: 399, // ← change price here
    color: { name: "Cream (Ecru)", hex: "#F2EADB", key: "cream" },
    badge: "Drop 02",
    description:
      "A clean, modern piece and a symbol of a better future — the perfect blend of streetwear and inspiration. Butterfly back print in navy and muted blue, chest logo on the left side and a star on the sleeve.",
    details: [
      "Premium cotton, 450 gsm",
      "Oversized fit, drop shoulder, unisex",
      "High-quality DTF print",
      "Back print 28 × 36 cm · Chest print 8 × 5 cm",
      "Ribbed cuffs & hem, kangaroo pocket"
    ],
    images: [
      "/assets/img/nf-model-back.webp",
      "/assets/img/nf-model-front.webp",
      "/assets/img/nf-flat-back.webp",
      "/assets/img/nf-flat-front.webp",
      "/assets/img/nf-backprint.webp",
      "/assets/img/nf-chest.webp",
      "/assets/img/nf-sleeve.webp"
    ],
    card: "/assets/img/nf-model-front.webp",
    hover: "/assets/img/nf-model-back.webp"
  },
  {
    id: "radio-dreams",
    name: "Radio Dreams Hoodie",
    short: "Radio Dreams",
    model: "Model 01",
    tagline: "Tune in to better days.",
    price: 399, // ← change price here
    color: { name: "Charcoal Black", hex: "#1A1A1A", key: "black" },
    badge: "Drop 02",
    description:
      "Radio telescope, orbiting globe and a sky full of stars. Cream print on charcoal black, with the Radio Dreams script on the chest and star bursts running down both sleeves.",
    details: [
      "100% cotton French terry, 380–420 gsm",
      "Oversized fit, unisex",
      "DTF print — back, chest and sleeves",
      "Back print 28 × 36 cm · Sleeve 4 × 12 cm",
      "Ribbed cuffs & hem, double-layer hood"
    ],
    images: [
      "/assets/img/rd-back.webp",
      "/assets/img/rd-front.webp",
      "/assets/img/rd-backprint.webp",
      "/assets/img/rd-chest.webp"
    ],
    card: "/assets/img/rd-front.webp",
    hover: "/assets/img/rd-back.webp"
  },
  {
    id: "lost-paradise",
    name: "Lost Paradise Hoodie",
    short: "Lost Paradise",
    model: "Model 02",
    tagline: "Somewhere in our minds.",
    price: 399, // ← change price here
    color: { name: "Forest Green", hex: "#2E4E3A", key: "green" },
    badge: "Drop 02",
    description:
      "A winged statue rising out of the clouds, framed by stars. Beige print on deep forest green, Lost Paradise script on the chest and flames up both sleeves.",
    details: [
      "100% cotton French terry, 380–420 gsm",
      "Oversized fit, unisex",
      "DTF print — back, chest and sleeves",
      "Back print 28 × 36 cm · Sleeve 4 × 14 cm",
      "Ribbed cuffs & hem, double-layer hood"
    ],
    images: [
      "/assets/img/lp-back.webp",
      "/assets/img/lp-front.webp",
      "/assets/img/lp-backprint.webp",
      "/assets/img/lp-chest.webp"
    ],
    card: "/assets/img/lp-front.webp",
    hover: "/assets/img/lp-back.webp"
  }
];
