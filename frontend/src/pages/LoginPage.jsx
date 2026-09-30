import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, LogIn, Lock, Mail, ShieldCheck, UserCheck, Loader2, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.error);
    }
  };

  const handleFillDemo = (type) => {
    if (type === 'student') {
      setEmail('student@eec.srmrmp.edu.in');
      setPassword('Student@123');
    } else {
      setEmail('organizer@eec.srmrmp.edu.in');
      setPassword('Admin@123');
    }
    setError('');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#0b132b]/95 border border-blue-900/50 p-8 rounded-3xl shadow-2xl space-y-6 backdrop-blur-md">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20 border border-blue-400/30 mb-1">
            <GraduationCap className="w-7 h-7 text-amber-400" />
          </div>
          <h1 className="text-2xl font-black text-white font-['Outfit']">Sign In to SympoSphere</h1>
