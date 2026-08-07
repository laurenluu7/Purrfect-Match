import React, { useState } from 'react';
import { Cat, Heart, Sparkles, ShieldCheck, Lock, ArrowRight, UserCheck, Key, Eye, EyeOff, Cake, Award, HelpCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Cat as CatType } from '../types';

interface LandingPageProps {
  cats: CatType[];
  onLogin: (user: { name: string; role: 'visitor' | 'staff'; email: string }) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ cats, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'visitor' | 'staff'>('visitor');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const featuredCats = cats.slice(0, 3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email or username');
      return;
    }

    const nameFromEmail = email.split('@')[0] || 'Cat Lover';
    const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);

    onLogin({
      name: formattedName,
      role: role,
      email: email.includes('@') ? email : `${email.toLowerCase()}@meohub.com`
    });
  };

  const handleQuickLogin = (selectedRole: 'visitor' | 'staff') => {
    if (selectedRole === 'staff') {
      onLogin({
        name: 'Staff Operations Manager',
        role: 'staff',
        email: 'manager@meohub.com'
      });
    } else {
      onLogin({
        name: 'Guest Visitor',
        role: 'visitor',
        email: 'guest@meohub.com'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f1ea] text-stone-800 flex flex-col justify-between font-['Poppins',sans-serif] antialiased selection:bg-[#e2cbb8]">
      
      {/* Top Header Navigation */}
      <header className="w-full bg-[#f0e8e0]/90 backdrop-blur-md border-b border-[#e6dad0] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Cafe Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f5dfce] border-2 border-white flex items-center justify-center shadow-xs text-[#8c593b]">
              <svg viewBox="0 0 36 36" className="w-6 h-6 fill-current">
                <path d="M18 10c-5.5 0-10 4.5-10 10 0 5 3.5 9 8 10 1-.2 2-.5 2-1 0-.5-1-.8-2-1-3.5 0-6-3-6-7 0-4.4 3.6-8 8-8s8 3.6 8 8c0 4-2.5 7-6 7-1 .2-2 .5-2 1 0 .5 1 .8 2 1 4.5-1 8-5 8-10 0-5.5-4.5-10-10-10z"/>
                <path d="M11 11l-4-5c-.4-.5-1.2-.2-1.1.4l1 6.6c1.3-0.7 2.7-1.4 4.1-2zM25 11l4-5c.4-.5 1.2-.2 1.1.4l-1 6.6c-1.3-0.7-2.7-1.4-4.1-2z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-stone-900 text-lg tracking-tight">Meo Hub</span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-[#e8ded4] text-[#8c593b] border border-[#d8c8ba] tracking-wide uppercase">
                  Meow Maison Cat Cafe
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleQuickLogin('visitor')}
              className="px-3.5 py-1.5 rounded-2xl text-xs font-bold text-stone-700 hover:text-stone-900 hover:bg-[#e8ded4] transition-all cursor-pointer hidden sm:flex items-center space-x-1.5"
            >
              <Heart className="w-3.5 h-3.5 text-[#c98d65]" />
              <span>Enter as Guest</span>
            </button>

            <button
              onClick={() => handleQuickLogin('staff')}
              className="px-4 py-2 rounded-2xl bg-[#c98d65] hover:bg-[#b57a53] text-white font-extrabold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer flex items-center space-x-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Staff Operations</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero & Login Split Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14 w-full flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Cafe Hero & Description */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#e8ded4] text-[#784729] border border-[#d8c8ba] text-xs font-extrabold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#c98d65]" />
              <span>AI-Powered Feline Sanctuary & Adoption Operations</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight leading-tight">
              Where Cozy Coffee Meets <span className="text-[#c98d65]">Forever Homes 🐾</span>
            </h1>

            <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              Welcome to <strong>Meo Hub</strong> — the operations and adopter matchmaker platform powering <strong>Meow Maison Cat Cafe</strong>. Browse resident cats, log health care notes, track lounge capacity, or let our <strong>Gemini AI Matchmaker</strong> pair adopters with their ideal feline companion.
            </p>

            {/* Feature Highlights Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white/90 border border-[#ebe0d5] shadow-2xs space-y-1">
                <div className="flex items-center space-x-1.5 text-[#c98d65] font-extrabold text-xs">
                  <Heart className="w-4 h-4 fill-[#c98d65]/20" />
                  <span>100% Adoptable</span>
                </div>
                <p className="text-[11px] text-stone-500 font-medium">Detailed profiles, health care notes & history</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/90 border border-[#ebe0d5] shadow-2xs space-y-1">
                <div className="flex items-center space-x-1.5 text-indigo-600 font-extrabold text-xs">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>AI Matchmaker</span>
                </div>
                <p className="text-[11px] text-stone-500 font-medium">Smart lifestyle & compatibility quiz score</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/90 border border-[#ebe0d5] shadow-2xs space-y-1 col-span-2 sm:col-span-1">
                <div className="flex items-center space-x-1.5 text-amber-700 font-extrabold text-xs">
                  <Cake className="w-4 h-4 text-amber-600" />
                  <span>Birthday Parties</span>
                </div>
                <p className="text-[11px] text-stone-500 font-medium">Treat celebrations & salmon birthday cards</p>
              </div>
            </div>

            {/* Cafe Hours Schedule Card */}
            <div className="p-4 rounded-2xl bg-white/90 border border-[#ebe0d5] shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between text-xs font-black text-stone-900">
                <span className="flex items-center space-x-1.5 text-[#8c593b]">
                  <Cat className="w-4 h-4 text-[#c98d65]" />
                  <span>Meow Maison Cafe Hours</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                  Walk-ins Welcome
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-stone-700">
                <div className="p-2 rounded-xl bg-[#faf6f2] border border-[#ebe0d5]">
                  <div className="text-[10px] text-stone-400 uppercase font-black">Tue - Thu</div>
                  <div className="font-extrabold text-stone-900 text-[11px]">12:00 PM – 7:00 PM</div>
                </div>
                <div className="p-2 rounded-xl bg-[#f5e9de] border border-[#e8ded4]">
                  <div className="text-[10px] text-[#8c593b] uppercase font-black">Fri - Sun</div>
                  <div className="font-extrabold text-stone-900 text-[11px]">11:00 AM – 7:00 PM</div>
                </div>
                <div className="p-2 rounded-xl bg-rose-50/80 border border-rose-200/80">
                  <div className="text-[10px] text-rose-600 uppercase font-black">Monday</div>
                  <div className="font-bold text-rose-800 text-[11px]">Closed</div>
                </div>
              </div>
            </div>

            {/* Featured Resident Cats Preview Bar */}
            <div className="pt-2 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                <span>Meet Resident Cats ({cats.length} Total)</span>
                <span className="text-[#c98d65]">Available for Adoption</span>
              </div>
              <div className="flex items-center space-x-3 overflow-x-auto py-1">
                {featuredCats.map((cat) => (
                  <div key={cat.id} className="flex items-center space-x-2.5 px-3 py-2 rounded-2xl bg-white border border-[#ebe0d5] shadow-2xs flex-shrink-0">
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-9 h-9 rounded-xl object-cover border border-[#e2d5c8]"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="text-xs font-extrabold text-stone-900">{cat.name}</div>
                      <div className="text-[10px] text-stone-500 font-medium">{cat.category} • {cat.ageYears > 0 ? `${cat.ageYears}y` : `${cat.ageMonths}m`}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Login Box */}
          <div className="lg:col-span-5 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl border border-[#ebe0d5] shadow-xl p-6 sm:p-8 space-y-6 relative overflow-hidden"
            >
              {/* Decorative Warm Soft Glow */}
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#f5dfce] rounded-full blur-2xl pointer-events-none opacity-60" />
              <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-indigo-100 rounded-full blur-2xl pointer-events-none opacity-50" />

              <div className="relative z-10 space-y-2 text-center">
                <div className="inline-flex p-3 rounded-2xl bg-[#f5e9de] text-[#8c593b] border border-[#e8ded4] mb-1">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-stone-900 tracking-tight">
                  Sign In to Meo Hub
                </h2>
                <p className="text-xs text-stone-500">
                  Select your role to access cat lounge records, adopter quiz, and health logs.
                </p>
              </div>

              {/* Role Toggle Selector */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#faf6f2] rounded-2xl text-xs font-bold border border-[#ebe0d5]">
                <button
                  type="button"
                  onClick={() => setRole('visitor')}
                  className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                    role === 'visitor'
                      ? 'bg-white text-stone-900 shadow-2xs border border-[#e2d5c8] font-black'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${role === 'visitor' ? 'text-[#c98d65] fill-[#c98d65]' : ''}`} />
                  <span>Visitor / Adopter</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('staff')}
                  className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                    role === 'staff'
                      ? 'bg-[#c98d65] text-white shadow-2xs font-black'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  <ShieldCheck className={`w-3.5 h-3.5 ${role === 'staff' ? 'text-white' : ''}`} />
                  <span>Cafe Staff</span>
                </button>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-800">
                    {role === 'staff' ? 'Staff Email / Username' : 'Your Email or Display Name'}
                  </label>
                  <input
                    type="text"
                    placeholder={role === 'staff' ? 'manager@meohub.com' : 'e.g. Lauren or visitor@example.com'}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#faf6f2] border border-[#e2d5c8] text-xs font-semibold text-stone-900 outline-none focus:border-[#c98d65] focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-stone-800">Password</label>
                    <span className="text-[10px] text-stone-400 font-medium">(Optional for demo)</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 pr-10 rounded-2xl bg-[#faf6f2] border border-[#e2d5c8] text-xs font-semibold text-stone-900 outline-none focus:border-[#c98d65] focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#c98d65] hover:bg-[#b57a53] text-white font-extrabold text-xs shadow-md flex items-center justify-center space-x-2 transition-all active:scale-98 cursor-pointer"
                >
                  <span>Enter Cafe as {role === 'staff' ? 'Staff Manager' : 'Guest'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Demo Logins Divider */}
              <div className="relative pt-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-black text-stone-400 tracking-wider">
                  <span className="bg-white px-2">Instant Demo Entry</span>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  onClick={() => handleQuickLogin('visitor')}
                  className="py-2.5 px-3 rounded-2xl bg-[#f5e9de] hover:bg-[#e8ded4] text-stone-800 border border-[#e2d5c8] transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Heart className="w-3.5 h-3.5 text-[#c98d65] fill-[#c98d65]" />
                  <span>Visitor Demo</span>
                </button>

                <button
                  onClick={() => handleQuickLogin('staff')}
                  className="py-2.5 px-3 rounded-2xl bg-[#c98d65] hover:bg-[#b57a53] text-white border border-[#b57a53] transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  <span>Staff Admin</span>
                </button>
              </div>

            </motion.div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 bg-white border-t border-[#ebe0d5] text-center text-xs text-stone-500 font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-stone-500">
          <p>© 2026 Meo Hub • Built for Meow Maison Cat Cafe • AI Adoption Organizer & Feline Sanctuary</p>
          <div className="flex items-center space-x-3 text-[11px] flex-wrap justify-center">
            <span><strong>Tue-Thu:</strong> 12pm-7pm</span>
            <span>•</span>
            <span><strong>Fri-Sun:</strong> 11am-7pm</span>
            <span>•</span>
            <span className="text-rose-600 font-semibold">Mon Closed</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
