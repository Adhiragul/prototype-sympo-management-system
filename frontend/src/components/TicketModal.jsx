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
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <CheckCircle className="w-3.5 h-3.5" />
                {registration.attended ? 'VERIFIED ATTENDED' : 'CONFIRMED RSVP'}
              </span>
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-blue-600 text-white">
              {event.category || 'Symposium'}
            </span>
            <h3 className="text-lg font-bold text-white leading-tight">
              {event.title}
            </h3>
            <p className="text-xs text-slate-400">
              Organized by <strong className="text-slate-200">{event.clubName || 'College Club'}</strong>
            </p>
          </div>

          {/* Date, Time & Venue */}
          <div className="grid grid-cols-2 gap-3 bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>Event Date</span>
              </div>
              <p className="font-semibold text-white">{formattedDate}</p>
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>{formattedTime}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>Venue</span>
              </div>
              <p className="font-semibold text-white">{event.venue || 'TRP Auditorium'}</p>
              <p className="text-[11px] text-slate-400 font-mono">Mode: {event.mode || 'In-Person'}</p>
            </div>
          </div>

          {/* Attendee Info & QR Code */}
          <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-xl border border-slate-800 gap-4">
            <div className="space-y-1 text-xs">
              <p className="text-[10px] uppercase font-bold text-slate-400">Attendee Details</p>
              <p className="font-bold text-white text-sm flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>{user.name || 'Registered Student'}</span>
              </p>
              <p className="text-slate-300">{user.email}</p>
              <p className="text-slate-400 text-[11px]">
                Roll No: <strong className="text-slate-200">{user.rollNo || 'N/A'}</strong>
              </p>
              <p className="text-slate-400 text-[11px] truncate max-w-[200px]">
                {user.department}
              </p>
            </div>

            {/* Scannable QR Code */}
            <div className="p-2.5 bg-white rounded-2xl shadow-lg shrink-0 flex flex-col items-center">
              <QRCodeSVG
                value={`SRM_EEC:${registration.ticketId}:${event._id}:${user._id}`}
                size={95}
                level="M"
              />
              <span className="text-[8px] font-mono text-slate-800 mt-1 font-bold">
                SCAN AT ENTRY
              </span>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-[11px] text-slate-400 bg-blue-950/30 p-3 rounded-xl border border-blue-900/30 space-y-1">
            <p className="font-semibold text-blue-300">Reporting Instructions:</p>
            <p>1. Present this digital pass or printed QR code at the check-in desk 15 mins prior.</p>
            <p>2. College ID card is mandatory for campus entry at SRM EEC Ramapuram.</p>
            <p>3. E-Certificate of participation will be issued post-attendance verification.</p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-[#080d20] border-t border-blue-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
          >
            Close Pass
          </button>
        </div>
      </div>
    </div>
  );
};
