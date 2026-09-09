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
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6 text-center">
        {success ? (
          <div className="py-8 space-y-3 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Student Verified!
            </h2>
            <p className="text-xs text-slate-500">
              Welcome to the exclusive campus network. Redirecting to your college feed...
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Verify Student Email
              </h2>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                We sent a 6-digit campus verification code to <br />
                <span className="font-semibold text-slate-800 dark:text-slate-200">{email}</span>
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Quick Demo Fill Helper */}
            {demoCode && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between text-xs">
                <div className="text-left">
                  <span className="font-bold text-amber-800 dark:text-amber-200 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Demo Code Generated:
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                    {demoCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFill}
                  className="px-2.5 py-1 rounded-lg bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 font-semibold text-[11px] hover:bg-amber-300 transition"
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
                    className="w-11 h-12 sm:w-12 sm:h-14 text-center font-bold text-lg rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition shadow-sm"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-500/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Verifying...' : 'Verify & Enter Campus'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
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
                className="text-brand-600 hover:underline font-medium"
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
