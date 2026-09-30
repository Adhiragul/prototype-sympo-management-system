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
              <CheckSquare className="w-4 h-4 text-blue-400" />
            ) : (
              <Square className="w-4 h-4 text-slate-500" />
            )}
            <span>Available Seats Only</span>
          </button>

          {/* Sort selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="date-asc">Date: Upcoming First</option>
            <option value="date-desc">Date: Latest First</option>
            <option value="seats-asc">Seats: Fewest Left</option>
            <option value="seats-desc">Seats: Most Available</option>
            <option value="popular">Capacity: Largest Events</option>
          </select>
        </div>
      </div>

      {/* Row 2: Department Selector Pills */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <span>Filter by Department</span>
          </label>

          {isFiltered && (
            <button
              onClick={handleReset}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {DEPARTMENTS.map((dept) => {
            const isSelected = selectedDepartment === dept;
            let icon = null;
            if (dept === 'Cybersecurity') icon = <Shield className="w-3.5 h-3.5 text-emerald-400" />;
            else if (dept === 'Robotics and Automation') icon = <Cpu className="w-3.5 h-3.5 text-cyan-400" />;
            else if (dept === 'Electrical and Electronics Engineering') icon = <Zap className="w-3.5 h-3.5 text-amber-400" />;

            return (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30 font-semibold'
                    : 'bg-slate-900/70 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {icon}
                <span>
                  {dept === 'Robotics and Automation' ? 'Robotics & Automation (RA)' : dept === 'Electrical and Electronics Engineering' ? 'EEE' : dept === 'Computer Science & Engineering' ? 'CSE' : dept}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 3: Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-slate-800/80 pt-3">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
          Category:
        </span>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors shrink-0 ${
                isSelected
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {cat}
            </button>
          );
        })}

        {totalFound !== undefined && (
          <span className="ml-auto text-xs text-slate-400 shrink-0 font-medium">
            Showing <strong className="text-white">{totalFound}</strong> event{totalFound === 1 ? '' : 's'}
          </span>
        )}
      </div>
    </div>
  );
};
