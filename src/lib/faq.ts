export type FaqItem = {
  question: string;
  answer: string;
};

export const FAQ_PAGE_DESCRIPTION =
  "Frequently asked questions for Indonesian Cafe in Crookes, Sheffield: halal Indonesian food, takeaway, vegetarian options, opening hours, location, and coffee and bakery details.";

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Is the food halal?",
    answer:
      "Yes. We're a halal kitchen. Everything we serve is prepared with 100% halal ingredients.",
  },
  {
    question: "Do you offer takeaway?",
    answer: "Yes. You're welcome to eat in with us or take food and drinks away.",
  },
  {
    question: "Do you have vegetarian options?",
    answer:
      "Yes. We have vegetarian dishes on the menu, including Capcai Veggie + Rice. For Gado-Gado / Indonesian Salad, ask us and we can make it vegan-friendly.",
  },
  {
    question: "Do you handle allergies?",
    answer:
      "Please tell us about any allergies or dietary requirements before you order. Our kitchen also handles nuts and other allergens, so we need to know to help you safely.",
  },
  {
    question: "What are your opening hours?",
    answer:
      "We're open 10 am to 8 pm on Monday, Wednesday, Thursday, Friday, Saturday, and Sunday. We're closed on Tuesday. Bank holiday hours may differ.",
  },
  {
    question: "Where are you located?",
    answer: "You'll find us at 15 Crookes, Sheffield S10 1UA.",
  },
  {
    question: "Do you serve coffee and bakery items?",
    answer:
      "Yes. Alongside our halal Indonesian food, we serve coffee and bakery favourites.",
  },
  {
    question: "Do I need to book?",
    answer:
      "No booking needed. Just walk in while we're open and we'll get you seated when we can.",
  },
] as const;
