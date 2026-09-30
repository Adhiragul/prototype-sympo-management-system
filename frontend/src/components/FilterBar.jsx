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
