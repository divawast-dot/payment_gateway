// Dummy catalog standing in for real Amazon/Flipkart/Zepto marketplace APIs — same product
// set/theme as the team's payment_gateway UI, extended with ratings and coupons for the chat flow.
const PRODUCTS = [
  {
    id: "vitamin-c",
    name: "Vitamin C 1000mg",
    category: "Vitamins & Minerals",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Redoxon_Vita_Guard_Ace%2B_Vitamin_C_standard_tablets.jpg/330px-Redoxon_Vita_Guard_Ace%2B_Vitamin_C_standard_tablets.jpg",
    description: "Immune-support tablets with 1000mg vitamin C per serving.",
    rating: 4.5,
    reviewCount: 312,
    vendors: [
      { name: "Amazon", price: 349 },
      { name: "Flipkart", price: 399 },
      { name: "Zepto", price: 329 }
    ]
  },
  {
    id: "multivitamin",
    name: "Daily Multivitamin",
    category: "Vitamins & Minerals",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Centrum_multivitamin_pills.jpg/500px-Centrum_multivitamin_pills.jpg",
    description: "A daily blend of essential vitamins and minerals.",
    rating: 4.3,
    reviewCount: 198,
    vendors: [
      { name: "Amazon", price: 449 },
      { name: "Flipkart", price: 429 },
      { name: "Zepto", price: 469 }
    ]
  },
  {
    id: "iron-folic",
    name: "Iron + Folic Acid",
    category: "Vitamins & Minerals",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/B_vitamin_supplement_tablets.jpg/500px-B_vitamin_supplement_tablets.jpg",
    description: "Supports healthy red blood cell production.",
    rating: 4.4,
    reviewCount: 156,
    vendors: [
      { name: "Amazon", price: 299 },
      { name: "Flipkart", price: 279 },
      { name: "Zepto", price: 309 }
    ]
  },
  {
    id: "whey-protein",
    name: "Whey Protein Isolate",
    category: "Protein",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Bodybuilding_supplement_high_protein_drink_mix_700g.jpg/500px-Bodybuilding_supplement_high_protein_drink_mix_700g.jpg",
    description: "25g protein per scoop to support muscle recovery.",
    rating: 4.6,
    reviewCount: 421,
    vendors: [
      { name: "Amazon", price: 2499 },
      { name: "Flipkart", price: 2599 },
      { name: "Zepto", price: 2399 }
    ]
  },
  {
    id: "plant-protein",
    name: "Plant Protein Blend",
    category: "Protein",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Chocolate_Pea_Protein_Powder.jpg/500px-Chocolate_Pea_Protein_Powder.jpg",
    description: "22g plant-based protein from pea and brown rice.",
    rating: 4.2,
    reviewCount: 134,
    vendors: [
      { name: "Amazon", price: 2199 },
      { name: "Flipkart", price: 2299 },
      { name: "Zepto", price: 2249 }
    ]
  },
  {
    id: "ashwagandha",
    name: "Ashwagandha Extract",
    category: "Herbal & Wellness",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Ashwagandha_Powder_and_Root_on_Spoons_-_50191697031.jpg/500px-Ashwagandha_Powder_and_Root_on_Spoons_-_50191697031.jpg",
    description: "Adaptogenic herb extract to help manage stress.",
    rating: 4.4,
    reviewCount: 267,
    vendors: [
      { name: "Amazon", price: 549 },
      { name: "Flipkart", price: 519 },
      { name: "Zepto", price: 559 }
    ]
  },
  {
    id: "turmeric",
    name: "Turmeric Curcumin",
    category: "Herbal & Wellness",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Turmeric_Powder_on_a_Spoon_-_Black_Background.jpg/500px-Turmeric_Powder_on_a_Spoon_-_Black_Background.jpg",
    description: "High-potency curcumin with black pepper extract.",
    rating: 4.5,
    reviewCount: 289,
    vendors: [
      { name: "Amazon", price: 499 },
      { name: "Flipkart", price: 479 },
      { name: "Zepto", price: 519 }
    ]
  },
  {
    id: "omega-3",
    name: "Omega-3 Fish Oil",
    category: "Heart & Brain",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Lachs%C3%B6lkapsel.jpg/500px-Lachs%C3%B6lkapsel.jpg",
    description: "Purified fish oil capsules rich in EPA and DHA.",
    rating: 4.6,
    reviewCount: 356,
    vendors: [
      { name: "Amazon", price: 599 },
      { name: "Flipkart", price: 649 },
      { name: "Zepto", price: 579 }
    ]
  },
  {
    id: "coq10",
    name: "CoQ10 Softgels",
    category: "Heart & Brain",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Health_Supplements_-_Nutraceuticals_-_50191152323.jpg/500px-Health_Supplements_-_Nutraceuticals_-_50191152323.jpg",
    description: "Antioxidant support for heart and cellular energy.",
    rating: 4.3,
    reviewCount: 142,
    vendors: [
      { name: "Amazon", price: 899 },
      { name: "Flipkart", price: 949 },
      { name: "Zepto", price: 879 }
    ]
  },
  {
    id: "probiotics",
    name: "Probiotic Complex",
    category: "Gut & Digestive",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Foto_Plusbiotic_30_c%C3%A1psulas_JPG.jpg/500px-Foto_Plusbiotic_30_c%C3%A1psulas_JPG.jpg",
    description: "10 billion CFU blend to support gut health.",
    rating: 4.4,
    reviewCount: 203,
    vendors: [
      { name: "Amazon", price: 799 },
      { name: "Flipkart", price: 749 },
      { name: "Zepto", price: 819 }
    ]
  },
  {
    id: "digestive-enzymes",
    name: "Digestive Enzymes",
    category: "Gut & Digestive",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/C%C3%A1psulas.jpg/500px-C%C3%A1psulas.jpg",
    description: "Enzyme blend to support healthy digestion.",
    rating: 4.1,
    reviewCount: 98,
    vendors: [
      { name: "Amazon", price: 649 },
      { name: "Flipkart", price: 629 },
      { name: "Zepto", price: 669 }
    ]
  }
];

const CATEGORIES = [...new Set(PRODUCTS.map((p) => p.category))];

const DOCTORS_BY_SPECIALIZATION = {
  "General Physician": { name: "Dr. Anjali Rao", slots: ["Mon 10:00 AM", "Wed 2:00 PM", "Fri 4:00 PM"] },
  Nutritionist: { name: "Dr. Kevin Fernandes", slots: ["Tue 11:00 AM", "Thu 3:00 PM"] },
  Dietician: { name: "Dr. Meera Iyer", slots: ["Mon 1:00 PM", "Wed 5:00 PM"] },
  Cardiologist: { name: "Dr. Sanjay Gupta", slots: ["Tue 9:00 AM", "Fri 11:00 AM"] },
  "Ayurveda Specialist": { name: "Dr. Priya Nair", slots: ["Mon 4:00 PM", "Thu 10:00 AM"] }
};

const SPECIALIZATIONS = Object.keys(DOCTORS_BY_SPECIALIZATION);

const COUPONS = {
  DRTRACKER10: { type: "percent", value: 10, description: "10% off your order" },
  WELCOME50: { type: "flat", value: 50, minSubtotal: 500, description: "₹50 off orders over ₹500" },
  BULK15: { type: "percent", value: 15, minSubtotal: 2000, description: "15% off orders over ₹2000" }
};

const sessions = new Map();

function getSession(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      cart: [], // { productId, vendorName, price }
      appliedCoupon: null,
      bookings: [], // { doctor, specialization, time }
      history: []
    });
  }
  return sessions.get(sessionId);
}

function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id);
}

module.exports = {
  PRODUCTS,
  CATEGORIES,
  COUPONS,
  SPECIALIZATIONS,
  DOCTORS_BY_SPECIALIZATION,
  getSession,
  getProductById
};
