/* ==========================================================
   SITE SETTINGS — edit this file to update the website.
   No coding knowledge needed: change the text between quotes.
   ========================================================== */
window.SITE = {
  teacher: "Abdullah M. Khalid",
  brand: "Easy Arabic",

  // Contact — bookings and book orders are sent here.
  // WhatsApp: full international number, digits only (e.g. "923001234567").
  whatsapp: "923308600927",
  email: "",

  // Social links (leave "" to hide an icon)
  social: {
    youtube: "",
    instagram: "",
    facebook: "",
    tiktok: ""
  },

  // Optional prices. Leave "" to show "Free trial" / "Enquire" instead.
  prices: {
    easy11: "",
    easyGroup: "",
    quranic11: "",
    quranicGroup: "",
    tajweed11: ""
  },

  /* ---------- Pre-recorded course (YouTube) ----------
     Option A: paste your PLAYLIST id (the part after "list=" in the URL).
     Option B: paste each video id (the part after "v=" in the URL).
     Lesson titles below are placeholders — rename them to match your videos. */
  youtubePlaylistId: "",
  videos: [
    { title: "Welcome & How This Course Works", id: "", mins: "" },
    { title: "The Arabic Alphabet — Part 1", id: "", mins: "" },
    { title: "The Arabic Alphabet — Part 2", id: "", mins: "" },
    { title: "Letter Shapes & Joining", id: "", mins: "" },
    { title: "Short Vowels (Harakat)", id: "", mins: "" },
    { title: "Long Vowels & Sukoon", id: "", mins: "" },
    { title: "Shaddah & Tanween", id: "", mins: "" },
    { title: "Reading Your First Words", id: "", mins: "" },
    { title: "Nouns & the Definite Article", id: "", mins: "" },
    { title: "Masculine & Feminine", id: "", mins: "" },
    { title: "Pronouns", id: "", mins: "" },
    { title: "Simple Sentences", id: "", mins: "" },
    { title: "Everyday Phrases", id: "", mins: "" },
    { title: "Numbers & Counting", id: "", mins: "" },
    { title: "Verbs — Past & Present", id: "", mins: "" },
    { title: "Putting It All Together", id: "", mins: "" }
  ],

  /* ---------- Book ---------- */
  book: {
    title: "Easy Arabic Grammar",
    // Leave a link "" to hide that button. Orders fall back to WhatsApp/email.
    buyPrintUrl: "",
    buyDigitalUrl: "",
    pricePrint: "",
    priceDigital: "",
    // Preview pages: put images in assets/book/ and list them here, e.g.
    // ["assets/book/page-1.jpg", "assets/book/page-2.jpg", ...]
    // While this is empty, the reader shows sample layout pages.
    previewPages: [
      "assets/book/page-1.jpg",
      "assets/book/page-2.jpg",
      "assets/book/page-3.jpg",
      "assets/book/page-4.jpg",
      "assets/book/page-5.jpg",
      "assets/book/page-6.jpg",
      "assets/book/page-7.jpg",
      "assets/book/page-8.jpg",
      "assets/book/page-9.jpg",
      "assets/book/page-10.jpg"
    ]
  }
};
