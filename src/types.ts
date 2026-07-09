export type UserRole = "customer" | "vendor" | "hall_owner" | "event_planner" | "admin" | "super_admin" | "provider";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  location: string; // e.g. "Qasimabad", "Latifabad Unit 6", "Saddar"
  createdAt: string;
  
  // Customer specific
  loyaltyPoints?: number;
  referralCode?: string;
  savedProviders?: string[];
  wishlist?: string[]; // Saved vendor / hall IDs
  savedEvents?: any[];

  // Provider / Vendor / Hall / Planner specific
  category?: string;
  subcategories?: string[];
  tagline?: string;
  bio?: string;
  experienceYears?: number;
  baseRate?: number;
  rateUnit?: string; // "hour" | "project" | "visit" | "day" | "event"
  isVerified?: boolean;
  kycStatus?: "pending" | "approved" | "rejected" | "unsubmitted";
  cnic?: string;
  rating?: number;
  reviewCount?: number;
  portfolioImages?: string[];
  availability?: string; // "Available" | "Busy" | "Holiday"
  trustScore?: number; // 0 - 100
  skills?: string[];

  // Hall specific
  capacity?: number; // e.g. 500
  virtualTourUrl?: string; // Virtual Tour link simulation
  maintenanceSchedule?: { date: string; task: string }[];
  specialOffers?: { title: string; discount: string; description: string }[];
  
  // Custom packages
  packages?: { name: string; price: number; details: string[] }[];
  coupons?: { code: string; discount: string; expiry: string }[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  description: string;
  subcategories: string[];
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerLocation: string;
  providerId: string;
  providerName: string;
  providerPhone: string;
  category: string;
  service: string;
  price: number;
  dateTime: string;
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
  otpCode: string; // Verification code for completion
  isSos?: boolean; // Emergency SOS Booking
  warrantyDays?: number; // Warranty periods e.g. 30
  notes?: string;
  createdAt: string;
  timeline?: {
    status: string;
    timestamp: string;
    description: string;
  }[];
}

export interface ReverseAuction {
  id: string;
  customerId: string;
  customerName: string;
  title: string;
  category: string;
  description: string;
  location: string;
  maxBudget: number;
  deadline: string;
  bids: Bid[];
  status: "open" | "accepted" | "expired";
  createdAt: string;
  attachmentUrl?: string;
}

export interface Bid {
  id: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  amount: number;
  proposal: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  bookingId?: string; // Option to tie chat to a specific booking
  senderId: string;
  senderName: string;
  receiverId: string;
  text: string;
  timestamp: number;
}

export interface Review {
  id: string;
  bookingId: string;
  providerId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  isFakeSuspected?: boolean; // AI flags fake reviews
  createdAt: string;
}

export interface Complaint {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  providerId: string;
  providerName: string;
  text: string;
  status: "pending" | "investigating" | "resolved";
  aiAnalysis?: string;
  aiUrgency?: string;
  aiActionPlan?: string;
  createdAt: string;
}
