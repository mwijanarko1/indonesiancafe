export type PricedMenuItem = {
  name: string;
  price: string;
  /** `false` hides the item on the site (same as Convex). Omitted or `true` = shown. */
  isAvailable?: boolean;
};

export type DrinkMenuItem = {
  name: string;
  /** Price for hot serving, if applicable */
  hot: string | null;
  /** Price for iced serving, if applicable */
  iced: string | null;
  /** `false` hides the row on the site (same as Convex). Omitted or `true` = shown. */
  isAvailable?: boolean;
};

export type DrinkMenuGroup = {
  title: string;
  items: DrinkMenuItem[];
};

export type MenuCategory =
  | {
      id: string;
      label: string;
      subtitle?: string;
      variant: "priced";
      items: PricedMenuItem[];
    }
  | {
      id: string;
      label: string;
      variant: "drinks";
      groups: DrinkMenuGroup[];
    };

export const MENU_IMAGE_FOOD = "/indo-cafe-menu.jpg";
export const MENU_IMAGE_DRINKS = "/indo-cafe-drinks-menu.jpg";

/** Full menu payload for Convex fallback and seed parity (`convex/defaultSiteMenu.ts`). */
export type SiteMenuContent = {
  disclaimer: string;
  footerTagline: string;
  foodMenuImageUrl: string;
  drinksMenuImageUrl: string;
  categories: MenuCategory[];
};

export const DEFAULT_DISCLAIMER =
  "Food is prepared in a kitchen that handles nuts and other allergens — please ask staff when you order. Prices may be updated in venue.";

export const DEFAULT_FOOTER_TAGLINE = "Indonesian Cafe · Crookes, Sheffield";

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: "breakfast",
    label: "Breakfast",
    subtitle: "From 8 till 11",
    variant: "priced",
    items: [
      { name: "Butter kaya toast", price: "£3.50" },
      { name: "Poached / fried eggs on toast", price: "£5.50" },
      { name: "Indomie goreng", price: "£5.00" },
      { name: "Indomie rebus", price: "£5.00" },
      { name: "Breakfast BAP", price: "£4.50" },
      { name: "Cereal + milk", price: "£2.50" },
      { name: "Full breakfast", price: "£10.50" },
    ],
  },
  {
    id: "mains",
    label: "Main menu",
    variant: "priced",
    items: [
      { name: "Rendang beef + rice", price: "£12.80" },
      { name: "Beef black pepper + rice", price: "£12.00" },
      { name: "Chicken curry + rice", price: "£11.80" },
      { name: "Chicken sweet sauce + rice", price: "£11.50" },
      { name: "Chicken katsu curry + rice", price: "£12.00" },
      { name: "Ayam geprek + rice", price: "£13.50" },
      { name: "Ayam sambal merah + rice", price: "£13.50" },
      { name: "Chicken stroganoff + rice", price: "£12.50" },
      { name: "Seafood / beef fried rice", price: "£13.00" },
      { name: "Chicken fried rice", price: "£12.00" },
      { name: "Seafood / beef fried noodles", price: "£12.70" },
      { name: "Fish & chips", price: "£12.00" },
      { name: "Scampi & chips", price: "£11.50" },
      { name: "Bakso daging", price: "£10.80" },
      { name: "Bakso ikan", price: "£10.50" },
      { name: "Mie ayam", price: "£10.50" },
      { name: "Mie ayam bakso", price: "£13.50" },
      { name: "Capcai chicken + rice", price: "£12.50" },
      { name: "Capcai veggie + rice", price: "£10.50" },
      { name: "Chicken fried noodles", price: "£12.00" },
    ],
  },
  {
    id: "nasi-padang",
    label: "Nasi Padang",
    variant: "priced",
    items: [
      { name: "Nasi Padang komplit", price: "£15.80" },
      { name: "Paket A", price: "£13.50" },
      { name: "Paket B", price: "£12.50" },
    ],
  },
  {
    id: "packed-lunch",
    label: "Packed lunch",
    variant: "priced",
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
    variant: "priced",
    items: [
      { name: "Kue cubit", price: "£5.50" },
      { name: "Pisang goreng keju", price: "£6.50" },
      { name: "Pisang bakar santan", price: "£8.00" },
      { name: "Bolen / pisang pastry", price: "£4.50" },
    ],
  },
  {
    id: "sides",
    label: "Side dishes",
    variant: "priced",
    items: [
      { name: "Mini spring roll", price: "£6.00" },
      { name: "Chicken spring roll", price: "£6.00" },
      { name: "Prawn toast", price: "£5.50" },
      { name: "King butterfly prawn", price: "£6.00" },
      { name: "Gado-gado", price: "£5.00" },
      { name: "Tahu isi", price: "£5.00" },
      { name: "Batagor", price: "£8.00" },
      { name: "Tempeh mendoan", price: "£5.00" },
      { name: "Chicken satay", price: "£5.50" },
      { name: "Chips", price: "£2.50" },
      { name: "Kerak telor Batam", price: "£6.00" },
      { name: "Cireng", price: "£5.00" },
      { name: "Epok-epok lumpia", price: "£5.50" },
      { name: "Gado-gado / Indonesian salad", price: "£10.50" },
    ],
  },
  {
    id: "drinks",
    label: "Drinks",
    variant: "drinks",
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
];

export const DEFAULT_SITE_MENU: SiteMenuContent = {
  disclaimer: DEFAULT_DISCLAIMER,
  footerTagline: DEFAULT_FOOTER_TAGLINE,
  foodMenuImageUrl: MENU_IMAGE_FOOD,
  drinksMenuImageUrl: MENU_IMAGE_DRINKS,
  categories: MENU_CATEGORIES,
};

/** Removes items with `isAvailable: false` and drops empty categories/groups. */
export function filterUnavailableMenuItems(content: SiteMenuContent): SiteMenuContent {
  return {
    ...content,
    categories: content.categories
      .map((cat) => {
        if (cat.variant === "priced") {
          const items = cat.items.filter((i) => i.isAvailable !== false);
          if (items.length === 0) return null;
          return { ...cat, items };
        }
        const groups = cat.groups
          .map((g) => ({
            ...g,
            items: g.items.filter((r) => r.isAvailable !== false),
          }))
          .filter((g) => g.items.length > 0);
        if (groups.length === 0) return null;
        return { ...cat, groups };
      })
      .filter((c): c is MenuCategory => c !== null),
  };
}
