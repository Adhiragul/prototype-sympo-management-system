import React from 'react';
import { GraduationCap, MapPin, Mail, Phone, ExternalLink, Shield, Cpu, Zap, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-[#050a18] border-t border-blue-950 text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & College Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-lg font-bold text-white font-['Outfit']">
                SRM <span className="text-amber-400">EEC</span> SympoSphere
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official Symposium, Technical Festival & Workshop Registration Portal of Easwari Engineering College (Autonomous), SRM Group, Chennai.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="w-4 h-4 text-red-400 shrink-0" />
              <span>Bharathi Salai, Ramapuram, Chennai - 600089</span>
            </div>
          </div>

          {/* Col 2: Priority Departments */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1.5">
              <span>Featured Departments</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/events?department=Cybersecurity" className="hover:text-blue-400 flex items-center gap-1.5 transition-colors">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  Cybersecurity (CS)
                </Link>
              </li>
              <li>
                <Link to="/events?department=Robotics and Automation" className="hover:text-blue-400 flex items-center gap-1.5 transition-colors">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  Robotics & Automation (RA)
                </Link>
              </li>
              <li>
                <Link to="/events?department=Electrical and Electronics Engineering" className="hover:text-blue-400 flex items-center gap-1.5 transition-colors">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Electrical & Electronics (EEE)
                </Link>
              </li>
              <li>
                <Link to="/events?department=Computer Science & Engineering" className="hover:text-blue-400 flex items-center gap-1.5 transition-colors">
                  <Code className="w-3.5 h-3.5 text-indigo-400" />
                  Computer Science & Engg (CSE)
                </Link>
              </li>
              <li>
                <Link to="/events?department=Artificial Intelligence & Data Science" className="hover:text-blue-400 flex items-center gap-1.5 transition-colors">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  AI & Data Science (AI&DS)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Venues & Campus Spots */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Campus Venues
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• TRP Auditorium (Capacity: 1200)</li>
              <li>• EEC Mini Auditorium (Block 2)</li>
              <li>• Hi-Tech Seminar Hall (Block 5)</li>
              <li>• Cyber Defense Centre Lab</li>
              <li>• Advanced Robotics & ROS Lab</li>
              <li>• Power Electronics Lab (EEE)</li>
            </ul>
          </div>

          {/* Col 4: Quick Portals & Contact */}
