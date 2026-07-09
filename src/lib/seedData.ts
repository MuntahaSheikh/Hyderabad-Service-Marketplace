import { ServiceCategory, UserProfile, Booking, ReverseAuction, Review } from "../types";

export const HYDERABAD_AREAS = [
  "All Hyderabad",
  "Qasimabad",
  "Latifabad (Unit 1-12)",
  "Saddar",
  "Autobahn Road",
  "Hirabad",
  "Phuleli",
  "Citizen Colony",
  "Gari Khata"
];

export const INITIAL_CATEGORIES: ServiceCategory[] = [
  {
    id: "wedding-halls",
    name: "Wedding Halls & Banquets",
    icon: "Building",
    description: "Elegant wedding halls, luxury banquet halls, scenic farmhouses, resorts, and premium hotels.",
    subcategories: ["Wedding Halls", "Banquet Halls", "Farmhouses", "Hotels", "Resorts"]
  },
  {
    id: "catering",
    name: "Catering & Cake",
    icon: "Utensils",
    description: "Gourmet catering services, designer wedding cakes, traditional cuisines, and custom florists.",
    subcategories: ["Catering Services", "Cake Shops", "Florists"]
  },
  {
    id: "media",
    name: "Photography & Media",
    icon: "Camera",
    description: "Candid photographers, cinematic videographers, and professional drone coverage.",
    subcategories: ["Photographers", "Videographers", "Drone Photography"]
  },
  {
    id: "beauty",
    name: "Makeup & Mehndi",
    icon: "Sparkles",
    description: "Top-tier bridal makeup artists, intricate mehndi designers, and groom styling salon experts.",
    subcategories: ["Makeup Artists", "Mehndi Artists", "Bridal Dresses", "Groom Wear"]
  },
  {
    id: "entertainment",
    name: "Sound, DJ & Lighting",
    icon: "Music",
    description: "Professional lighting, custom sound systems, professional DJs, and event hosts.",
    subcategories: ["Lighting", "Sound System", "DJ", "Event Hosts", "Kids Entertainment"]
  },
  {
    id: "logistics",
    name: "Logistics & Transport",
    icon: "Car",
    description: "Luxury wedding cars, reliable guest rentals, security staff, and valet parking services.",
    subcategories: ["Car Rentals", "Luxury Cars", "Security Staff", "Valet Parking", "Cleaning Staff"]
  },
  {
    id: "planners",
    name: "Event Planners",
    icon: "Calendar",
    description: "Elite wedding planners, corporate organizers, invitation designers, and gift shops.",
    subcategories: ["Event Planners", "Invitation Designers", "Printing Services", "Gift Shops"]
  }
];

export const INITIAL_PROVIDERS: UserProfile[] = [
  {
    uid: "prov-sajid",
    name: "Shalimar Jewel Banquet & Gardens",
    email: "shalimar@hsm.com",
    phone: "0300-1234567",
    role: "hall_owner",
    avatar: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=300",
    location: "Autobahn Road",
    createdAt: "2026-01-10T12:00:00Z",
    category: "Wedding Halls & Banquets",
    subcategories: ["Banquet Halls", "Wedding Halls", "Resorts"],
    tagline: "Where premium luxury meets your timeless moments",
    bio: "Shalimar Jewel Banquet is Hyderabad's most prestigious event venue. Featuring a grand pillarless hall, exquisite interior design, temperature control, and a lush green lawn for outdoor mehndi or waleema setups. Capacity of up to 1,200 guests with spacious valet parking.",
    experienceYears: 12,
    baseRate: 250000,
    rateUnit: "day",
    isVerified: true,
    kycStatus: "approved",
    cnic: "41303-1234567-1",
    rating: 4.9,
    reviewCount: 38,
    portfolioImages: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600",
      "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600"
    ],
    availability: "Available",
    trustScore: 98,
    skills: ["Seating capacity: 1200", "Valet Parking", "In-house Catering", "Soundproofing", "Power Backup Generators"],
    capacity: 1200,
    virtualTourUrl: "https://example.com/tour-shalimar-banquet-simulation",
    maintenanceSchedule: [
      { date: "2026-07-15", task: "Central Air Conditioning System Servicing" },
      { date: "2026-07-28", task: "Garden lawn redesigning and deep cleaning" }
    ],
    specialOffers: [
      { title: "Mid-Week Wedding Discount", discount: "15% OFF", description: "Get 15% off hall rentals for weddings held on Monday through Wednesday." }
    ],
    packages: [
      { name: "Silver Elegance Package", price: 180000, details: ["Hall rental (6 hours)", "Standard floral entry decor", "Stage setup & lighting", "10 VIP tables with fresh roses", "Basic sound system"] },
      { name: "Gold Royal Package", price: 290000, details: ["Hall rental & premium private suite", "High-end floral stage design", "Professional ambient lighting & spotlights", "Valet parking for all guests", "Premium sound & heavy fog entry effects"] }
    ],
    coupons: [
      { code: "SHALIMAR99", discount: "PKR 15,000 Flat Off", expiry: "2026-12-31" }
    ]
  },
  {
    uid: "prov-maria",
    name: "Maria Bridal Studio & Mehndi Care",
    email: "maria.bridal@hsm.com",
    phone: "0333-7654321",
    role: "vendor",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300",
    location: "Qasimabad",
    createdAt: "2026-02-15T10:00:00Z",
    category: "Makeup & Mehndi",
    subcategories: ["Makeup Artists", "Mehndi Artists"],
    tagline: "Flawless HD makeup & classic Sindhi/Arabic mehndi patterns",
    bio: "Certified makeup artist trained under international stylists. Specializing in flawless HD bridal makeups, engagement glam, party styling, and beautiful intricate mehndi designs using natural organic mehndi cone paste.",
    experienceYears: 5,
    baseRate: 45000,
    rateUnit: "event",
    isVerified: true,
    kycStatus: "approved",
    cnic: "41304-7654321-2",
    rating: 4.8,
    reviewCount: 29,
    portfolioImages: [
      "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=600",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600"
    ],
    availability: "Available",
    trustScore: 96,
    skills: ["HD Bridal Makeup", "Airbrush Makeup", "Intricate Arabic Mehndi", "Organic Henna", "Hairstyling"],
    packages: [
      { name: "Elite Bridal Package", price: 45000, details: ["Flawless HD Makeup", "Premium lash extensions", "Hair styling & dupatta settings", "Organic hand/arm mehndi designs"] },
      { name: "Bridal Mehndi Only", price: 15000, details: ["Full intricate bridal hand and feet mehndi designs", "Premium organic stain guarantee", "Mehndi artist travel to home"] }
    ],
    coupons: [
      { code: "BRIDAL10", discount: "10% OFF on Booking", expiry: "2026-10-31" }
    ]
  },
  {
    uid: "prov-tariq",
    name: "Grand Feast Caterers & Bakers",
    email: "grandfeast@hsm.com",
    phone: "0312-9876543",
    role: "vendor",
    avatar: "https://images.unsplash.com/photo-1555244162-803834f70033?w=300",
    location: "Saddar",
    createdAt: "2026-03-01T09:00:00Z",
    category: "Catering & Cake",
    subcategories: ["Catering Services", "Cake Shops"],
    tagline: "Traditional Hyderabadi Biryani & Custom Designer Wedding Cakes",
    bio: "Providing sensory delight for your special events. Known across Hyderabad and Sindh for our authentic wood-fired Hyderabadi Biryani, mutton korma, and modern multi-tier custom wedding cakes.",
    experienceYears: 15,
    baseRate: 1200,
    rateUnit: "project", // price per head
    isVerified: true,
    kycStatus: "approved",
    cnic: "41303-9876543-3",
    rating: 4.7,
    reviewCount: 14,
    portfolioImages: [
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=600"
    ],
    availability: "Available",
    trustScore: 94,
    skills: ["Traditional Sindhi/Hyderabadi Biryani", "Wood-fired Cooking", "Premium Crockery rentals", "Multi-Tier Fondant Cakes", "Dessert Bars"],
    packages: [
      { name: "Sajid-Al-Hariri Royal Menu", price: 1800, details: ["Hyderabadi Mutton Biryani (Wood-fired)", "Special Mutton Qorma", "Traditional Shahi Kheer", "Fresh Naan & Salad bar", "Cold drinks & Kashmiri Tea"] },
      { name: "Elite Event Buffet", price: 1200, details: ["Chicken Biryani", "Chicken Karahi", "Standard Salad & Raita", "Standard Lab-e-Shireen dessert"] }
    ],
    coupons: [
      { code: "FEAST5", discount: "5% Off Per Head", expiry: "2026-12-15" }
    ]
  },
  {
    uid: "prov-imran",
    name: "Royal Luxury Wedding Cars & Valet",
    email: "royal.rides@hsm.com",
    phone: "0345-1237890",
    role: "vendor",
    avatar: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=300",
    location: "Autobahn Road",
    createdAt: "2026-04-12T08:00:00Z",
    category: "Logistics & Transport",
    subcategories: ["Luxury Cars", "Car Rentals", "Valet Parking"],
    tagline: "Drive in absolute royalty. Decorated luxury vehicles with private chauffeurs.",
    bio: "Premium automotive rental and event valet service. Providing fully decorated luxury cars (Mercedes, Audi, Range Rover, Honda Civic) for wedding entries and sendoffs. Includes experienced uniformed chauffeurs.",
    experienceYears: 10,
    baseRate: 20000,
    rateUnit: "day",
    isVerified: true,
    kycStatus: "approved",
    cnic: "41301-1237890-5",
    rating: 4.9,
    reviewCount: 42,
    portfolioImages: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600"
    ],
    availability: "Available",
    trustScore: 99,
    skills: ["Audi A6 Red Edition", "Mercedes Benz S-Class", "Floral Car Decoration", "Professional Chauffeurs", "Valet Guest Management"],
    packages: [
      { name: "Royal Entry Premium", price: 35000, details: ["Mercedes S-Class (white/black)", "Uniformed private chauffeur", "Standard premium red-rose decoration", "Fuel included for 100km inside Hyderabad"] },
      { name: "Classic Ride Package", price: 20000, details: ["Toyota Fortuner / Civic", "Floral ribbon decoration", "Private driver for 8 hours"] }
    ],
    coupons: [
      { code: "ROYALCAR", discount: "PKR 3000 Off", expiry: "2026-09-30" }
    ]
  },
  {
    uid: "prov-anas",
    name: "Apex Elite Event Planners & Drone Media",
    email: "apex.events@hsm.com",
    phone: "0311-5551212",
    role: "event_planner",
    avatar: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300",
    location: "Hirabad",
    createdAt: "2026-05-20T14:00:00Z",
    category: "Event Planners",
    subcategories: ["Event Planners", "Photographers", "Videographers"],
    tagline: "We design, capture, and execute your dream celebrations",
    bio: "Full-service luxury event organizers. We handle everything from invitation cards, theme selection, venue decor orchestration, catering, and heavy sound/CCTV coordination to cinematic drone and 4K media coverage.",
    experienceYears: 6,
    baseRate: 75000,
    rateUnit: "event",
    isVerified: true,
    kycStatus: "approved",
    cnic: "41302-5551212-7",
    rating: 5.0,
    reviewCount: 19,
    portfolioImages: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600"
    ],
    availability: "Available",
    trustScore: 95,
    skills: ["Complete Wedding Planning", "Corporate Seminars/Expos", "4K Drone Cinematic Videography", "Custom Theme Design", "Stage Set Construction"],
    packages: [
      { name: "Full Wedding Master Coordination", price: 120000, details: ["Vendor vetting & bookings", "Timeline orchestration & on-site supervision", "Invitation cards design & guest support desk", "Complete 4K photo, cinematic video, and drone coverage"] },
      { name: "Digital & Media Package Only", price: 50000, details: ["2 Candid Photographers", "1 Cinematic Videographer", "Full event drone coverage", "30-page premium leather album", "All digital copies delivered in 15 days"] }
    ],
    coupons: [
      { code: "APEXEVENT", discount: "PKR 10,000 Flat Off", expiry: "2026-11-30" }
    ]
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    bookingId: "book-mock-1",
    providerId: "prov-sajid",
    customerId: "cust-kamran",
    customerName: "Kamran Shah",
    rating: 5,
    comment: "Hosted our sister's Walima here. The air conditioning was absolutely perfect, stage design was royal, and the valet parking staff managed 120 cars smoothly. Highly recommended banquet on Autobahn Road!",
    createdAt: "2026-06-15T18:30:00Z"
  },
  {
    id: "rev-2",
    bookingId: "book-mock-2",
    providerId: "prov-maria",
    customerId: "cust-anila",
    customerName: "Anila Yusuf",
    rating: 5,
    comment: "Absolutely breathtaking bridal makeup and organic mehndi. The stain lasted for 10 days and looked rich dark mahogany. Everyone on the wedding night asked where we got the makeup from!",
    createdAt: "2026-06-20T15:00:00Z"
  },
  {
    id: "rev-3",
    bookingId: "book-mock-3",
    providerId: "prov-imran",
    customerId: "cust-farhan",
    customerName: "Farhan Junejo",
    rating: 5,
    comment: "Rented the red Audi S6 with a professional driver for our groom entry. The car was spotlessly clean, elegantly decorated with real red roses, and the driver arrived 20 minutes early. Premium service!",
    createdAt: "2026-06-25T11:00:00Z"
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "book-1",
    customerId: "cust-kamran",
    customerName: "Kamran Shah",
    customerPhone: "0301-1112222",
    customerLocation: "Qasimabad",
    providerId: "prov-sajid",
    providerName: "Shalimar Jewel Banquet & Gardens",
    providerPhone: "0300-1234567",
    category: "Wedding Halls & Banquets",
    service: "Banquet Hall Rental",
    price: 250000,
    dateTime: "2026-07-20T17:00",
    status: "pending",
    otpCode: "3948",
    isSos: false,
    warrantyDays: 30,
    notes: "Walima Event for 500 Guests. Please coordinate setup at 12 PM.",
    createdAt: "2026-07-08T12:00:00Z",
    timeline: [
      { status: "pending", timestamp: "2026-07-08 12:00 PM", description: "Waleema Banquet booking request initiated by customer Kamran Shah" }
    ]
  },
  {
    id: "book-2",
    customerId: "cust-kamran",
    customerName: "Kamran Shah",
    customerPhone: "0301-1112222",
    customerLocation: "Qasimabad",
    providerId: "prov-maria",
    providerName: "Maria Bridal Studio & Mehndi Care",
    providerPhone: "0333-7654321",
    category: "Makeup & Mehndi",
    service: "Elite Bridal Package",
    price: 45000,
    dateTime: "2026-07-08T14:00",
    status: "in_progress",
    otpCode: "8273",
    isSos: false,
    warrantyDays: 15,
    notes: "Mehndi event session. Please arrive on-site with natural henna paste.",
    createdAt: "2026-07-08T14:10:00Z",
    timeline: [
      { status: "pending", timestamp: "2026-07-08 02:10 PM", description: "Booking request created" },
      { status: "accepted", timestamp: "2026-07-08 02:15 PM", description: "Maria Bridal accepted booking and locked calendar slot" },
      { status: "in_progress", timestamp: "2026-07-08 02:22 PM", description: "Session in progress" }
    ]
  }
];

export const INITIAL_REVERSE_AUCTIONS: ReverseAuction[] = [
  {
    id: "auc-1",
    customerId: "cust-kamran",
    customerName: "Kamran Shah",
    title: "Need traditional Catering for 800 guests (Walima)",
    category: "Catering & Cake",
    description: "Looking for premium wood-fired catering for a walima event of 800 guests. Menu must include Hyderabadi Mutton Biryani, Mutton Qorma, and traditional Shahi Kheer. Clean crockery and waiters are required.",
    location: "Latifabad (Unit 1-12)",
    maxBudget: 1500000,
    deadline: "2026-07-18",
    status: "open",
    createdAt: "2026-07-07T10:00:00Z",
    bids: [
      {
        id: "bid-1",
        providerId: "prov-tariq",
        providerName: "Grand Feast Caterers & Bakers",
        providerAvatar: "https://images.unsplash.com/photo-1555244162-803834f70033?w=150",
        amount: 1440000,
        proposal: "We can provide authentic wood-fired Mutton Biryani and our premium Hariri Royal package. This includes 20 expert waiters, luxurious bone-china crockery, and designer tables. I can also include a 3-tier wedding cake as a complimentary bonus!",
        createdAt: "2026-07-07T14:30:00Z"
      }
    ]
  },
  {
    id: "auc-2",
    customerId: "cust-anila",
    customerName: "Anila Yusuf",
    title: "Complete Floral Theme Stage Decoration for Mehndi",
    category: "Event Planners",
    description: "Need stage setup, fairy lights, fresh marigold hangings, and a premium yellow-themed backdrop for a backyard mehndi party of 150 guests.",
    location: "Citizen Colony",
    maxBudget: 60000,
    deadline: "2026-07-15",
    status: "open",
    createdAt: "2026-07-08T09:00:00Z",
    bids: [
      {
        id: "bid-2",
        providerId: "prov-anas",
        providerName: "Apex Elite Event Planners & Drone Media",
        providerAvatar: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=150",
        amount: 55000,
        proposal: "We have an absolute dream theme for Mehndi! It includes a wooden swing, premium silk cushions, 200 yards of fairy lights, and fresh organic marigolds imported daily. Includes 1 supervisor.",
        createdAt: "2026-07-08T11:45:00Z"
      }
    ]
  }
];

export const DEALS_OF_THE_DAY = [
  {
    id: "deal-1",
    title: "Mid-Week Royal Hall Booking",
    discount: "PKR 50,000 OFF",
    providerName: "Shalimar Jewel Banquet",
    originalPrice: 250000,
    promoPrice: 200000,
    icon: "Building",
    badge: "Walima & Weddings"
  },
  {
    id: "deal-2",
    title: "Premium Bridal Glow & Lash Lift",
    discount: "30% OFF",
    providerName: "Maria Bridal Studio",
    originalPrice: 45000,
    promoPrice: 31500,
    icon: "Sparkles",
    badge: "Limited Slots"
  },
  {
    id: "deal-3",
    title: "Traditional Wood-Fired Catering Buffet",
    discount: "10% Off per Head",
    providerName: "Grand Feast Caterers",
    originalPrice: 1500,
    promoPrice: 1350,
    icon: "Utensils",
    badge: "Biryani & Korma"
  }
];

export const BLOG_POSTS = [
  {
    id: "blog-1",
    title: "Choosing the Perfect Wedding Hall in Hyderabad: A 2026 Guide",
    summary: "From capacity limits on Autobahn Road to parking safety in Qasimabad, learn the top 5 questions to ask hall owners before paying your advance booking deposit.",
    readTime: "5 mins read",
    author: "Apex Event Planners",
    date: "July 2, 2026"
  },
  {
    id: "blog-2",
    title: "10 Must-Have Traditional Sindhi & Arabic Mehndi Designs",
    summary: "Aesthetic negative space mandalas are trending this wedding season. Read our complete design curation for brides and bridesmaid henna.",
    readTime: "4 mins read",
    author: "Maria Khan, Stylist",
    date: "June 28, 2026"
  }
];
