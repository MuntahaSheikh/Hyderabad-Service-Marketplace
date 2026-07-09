import React, { useState } from "react";
import { Booking, UserProfile, Complaint } from "../types";
import { 
  Shield, 
  ShieldCheck, 
  CheckCircle, 
  Users, 
  DollarSign, 
  AlertTriangle, 
  Activity, 
  FileText, 
  UserX, 
  Wrench, 
  RefreshCw, 
  Info,
  X
} from "lucide-react";

interface DashboardAdminProps {
  bookings: Booking[];
  providers: UserProfile[];
  complaints: Complaint[];
  onVerifyProvider: (uid: string, status: "approved" | "rejected") => void;
  onResolveComplaint: (id: string) => void;
}

export default function DashboardAdmin({
  bookings,
  providers,
  complaints,
  onVerifyProvider,
  onResolveComplaint
}: DashboardAdminProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "providers" | "complaints" | "logs">("overview");

  // Calculate stats
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(b => b.status === "completed");
  const totalVolume = completedBookings.reduce((acc, curr) => acc + curr.price, 0);
  const platformEarnings = totalVolume * 0.1; // 10% Platform fee

  const unverifiedProviders = providers.filter(p => p.kycStatus === "pending" || !p.isVerified);
  const activeComplaintsCount = complaints.filter(c => c.status !== "resolved").length;

  // Real-time audit logs simulation
  const [auditLogs, setAuditLogs] = useState([
    { id: 1, time: "02:22 PM", text: "SOS Emergency Car Mechanic dispatched on-site", ip: "182.176.103.49" },
    { id: 2, time: "02:15 PM", text: "Provider Sajid Ali accepted inverter repair request", ip: "182.176.103.21" },
    { id: 3, time: "01:45 PM", text: "Professor Tariq submitted bid PKR 11,000 on mathematics tutor board", ip: "39.40.12.82" },
    { id: 4, time: "12:00 PM", text: "New Customer Kamran Shah registered from Qasimabad", ip: "182.176.101.5" }
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Admin header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 font-bold text-[10px] uppercase mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Marketplace Administration</span>
          </div>
          <h2 className="font-display font-black text-2xl md:text-3xl text-slate-900 dark:text-white">
            HSM Enterprise Control Panel
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Monitor hyperlocal operations, verify provider credentials, resolve customer disputes with AI analytical summaries, and track platform commission earnings.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl self-start md:self-auto border border-slate-200/50 dark:border-slate-800/50 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === "overview" ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-cyan-400 shadow-sm" : "hover:text-slate-900"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("providers")}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1 ${
              activeTab === "providers" ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-cyan-400 shadow-sm" : "hover:text-slate-900"
            }`}
          >
            <span>KYC Providers</span>
            {unverifiedProviders.length > 0 && (
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("complaints")}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1 ${
              activeTab === "complaints" ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-cyan-400 shadow-sm" : "hover:text-slate-900"
            }`}
          >
            <span>Complaints</span>
            {activeComplaintsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-600 text-[9px] font-black">{activeComplaintsCount}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === "logs" ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-cyan-400 shadow-sm" : "hover:text-slate-900"
            }`}
          >
            System Logs
          </button>
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Bookings</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono block mt-1">{totalBookings}</span>
              <p className="text-[10px] text-slate-500 mt-2">Active dispatches in Hyderabad</p>
            </div>

            <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gross volume (PKR)</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono block mt-1">PKR {totalVolume.toLocaleString()}</span>
              <p className="text-[10px] text-emerald-500 mt-2">Completed repair transactions</p>
            </div>

            <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Platform Commission</span>
              <span className="text-2xl font-black text-blue-600 dark:text-cyan-400 font-mono block mt-1">PKR {platformEarnings.toLocaleString()}</span>
              <p className="text-[10px] text-slate-500 mt-2">Net 10% platform royalty fee</p>
            </div>

            <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Verified Partners</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono block mt-1">
                {providers.filter(p => p.isVerified).length} <span className="text-xs text-slate-400 font-sans font-normal">Active</span>
              </span>
              <p className="text-[10px] text-emerald-500 mt-2">✓ Fully verified CNIC & profiles</p>
            </div>
          </div>

          {/* Quick summaries */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick disputes panel */}
            <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
              <h4 className="font-display font-bold text-sm text-slate-800 dark:text-white uppercase tracking-widest">
                Pending KYC Approvals ({unverifiedProviders.length})
              </h4>
              {unverifiedProviders.length === 0 ? (
                <p className="text-xs text-slate-400 italic">All registered partners are currently verified and operational.</p>
              ) : (
                <div className="space-y-3">
                  {unverifiedProviders.map(p => (
                    <div key={p.uid} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-between text-xs border border-slate-200/40">
                      <div className="flex items-center gap-2.5">
                        <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200 leading-none">{p.name}</p>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">CNIC: {p.cnic || "Unsubmitted"} | {p.category}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab("providers")}
                        className="text-[10px] text-blue-600 hover:underline font-bold"
                      >
                        Inspect Application
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick complaints panel */}
            <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
              <h4 className="font-display font-bold text-sm text-slate-800 dark:text-white uppercase tracking-widest">
                Active Complaints ({activeComplaintsCount})
              </h4>
              {activeComplaintsCount === 0 ? (
                <p className="text-xs text-slate-400 italic">No unresolved disputes or complaints at this time.</p>
              ) : (
                <div className="space-y-3">
                  {complaints.filter(c => c.status !== "resolved").map(c => (
                    <div key={c.id} className="p-3 bg-red-50/20 dark:bg-red-950/10 rounded-xl flex items-center justify-between text-xs border border-red-100/40">
                      <div>
                        <p className="font-bold text-red-700 dark:text-red-400">Against: {c.providerName}</p>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">Filed by {c.customerName} | {new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                      <button
                        onClick={() => setActiveTab("complaints")}
                        className="text-[10px] text-blue-600 hover:underline font-bold"
                      >
                        View AI Analysis
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "providers" && (
        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-5 shadow-sm space-y-5">
          <h3 className="font-display font-bold text-sm text-slate-800 dark:text-white uppercase tracking-widest">
            Partner Registration & CNIC Verification Queue ({unverifiedProviders.length})
          </h3>

          {unverifiedProviders.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs italic">
              Verification queue is empty. All Hyderabad partners are fully vetted.
            </div>
          ) : (
            <div className="space-y-4">
              {unverifiedProviders.map((p) => (
                <div key={p.uid} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                  <div className="flex gap-3.5">
                    <img src={p.avatar} alt={p.name} className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-bold text-slate-950 dark:text-white text-sm">{p.name}</h4>
                      <p className="text-blue-600 dark:text-cyan-400 font-semibold mt-0.5">{p.category} Specialist</p>
                      <p className="text-slate-500 dark:text-slate-400 mt-1 leading-relaxed max-w-xl">
                        <strong>Statement/Bio:</strong> "{p.bio || "No bio submitted yet."}"
                      </p>
                      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-400">
                        <span>CNIC Number: <strong>{p.cnic || "Unsubmitted"}</strong></span>
                        <span>Selfie ID Photo: <strong>Submitted (Vetted matching name)</strong></span>
                        <span>Experience: <strong>{p.experienceYears || 5} Years</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 self-end md:self-auto shrink-0">
                    <button
                      onClick={() => onVerifyProvider(p.uid, "rejected")}
                      className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg font-bold"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => onVerifyProvider(p.uid, "approved")}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1 shadow-sm"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Approve Partner</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "complaints" && (
        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-5 shadow-sm space-y-5">
          <h3 className="font-display font-bold text-sm text-slate-800 dark:text-white uppercase tracking-widest">
            AI-Audited Disputes & Complaints ({complaints.length})
          </h3>

          {complaints.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs italic">
              Dispute center is clean. No active tickets.
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((c) => (
                <div 
                  key={c.id} 
                  className={`p-5 rounded-xl border ${
                    c.status === "resolved" 
                      ? "border-slate-100 bg-slate-50/50 dark:border-slate-900/40" 
                      : "border-red-100 bg-red-50/10 dark:border-red-950/20"
                  }`}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">Complaint ID: {c.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          c.status === "resolved" 
                            ? "bg-emerald-100 text-emerald-700" 
                            : "bg-red-100 text-red-700"
                        }`}>
                          {c.status}
                        </span>
                      </div>

                      <p className="text-slate-500 mt-1 leading-relaxed max-w-3xl">
                        <strong>Details:</strong> {c.text}
                      </p>

                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-y-1 text-[11px] text-slate-400">
                        <span>Customer Name: <strong>{c.customerName}</strong></span>
                        <span>Against Partner: <strong>{c.providerName}</strong></span>
                        <span>Filing Date: <strong>{new Date(c.createdAt).toLocaleDateString()}</strong></span>
                      </div>
                    </div>

                    {c.status !== "resolved" && (
                      <button
                        onClick={() => onResolveComplaint(c.id)}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm shrink-0"
                      >
                        Resolve Dispute
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "logs" && (
        <div className="bg-slate-950 text-slate-300 rounded-2xl border border-slate-800 p-5 shadow-2xl font-mono text-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              <span className="font-bold text-slate-400">HSM Live Security & Activity Audit Console</span>
            </div>
            <span className="text-[10px] text-slate-500">Auto-Refreshed GPS Logs</span>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex flex-col sm:flex-row justify-between sm:items-center py-1 border-b border-slate-900/50">
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-slate-500">[{log.time}]</span>
                  <span className="text-emerald-400 font-bold">INFO:</span>
                  <span>{log.text}</span>
                </div>
                <span className="text-[10px] text-slate-600 font-mono self-end sm:self-auto">{log.ip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
