import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Sparkles, CheckCircle2, ArrowRight, RotateCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const OtpVerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyOtp, user } = useAuth();

  const emailParam = searchParams.get('email') || user?.email || 'student@university.edu';
  const [email] = useState(emailParam);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [demoCode, setDemoCode] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Automatically request initial OTP to provide demo code
  useEffect(() => {
    if (email) {
      api.sendOtp(email)
        .then(res => {
          if (res.demo_otp) {
            setDemoCode(res.demo_otp);
          }
        })
        .catch(() => {});
    }
  }, [email]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleAutoFill = () => {
    if (demoCode && demoCode.length === 6) {
      setOtp(demoCode.split(''));
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    try {
      const res = await api.sendOtp(email);
      if (res.demo_otp) {
        setDemoCode(res.demo_otp);
      }
      alert(`New OTP sent to ${email}`);
    } catch (err: any) {
      setError(err.message || 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullCode = otp.join('');
    if (fullCode.length !== 6) {
      setError('Please enter the full 6-digit code');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await verifyOtp(email, fullCode);
      setSuccess(true);
      setTimeout(() => {
        navigate('/feed');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#faf8f5] dark:bg-[#0c0a09] relative overflow-hidden">
      <div className="absolute inset-0 spotlight-beam pointer-events-none" />
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white/80 dark:bg-[#150f0b]/85 backdrop-blur-2xl border border-stone-200/80 dark:border-amber-500/[0.12] shadow-2xl shadow-stone-950/5 dark:shadow-black/70 space-y-6 text-center relative specular-top z-10">
        {success ? (
          <div className="py-8 space-y-3 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-black text-stone-900 dark:text-white font-display">
              Student Identity Verified
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Welcome to the exclusive campus network. Redirecting to your college feed...
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-stone-900 dark:text-white font-display">
                Verify Student Email
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mx-auto">
                We sent a 6-digit campus verification code to <br />
                <span className="font-semibold text-stone-800 dark:text-stone-200">{email}</span>
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Quick Demo Fill Helper */}
            {demoCode && (
              <div className="p-3 rounded-xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/20 flex items-center justify-between text-xs">
                <div className="text-left">
                  <span className="font-bold text-amber-800 dark:text-amber-200 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Demo Code Generated:
                  </span>
                  <span className="font-mono text-xs font-bold text-stone-900 dark:text-white">
                    {demoCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFill}
                  className="px-2.5 py-1 rounded-lg bg-amber-500 text-stone-950 font-bold text-[11px] hover:bg-amber-400 transition shadow-sm cursor-pointer"
                >
                  Auto-Fill
                </button>
              </div>
            )}

            {/* OTP Input Boxes */}
            <form onSubmit={handleVerify} className="space-y-5">
              <div className="flex justify-center gap-2 sm:gap-2.5">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { inputRefs.current[idx] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-11 h-12 sm:w-12 sm:h-14 text-center font-bold text-lg rounded-xl bg-stone-50/80 dark:bg-[#100b07]/90 border border-stone-200/80 dark:border-amber-500/[0.1] focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white dark:focus:bg-[#1c140f] text-stone-900 dark:text-white focus:outline-none transition shadow-sm"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black text-xs shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{loading ? 'Verifying...' : 'Verify & Enter Campus'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>

            <div className="pt-2 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="hover:underline flex items-center gap-1 font-medium"
              >
                <RotateCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                <span>Resend Code</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-amber-600 dark:text-amber-400 hover:underline font-bold"
              >
                Back to Sign In
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
