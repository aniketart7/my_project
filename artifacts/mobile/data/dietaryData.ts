import { DietaryPreference } from "@/context/PregnancyContext";

/**
 * Preference-specific diet additions per trimester.
 * These are merged with (or partially replace) the base week diet tips.
 */
export interface PreferenceDietItem {
  label: string;
  preference: DietaryPreference[];
}

// Per-trimester protein sources by preference
const PROTEIN_SOURCES: Record<DietaryPreference, string[]> = {
  veg: [
    "Protein from legumes: lentils, chickpeas, black beans (cooked well)",
    "Paneer, tofu, and tempeh for complete amino acids",
    "Greek yogurt and cottage cheese daily",
    "Nuts and seeds: almonds, walnuts, chia, hemp seeds",
  ],
  nonveg: [
    "Lean chicken breast or turkey: thoroughly cooked to 165°F",
    "Eggs (fully cooked): scrambled, boiled, or poached",
    "Salmon or sardines 2x/week for omega-3 (avoid high-mercury fish)",
    "Lean beef or lamb in moderation for iron and zinc",
  ],
  vegan: [
    "Complete proteins: quinoa, soy milk, edamame, tofu",
    "Lentil and legume dishes cooked with turmeric and cumin",
    "Hemp seeds and chia seeds in smoothies for omega-3",
    "B12 supplement is essential — take daily without fail",
  ],
};

const CALCIUM_SOURCES: Record<DietaryPreference, string[]> = {
  veg: [
    "Dairy: milk, yogurt, paneer, cheese for calcium",
    "Fortified plant milk as a supplement",
    "Sesame seeds (til) and ragi for plant calcium",
  ],
  nonveg: [
    "Dairy products and canned salmon/sardines with bones",
    "Fortified orange juice for additional calcium",
    "Bone broth: simmer bones for 8h for bioavailable minerals",
  ],
  vegan: [
    "Fortified plant milk (almond, soy, oat): 3 cups daily",
    "Calcium-set tofu, kale, bok choy, broccoli",
    "Calcium supplement (calcium citrate form absorbs best)",
    "Tahini (sesame paste) in dressings and dips",
  ],
};

const IRON_SOURCES: Record<DietaryPreference, string[]> = {
  veg: [
    "Iron from plant sources: spinach, lentils, fortified cereals",
    "Pair iron-rich foods with vitamin C (lemon, tomato) to boost absorption",
    "Avoid tea/coffee within 1 hour of iron-rich meals",
    "Cooked tomatoes, jaggery, dates are iron-rich Indian options",
  ],
  nonveg: [
    "Heme iron from red meat absorbs 3x better than plant iron",
    "Chicken liver once a week: extremely high in iron and B12",
    "Pair red meat with colorful vegetables for balanced nutrition",
  ],
  vegan: [
    "Iron from: lentils, chickpeas, tofu, pumpkin seeds, dried apricots",
    "Cast iron cookware leaches iron into food — use it!",
    "Vitamin C with every iron-rich meal is non-negotiable for vegans",
    "Iron supplement likely needed — consult your OB",
  ],
};

const OMEGA3_SOURCES: Record<DietaryPreference, string[]> = {
  veg: [
    "ALA omega-3: flaxseed (ground), chia seeds, walnuts",
    "Consider algae-based DHA supplement — same source fish get omega-3 from",
    "Hemp oil or flaxseed oil in salad dressings (not for cooking)",
  ],
  nonveg: [
    "Fatty fish 2x/week: salmon, sardines, mackerel (low mercury)",
    "Cod liver oil supplement for combined DHA + vitamin D",
    "Eggs from omega-3 enriched hens are a great daily source",
  ],
  vegan: [
    "DHA/EPA from algae oil supplement — essential for vegan pregnancies",
    "Ground flaxseed in oatmeal or smoothies every day",
    "Walnuts: 7 halves daily provide ALA omega-3",
  ],
};

export const FOOD_AVOIDANCE: Record<DietaryPreference, string[]> = {
  veg: [
    "Avoid unpasteurized cheeses (soft brie, camembert, blue cheese)",
    "Avoid raw sprouts — they harbor bacteria",
    "Limit caffeine: 1 small coffee or 2 teas per day maximum",
    "Avoid excess vitamin A supplements (not from food)",
  ],
  nonveg: [
    "Avoid raw/undercooked meat, poultry, and eggs completely",
    "Avoid high-mercury fish: shark, swordfish, king mackerel, tilefish",
    "Avoid deli meats and hot dogs unless heated until steaming",
    "Avoid raw shellfish, sushi, sashimi, and raw oysters",
    "Limit caffeine: 200mg/day maximum",
  ],
  vegan: [
    "Avoid raw sprouts, unpasteurized juices",
    "Watch for B12, D3, iodine, zinc — all common vegan deficiencies in pregnancy",
    "Limit soy to 2-3 servings/day (some phytoestrogen concern at high doses)",
    "Avoid excess seaweed: iodine toxicity risk",
  ],
};

/**
 * Returns preference-aware diet tips for a given week and preference.
 * Returns a curated, personalized list of 4-6 items.
 */
export function getPersonalizedDiet(
  baseDiet: string[],
  week: number,
  preference: DietaryPreference
): string[] {
  const trimester = week <= 12 ? 1 : week <= 27 ? 2 : 3;

  const proteinTip = PROTEIN_SOURCES[preference][Math.min(week % 4, PROTEIN_SOURCES[preference].length - 1)];
  const calciumTip = CALCIUM_SOURCES[preference][Math.min(week % 3, CALCIUM_SOURCES[preference].length - 1)];
  const ironTip = IRON_SOURCES[preference][Math.min(week % 4, IRON_SOURCES[preference].length - 1)];
  const omegaTip = OMEGA3_SOURCES[preference][Math.min(week % 3, OMEGA3_SOURCES[preference].length - 1)];
  const avoidTip = FOOD_AVOIDANCE[preference][Math.min(week % FOOD_AVOIDANCE[preference].length, FOOD_AVOIDANCE[preference].length - 1)];

  // Filter base diet to remove items that contradict preference
  const filteredBase = baseDiet.filter((item) => {
    const lower = item.toLowerCase();
    if (preference === "veg" || preference === "vegan") {
      if (lower.includes("meat") || lower.includes("chicken") || lower.includes("beef") ||
          lower.includes("salmon") || lower.includes("sardine") || lower.includes("fish") ||
          lower.includes("liver") || lower.includes("cod") || lower.includes("lamb") ||
          lower.includes("shellfish") || lower.includes("oyster")) {
        return false;
      }
    }
    if (preference === "vegan") {
      if (lower.includes("dairy") || lower.includes("milk") || lower.includes("yogurt") ||
          lower.includes("paneer") || lower.includes("cheese") || lower.includes("egg") ||
          lower.includes("ghee") || lower.includes("butter") || lower.includes("honey")) {
        return false;
      }
    }
    return true;
  });

  const personalizedItems: string[] = [];

  // Always include protein and a core base tip
  personalizedItems.push(proteinTip);

  if (filteredBase.length > 0) {
    personalizedItems.push(filteredBase[0]);
  }

  // Trimester-specific focus
  if (trimester === 1) {
    personalizedItems.push("Folate-rich foods: leafy greens, lentils, fortified grains");
    personalizedItems.push(preference === "vegan" ? "Ginger tea (no honey) for morning sickness" : "Ginger tea or ginger candies for morning sickness");
  } else if (trimester === 2) {
    personalizedItems.push(ironTip);
    personalizedItems.push(calciumTip);
  } else {
    personalizedItems.push(omegaTip);
    personalizedItems.push(calciumTip);
    personalizedItems.push("Energy foods for labor preparation: oats, dates, sweet potatoes");
  }

  // Add a base tip if room
  if (filteredBase.length > 1 && personalizedItems.length < 6) {
    personalizedItems.push(filteredBase[1]);
  }

  // Add avoidance tip
  personalizedItems.push(avoidTip);

  return personalizedItems;
}

export const DIETARY_LABELS: Record<DietaryPreference, string> = {
  veg: "Vegetarian",
  nonveg: "Non-Vegetarian",
  vegan: "Vegan",
};

export const DIETARY_ICONS: Record<DietaryPreference, string> = {
  veg: "🥦",
  nonveg: "🍗",
  vegan: "🌱",
};

export const DIETARY_COLORS: Record<DietaryPreference, string> = {
  veg: "#6db58a",
  nonveg: "#e07a5f",
  vegan: "#81b29a",
};
