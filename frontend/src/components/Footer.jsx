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
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Contact & Support
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>events@eec.srmrmp.edu.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-400" />
                <span>+91 44 4392 3041 / 3042</span>
              </div>
              <div className="pt-2">
                <a
                  href="https://srmeaswari.ac.in/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors border border-slate-700"
                >
                  <span>SRM EEC Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SRM Easwari Engineering College (Autonomous). All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Affiliated to Anna University</span>
            <span>•</span>
            <span>Accredited by NAAC 'A' Grade</span>
            <span>•</span>
            <span>NBA Tier-1 Accredited</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
