import React from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Shield, 
  Cpu, 
  Zap, 
  Code, 
  Sparkles, 
  CheckSquare, 
  Square 
} from 'lucide-react';

const DEPARTMENTS = [
  'All Departments',
  'Cybersecurity',
  'Robotics and Automation',
  'Electrical and Electronics Engineering',
  'Computer Science & Engineering',
  'Information Technology',
  'Artificial Intelligence & Data Science',
  'Electronics & Communication Engineering',
  'Mechanical Engineering',
  'Civil Engineering'
];

const CATEGORIES = [
  'All Categories',
  'Symposium',
  'Workshop',
  'Hackathon',
  'Paper Presentation',
  'Seminar',
  'Technical Contest'
];

export const FilterBar = ({
  search,
  setSearch,
  selectedDepartment,
  setSelectedDepartment,
  selectedCategory,
  setSelectedCategory,
  availableOnly,
  setAvailableOnly,
  sortBy,
  setSortBy,
  totalFound
}) => {
  const isFiltered =
    search ||
    selectedDepartment !== 'All Departments' ||
    selectedCategory !== 'All Categories' ||
    availableOnly;

  const handleReset = () => {
    setSearch('');
    setSelectedDepartment('All Departments');
    setSelectedCategory('All Categories');
    setAvailableOnly(false);
    setSortBy('date-asc');
  };

  return (
    <div className="bg-[#0b132b]/80 border border-blue-900/40 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md space-y-5">
      {/* Top Row: Search Input & Sort Selector */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, club (e.g. CyberDef, RoboTech), topic, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right Controls: Available Only toggle & Sort dropdown */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Seats Available Toggle */}
          <button
            onClick={() => setAvailableOnly(!availableOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
              availableOnly
                ? 'bg-blue-600/20 text-blue-300 border-blue-500/60'
                : 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            {availableOnly ? (
