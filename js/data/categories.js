const CATEGORIES = [
  {
    id: "power-charging",
    name: "Power & Charging",
    slug: "power-charging",
    description: "Fast chargers, power banks, and cables to keep your devices powered up.",
    icon: "bolt",
    image: "assets/laptop.png",
    subcategories: [
      { id: "chargers", name: "Chargers", slug: "chargers" },
      { id: "power-banks", name: "Power Banks", slug: "power-banks" },
      { id: "cables", name: "Cables", slug: "cables" },
      { id: "wireless-chargers", name: "Wireless Chargers", slug: "wireless-chargers" }
    ]
  },
  {
    id: "mobile-productivity",
    name: "Mobile Productivity",
    slug: "mobile-productivity",
    description: "Hubs, stands, keyboards, and monitors for productive mobile setups.",
    icon: "laptop",
    image: "assets/keyboard.png",
    subcategories: [
      { id: "hubs-adapters", name: "Hubs & Adapters", slug: "hubs-adapters" },
      { id: "stands", name: "Stands", slug: "stands" },
      { id: "keyboards-mice", name: "Keyboards & Mice", slug: "keyboards-mice" },
      { id: "monitors", name: "Monitors", slug: "monitors" },
      { id: "desk-accessories", name: "Desk Accessories", slug: "desk-accessories" }
    ]
  },
  {
    id: "audio",
    name: "Audio",
    slug: "audio",
    description: "Earbuds, headphones, and speakers for immersive sound.",
    icon: "headphones",
    image: "assets/headset.png",
    subcategories: [
      { id: "earbuds", name: "Earbuds", slug: "earbuds" },
      { id: "headphones", name: "Headphones", slug: "headphones" },
      { id: "speakers", name: "Speakers", slug: "speakers" }
    ]
  },
  {
    id: "smart-living",
    name: "Smart Living",
    slug: "smart-living",
    description: "Smart bulbs, plugs, and sensors for connected living.",
    icon: "home",
    image: "assets/smart watch.png",
    subcategories: [
      { id: "lighting", name: "Lighting", slug: "lighting" },
      { id: "smart-plugs-sensors", name: "Smart Plugs & Sensors", slug: "smart-plugs-sensors" },
      { id: "smart-lamps", name: "Smart Lamps", slug: "smart-lamps" },
      { id: "security", name: "Security", slug: "security" }
    ]
  },
  {
    id: "travel-essentials",
    name: "Travel Essentials",
    slug: "travel-essentials",
    description: "Adapters, organizers, and trackers for seamless travel.",
    icon: "bag",
    image: "assets/vintage pc.png",
    subcategories: [
      { id: "organizers", name: "Organizers", slug: "organizers" },
      { id: "adapters", name: "Adapters", slug: "adapters" },
      { id: "trackers", name: "Trackers", slug: "trackers" }
    ]
  }
];
