/**
 * Default nested menu for `menu.applyDefaultSeed`. Keep in sync with
 * `DEFAULT_SITE_MENU` in `src/lib/cafe-menu.ts`.
 */
export const defaultSiteMenuRow = {
  key: "default" as const,
  disclaimer:
    "Food is prepared in a kitchen which also processes nuts and other allergens. If you have any specific requirements, please ask. We might be able to fulfil them, though do mind it will take longer.",
  footerTagline: "Indonesian Cafe · Crookes, Sheffield",
  foodMenuImageUrl: "/menu-food.jpeg",
  drinksMenuImageUrl: "/indo-cafe-drinks-menu.jpg",
  categories: [
    {
      id: "mains",
      label: "Main Menu",
      variant: "priced" as const,
      items: [
        {
          name: "Rendang Beef + Rice",
          price: "£12.80",
          description:
            "Rich slow-cooked beef in coconut milk with our family's spice blend, cooked until tender.",
        },
        {
          name: "Chicken Curry + Rice",
          price: "£11.80",
          description:
            "Traditional Indonesian chicken curry, a West Sumatran specialty. Mild unless you ask for spice.",
        },
        {
          name: "Ayam Geprek + Rice",
          price: "£13.50",
          description:
            "Crispy fried chicken smashed (geprek) and tossed in fiery sambal.",
        },
        {
          name: "Nasi Goreng Seafood",
          price: "£13.00",
          description:
            "Fried rice with mixed seafood and vegetables, served with prawn crackers.",
        },
        {
          name: "Nasi Goreng Ayam",
          price: "£12.00",
          description:
            "Fried rice with chicken and vegetables, served with prawn crackers. Vegetarian option available.",
        },
        {
          name: "Mie Goreng Seafood",
          price: "£12.70",
          description:
            "Fried noodles with mixed seafood and vegetables, served with vermicelli or egg noodles.",
        },
        {
          name: "Mie Goreng Chicken",
          price: "£12.00",
          description:
            "Fried noodles with chicken and vegetables, served with vermicelli or egg noodles. Vegetarian option available.",
        },
        {
          name: "Mie Curry Laksa Seafood",
          price: "£12.00",
          description:
            "Yellow egg noodles with fresh prawns (shrimp), fish balls, bean sprouts, tofu, and curry spices.",
        },
        {
          name: "Bakso Daging",
          price: "£10.80",
          description:
            "Indonesian-style beef meatballs with noodles in a hearty vegetable broth.",
        },
        {
          name: "Bakso Ikan",
          price: "£10.50",
          description:
            "Fishballs with noodles in a hearty vegetable broth.",
        },
        {
          name: "Mie Ayam",
          price: "£10.50",
          description:
            "Egg noodles with diced chicken, seasoned soy sauce, and chicken broth.",
        },
        {
          name: "Mie Ayam Bakso",
          price: "£13.50",
          description:
            "Diced chicken and beef meatballs in egg noodles with chicken broth. A hearty bowl to warm you up.",
        },
        {
          name: "Capcai Chicken + Rice",
          price: "£12.50",
          description:
            "Indonesian-style stir-fried vegetables with diced chicken, broccoli, cauliflower, pak choi, carrots, and onions.",
        },
        {
          name: "Capcai Veggie + Rice",
          price: "£10.50",
          description:
            "Indonesian-style stir-fried vegetables with broccoli, cauliflower, pak choi, carrots, and onions, cooked fresh to order.",
        },
        {
          name: "Indomie Goreng",
          price: "£5.00",
          description:
            "Warung-style fried noodles with egg and salad.",
        },
        {
          name: "Kwetiau Goreng/Basah",
          price: "£12.00",
          description:
            "Fresh flat rice noodles with bean sprouts and egg.",
        },
        {
          name: "Mie Lendir",
          price: "£10.50",
          description:
            "Batam and Riau Islands specialty with egg noodles, ebi (shrimp), bean sprouts, and peanut sauce.",
        },
      ],
    },
    {
      id: "nasi-padang",
      label: "Nasi Padang",
      variant: "priced" as const,
      items: [
        {
          name: "Nasi Padang Komplit",
          price: "£15.80",
          description:
            "Rendang beef, chicken curry, egg or omelette, vegetables, and spicy sambal or chilli sauce.",
        },
        {
          name: "Paket A",
          price: "£13.50",
          description:
            "Rendang beef with chilli, rice, egg, and mixed vegetables.",
        },
        {
          name: "Paket B",
          price: "£12.50",
          description:
            "Chicken curry with chilli, rice, egg, and mixed vegetables.",
        },
      ],
    },
    {
      id: "dessert",
      label: "Dessert",
      variant: "priced" as const,
      items: [
        {
          name: "Kue Cubit",
          price: "£5.50",
          description:
            "Bite-sized snack cakes with chocolate sprinkles.",
        },
        {
          name: "Pisang Goreng Keju",
          price: "£6.50",
          description:
            "Banana fritters topped with grated cheese and condensed milk.",
        },
        {
          name: "Bolen/Pisang Pastry",
          price: "£4.50",
          description:
            "Pastry filled with banana, chocolate, and cheese.",
        },
        {
          name: "Butter Kaya Toast",
          price: "£3.50",
          description:
            "Toast with kaya spread and a slab of butter in the middle.",
        },
      ],
    },
    {
      id: "sides",
      label: "Side Dish Menu",
      variant: "priced" as const,
      items: [
        {
          name: "Vegetarian Spring Roll",
          price: "£6.00",
          description:
            "Spring rolls filled with mixed vegetables such as cabbage, carrots, and vermicelli, fried until crispy.",
        },
        {
          name: "Chicken Spring Roll",
          price: "£6.00",
          description:
            "Spring rolls filled with seasoned minced chicken and vegetables, deep-fried until crispy.",
        },
        {
          name: "King Butterfly Prawn",
          price: "£6.00",
          description:
            "Prawns deep-fried and served with chilli or sweet sauce.",
        },
        {
          name: "Bakwan",
          price: "£5.00",
          description:
            "Indonesian-style vegetable fritters made with cabbage, carrots, spring onion, and seasoned flour batter.",
        },
        {
          name: "Tempeh Mendoan",
          price: "£5.00",
          description:
            "Thin slices of tempeh coated in seasoned batter and lightly fried for a soft, crunchy texture.",
        },
        {
          name: "Tahu Isi",
          price: "£5.00",
          description:
            "Fried tofu stuffed with seasoned vegetables such as vermicelli, cabbage, and carrots.",
        },
        {
          name: "Batagor",
          price: "£8.00",
          description:
            "Sundanese specialty of fried tofu served with homemade peanut sauce (contains nuts).",
        },
        {
          name: "Cireng",
          price: "£5.00",
          description:
            "Fried tapioca dough snacks from West Java with spring onion inside, chewy inside and crispy outside.",
        },
        {
          name: "Chicken Satay",
          price: "£5.50",
          description:
            "Skewered chicken served with homemade peanut sauce (contains nuts).",
        },
        {
          name: "Gado-Gado/Indonesian Salad",
          price: "£10.50",
          description:
            "Indonesian salad with boiled egg, potato, tempeh, carrots, fine beans, cucumber, lettuce, cabbage, and homemade peanut sauce (contains nuts). Ask staff to leave out the egg for a vegan version.",
        },
      ],
    },
    {
      id: "drinks",
      label: "Drinks",
      variant: "drinks" as const,
      groups: [
        {
          title: "Coffee",
          items: [
            { name: "Espresso", hot: "£2.50", iced: "£2.70" },
            { name: "Americano", hot: "£2.50", iced: "£2.70" },
            { name: "Cappuccino", hot: "£2.50", iced: "£2.70" },
            { name: "Latte", hot: "£2.50", iced: "£2.70" },
            { name: "Spanish Latte", hot: "£3.00", iced: "£3.20" },
            { name: "Salted Caramel", hot: "£3.00", iced: "£3.20" },
          ],
        },
        {
          title: "Non-Coffee",
          items: [
            { name: "Tea", hot: "£2.00", iced: "£2.50" },
            { name: "Speciality Tea", hot: "£2.50", iced: null },
            { name: "Hot Chocolate", hot: "£2.50", iced: "£3.00" },
            { name: "Teh Tarik", hot: "£3.80", iced: "£4.00" },
            { name: "Matcha", hot: "£3.50", iced: "£3.80" },
            { name: "Milo", hot: "£3.80", iced: "£4.00" },
            { name: "Still & Sparkling Water", hot: null, iced: "£1.50" },
            { name: "J20 (Any Flavour)", hot: null, iced: "£2.00" },
            { name: "Soda", hot: null, iced: "£2.00" },
          ],
        },
      ],
    },
  ],
};
