/* ============================================================
   OFFGRID — store settings & products
   Edit this file to change prices, delivery, contact or products.
   ============================================================ */

window.OFFGRID_CONFIG = {
  brand: "OFFGRID",
  legalName: "Off Grid",
  city: "Casablanca",
  currency: "MAD",
  instagram: "offgrid.storeoficiel",
  tiktok: "offgrid.storeofficiel",
  whatsapp: "212771909178",          // shown only as a button, never as text
  sizes: ["S", "M", "L", "XL"],    // default sizes; a product can override with its own "sizes"
  delivery: { casablanca: 0, other: 20 },   // MAD: free in Casablanca, 20 MAD elsewhere
  pack: { qty: 2, price: 500 },             // any 2 hoodies for 500 MAD (mix & match)
  nextDrop: "2026-11-25T00:00:00+01:00", // launch countdown (Morocco time)
  defaultLang: "fr"
};

/* Text fields are { fr, en, ar }. Prices in MAD. oldPrice shows as crossed out. */
window.OFFGRID_PRODUCTS = [
  {
    id: "new-future",
    name: "New Future",
    price: 270, oldPrice: 400,
    color: { hex: "#EDE6D8", key: "white", fr: "Blanc", en: "White", ar: "أبيض" },
    tagline: { fr: "Same people. New dreams. Bigger goals.", en: "Same people. New dreams. Bigger goals.", ar: "نفس الناس. أحلام جديدة. أهداف أكبر." },
    description: {
      fr: "Un hoodie blanc au style streetwear minimaliste, sublimé par un design papillon original qui symbolise la liberté et la transformation. Des détails soigneusement pensés pour un look unique, frais et intemporel.",
      en: "A white hoodie with a minimalist streetwear style, elevated by an original butterfly design that stands for freedom and transformation. Carefully thought-out details for a unique, fresh and timeless look.",
      ar: "هودي أبيض بأسلوب ستريتوير بسيط، يزيّنه تصميم فراشة أصلي يرمز إلى الحرية والتحوّل. تفاصيل مدروسة بعناية لإطلالة فريدة، منعشة وخالدة."
    },
    sizes: ["S", "M", "L"],
    images: ["nf-1", "nf-2", "nf-3"],
    card: "nf-1", hover: "nf-2", photos: true
  },
  {
    id: "radio-dreams",
    name: "Radio Dreams",
    price: 270, oldPrice: 400,
    color: { hex: "#141414", key: "black", fr: "Noir", en: "Black", ar: "أسود" },
    tagline: { fr: "Tune in to better days.", en: "Tune in to better days.", ar: "التقط إشارة أيام أفضل." },
    description: {
      fr: "Un hoodie oversize noir au caractère streetwear affirmé, inspiré de l'univers rétro-futuriste. Son impression au dos mêle une illustration de satellite, une typographie dynamique et des détails étoilés pour un effet visuel unique. Les touches crème apportent un contraste élégant, tandis que le petit logo sur la poitrine complète parfaitement le design.",
      en: "A black oversized hoodie with a bold streetwear character, inspired by the retro-futuristic universe. Its back print mixes a satellite illustration, dynamic typography and star details for a unique visual effect. Cream accents add an elegant contrast, while the small chest logo completes the design perfectly.",
      ar: "هودي أسود واسع بطابع ستريتوير قوي، مستوحى من عالم الريترو المستقبلي. تجمع الطباعة الخلفية بين رسم لطبق القمر الصناعي وخط ديناميكي وتفاصيل نجمية لتأثير بصري فريد. لمسات الكريمي تضيف تباينًا أنيقًا، بينما يكمل الشعار الصغير على الصدر التصميم بشكل مثالي."
    },
    images: ["rd-1", "rd-2"],
    card: "rd-1", hover: "rd-2", photos: true
  },
  {
    id: "static-frequency",
    name: "Static Frequency",
    price: 270, oldPrice: 400,
    color: { hex: "#1B2740", key: "navy", fr: "Bleu nuit", en: "Midnight blue", ar: "أزرق ليلي" },
    tagline: { fr: "Rétro radio. Identité affirmée.", en: "Retro radio. Strong identity.", ar: "راديو ريترو. هوية واضحة." },
    description: {
      fr: "Un hoodie oversize bleu nuit inspiré de l'univers vintage et de la culture radio rétro. Son graphisme exclusif mêle typographie audacieuse, détails techniques et touches orange pour un look streetwear unique. Un modèle qui affirme son identité sans en faire trop.",
      en: "A midnight-blue oversized hoodie inspired by vintage style and retro radio culture. Its exclusive graphic mixes bold typography, technical details and orange accents for a unique streetwear look. A piece that shows its identity without overdoing it.",
      ar: "هودي واسع بلون أزرق ليلي مستوحى من العالم الكلاسيكي وثقافة الراديو القديمة. يمزج تصميمه الحصري بين خط جريء وتفاصيل تقنية ولمسات برتقالية لإطلالة ستريتوير فريدة. قطعة تعبّر عن هويتها دون مبالغة."
    },
    images: ["sf-1", "sf-3", "sf-2", "sf-4", "film-3"],
    card: "sf-1", hover: "sf-3", photos: true
  },
  {
    id: "lost-souls",
    name: "Lost Souls",
    price: 270, oldPrice: 400,
    color: { hex: "#4A5A34", key: "green", fr: "Vert olive", en: "Olive green", ar: "أخضر زيتوني" },
    tagline: { fr: "Made to stand out.", en: "Made to stand out.", ar: "صُنع ليتميّز." },
    description: {
      fr: "Un hoodie oversize vert olive au style vintage streetwear. Un design exclusif avec des détails graphiques audacieux et une impression crème effet rétro. Made to stand out, designed to be different.",
      en: "An olive-green oversized hoodie with a vintage streetwear style. An exclusive design with bold graphic details and a retro-effect cream print. Made to stand out, designed to be different.",
      ar: "هودي واسع بلون أخضر زيتوني بأسلوب ستريتوير كلاسيكي. تصميم حصري بتفاصيل جرافيكية جريئة وطباعة كريمية بتأثير ريترو. صُنع ليتميّز، وصُمّم ليكون مختلفًا."
    },
    images: ["ls-1", "ls-2"],
    card: "ls-1", hover: "ls-2", photos: true
  }
];
