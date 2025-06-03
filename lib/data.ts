export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  features: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  bestseller?: boolean;
  new?: boolean;
  featured?: boolean;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  image: string;
};

// Mock data for the e-commerce store
export const products: Product[] = [
  {
    id: "1",
    title: "Modern Outdoor Patio Furniture Set",
    description: "Transform your outdoor space with this elegant 4-piece patio set, featuring weather-resistant wicker, plush cushions, and a sophisticated design that blends with any décor.",
    price: 499.99,
    originalPrice: 699.99,
    category: "outdoor",
    images: [
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=2830&auto=format&fit=crop&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1560448204-603b3fc33dab?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
    ],
    features: [
      "Weather-resistant PE wicker",
      "Rust-proof aluminum frame",
      "5-inch thick cushions with removable covers",
      "Glass top coffee table",
      "Assembly required (tools included)",
    ],
    rating: 4.7,
    reviewCount: 128,
    stock: 15,
    bestseller: true,
    featured: true,
  },
  {
    id: "2",
    title: "Ergonomic Home Office Desk",
    description: "Enhance your work-from-home experience with this height-adjustable desk featuring ample storage, cable management, and a sleek contemporary design.",
    price: 329.99,
    originalPrice: 399.99,
    category: "furniture",
    images: [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1544140708-514b7837c5d5?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1486946255434-2466348c2166?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
    ],
    features: [
      "Height-adjustable from 28 to 48 inches",
      "Built-in cable management system",
      "Dual side drawers for storage",
      "Durable engineered wood construction",
      "48 x 24 inch work surface",
    ],
    rating: 4.5,
    reviewCount: 89,
    stock: 23,
    new: true,
  },
  {
    id: "3",
    title: "Luxury Memory Foam Mattress",
    description: "Experience the perfect balance of comfort and support with this premium mattress featuring adaptive memory foam, cooling technology, and edge-to-edge support.",
    price: 799.99,
    originalPrice: 1199.99,
    category: "bedroom",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=3027&auto=format&fit=crop&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1558950566-8c6c214ee121?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3",
    ],
    features: [
      "12-inch profile with three-layer foam construction",
      "CertiPUR-US certified materials",
      "Cooling gel-infused memory foam",
      "Hypoallergenic and antimicrobial cover",
      "100-night trial and 10-year warranty",
    ],
    rating: 4.8,
    reviewCount: 312,
    stock: 8,
    featured: true,
  },
  {
    id: "4",
    title: "Multifunctional Kitchen Island Cart",
    description: "Maximize your kitchen space with this versatile island cart featuring a granite top, expandable storage, and mobility that adapts to your cooking needs.",
    price: 249.99,
    category: "kitchen",
    images: [
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=3368&auto=format&fit=crop&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1586208958839-06c17cacdf08?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.0.3",
    ],
    features: [
      "Natural granite top for food preparation",
      "Extendable leaf for additional workspace",
      "Two storage cabinets and three drawers",
      "Towel rack and spice shelf",
      "Locking wheels for stability",
    ],
    rating: 4.4,
    reviewCount: 67,
    stock: 19,
  },
  {
    id: "5",
    title: "Premium Reclining Sectional Sofa",
    description: "Create the ultimate comfort zone with this luxurious sectional featuring power recliners, built-in USB charging, and plush upholstery for the perfect movie night.",
    price: 1299.99,
    originalPrice: 1599.99,
    category: "furniture",
    images: [
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0c2?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
    ],
    features: [
      "Power recliners with one-touch control",
      "Built-in USB charging ports",
      "Premium stain-resistant fabric",
      "Storage console with cup holders",
      "Modular design for flexible arrangements",
    ],
    rating: 4.6,
    reviewCount: 156,
    stock: 5,
    featured: true,
  },
  {
    id: "6",
    title: "Smart Home Storage Organization System",
    description: "Declutter your living space with this customizable storage solution featuring modular components, adjustable shelving, and a sleek design that complements any room.",
    price: 179.99,
    category: "storage",
    images: [
      "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
    ],
    features: [
      "Customizable modular design",
      "Adjustable shelving and dividers",
      "Soft-close doors and drawers",
      "Wall-mountable with included hardware",
      "Available in multiple finishes",
    ],
    rating: 4.3,
    reviewCount: 42,
    stock: 31,
    new: true,
  },
  {
    id: "7",
    title: "Deluxe Adjustable Bed Frame",
    description: "Elevate your sleep experience with this premium adjustable bed base featuring massage functions, wireless remote, and customizable positions for ultimate comfort.",
    price: 899.99,
    originalPrice: 1099.99,
    category: "bedroom",
    images: [
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=2892&auto=format&fit=crop&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
    ],
    features: [
      "Zero-gravity, TV, and lounge preset positions",
      "Dual massage zones with three intensity levels",
      "Under-bed lighting with remote control",
      "USB ports on both sides of the bed",
      "Whisper-quiet motors with emergency power-down",
    ],
    rating: 4.7,
    reviewCount: 83,
    stock: 12,
  },
  {
    id: "8",
    title: "Contemporary Dining Table Set",
    description: "Gather in style with this elegant dining set featuring a solid wood table, six comfortable chairs, and a sophisticated design that makes every meal special.",
    price: 649.99,
    category: "furniture",
    images: [
      "https://images.unsplash.com/photo-1617104678098-de229db51175?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
    ],
    features: [
      "Solid oak construction with natural finish",
      "Extendable table design for additional seating",
      "Ergonomically designed chairs with padded seats",
      "Scratch and stain-resistant table top",
      "Easy assembly with included hardware",
    ],
    rating: 4.5,
    reviewCount: 59,
    stock: 7,
    bestseller: true,
  },
];

export const categories: Category[] = [
  {
    id: "bedroom",
    name: "Bedroom",
    description: "Stylish and comfortable bedroom furniture sets, beds, wardrobes, and nightstands.",
    image: "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3"
  },
  {
    id: "living-room",
    name: "Living Room",
    description: "Beautiful sofas, coffee tables, TV units, and accent furniture for your living space.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3"
  },
  {
    id: "dining-room",
    name: "Dining Room",
    description: "Elegant dining tables, chairs, and sideboards for memorable dining experiences.",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3"
  },
  {
    id: "home-office",
    name: "Home Office",
    description: "Functional desks, bookcases, and office chairs for a productive workspace.",
    image: "https://images.unsplash.com/photo-1593476550610-87baa860004a?q=80&w=2813&auto=format&fit=crop&ixlib=rb-4.0.3"
  },
  {
    id: "outdoor",
    name: "Outdoor",
    description: "Durable and stylish outdoor furniture for your garden, patio, or balcony.",
    image: "https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3"
  },
  {
    id: "accent-furniture",
    name: "Accent Furniture",
    description: "Distinctive accent pieces to add character and style to any room.",
    image: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3"
  },
  {
    id: "storage",
    name: "Storage & Organization",
    description: "Practical storage solutions including cabinets, shelves, and organizational furniture.",
    image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3"
  },
  {
    id: "lighting",
    name: "Lighting",
    description: "Decorative and functional lighting options for every room in your home.",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3"
  },
  {
    id: "rugs",
    name: "Rugs & Textiles",
    description: "Beautiful rugs, throws, and textiles to add warmth and texture to your space.",
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3"
  },
  {
    id: "wall-decor",
    name: "Wall Decor",
    description: "Mirrors, artwork, and wall accents to personalize your home.",
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a694?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3"
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (categoryId: string): Product[] => {
  return products.filter(product => product.category === categoryId);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getNewProducts = (): Product[] => {
  return products.filter(product => product.new);
};

export const getBestsellerProducts = (): Product[] => {
  return products.filter(product => product.bestseller);
};
