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
          name: "Butter kaya toast",
          price: "£3.50",
          description:
            "Toast with spread of srikaya and block of butter in the middle",
        },
        {
          name: "Poached / fried eggs on toast",
          price: "£5.50",
          description: "Poached or fried egg on toast with beans",
        },
        {
          name: "Indomie goreng",
          price: "£5.00",
          description: "Warung style fried noodles with eggs and salad",
        },
        {
          name: "Indomie rebus",
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
          name: "Cereal + milk",
          price: "£2.50",
          description:
            "A portion size cereal of your choosing with a bowl of milk — please ask the staff for options",
        },
        {
          name: "Full breakfast",
          price: "£10.50",
          description:
            "A full breakfast with beef sausage, chopped potato, mushroom, hash brown, beans, egg, tomato",
        },
      ],
    },
    {
      id: "mains",
      label: "Main menu",
      variant: "priced" as const,
      items: [
        {
          name: "Rendang beef + rice",
          price: "£12.80",
          description:
            "A rich slow cooked beef in coconut milk with special family recipe spices until tender",
        },
        {
          name: "Beef black pepper + rice",
          price: "£12.00",
          description:
            "Sliced beef stir fried with black pepper sauce, soy sauce, carrot, red & green pepper and onions",
        },
        {
          name: "Chicken curry + rice",
          price: "£11.80",
          description:
            "A traditional Indonesian chicken curry, a specialty of West Sumatra — perfect meal to start the day. Not spicy unless requested",
        },
        {
          name: "Chicken sweet sauce + rice",
          price: "£11.50",
          description:
            "Fried chicken coated in a sauce of ketchup, vinegar, honey, soy sauce and pineapple for a tangy flavour",
        },
        {
          name: "Chicken katsu curry + rice",
          price: "£12.00",
          description:
            "Fried chicken cutlet coated in panko breadcrumbs, served with curry sauce over rice",
        },
        {
          name: "Ayam geprek + rice",
          price: "£13.50",
          description:
            "Crispy fried chicken smashed / geprek and mixed with fiery spicy sambal",
        },
        {
          name: "Ayam sambal merah + rice",
          price: "£13.50",
          description:
            "Chicken simmered in a rich, sweet tomato-based sauce — often served for special occasions",
        },
        {
          name: "Chicken stroganoff + rice",
          price: "£12.50",
          description:
            "Chicken breast with soured cream, mushrooms and fresh herbs",
        },
        {
          name: "Seafood / beef fried rice",
          price: "£13.00",
          description:
            "Fried rice with mixed seafood and vegetables, served with prawn crackers",
        },
        {
          name: "Chicken fried rice",
          price: "£12.00",
          description:
            "Fried rice with chicken and vegetables, served with prawn crackers",
        },
        {
          name: "Seafood / beef fried noodles",
          price: "£12.70",
          description:
            "Fried noodles with mixed seafood and vegetables — vermicelli rice noodles or egg noodles",
        },
        {
          name: "Fish & chips",
          price: "£12.00",
          description:
            "Haddock in homemade batter for a crispy meal, with tartar sauce",
        },
        {
          name: "Scampi & chips",
          price: "£11.50",
          description: "Deep fried scampi with tartar sauce",
        },
        {
          name: "Bakso daging",
          price: "£10.80",
          description:
            "Indonesian style meatballs with noodles and a hearty vegetable broth",
        },
        {
          name: "Bakso ikan",
          price: "£10.50",
          description: "Fish balls with noodles and a hearty vegetable broth",
        },
        {
          name: "Mie ayam",
          price: "£10.50",
          description:
            "Egg noodles with diced chicken, salty soy sauce and chicken broth",
        },
        {
          name: "Mie ayam bakso",
          price: "£13.50",
          description:
            "Diced chicken and beef meatballs with egg noodles and chicken broth — great to warm you up",
        },
        {
          name: "Capcai chicken + rice",
          price: "£12.50",
          description:
            "Indonesian style stir fry with broccoli, cauliflower, bok choy, carrots and onions — cooked fresh every time",
        },
        {
          name: "Capcai veggie + rice",
          price: "£10.50",
          description:
            "Indonesian style stir fry with broccoli, cauliflower, bok choy, carrots and onions — cooked fresh every time",
        },
        {
          name: "Chicken fried noodles",
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
          name: "Nasi Padang komplit",
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
      label: "Packed lunch",
      subtitle:
        "Sandwich fillings of choice: tuna mayo, egg mayo, cheese — ask staff when ordering",
      variant: "priced" as const,
      items: [
        { name: "Sandwich", price: "£3.50" },
        { name: "Sandwich + chip", price: "£6.00" },
        { name: "Sandwich + coffee or tea", price: "£5.50" },
        {
          name: "Sandwich + coffee or tea + chocolate bar / crisp",
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
          name: "Kue cubit",
          price: "£5.50",
          description: "Small pinch-size snack cakes with chocolate sprinkles",
        },
        {
          name: "Pisang goreng keju",
          price: "£6.50",
          description:
            "Banana fritters topped with grated cheese and condensed milk",
        },
        {
          name: "Pisang bakar santan",
          price: "£8.00",
          description:
            "Grilled bananas with sweet coconut milk sauce and gobri / crackers",
        },
        {
          name: "Bolen / pisang pastry",
          price: "£4.50",
          description: "Slice of banana with chocolate and cheese inside pastry",
        },
      ],
    },
    {
      id: "sides",
      label: "Side dish menu",
      variant: "priced" as const,
      items: [
        {
          name: "Mini spring roll",
          price: "£6.00",
          description:
            "Chicken, carrots, vermicelli and cabbage, mixed with vegetables, deep-fried",
        },
        {
          name: "Chicken spring roll",
          price: "£6.00",
          description:
            "Seasoned minced chicken, cabbage, carrots and vermicelli, fried until crispy",
        },
        {
          name: "Prawn toast",
          price: "£5.50",
          description:
            "Bread topped with seasoned minced prawn paste and sesame, fried until golden",
        },
        {
          name: "King butterfly prawn",
          price: "£6.00",
          description: "Deep fried prawns with chilli or sweet sauce",
        },
        {
          name: "Gado-gado",
          price: "£5.00",
          description:
            "Indonesian style vegetable fritters with cabbage, carrots, spring onion and seasoned flour batter",
        },
        {
          name: "Tahu isi",
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
          name: "Tempeh mendoan",
          price: "£5.00",
          description:
            "Thin tempeh in seasoned batter, fried lightly — soft inside, crunchy outside",
        },
        {
          name: "Chicken satay",
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
          name: "Kerak telor Batam",
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
          name: "Epok-epok lumpia",
          price: "£5.50",
          description:
            "Traditional Melayu snack like samosa, with potato and carrot",
        },
        {
          name: "Gado-gado / Indonesian salad",
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
            { name: "Spanish latte", hot: "£3.00", iced: "£3.20" },
            { name: "Salted caramel", hot: "£3.00", iced: "£3.20" },
          ],
        },
        {
          title: "Non-coffee",
          items: [
            { name: "Tea", hot: "£2.00", iced: "£2.50" },
            { name: "Speciality tea", hot: "£2.50", iced: null },
            { name: "Hot chocolate", hot: "£2.50", iced: "£3.00" },
            { name: "Teh tarik", hot: "£3.80", iced: "£4.00" },
            { name: "Matcha", hot: "£3.50", iced: "£3.80" },
            { name: "Milo", hot: "£3.80", iced: "£4.00" },
            { name: "Still & sparkling water", hot: null, iced: "£1.50" },
            { name: "J20 (any flavour)", hot: null, iced: "£2.00" },
            { name: "Soda", hot: null, iced: "£2.00" },
          ],
        },
      ],
    },
  ],
};
