import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  X, 
  Printer, 
  CheckCircle, 
  Calendar, 
  MapPin, 
  GraduationCap, 
  Clock, 
  User, 
  Hash, 
  Sparkles 
} from 'lucide-react';

export const TicketModal = ({ registration, onClose }) => {
  const printRef = useRef(null);

  if (!registration) return null;

  const event = registration.event || {};
  const user = registration.user || {};

  const handlePrint = () => {
    window.print();
  };

  const eventDateObj = new Date(event.eventDate || registration.registeredAt);
  const formattedDate = eventDateObj.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const formattedTime = eventDateObj.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0c142e] border border-blue-900/60 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-950 bg-[#080d20]">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Official Digital Entry Pass
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Print Pass"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Area */}
        <div ref={printRef} className="p-6 space-y-6 text-slate-100 print:bg-white print:text-black">
          {/* Institutional Branding */}
          <div className="text-center border-b border-blue-950/80 pb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 shadow-lg shadow-blue-500/20 mb-2 border border-blue-400/30">
              <GraduationCap className="w-7 h-7 text-amber-400" />
            </div>
            <h2 className="text-base font-black tracking-tight text-white uppercase font-['Outfit']">
              SRM Easwari Engineering College
            </h2>
            <p className="text-[11px] text-blue-300 font-medium">
              (Autonomous Institution • Affiliated to Anna University)
            </p>
            <p className="text-[10px] text-slate-400">
              Department of {event.department || 'Academic Affairs'}
            </p>
          </div>

          {/* Ticket ID & Status Banner */}
          <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 p-4 rounded-2xl border border-blue-500/30 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Registration Code
              </p>
              <p className="text-xl font-mono font-black text-amber-400 tracking-wider">
                {registration.ticketId}
              </p>
            </div>
            <div className="text-right">
