import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  Calendar, 
  PlusCircle, 
  LayoutDashboard, 
  Ticket, 
  LogOut, 
  LogIn, 
  UserCheck,
  ShieldCheck,
  Cpu,
  Zap
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isOrganizer, logout, quickDemoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#0a1128]/90 backdrop-blur-md border-b border-blue-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform border border-blue-400/30">
              <GraduationCap className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white font-['Outfit']">
                  SRM <span className="text-amber-400">EEC</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 font-medium border border-blue-700/50">
