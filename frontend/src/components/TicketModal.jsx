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
