import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building, Mail, Lock, User as UserIcon, 
  GraduationCap, FileText, ArrowRight, ShieldCheck, Upload 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { uploadFile } from '../services/api';

export const RegisterPage: React.FC = () => {
  const { register, colleges } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [collegeId, setCollegeId] = useState<number>(colleges[0]?.id || 1);
  const [major, setMajor] = useState('Computer Science');
  const [gradYear, setGradYear] = useState(2026);
  const [studentIdNumber, setStudentIdNumber] = useState('');
  const [idCardUrl, setIdCardUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleIdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadFile(file);
      setIdCardUrl(res.url);
    } catch (err) {
      console.error(err);
      alert('Failed to upload ID proof image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({
        full_name: fullName.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password,
        college_id: Number(collegeId),
        major: major.trim(),
        graduation_year: Number(gradYear),
        student_id_number: studentIdNumber.trim() || undefined,
        id_card_image_url: idCardUrl || undefined,
      });

      // Redirect to OTP verification page
      navigate(`/verify-otp?email=${encodeURIComponent(email.trim().toLowerCase())}`);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center bg-[#faf8f5] dark:bg-[#0c0a09] relative overflow-hidden">
      <div className="absolute inset-0 spotlight-beam pointer-events-none" />
      <div className="w-full max-w-xl p-8 sm:p-10 rounded-3xl bg-white/80 dark:bg-[#150f0b]/85 backdrop-blur-2xl border border-stone-200/80 dark:border-amber-500/[0.12] shadow-2xl shadow-stone-950/5 dark:shadow-black/70 space-y-6 relative specular-top z-10">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-700 text-stone-950 font-black text-2xl mx-auto flex items-center justify-center shadow-lg shadow-amber-500/25 mb-1">
            U
          </div>
          <h2 className="text-2xl font-black tracking-tight text-stone-900 dark:text-white font-display">
            Create Verified Student Account
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Join your campus circle and collaborate across universities
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* University Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Your College / University
            </label>
            <div className="relative">
              <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={collegeId}
                onChange={(e) => setCollegeId(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:outline-none"
              >
                {colleges.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.short_code}) — {c.domain}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Username
              </label>
              <input
                type="text"
                required
                placeholder="e.g. alex_rivera"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                College / Student Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Major / Department
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Grad Year
              </label>
              <input
                type="number"
                min={2024}
                max={2032}
                value={gradYear}
                onChange={(e) => setGradYear(Number(e.target.value))}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Student ID proof verification upload */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Student ID Verification Proof (Optional / Instant Verification)
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Upload your Student ID Card photo to receive the official Verified Student Badge.
            </p>
            <div className="flex items-center gap-3">
              <label className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-100 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'Uploading ID...' : idCardUrl ? 'Replace ID Photo' : 'Upload ID Proof'}</span>
                <input type="file" accept="image/*" onChange={handleIdUpload} className="hidden" />
              </label>
              {idCardUrl && (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  ✓ ID Photo Uploaded
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black text-xs shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>{loading ? 'Creating Student Account...' : 'Continue to OTP Verification'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>

        <p className="text-center text-xs text-stone-500 dark:text-stone-400">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-amber-600 dark:text-amber-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
