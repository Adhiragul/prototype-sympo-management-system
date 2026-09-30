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
                  SympoSphere
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Easwari Engineering College (Autonomous)
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/events"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                isActive('/events')
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Events & Workshops
            </Link>

            {isAuthenticated && !isOrganizer && (
              <Link
                to="/my-registrations"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  isActive('/my-registrations')
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Ticket className="w-4 h-4 text-amber-400" />
                My Registrations
              </Link>
            )}

            {isOrganizer && (
              <>
                <Link
                  to="/organizer/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive('/organizer/dashboard')
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                  Organizer Portal
                </Link>

                <Link
                  to="/organizer/create-event"
                  className="px-3 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-900/30 flex items-center gap-2 transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  Publish Event
                </Link>
              </>
            )}
          </nav>

          {/* User Controls & Demo Switcher */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Switcher for fast evaluation */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
              <span className="px-2 text-slate-400 text-[11px]">Quick Demo:</span>
              <button
                onClick={() => quickDemoLogin('student')}
                className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                  user?.role === 'student'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
                title="Log in as demo student (Adhiragul S - Cybersecurity)"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Student
              </button>
              <button
                onClick={() => quickDemoLogin('organizer')}
                className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                  isOrganizer
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
                title="Log in as club organizer / faculty coordinator"
              >
                <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                Organizer
              </button>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-semibold text-white leading-tight">
                    {user?.name}
                  </p>
                  <p className="text-[10px] text-blue-300">
                    {user?.department} • {user?.role?.toUpperCase()}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-slate-800/80 hover:bg-red-500/20 hover:text-red-400 text-slate-400 border border-slate-700/60 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
