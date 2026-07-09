import React, { useState, useEffect, useMemo } from "react";
import { ServiceCategory, UserProfile, Booking } from "../types";
import { INITIAL_CATEGORIES, HYDERABAD_AREAS } from "../lib/seedData";
import { 
  SlidersHorizontal, 
  X, 
  Calendar, 
  DollarSign, 
  Star, 
  Award, 
  CheckCircle2, 
  Building2, 
  RotateCcw, 
  MapPin, 
  Sparkles,
  Search,
  Filter,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface FilterState {
  subcategory: string;
  area: string;
  minPrice: number | "";
  maxPrice: number | "";
  minRating: number;
  availability: string;
  eventDate: string;
  minExperience: number | "";
  trustScoreThreshold: number | "";
  verifiedOnly: boolean;
  minCapacity: number | "";
  sortBy: string;
}

export const DEFAULT_FILTERS: FilterState = {
  subcategory: "All",
  area: "All Hyderabad",
  minPrice: "",
  maxPrice: "",
  minRating: 0,
  availability: "All",
  eventDate: "",
  minExperience: "",
  trustScoreThreshold: "",
  verifiedOnly: false,
  minCapacity: "",
  sortBy: "best"
};

interface ProviderFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onFiltersChange: (filters: FilterState) => void;
  activeFiltersCount: number;
}

export default function ProviderFilters({
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
  searchQuery,
  setSearchQuery,
  onFiltersChange,
  activeFiltersCount
}: ProviderFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Sync parent category changes with reset of subcategory
  useEffect(() => {
    setFilters(prev => ({ ...prev, subcategory: "All" }));
  }, [selectedCategory]);

  // Sync parent location change to area filter
  useEffect(() => {
    setFilters(prev => ({ ...prev, area: selectedLocation }));
  }, [selectedLocation]);

  // Propagate filter updates up
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  // Get subcategories of the active category
  const subcategories = useMemo(() => {
    if (selectedCategory === "All") {
      // Return a unique list of all subcategories across all categories
      const all: string[] = [];
      INITIAL_CATEGORIES.forEach(cat => {
        cat.subcategories.forEach(sub => {
          if (!all.includes(sub)) all.push(sub);
        });
      });
      return all;
    }
    const match = INITIAL_CATEGORIES.find(c => c.name === selectedCategory);
    return match ? match.subcategories : [];
  }, [selectedCategory]);

  const handleReset = () => {
    setFilters({
      ...DEFAULT_FILTERS,
      area: selectedLocation // keep parent location if specified
    });
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedLocation("All Hyderabad");
  };

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => {
      const updated = { ...prev, [key]: value };
      // Keep navbar / parent states in sync if they are edited here
      if (key === "area") {
        setSelectedLocation(value as string);
      }
      return updated;
    });
  };

  const handleActiveToggle = (key: keyof FilterState, value: any, defaultValue: any) => {
    if (filters[key] === value) {
      updateFilter(key, defaultValue);
    } else {
      updateFilter(key, value);
    }
  };

  return (
    <div id="filters-container" className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 p-4 shadow-sm space-y-4 transition-all duration-200">
      
      {/* Primary search query & basic sort toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-display font-bold text-sm">
          <Filter className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>Refine Service Registry</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {/* Sorting control */}
          <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-xl px-3 py-1.5 text-xs">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter("sortBy", e.target.value)}
              className="bg-transparent text-slate-700 dark:text-slate-200 font-bold focus:outline-none cursor-pointer"
            >
              <option value="best">Featured Match</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Top Rated (Stars)</option>
              <option value="experience_desc">Seniority (Years)</option>
              <option value="trust_desc">Trust Score</option>
              <option value="newest">Newly Listed</option>
            </select>
          </div>

          {/* Toggle Advanced Filters Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0 ${
              isOpen || activeFiltersCount > 0
                ? "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400"
                : "bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Advanced Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Clear Button */}
          {(activeFiltersCount > 0 || searchQuery !== "" || selectedCategory !== "All") && (
            <button
              onClick={handleReset}
              className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors shrink-0"
              title="Reset All Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Advanced filters collapsible cabinet */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
              
              {/* Category & Subcategory Box */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Sub-Specialty ({selectedCategory === "All" ? "Global" : selectedCategory})
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                  <button
                    onClick={() => updateFilter("subcategory", "All")}
                    className={`px-2 py-1 rounded-lg font-semibold text-[10px] transition-all border ${
                      filters.subcategory === "All"
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200/50 dark:border-slate-800"
                    }`}
                  >
                    All Subcategories
                  </button>
                  {subcategories.map(sub => (
                    <button
                      key={sub}
                      onClick={() => handleActiveToggle("subcategory", sub, "All")}
                      className={`px-2 py-1 rounded-lg font-semibold text-[10px] transition-all border ${
                        filters.subcategory === sub
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200/50 dark:border-slate-800"
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              {/* Area & Location */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Sector / Area in Hyderabad
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={filters.area}
                    onChange={(e) => updateFilter("area", e.target.value)}
                    className="w-full text-xs pl-8.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl p-2.5 text-slate-800 dark:text-white focus:outline-none cursor-pointer"
                  >
                    {HYDERABAD_AREAS.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Budget / Rates Range */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Base Rate Range (PKR)
                </label>
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => updateFilter("minPrice", e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full pl-7.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl p-2 text-slate-800 dark:text-white focus:outline-none"
                    />
                  </div>
                  <span className="text-slate-400 font-bold">—</span>
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => updateFilter("maxPrice", e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full pl-7.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl p-2 text-slate-800 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Date availability checker */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Filter by Event Date
                  </label>
                  {filters.eventDate && (
                    <span className="text-[9px] text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded">
                      Excludes Booked Pros
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="date"
                    value={filters.eventDate}
                    onChange={(e) => updateFilter("eventDate", e.target.value)}
                    className="w-full pl-8.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl p-2 text-slate-800 dark:text-white focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Ratings and Availability status */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Feedback Rating & Availability
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={filters.minRating}
                    onChange={(e) => updateFilter("minRating", Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl p-2 text-slate-800 dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value={0}>Any Rating</option>
                    <option value={4.0}>⭐ 4.0+ Stars</option>
                    <option value={4.5}>⭐ 4.5+ Stars</option>
                    <option value={4.8}>⭐ 4.8+ Stars</option>
                    <option value={5.0}>⭐ 5.0 Perfect</option>
                  </select>

                  <select
                    value={filters.availability}
                    onChange={(e) => updateFilter("availability", e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl p-2 text-slate-800 dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="All">Any Status</option>
                    <option value="Available">Available Only</option>
                    <option value="Busy">Busy</option>
                    <option value="Holiday">Holiday</option>
                  </select>
                </div>
              </div>

              {/* Experience and Trust score */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Experience & Trust Score
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Award className="absolute left-2 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="number"
                      placeholder="Min Years"
                      value={filters.minExperience}
                      onChange={(e) => updateFilter("minExperience", e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full pl-6.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl p-2 text-slate-800 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="relative">
                    <Sparkles className="absolute left-2 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="number"
                      placeholder="Trust Score 90+"
                      value={filters.trustScoreThreshold}
                      onChange={(e) => updateFilter("trustScoreThreshold", e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full pl-6.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl p-2 text-slate-800 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Custom options: Capacity and Verification status */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Specialist & Venue Capacity Checks
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="number"
                      placeholder="Min Capacity (Guests: Wedding Halls only)"
                      value={filters.minCapacity}
                      onChange={(e) => updateFilter("minCapacity", e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full pl-8.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl p-2 text-slate-800 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between border border-slate-200/50 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl p-2 px-3.5">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="font-bold text-slate-700 dark:text-slate-200">HSM Vetted Only</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.verifiedOnly}
                        onChange={(e) => updateFilter("verifiedOnly", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
