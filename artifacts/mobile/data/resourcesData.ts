export interface Resource {
  title: string;
  description: string;
  url: string;
  category: string;
}

export interface ResourceCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
  resources: Resource[];
}

export const resourceCategories: ResourceCategory[] = [
  {
    id: "general",
    title: "General Pregnancy",
    icon: "book-open",
    color: "#e8608a",
    resources: [
      {
        title: "What to Expect",
        description: "Week-by-week pregnancy guide, symptoms, and community support",
        url: "https://www.whattoexpect.com/pregnancy/",
        category: "general",
      },
      {
        title: "BabyCenter Pregnancy",
        description: "Pregnancy calendar, fetal development, and expert advice",
        url: "https://www.babycenter.com/pregnancy",
        category: "general",
      },
      {
        title: "WHO: Pregnancy Care",
        description: "World Health Organization's evidence-based pregnancy guidelines",
        url: "https://www.who.int/health-topics/maternal-health",
        category: "general",
      },
      {
        title: "American Pregnancy Association",
        description: "Comprehensive pregnancy health information and resources",
        url: "https://americanpregnancy.org/",
        category: "general",
      },
    ],
  },
  {
    id: "nutrition",
    title: "Diet & Nutrition",
    icon: "coffee",
    color: "#6db58a",
    resources: [
      {
        title: "NHS: Eating in Pregnancy",
        description: "Evidence-based nutrition guide for pregnancy by the UK's NHS",
        url: "https://www.nhs.uk/pregnancy/keeping-well/have-a-healthy-diet/",
        category: "nutrition",
      },
      {
        title: "Healthline Pregnancy Nutrition",
        description: "Science-backed guide to the best foods to eat during pregnancy",
        url: "https://www.healthline.com/nutrition/13-foods-to-eat-when-pregnant",
        category: "nutrition",
      },
      {
        title: "Vegan Pregnancy Nutrition (Reed Mangels, PhD)",
        description: "Complete vegan pregnancy nutrition guide by a registered dietitian",
        url: "https://www.theveganrd.com/vegan-information/vegan-diets-for-pregnant-and-nursing-women/",
        category: "nutrition",
      },
      {
        title: "ACOG: Nutrition During Pregnancy",
        description: "American College of Obstetricians guidelines on prenatal nutrition",
        url: "https://www.acog.org/womens-health/faqs/nutrition-during-pregnancy",
        category: "nutrition",
      },
    ],
  },
  {
    id: "exercise",
    title: "Exercise & Fitness",
    icon: "heart",
    color: "#9b6db5",
    resources: [
      {
        title: "Yoga with Adriene: Prenatal Yoga",
        description: "Free prenatal yoga videos for all trimesters on YouTube",
        url: "https://www.youtube.com/@yogawithadriene",
        category: "exercise",
      },
      {
        title: "ACOG: Exercise During Pregnancy",
        description: "Safe exercise recommendations from OB/GYN experts",
        url: "https://www.acog.org/womens-health/faqs/exercise-during-pregnancy",
        category: "exercise",
      },
      {
        title: "Peanut Ball Exercises (labor preparation)",
        description: "Evidence-based exercises using a peanut ball for labor preparation",
        url: "https://www.evidencebasedbirth.com/peanut-ball/",
        category: "exercise",
      },
      {
        title: "Spinning Babies",
        description: "Exercises and positions to help get baby in optimal birth position",
        url: "https://spinningbabies.com/",
        category: "exercise",
      },
    ],
  },
  {
    id: "mental",
    title: "Mental Health & Mood",
    icon: "sun",
    color: "#f4a261",
    resources: [
      {
        title: "Postpartum Support International",
        description: "Resources for perinatal mental health, anxiety, and depression",
        url: "https://www.postpartum.net/",
        category: "mental",
      },
      {
        title: "Mind: Perinatal Mental Health",
        description: "Understanding and managing mental health during and after pregnancy",
        url: "https://www.mind.org.uk/information-support/types-of-mental-health-problems/postnatal-depression-and-perinatal-mental-health/",
        category: "mental",
      },
      {
        title: "Headspace: Pregnancy Meditation",
        description: "Guided meditations and sleep support specifically for pregnancy",
        url: "https://www.headspace.com/",
        category: "mental",
      },
      {
        title: "Calm: Pregnancy Sleep Stories",
        description: "Sleep and relaxation content designed for pregnant women",
        url: "https://www.calm.com/",
        category: "mental",
      },
    ],
  },
  {
    id: "development",
    title: "Fetal Development",
    icon: "zap",
    color: "#5b8fd6",
    resources: [
      {
        title: "BabyCenter: Fetal Development",
        description: "3D visualizations and descriptions of baby's development each week",
        url: "https://www.babycenter.com/pregnancy/your-baby",
        category: "development",
      },
      {
        title: "The Visible Embryo",
        description: "Scientific guide to human embryonic and fetal development",
        url: "https://www.visembryo.com/",
        category: "development",
      },
      {
        title: "March of Dimes: Baby Development",
        description: "Detailed fetal development guide from a leading research foundation",
        url: "https://www.marchofdimes.org/find-support/topics/pregnancy/baby-growth-during-pregnancy",
        category: "development",
      },
    ],
  },
  {
    id: "dads",
    title: "For Dads & Partners",
    icon: "users",
    color: "#5b8fd6",
    resources: [
      {
        title: "HowDaddy: Dad's Pregnancy Guide",
        description: "Week-by-week guide specifically written for expectant fathers",
        url: "https://www.howdaddy.com/",
        category: "dads",
      },
      {
        title: "Mark Sloan MD: Dad's Guide",
        description: "A father and pediatrician's guide to supporting during pregnancy",
        url: "https://www.marksloanmd.com/",
        category: "dads",
      },
      {
        title: "Dad, Delirious & Elated (YouTube)",
        description: "Real dad experiences through pregnancy and newborn stage",
        url: "https://www.youtube.com/results?search_query=expectant+father+guide+pregnancy",
        category: "dads",
      },
      {
        title: "Reddit: r/predaddit",
        description: "Community support forum for expectant and new dads",
        url: "https://www.reddit.com/r/predaddit/",
        category: "dads",
      },
    ],
  },
  {
    id: "birth",
    title: "Birth Preparation",
    icon: "anchor",
    color: "#e07a5f",
    resources: [
      {
        title: "Evidence Based Birth",
        description: "Research-based information on labor, birth, and newborn care",
        url: "https://evidencebasedbirth.com/",
        category: "birth",
      },
      {
        title: "Hypnobirthing International",
        description: "Breathing, visualization, and relaxation techniques for labor",
        url: "https://www.hypnobirthing.com/",
        category: "birth",
      },
      {
        title: "Lamaze International",
        description: "Lamaze breathing and birth preparation techniques",
        url: "https://www.lamaze.org/",
        category: "birth",
      },
      {
        title: "DONA International (Doulas)",
        description: "Find a certified birth or postpartum doula near you",
        url: "https://www.dona.org/",
        category: "birth",
      },
    ],
  },
  {
    id: "newborn",
    title: "Newborn & Postpartum",
    icon: "star",
    color: "#9b6db5",
    resources: [
      {
        title: "La Leche League: Breastfeeding",
        description: "World's most comprehensive breastfeeding support resource",
        url: "https://www.llli.org/",
        category: "newborn",
      },
      {
        title: "Kellymom Breastfeeding",
        description: "Science-based breastfeeding and parenting information",
        url: "https://kellymom.com/",
        category: "newborn",
      },
      {
        title: "Safe to Sleep: Safe Sleep Guidelines",
        description: "NIH guidelines for safe infant sleep and SIDS prevention",
        url: "https://safetosleep.nichd.nih.gov/",
        category: "newborn",
      },
      {
        title: "AAP: Newborn Care",
        description: "American Academy of Pediatrics guide to newborn care",
        url: "https://www.healthychildren.org/English/ages-stages/baby/Pages/default.aspx",
        category: "newborn",
      },
    ],
  },
];
