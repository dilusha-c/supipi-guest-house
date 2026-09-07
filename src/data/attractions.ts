export type AttractionCategory = 
  | "Viewpoints & Historic Sites" 
  | "Waterfalls & Nature" 
  | "Around Bandarawela" 
  | "Horton Plains"
  | "Events & Sports";

export interface Attraction {
  id: string;
  name: string;
  rating?: number;
  type: string;
  description: string;
  tip: string;
  category: AttractionCategory;
  image: string;
}

export const attractions: Attraction[] = [
  // Viewpoints & Historic Sites
  {
    id: "liptons-seat",
    name: "Lipton's Seat",
    rating: 4.6,
    type: "Viewpoint & tea country",
    description: "One of the most famous viewpoints around Haputale, surrounded by Dambatenne tea estates. Go early in the morning for the best chance of clear panoramic views. The route through the tea estates is part of the experience.",
    tip: "🌅 Go early, preferably around sunrise.",
    category: "Viewpoints & Historic Sites",
    image: "/images/Lipton's Seat.webp"
  },
  {
    id: "adisham-bungalow",
    name: "Adisham Bungalow (St.Benedict's Monastery)",
    rating: 4.6,
    type: "Historic site & monastery",
    description: "A beautiful historic stone building surrounded by gardens and greenery. It was built as a colonial-era residence and later became a Benedictine monastery. It is a peaceful place to explore architecture, gardens and history.",
    tip: "🏛️ Check the current visiting hours before going.",
    category: "Viewpoints & Historic Sites",
    image: "/images/Adisham Bungalow.jpg"
  },
  {
    id: "eagles-rock",
    name: "Eagle's Rock View Point",
    rating: 4.8,
    type: "Scenic viewpoint",
    description: "A quieter viewpoint around Haputale where visitors can enjoy the surrounding mountains, valleys and tea-country landscape.",
    tip: "📸 Best for photos and a short scenic stop.",
    category: "Viewpoints & Historic Sites",
    image: "/images/Eagle's Rock View Point.webp"
  },

  // Waterfalls & Nature
  {
    id: "diyaluma-waterfall",
    name: "Diyaluma Waterfall",
    rating: 4.8,
    type: "Waterfall & nature",
    description: "Sri Lanka's second-highest waterfall, offering a stunning cascade right by the road. A must-see natural wonder when visiting the area.",
    tip: "📸 The lower falls are easily visible from the road for a quick photo stop.",
    category: "Waterfalls & Nature",
    image: "/images/Diyaluma Waterfall.jpg"
  },
  {
    id: "bambarakanda-falls",
    name: "Bambarakanda Falls",
    rating: 4.8,
    type: "Waterfall & nature",
    description: "Sri Lanka's tallest waterfall, dropping dramatically through the hill-country landscape. It makes a great half-day or longer nature trip from Haputale.",
    tip: "🌧️ Water flow can vary with weather, so conditions are worth checking before travelling.",
    category: "Waterfalls & Nature",
    image: "/images/Bambarakanda Falls.jpg"
  },
  {
    id: "lanka-ella",
    name: "Lanka Ella Waterfall",
    rating: 4.8,
    type: "Waterfall & nature",
    description: "A beautiful waterfall surrounded by the green landscape of Sri Lanka's hill country. A good choice for visitors looking for a quieter natural attraction.",
    tip: "👟 Wear shoes with good grip because wet surfaces can be slippery.",
    category: "Waterfalls & Nature",
    image: "/images/Lanka Ella Waterfall.avif"
  },
  {
    id: "upper-diyaluma",
    name: "Upper Diyaluma Waterfall",
    rating: 4.8,
    type: "Waterfall & hiking",
    description: "Upper Diyaluma is known for its dramatic highland scenery, natural pools and waterfall views. It is better suited to visitors looking for a more adventurous experience.",
    tip: "⚠️ Conditions can change with rain. Use extra caution around waterfalls and natural pools.",
    category: "Waterfalls & Nature",
    image: "/images/Upper Diyaluma Waterfall.jpg"
  },

  // Around Bandarawela
  {
    id: "porawagala-viewpoint",
    name: "Porawagala Viewpoint",
    rating: 4.4,
    type: "Mountain viewpoint",
    description: "A scenic viewpoint near Bandarawela with wide views across the surrounding hills and valleys.",
    tip: "🌤️ Visit when visibility is good for the best views.",
    category: "Around Bandarawela",
    image: "/images/Porawagala Viewpoint.jpg"
  },
  {
    id: "fox-hill-supercross",
    name: "Fox Hill Supercross (Diyatalawa)",
    rating: 4.7,
    type: "Motorsport event",
    description: "One of Sri Lanka's premier motor racing events held annually at the military academy in Diyatalawa. Experience the thrill of rally cross and motocross in a unique setting.",
    tip: "🏎️ Check the annual event calendar to see if your visit coincides with race day.",
    category: "Around Bandarawela", // Grouping it here as Diyatalawa is very close to Bandarawela
    image: "/images/fox hill supercross.jpg"
  },

  // Horton Plains
  {
    id: "horton-plains",
    name: "Horton Plains National Park",
    type: "National park & hiking",
    description: "A high-altitude national park famous for its grasslands, cloud forest and dramatic viewpoints. It is one of the best full-day nature trips from the Haputale area.",
    tip: "🌅 Start early. Clouds and mist can cover the major viewpoints later in the day.",
    category: "Horton Plains",
    image: "/images/Horton Plains National Park.jpg"
  },
  {
    id: "worlds-end",
    name: "World's End",
    type: "Viewpoint & hiking",
    description: "A spectacular escarpment inside Horton Plains with a dramatic drop and expansive views when the weather is clear.",
    tip: "🌄 Try to reach the viewpoint early in the morning before mist develops.",
    category: "Horton Plains",
    image: "/images/World's End.jpg"
  },
  {
    id: "bakers-falls",
    name: "Baker's Falls",
    type: "Waterfall",
    description: "A scenic waterfall within Horton Plains and one of the highlights of the park's main walking route.",
    tip: "💧 Combine it with World's End rather than making it a separate trip.",
    category: "Horton Plains",
    image: "/images/Baker's Falls.jpg"
  }
];
