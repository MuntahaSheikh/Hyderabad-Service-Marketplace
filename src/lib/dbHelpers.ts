import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  deleteDoc,
  limit
} from "firebase/firestore";
import { db } from "./firebase";
import { 
  INITIAL_PROVIDERS, 
  INITIAL_BOOKINGS, 
  INITIAL_REVIEWS, 
  INITIAL_REVERSE_AUCTIONS 
} from "./seedData";
import { UserProfile, Booking, ReverseAuction, Review, ChatMessage, Complaint, Bid } from "../types";

// Helper to determine if Firebase is working and online
let isFirebaseOnline = true;

// Define localStorage fallback keys
const LS_PROVIDERS = "hsm_ls_providers";
const LS_BOOKINGS = "hsm_ls_bookings";
const LS_REVIEWS = "hsm_ls_reviews";
const LS_AUCTIONS = "hsm_ls_auctions";
const LS_CHATS = "hsm_ls_chats";
const LS_COMPLAINTS = "hsm_ls_complaints";

// Seed local storage with default data if empty
function initLocalStorage() {
  if (!localStorage.getItem(LS_PROVIDERS)) {
    localStorage.setItem(LS_PROVIDERS, JSON.stringify(INITIAL_PROVIDERS));
  }
  if (!localStorage.getItem(LS_BOOKINGS)) {
    localStorage.setItem(LS_BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
  }
  if (!localStorage.getItem(LS_REVIEWS)) {
    localStorage.setItem(LS_REVIEWS, JSON.stringify(INITIAL_REVIEWS));
  }
  if (!localStorage.getItem(LS_AUCTIONS)) {
    localStorage.setItem(LS_AUCTIONS, JSON.stringify(INITIAL_REVERSE_AUCTIONS));
  }
  if (!localStorage.getItem(LS_CHATS)) {
    localStorage.setItem(LS_CHATS, JSON.stringify([]));
  }
  if (!localStorage.getItem(LS_COMPLAINTS)) {
    localStorage.setItem(LS_COMPLAINTS, JSON.stringify([]));
  }
}

initLocalStorage();

// Attempt to seed Firestore database on load
export async function seedFirestore() {
  try {
    const q = query(collection(db, "hsm_users"), limit(1) as any);
    const snap = await getDocs(q);
    if (snap.empty) {
      console.log("Firestore empty. Seeding initial data for Hyderabad Service Marketplace...");
      
      // Seed Providers
      for (const prov of INITIAL_PROVIDERS) {
        await setDoc(doc(db, "hsm_users", prov.uid), prov);
      }
      
      // Seed Bookings
      for (const book of INITIAL_BOOKINGS) {
        await setDoc(doc(db, "hsm_bookings", book.id), book);
      }
      
      // Seed Reviews
      for (const rev of INITIAL_REVIEWS) {
        await setDoc(doc(db, "hsm_reviews", rev.id), rev);
      }
      
      // Seed Auctions
      for (const auc of INITIAL_REVERSE_AUCTIONS) {
        await setDoc(doc(db, "hsm_auctions", auc.id), auc);
      }
      console.log("Firestore database seeded successfully!");
    }
  } catch (err) {
    console.warn("Could not seed Firestore (might be offline or security rules block). Falling back to browser LocalStorage.", err);
    isFirebaseOnline = false;
  }
}

// Real limit is imported above

// ==========================================
// PROVIDERS & USERS OPERATIONS
// ==========================================

export async function getProviders(): Promise<UserProfile[]> {
  try {
    const colRef = collection(db, "hsm_users");
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const providers: UserProfile[] = [];
      snap.forEach((d) => {
        const u = d.data() as UserProfile;
        if (u.role === "provider") {
          providers.push(u);
        }
      });
      return providers;
    }
  } catch (err) {
    console.warn("Firestore error in getProviders, using localStorage", err);
  }
  return JSON.parse(localStorage.getItem(LS_PROVIDERS) || "[]");
}

export async function updateProviderProfile(uid: string, updates: Partial<UserProfile>): Promise<UserProfile> {
  try {
    const docRef = doc(db, "hsm_users", uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      await updateDoc(docRef, updates as any);
      const updated = { ...snap.data(), ...updates } as UserProfile;
      return updated;
    } else {
      const fullProfile = { uid, role: "provider", createdAt: new Date().toISOString(), ...updates } as UserProfile;
      await setDoc(docRef, fullProfile);
      return fullProfile;
    }
  } catch (err) {
    console.warn("Firestore error in updateProviderProfile, updating localStorage", err);
  }

  // LocalStorage fallback
  const list: UserProfile[] = JSON.parse(localStorage.getItem(LS_PROVIDERS) || "[]");
  const index = list.findIndex(p => p.uid === uid);
  if (index !== -1) {
    list[index] = { ...list[index], ...updates };
  } else {
    list.push({ uid, role: "provider", createdAt: new Date().toISOString(), ...updates } as UserProfile);
  }
  localStorage.setItem(LS_PROVIDERS, JSON.stringify(list));
  return list.find(p => p.uid === uid)!;
}

// ==========================================
// BOOKINGS OPERATIONS
// ==========================================

export async function getBookings(): Promise<Booking[]> {
  try {
    const colRef = collection(db, "hsm_bookings");
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const bookings: Booking[] = [];
      snap.forEach((d) => {
        bookings.push(d.data() as Booking);
      });
      return bookings.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
  } catch (err) {
    console.warn("Firestore error in getBookings, using localStorage", err);
  }
  const list: Booking[] = JSON.parse(localStorage.getItem(LS_BOOKINGS) || "[]");
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createBooking(booking: Booking): Promise<Booking> {
  try {
    await setDoc(doc(db, "hsm_bookings", booking.id), booking);
    // Increment provider reviews count or load from db
  } catch (err) {
    console.warn("Firestore error in createBooking, writing to localStorage", err);
  }
  
  const list: Booking[] = JSON.parse(localStorage.getItem(LS_BOOKINGS) || "[]");
  list.unshift(booking);
  localStorage.setItem(LS_BOOKINGS, JSON.stringify(list));
  return booking;
}

export async function updateBookingStatus(
  bookingId: string, 
  newStatus: Booking["status"], 
  description: string
): Promise<Booking> {
  const timelineItem = {
    status: newStatus,
    timestamp: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    description: description
  };

  try {
    const docRef = doc(db, "hsm_bookings", bookingId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const current = snap.data() as Booking;
      const updatedTimeline = [...(current.timeline || []), timelineItem];
      await updateDoc(docRef, {
        status: newStatus,
        timeline: updatedTimeline
      });
      return { ...current, status: newStatus, timeline: updatedTimeline };
    }
  } catch (err) {
    console.warn("Firestore error in updateBookingStatus, writing to localStorage", err);
  }

  // LocalStorage fallback
  const list: Booking[] = JSON.parse(localStorage.getItem(LS_BOOKINGS) || "[]");
  const index = list.findIndex(b => b.id === bookingId);
  if (index !== -1) {
    const current = list[index];
    const updatedTimeline = [...(current.timeline || []), timelineItem];
    list[index] = { ...current, status: newStatus, timeline: updatedTimeline };
    localStorage.setItem(LS_BOOKINGS, JSON.stringify(list));
    return list[index];
  }
  throw new Error("Booking not found");
}

// ==========================================
// REVERSE AUCTION OPERATIONS
// ==========================================

export async function getReverseAuctions(): Promise<ReverseAuction[]> {
  try {
    const colRef = collection(db, "hsm_auctions");
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list: ReverseAuction[] = [];
      snap.forEach(d => list.push(d.data() as ReverseAuction));
      return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
  } catch (err) {
    console.warn("Firestore error in getReverseAuctions, using localStorage", err);
  }
  const list: ReverseAuction[] = JSON.parse(localStorage.getItem(LS_AUCTIONS) || "[]");
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createReverseAuction(auction: ReverseAuction): Promise<ReverseAuction> {
  try {
    await setDoc(doc(db, "hsm_auctions", auction.id), auction);
  } catch (err) {
    console.warn("Firestore error in createReverseAuction, writing to localStorage", err);
  }
  const list: ReverseAuction[] = JSON.parse(localStorage.getItem(LS_AUCTIONS) || "[]");
  list.unshift(auction);
  localStorage.setItem(LS_AUCTIONS, JSON.stringify(list));
  return auction;
}

export async function createBid(auctionId: string, bid: Bid): Promise<ReverseAuction> {
  try {
    const docRef = doc(db, "hsm_auctions", auctionId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const current = snap.data() as ReverseAuction;
      const updatedBids = [...(current.bids || []), bid];
      await updateDoc(docRef, { bids: updatedBids });
      return { ...current, bids: updatedBids };
    }
  } catch (err) {
    console.warn("Firestore error in createBid, writing to localStorage", err);
  }

  // LocalStorage fallback
  const list: ReverseAuction[] = JSON.parse(localStorage.getItem(LS_AUCTIONS) || "[]");
  const index = list.findIndex(a => a.id === auctionId);
  if (index !== -1) {
    const current = list[index];
    const updatedBids = [...(current.bids || []), bid];
    list[index] = { ...current, bids: updatedBids };
    localStorage.setItem(LS_AUCTIONS, JSON.stringify(list));
    return list[index];
  }
  throw new Error("Auction not found");
}

export async function acceptBid(auctionId: string, bidId: string): Promise<ReverseAuction> {
  try {
    const docRef = doc(db, "hsm_auctions", auctionId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      await updateDoc(docRef, { status: "accepted" });
      return { ...(snap.data() as ReverseAuction), status: "accepted" };
    }
  } catch (err) {
    console.warn("Firestore error in acceptBid, writing to localStorage", err);
  }

  const list: ReverseAuction[] = JSON.parse(localStorage.getItem(LS_AUCTIONS) || "[]");
  const index = list.findIndex(a => a.id === auctionId);
  if (index !== -1) {
    list[index].status = "accepted";
    localStorage.setItem(LS_AUCTIONS, JSON.stringify(list));
    return list[index];
  }
  throw new Error("Auction not found");
}

// ==========================================
// REVIEWS OPERATIONS
// ==========================================

export async function getReviews(providerId?: string): Promise<Review[]> {
  try {
    const colRef = collection(db, "hsm_reviews");
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list: Review[] = [];
      snap.forEach(d => list.push(d.data() as Review));
      if (providerId) {
        return list.filter(r => r.providerId === providerId).sort((a,b) => b.createdAt.localeCompare(a.createdAt));
      }
      return list.sort((a,b) => b.createdAt.localeCompare(a.createdAt));
    }
  } catch (err) {
    console.warn("Firestore error in getReviews, using localStorage", err);
  }
  const list: Review[] = JSON.parse(localStorage.getItem(LS_REVIEWS) || "[]");
  if (providerId) {
    return list.filter(r => r.providerId === providerId).sort((a,b) => b.createdAt.localeCompare(a.createdAt));
  }
  return list.sort((a,b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addReview(review: Review): Promise<Review> {
  try {
    await setDoc(doc(db, "hsm_reviews", review.id), review);
    
    // Increment provider's counts
    const provDoc = doc(db, "hsm_users", review.providerId);
    const provSnap = await getDoc(provDoc);
    if (provSnap.exists()) {
      const data = provSnap.data() as UserProfile;
      const count = (data.reviewCount || 0) + 1;
      const newRating = Number((((data.rating || 4.5) * (data.reviewCount || 0) + review.rating) / count).toFixed(1));
      await updateDoc(provDoc, {
        reviewCount: count,
        rating: newRating
      });
    }
  } catch (err) {
    console.warn("Firestore error in addReview, writing to localStorage", err);
  }

  const list: Review[] = JSON.parse(localStorage.getItem(LS_REVIEWS) || "[]");
  list.unshift(review);
  localStorage.setItem(LS_REVIEWS, JSON.stringify(list));

  // Update provider list in localStorage too
  const provList: UserProfile[] = JSON.parse(localStorage.getItem(LS_PROVIDERS) || "[]");
  const pIdx = provList.findIndex(p => p.uid === review.providerId);
  if (pIdx !== -1) {
    const p = provList[pIdx];
    const count = (p.reviewCount || 0) + 1;
    const newRating = Number((((p.rating || 4.5) * (p.reviewCount || 0) + review.rating) / count).toFixed(1));
    provList[pIdx] = { ...p, reviewCount: count, rating: newRating };
    localStorage.setItem(LS_PROVIDERS, JSON.stringify(provList));
  }

  return review;
}

// ==========================================
// COMPLAINTS OPERATIONS
// ==========================================

export async function getComplaints(): Promise<Complaint[]> {
  try {
    const colRef = collection(db, "hsm_complaints");
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list: Complaint[] = [];
      snap.forEach(d => list.push(d.data() as Complaint));
      return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
  } catch (err) {
    console.warn("Firestore error in getComplaints, using localStorage", err);
  }
  return JSON.parse(localStorage.getItem(LS_COMPLAINTS) || "[]");
}

export async function submitComplaint(complaint: Complaint): Promise<Complaint> {
  try {
    await setDoc(doc(db, "hsm_complaints", complaint.id), complaint);
  } catch (err) {
    console.warn("Firestore error in submitComplaint, writing to localStorage", err);
  }
  const list: Complaint[] = JSON.parse(localStorage.getItem(LS_COMPLAINTS) || "[]");
  list.unshift(complaint);
  localStorage.setItem(LS_COMPLAINTS, JSON.stringify(list));
  return complaint;
}

export async function updateComplaintStatus(id: string, status: Complaint["status"]): Promise<void> {
  try {
    const docRef = doc(db, "hsm_complaints", id);
    await updateDoc(docRef, { status });
  } catch (err) {
    console.warn("Firestore error in updateComplaintStatus, writing to localStorage", err);
  }
  const list: Complaint[] = JSON.parse(localStorage.getItem(LS_COMPLAINTS) || "[]");
  const index = list.findIndex(c => c.id === id);
  if (index !== -1) {
    list[index].status = status;
    localStorage.setItem(LS_COMPLAINTS, JSON.stringify(list));
  }
}

// ==========================================
// CHAT OPERATIONS
// ==========================================

export async function getChats(senderId: string, receiverId: string): Promise<ChatMessage[]> {
  try {
    const colRef = collection(db, "hsm_chats");
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list: ChatMessage[] = [];
      snap.forEach(d => {
        const msg = d.data() as ChatMessage;
        if (
          (msg.senderId === senderId && msg.receiverId === receiverId) ||
          (msg.senderId === receiverId && msg.receiverId === senderId)
        ) {
          list.push(msg);
        }
      });
      return list.sort((a,b) => a.timestamp - b.timestamp);
    }
  } catch (err) {
    console.warn("Firestore error in getChats, using localStorage", err);
  }
  
  const list: ChatMessage[] = JSON.parse(localStorage.getItem(LS_CHATS) || "[]");
  return list.filter(msg => 
    (msg.senderId === senderId && msg.receiverId === receiverId) ||
    (msg.senderId === receiverId && msg.receiverId === senderId)
  ).sort((a,b) => a.timestamp - b.timestamp);
}

export async function sendChatMessage(msg: ChatMessage): Promise<ChatMessage> {
  try {
    await setDoc(doc(db, "hsm_chats", msg.id), msg);
  } catch (err) {
    console.warn("Firestore error in sendChatMessage, writing to localStorage", err);
  }
  
  const list: ChatMessage[] = JSON.parse(localStorage.getItem(LS_CHATS) || "[]");
  list.push(msg);
  localStorage.setItem(LS_CHATS, JSON.stringify(list));
  return msg;
}
