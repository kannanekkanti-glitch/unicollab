import React, { useState } from 'react';
import { 
  Settings, ShieldCheck, User, Building, 
  Upload, CheckCircle2, Lock, Save, AlertCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api, uploadFile } from '../services/api';
import { Badge } from '../components/common/Badge';

export const SettingsPage: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [major, setMajor] = useState(user?.major || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [skills, setSkills] = useState(user?.skills || '');
  const [interests, setInterests] = useState(user?.interests || '');
  const [githubUrl, setGithubUrl] = useState(user?.github_url || '');
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedin_url || '');
  const [studentIdNumber, setStudentIdNumber] = useState(user?.student_id_number || '');

  const [idCardUrl, setIdCardUrl] = useState(user?.id_card_image_url || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleIdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadFile(file);
      setIdCardUrl(res.url);
      await api.updateProfile({ id_card_image_url: res.url });
      await refreshUser();
      alert('Student ID uploaded for verification review!');
    } catch (err) {
      console.error(err);
      alert('Failed to upload ID proof');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateProfile({
        full_name: fullName.trim(),
        major: major.trim(),
        bio: bio.trim(),
        skills: skills.trim(),
        interests: interests.trim(),
        github_url: githubUrl.trim(),
        linkedin_url: linkedinUrl.trim(),
        student_id_number: studentIdNumber.trim(),
        id_card_image_url: idCardUrl,
      });
      await refreshUser();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err: any) {
      alert(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-600" />
            <span>Account & Verification Settings</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your student identity, privacy visibility, and campus credentials
          </p>
        </div>

        <Badge
          type={user?.verification_status.toLowerCase() as any}
          text={user?.verification_status === 'VERIFIED' ? 'Verified Student' : 'Pending Verification'}
        />
      </div>

      {/* Verification Status Banner */}
      <div className={`p-5 rounded-3xl border ${
        user?.verification_status === 'VERIFIED'
          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
          : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
      }`}>
        <div className="flex items-start gap-3">
          {user?.verification_status === 'VERIFIED' ? (
            <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
          )}

          <div className="space-y-1.5 flex-1 text-xs">
            <h3 className="font-bold text-slate-900 dark:text-white">
              {user?.verification_status === 'VERIFIED'
                ? 'Campus Student Status: Verified'
                : 'Student ID Verification Pending Review'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {user?.verification_status === 'VERIFIED'
                ? 'Your student account has verified access across connected college feeds, hackathon rosters, and club management.'
                : 'To receive your green Verified Student badge, upload a photo of your physical Student ID card below for campus moderation review.'}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <label className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-semibold cursor-pointer hover:bg-slate-50 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'Uploading...' : idCardUrl ? 'Update ID Card Photo' : 'Upload Student ID Proof'}</span>
                <input type="file" accept="image/*" onChange={handleIdUpload} className="hidden" />
              </label>
              {idCardUrl && (
                <a
                  href={idCardUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-600 hover:underline font-semibold"
                >
                  View uploaded ID card &rarr;
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Form */}
      <form onSubmit={handleSave} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 text-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
          Personal & Academic Info
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Major / Department
            </label>
            <input
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Student ID Number (from ID card)
            </label>
            <input
              type="text"
              value={studentIdNumber}
              onChange={(e) => setStudentIdNumber(e.target.value)}
              placeholder="e.g. SU-2026-9041"
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              College Email
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full px-3.5 py-2 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Bio
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Share your interests, projects, or background..."
            className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Technical Skills (Comma separated)
          </label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. PyTorch, React, FastAPI, Docker, ROS2"
            className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              GitHub URL
            </label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          {savedSuccess ? (
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Changes saved successfully!
            </span>
          ) : (
            <span />
          )}

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-500/20 transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
