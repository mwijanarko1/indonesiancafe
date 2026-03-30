/**
 * Default nested menu for `menu.applyDefaultSeed`. Keep in sync with
 * `DEFAULT_SITE_MENU` in `src/lib/cafe-menu.ts`.
 */
export const defaultSiteMenuRow = {
  key: "default" as const,
  disclaimer:
    "Food is prepared in a kitchen which also processes nuts and other allergens. If you have any specific requirements, please ask. We might be able to fulfil them, though do mind it will take longer.",
  footerTagline: "Indonesian Cafe · Crookes, Sheffield",
  foodMenuImageUrl: "/indo-cafe-menu.jpg",
  drinksMenuImageUrl: "/indo-cafe-drinks-menu.jpg",
  categories: [
    {
      id: "breakfast",
      label: "Breakfast",
      subtitle: "From 8 till 11",
      variant: "priced" as const,
      items: [
        {
          name: "Butter Kaya Toast",
          price: "£3.50",
          description:
            "Toast with spread of srikaya and block of butter in the middle",
        },
        {
          name: "Poached / Fried Eggs on Toast",
          price: "£5.50",
          description: "Poached or fried egg on toast with beans",
        },
        {
          name: "Indomie Goreng",
          price: "£5.00",
          description: "Warung style fried noodles with eggs and salad",
        },
        {
          name: "Indomie Rebus",
          price: "£5.00",
          description: "Warung style curry noodles with eggs",
        },
        {
          name: "Breakfast BAP",
          price: "£4.50",
          description:
            "Beef sausage, hash browns (+50p for egg / beans / mushroom)",
        },
        {
          name: "Cereal + Milk",
          price: "£2.50",
          description:
            "A portion size cereal of your choosing with a bowl of milk — please ask the staff for options",
        },
        {
          name: "Full Breakfast",
          price: "£10.50",
          description:
            "A full breakfast with beef sausage, chopped potato, mushroom, hash brown, beans, egg, tomato",
        },
      ],
    },
    {
      id: "mains",
      label: "Main Menu",
      variant: "priced" as const,
      items: [
        {
          name: "Rendang Beef + Rice",
          price: "£12.80",
          description:
            "A rich slow cooked beef in coconut milk with special family recipe spices until tender",
        },
        {
          name: "Beef Black Pepper + Rice",
          price: "£12.00",
          description:
            "Sliced beef stir fried with black pepper sauce, soy sauce, carrot, red & green pepper and onions",
        },
        {
          name: "Chicken Curry + Rice",
          price: "£11.80",
          description:
            "A traditional Indonesian chicken curry, a specialty of West Sumatra — perfect meal to start the day. Not spicy unless requested",
        },
        {
          name: "Chicken Sweet Sauce + Rice",
          price: "£11.50",
          description:
            "Fried chicken coated in a sauce of ketchup, vinegar, honey, soy sauce and pineapple for a tangy flavour",
        },
        {
          name: "Chicken Katsu Curry + Rice",
          price: "£12.00",
          description:
            "Fried chicken cutlet coated in panko breadcrumbs, served with curry sauce over rice",
        },
        {
          name: "Ayam Geprek + Rice",
          price: "£13.50",
          description:
            "Crispy fried chicken smashed / geprek and mixed with fiery spicy sambal",
        },
        {
          name: "Ayam Sambal Merah + Rice",
          price: "£13.50",
          description:
            "Chicken simmered in a rich, sweet tomato-based sauce — often served for special occasions",
        },
        {
          name: "Chicken Stroganoff + Rice",
          price: "£12.50",
          description:
            "Chicken breast with soured cream, mushrooms and fresh herbs",
        },
        {
          name: "Seafood / Beef Fried Rice",
          price: "£13.00",
          description:
            "Fried rice with mixed seafood and vegetables, served with prawn crackers",
        },
        {
          name: "Chicken Fried Rice",
          price: "£12.00",
          description:
            "Fried rice with chicken and vegetables, served with prawn crackers",
        },
        {
          name: "Seafood / Beef Fried Noodles",
          price: "£12.70",
          description:
            "Fried noodles with mixed seafood and vegetables — vermicelli rice noodles or egg noodles",
        },
        {
          name: "Fish & Chips",
          price: "£12.00",
          description:
            "Haddock in homemade batter for a crispy meal, with tartar sauce",
        },
        {
          name: "Scampi & Chips",
          price: "£11.50",
          description: "Deep fried scampi with tartar sauce",
        },
        {
          name: "Bakso Daging",
          price: "£10.80",
          description:
            "Indonesian style meatballs with noodles and a hearty vegetable broth",
        },
        {
          name: "Bakso Ikan",
          price: "£10.50",
          description: "Fish balls with noodles and a hearty vegetable broth",
        },
        {
          name: "Mie Ayam",
          price: "£10.50",
          description:
            "Egg noodles with diced chicken, salty soy sauce and chicken broth",
        },
        {
          name: "Mie Ayam Bakso",
          price: "£13.50",
          description:
            "Diced chicken and beef meatballs with egg noodles and chicken broth — great to warm you up",
        },
        {
          name: "Capcai Chicken + Rice",
          price: "£12.50",
          description:
            "Indonesian style stir fry with broccoli, cauliflower, bok choy, carrots and onions — cooked fresh every time",
        },
        {
          name: "Capcai Veggie + Rice",
          price: "£10.50",
          description:
            "Indonesian style stir fry with broccoli, cauliflower, bok choy, carrots and onions — cooked fresh every time",
        },
        {
          name: "Chicken Fried Noodles",
          price: "£12.00",
          description:
            "Fried noodles with chicken and vegetables — vermicelli rice noodles or egg noodles",
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
            "Rendang beef + chicken curry + egg / omelette + vegetable + spicy sambal / chilli sauce",
        },
        {
          name: "Paket A",
          price: "£13.50",
          description: "Rendang beef + chilli + rice + egg + vegetables mix",
        },
        {
          name: "Paket B",
          price: "£12.50",
          description: "Chicken curry + chilli + rice + egg + vegetable mix",
        },
      ],
    },
    {
      id: "packed-lunch",
      label: "Packed Lunch",
      subtitle:
        "Sandwich fillings of choice: tuna mayo, egg mayo, cheese — ask staff when ordering",
      variant: "priced" as const,
      items: [
        { name: "Sandwich", price: "£3.50" },
        { name: "Sandwich + Chip", price: "£6.00" },
        { name: "Sandwich + Coffee or Tea", price: "£5.50" },
        {
          name: "Sandwich + Coffee or Tea + Chocolate Bar / Crisp",
          price: "£6.00",
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
          description: "Small pinch-size snack cakes with chocolate sprinkles",
        },
        {
          name: "Pisang Goreng Keju",
          price: "£6.50",
          description:
            "Banana fritters topped with grated cheese and condensed milk",
        },
        {
          name: "Pisang Bakar Santan",
          price: "£8.00",
          description:
            "Grilled bananas with sweet coconut milk sauce and gobri / crackers",
        },
        {
          name: "Bolen / Pisang Pastry",
          price: "£4.50",
          description: "Slice of banana with chocolate and cheese inside pastry",
        },
      ],
    },
    {
      id: "sides",
      label: "Side Dish Menu",
      variant: "priced" as const,
      items: [
        {
          name: "Mini Spring Roll",
          price: "£6.00",
          description:
            "Chicken, carrots, vermicelli and cabbage, mixed with vegetables, deep-fried",
        },
        {
          name: "Chicken Spring Roll",
          price: "£6.00",
          description:
            "Seasoned minced chicken, cabbage, carrots and vermicelli, fried until crispy",
        },
        {
          name: "Prawn Toast",
          price: "£5.50",
          description:
            "Bread topped with seasoned minced prawn paste and sesame, fried until golden",
        },
        {
          name: "King Butterfly Prawn",
          price: "£6.00",
          description: "Deep fried prawns with chilli or sweet sauce",
        },
        {
          name: "Gado-Gado",
          price: "£5.00",
          description:
            "Indonesian style vegetable fritters with cabbage, carrots, spring onion and seasoned flour batter",
        },
        {
          name: "Tahu Isi",
          price: "£5.00",
          description:
            "Fried tofu stuffed with seasoned vegetables — vermicelli, cabbage, carrots and bean sprouts",
        },
        {
          name: "Batagor",
          price: "£8.00",
          description:
            "Sundanese speciality: fried tofu, fish dumpling, boiled potatoes with homemade peanut sauce (contains nuts)",
        },
        {
          name: "Tempeh Mendoan",
          price: "£5.00",
          description:
            "Thin tempeh in seasoned batter, fried lightly — soft inside, crunchy outside",
        },
        {
          name: "Chicken Satay",
          price: "£5.50",
          description:
            "Skewered chicken with homemade peanut sauce (contains nuts)",
        },
        {
          name: "Chips",
          price: "£2.50",
          description: "Chips with salt, vinegar and Henderson's",
        },
        {
          name: "Kerak Telor Batam",
          price: "£6.00",
          description:
            "Indonesian style egg takoyaki from Bintan Island, with starch and vegetable",
        },
        {
          name: "Cireng",
          price: "£5.00",
          description:
            "Fried tapioca dough from West Java with spring onion — chewy inside, crispy outside",
        },
        {
          name: "Epok-Epok Lumpia",
          price: "£5.50",
          description:
            "Traditional Melayu snack like samosa, with potato and carrot",
        },
        {
          name: "Gado-Gado / Indonesian Salad",
          price: "£10.50",
          description:
            "Boiled egg, potatoes, tempeh, tofu, carrots, fine beans, cucumber, lettuce, cabbage with homemade peanut sauce (contains nuts). Vegan? Ask staff to omit the egg.",
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
