import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, CheckCircle2, XCircle, AlertTriangle, 
  Trash2, Eye, Ban, Sparkles, Building, BarChart3 
} from 'lucide-react';
import { AdminMetrics, User, Report } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/common/Avatar';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();

  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [verifications, setVerifications] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [activeTab, setActiveTab] = useState<'verifications' | 'reports'>('verifications');
  const [loading, setLoading] = useState(true);

  // ID Card Preview Modal
  const [previewUser, setPreviewUser] = useState<User | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [m, v, r] = await Promise.all([
        api.getAdminMetrics(),
        api.getVerifications('PENDING'),
        api.getReports('PENDING'),
      ]);
      setMetrics(m);
      setVerifications(v);
      setReports(r);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleReviewVerification = async (userId: number, status: 'VERIFIED' | 'REJECTED') => {
    try {
      await api.reviewVerification(userId, status);
      setVerifications(verifications.filter(u => u.id !== userId));
      if (previewUser?.id === userId) setPreviewUser(null);
      await fetchAdminData();
    } catch (err) {
      console.error(err);
      alert('Failed to update verification');
    }
  };

  const handleResolveReport = async (reportId: number, action: 'DISMISS' | 'DELETE_TARGET' | 'BAN_USER') => {
    try {
      await api.resolveReport(reportId, action);
      setReports(reports.filter(r => r.id !== reportId));
      await fetchAdminData();
    } catch (err) {
      console.error(err);
      alert('Failed to resolve report');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-lg space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-brand-300">
          <Shield className="w-3.5 h-3.5" />
          <span>Campus Safety & Administration</span>
        </div>
        <h2 className="text-2xl font-black">Campus Moderation & Verification Hub</h2>
        <p className="text-xs text-slate-400 max-w-xl">
          Review pending student ID verification submissions to uphold platform trust, monitor community reports, and manage campus integrity.
        </p>
      </div>

      {/* Metrics Cards Grid */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs text-slate-400 font-semibold">Total Students</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {metrics.total_users}
            </p>
            <span className="text-[11px] text-emerald-600 font-medium">
              {metrics.verified_users} Verified Badges
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs text-slate-400 font-semibold">Pending Verifications</span>
            <p className="text-2xl font-black text-amber-500">
              {metrics.pending_verifications}
            </p>
            <span className="text-[11px] text-slate-400">Needs ID card review</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs text-slate-400 font-semibold">Campus Posts</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {metrics.total_posts}
            </p>
            <span className="text-[11px] text-brand-600 font-medium">
              {metrics.total_projects} Active Projects
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-xs text-slate-400 font-semibold">Pending Reports</span>
            <p className="text-2xl font-black text-rose-500">
              {metrics.pending_reports}
            </p>
            <span className="text-[11px] text-slate-400">Flagged content</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('verifications')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'verifications'
              ? 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Student ID Verification Queue ({verifications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'reports'
              ? 'bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Reported Content Queue ({reports.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
          Loading moderation queue...
        </div>
      ) : activeTab === 'verifications' ? (
        verifications.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            No pending student verifications. All student submissions are verified!
          </div>
        ) : (
          <div className="space-y-3">
            {verifications.map((student) => (
              <div
                key={student.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    src={student.avatar_url}
                    name={student.full_name}
                    size="lg"
                  />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {student.full_name}
                      </h4>
                      <Badge type="pending" text="ID Review Needed" />
                    </div>
                    <p className="text-xs text-slate-500">
                      {student.college?.name} • {student.major}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Email: <span className="font-mono">{student.email}</span> • ID Number: <span className="font-mono font-semibold">{student.student_id_number || 'N/A'}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {student.id_card_image_url ? (
                    <button
                      onClick={() => setPreviewUser(student)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect ID Proof</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">No image uploaded</span>
                  )}

                  <button
                    onClick={() => handleReviewVerification(student.id, 'REJECTED')}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={() => handleReviewVerification(student.id, 'VERIFIED')}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Student</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Reports Queue */
        reports.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            No active reports. Campus environment is safe!
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                      Reason: {rep.reason}
                    </span>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-2">
                      Target: {rep.target_type} (ID: #{rep.target_id})
                    </p>
                    {rep.details && (
                      <p className="text-xs text-slate-500 mt-1">
                        Reporter note: "{rep.details}"
                      </p>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-400">
                    Reported on {new Date(rep.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 text-xs">
                  <button
                    onClick={() => handleResolveReport(rep.id, 'DISMISS')}
                    className="px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Dismiss Report
                  </button>
                  <button
                    onClick={() => handleResolveReport(rep.id, 'DELETE_TARGET')}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Content</span>
                  </button>
                  <button
                    onClick={() => handleResolveReport(rep.id, 'BAN_USER')}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold flex items-center gap-1"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Suspend User</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ID Card Preview Lightbox Modal */}
      <Modal
        isOpen={!!previewUser}
        onClose={() => setPreviewUser(null)}
        title={`Student ID Proof: ${previewUser?.full_name}`}
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100">
            {previewUser?.id_card_image_url ? (
              <img
                src={previewUser.id_card_image_url}
                alt="Student ID Card"
                className="w-full h-auto object-contain max-h-96"
              />
            ) : (
              <div className="p-8 text-center text-slate-400">No image available</div>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1">
            <p><span className="font-semibold">University:</span> {previewUser?.college?.name}</p>
            <p><span className="font-semibold">Major:</span> {previewUser?.major}</p>
            <p><span className="font-semibold">Student ID:</span> {previewUser?.student_id_number || 'N/A'}</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => handleReviewVerification(previewUser!.id, 'REJECTED')}
              className="px-4 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-semibold"
            >
              Reject Verification
            </button>
            <button
              onClick={() => handleReviewVerification(previewUser!.id, 'VERIFIED')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
            >
              Approve & Award Badge
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
