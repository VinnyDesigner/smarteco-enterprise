import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import BackgroundImage from '../../../assets/Background.jpg';

export const LoginPage: React.FC = () => {
  const { login } = useApp();

  const [email, setEmail] = useState<string>('admin@company.io');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState<boolean>(false);
  const [showCreateAccountModal, setShowCreateAccountModal] = useState<boolean>(false);

  // Cursor position tracking for green gradient spotlight effect (300px radius)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = Math.round((clientX / innerWidth) * 100);
    const y = Math.round((clientY / innerHeight) * 100);
    setMousePos({ x, y });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setTimeout(async () => {
      await login(email, password);
      setIsLoading(false);
    }, 600);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-8 lg:p-12 text-slate-900 overflow-hidden select-none bg-cover bg-center"
      style={{
        backgroundImage: `radial-gradient(circle 300px at ${mousePos.x}% ${mousePos.y}%, rgba(0, 176, 116, 0.18), transparent 85%), url(${BackgroundImage})`,
      }}
    >
      {/* FULL-PAGE CONTAINER: OPEN VIEWPORT ON LEFT, EXPANDED WHITE GLASSMORPHIC CARD SHIFTED RIGHT */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">

        {/* LEFT COLUMN: OPEN VIEWPORT DISPLAYING UNBLURRED WALLPAPER HARDWARE PODIUM */}
        <div className="hidden lg:block lg:w-1/2 min-h-[420px]" />

        {/* RIGHT COLUMN: WHITE GLASSMORPHIC LOGIN CARD (SHIFTED ~15% RIGHT) */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end lg:translate-x-12">
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.45)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.85)',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.12), inset 0 1px 2px rgba(255, 255, 255, 0.9)',
            }}
            className="rounded-[2.5rem] p-8 sm:p-11 max-w-xl w-full space-y-6"
          >
            {/* Header Title: CENTERED IN THE CARD */}
            <div className="space-y-1 text-center">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight block text-center">
                Welcome to
              </h1>
              <span className="text-3xl sm:text-4xl font-black text-[#00B074] tracking-tight whitespace-nowrap block mt-1 text-center">
                Smart Eco Enterprise
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email Input with Increased Left Padding (pl-7) */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-extrabold text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-4 pr-4 py-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/90 focus:border-[#00B074] focus:bg-white focus:outline-none text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 transition-all shadow-2xs"
                />
              </div>

              {/* Password Input with Increased Left Padding (pl-7) */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-extrabold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full pl-4 pr-11 py-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/90 focus:border-[#00B074] focus:bg-white focus:outline-none text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Checkbox & Forgot Password Row */}
              <div className="flex items-center justify-between pt-1 text-xs sm:text-sm">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4.5 h-4.5 rounded border-slate-300 text-[#00B074] focus:ring-[#00B074] cursor-pointer"
                  />
                  <span className="text-slate-700 font-extrabold">Remember Me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(true)}
                  className="text-xs sm:text-sm font-extrabold text-[#FF6B6B] hover:underline transition-colors"
                >
                  Forgot Password
                </button>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-2xl bg-[#00B074] hover:bg-[#009663] text-white text-sm sm:text-base font-extrabold shadow-xl shadow-emerald-600/20 hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 mt-3"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* OR Divider Line with Lines on Each Side */}
              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-slate-300/80 w-full" />
                <span className="bg-white/80 backdrop-blur-md px-3 py-0.5 rounded-full text-xs font-extrabold text-slate-500 uppercase tracking-widest absolute shadow-2xs">
                  OR
                </span>
              </div>

              {/* Microsoft & Google SSO Buttons */}
              <div className="grid grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => login('admin@company.io')}
                  className="py-3 px-4 rounded-2xl bg-white/70 backdrop-blur-md hover:bg-white border border-slate-200/90 text-xs sm:text-sm font-extrabold text-slate-700 flex items-center justify-center gap-2.5 transition-all shadow-2xs"
                >
                  <div className="grid grid-cols-2 gap-0.5 w-4 h-4 shrink-0">
                    <div className="bg-[#F25022]" />
                    <div className="bg-[#7FBA00]" />
                    <div className="bg-[#00A4EF]" />
                    <div className="bg-[#FFB900]" />
                  </div>
                  <span>Microsoft</span>
                </button>

                <button
                  type="button"
                  onClick={() => login('pujitha@smarteco.io')}
                  className="py-3 px-4 rounded-2xl bg-white/70 backdrop-blur-md hover:bg-white border border-slate-200/90 text-xs sm:text-sm font-extrabold text-slate-700 flex items-center justify-center gap-2.5 transition-all shadow-2xs"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google</span>
                </button>
              </div>

              {/* "Don't have an account? Sign Up" Footer at the VERY END of the Card */}
              <div className="pt-2 text-center text-xs sm:text-sm font-extrabold text-slate-600">
                <span>Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => setShowCreateAccountModal(true)}
                  className="text-[#FF6B6B] hover:underline font-black transition-colors"
                >
                  Sign Up
                </button>
              </div>
            </form>

          </div>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-white animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-black text-slate-900">Reset Password</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your corporate email address to receive password reset instructions.
            </p>
            <input
              type="email"
              defaultValue={email}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00B074]"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowForgotPasswordModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowForgotPasswordModal(false);
                  alert(`Password reset instructions sent to ${email}`);
                }}
                className="px-4 py-2 text-xs font-bold bg-[#00B074] text-white rounded-xl shadow-sm"
              >
                Send Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Account Modal */}
      {showCreateAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-white animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-black text-slate-900">Request SmartEco Access</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              SmartEco Enterprise accounts are provisioned by site administrators. Contact your site admin or click below to submit an access request.
            </p>
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Use test credentials to sign in instantly!</span>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCreateAccountModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowCreateAccountModal(false);
                  login('pujitha@smarteco.io');
                }}
                className="px-4 py-2 text-xs font-bold bg-[#00B074] text-white rounded-xl shadow-sm"
              >
                Sign In As Test User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
