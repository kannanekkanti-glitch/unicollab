const API_BASE = '/api/v1';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('unicollab_token');
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('unicollab_token', token);
};

export const clearAuthToken = () => {
  localStorage.removeItem('unicollab_token');
  localStorage.removeItem('unicollab_user');
};

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = 'Something went wrong';
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errJson.message || errorDetail;
    } catch {
      errorDetail = response.statusText;
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

export async function uploadFile(file: File): Promise<{ url: string; filename: string }> {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/users/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!response.ok) {
    throw new Error('File upload failed');
  }

  return response.json();
}

export const api = {
  // Auth
  getColleges: () => apiRequest('/auth/colleges'),
  login: (credentials: { email_or_username: string; password: string }) =>
    apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData: any) =>
    apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  sendOtp: (email: string) =>
    apiRequest(`/auth/send-otp?email=${encodeURIComponent(email)}`, { method: 'POST' }),
  verifyOtp: (email: string, code: string) =>
    apiRequest('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    }),
  getMe: () => apiRequest('/auth/me'),

  // Users
  getUser: (id: number) => apiRequest(`/users/${id}`),
  updateProfile: (data: any) =>
    apiRequest('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
  searchStudents: (params: { query?: string; college_id?: number; skill?: string }) => {
    const q = new URLSearchParams();
    if (params.query) q.append('query', params.query);
    if (params.college_id) q.append('college_id', String(params.college_id));
    if (params.skill) q.append('skill', params.skill);
    return apiRequest(`/users/search?${q.toString()}`);
  },

  // Feed & Posts
  getPosts: (feed_type = 'all', category?: string, college_id?: number) => {
    const q = new URLSearchParams({ feed_type });
    if (category && category !== 'All') q.append('category', category);
    if (college_id) q.append('college_id', String(college_id));
    return apiRequest(`/posts?${q.toString()}`);
  },
  getPost: (id: number) => apiRequest(`/posts/${id}`),
  createPost: (data: any) =>
    apiRequest('/posts', { method: 'POST', body: JSON.stringify(data) }),
  votePost: (id: number, vote_type: number) =>
    apiRequest(`/posts/${id}/vote`, { method: 'POST', body: JSON.stringify({ vote_type }) }),
  votePoll: (postId: number, optionId: number) =>
    apiRequest(`/posts/${postId}/poll/vote?option_id=${optionId}`, { method: 'POST' }),
  getComments: (postId: number) => apiRequest(`/posts/${postId}/comments`),
  addComment: (postId: number, content: string, parent_id?: number) =>
    apiRequest(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, parent_id }),
    }),
  deletePost: (id: number) => apiRequest(`/posts/${id}`, { method: 'DELETE' }),

  // Projects & Teammates
  getProjects: (params: { domain?: string; skill?: string; role?: string; search?: string; college_id?: number }) => {
    const q = new URLSearchParams();
    if (params.domain && params.domain !== 'All') q.append('domain', params.domain);
    if (params.skill) q.append('skill', params.skill);
    if (params.role) q.append('role', params.role);
    if (params.search) q.append('search', params.search);
    if (params.college_id) q.append('college_id', String(params.college_id));
    return apiRequest(`/projects?${q.toString()}`);
  },
  getProject: (id: number) => apiRequest(`/projects/${id}`),
  createProject: (data: any) =>
    apiRequest('/projects', { method: 'POST', body: JSON.stringify(data) }),
  applyToProject: (projectId: number, desired_role: string, message?: string) =>
    apiRequest(`/projects/${projectId}/apply`, {
      method: 'POST',
      body: JSON.stringify({ desired_role, message }),
    }),
  getProjectRequests: (projectId: number) => apiRequest(`/projects/${projectId}/requests`),
  actionProjectRequest: (requestId: number, action: 'ACCEPT' | 'REJECT') =>
    apiRequest(`/projects/requests/${requestId}/action?action=${action}`, { method: 'POST' }),

  // Hackathons
  getHackathons: (mode?: string, tag?: string) => {
    const q = new URLSearchParams();
    if (mode && mode !== 'All') q.append('mode', mode);
    if (tag) q.append('tag', tag);
    return apiRequest(`/hackathons?${q.toString()}`);
  },
  getHackathon: (id: number) => apiRequest(`/hackathons/${id}`),
  createHackathonTeam: (hackathonId: number, data: any) =>
    apiRequest(`/hackathons/${hackathonId}/teams`, { method: 'POST', body: JSON.stringify(data) }),
  applyToHackathonTeam: (teamId: number, role: string, message?: string) => {
    const q = new URLSearchParams({ role });
    if (message) q.append('message', message);
    return apiRequest(`/hackathons/teams/${teamId}/apply?${q.toString()}`, { method: 'POST' });
  },
  actionHackathonRequest: (teamId: number, requestId: number, action: 'ACCEPT' | 'REJECT') =>
    apiRequest(`/hackathons/teams/${teamId}/requests/${requestId}/action?action=${action}`, { method: 'POST' }),

  // Events & Fests
  getEvents: (category?: string, college_id?: number) => {
    const q = new URLSearchParams();
    if (category && category !== 'All') q.append('category', category);
    if (college_id) q.append('college_id', String(college_id));
    return apiRequest(`/events?${q.toString()}`);
  },
  getEvent: (id: number) => apiRequest(`/events/${id}`),
  createEvent: (data: any) =>
    apiRequest('/events', { method: 'POST', body: JSON.stringify(data) }),
  toggleRsvp: (eventId: number, status_type: 'GOING' | 'INTERESTED' | 'CANCEL') =>
    apiRequest(`/events/${eventId}/rsvp?status_type=${status_type}`, { method: 'POST' }),

  // Clubs
  getClubs: (college_id?: number, category?: string) => {
    const q = new URLSearchParams();
    if (college_id) q.append('college_id', String(college_id));
    if (category && category !== 'All') q.append('category', category);
    return apiRequest(`/clubs?${q.toString()}`);
  },
  getClub: (id: number) => apiRequest(`/clubs/${id}`),
  createClub: (data: any) =>
    apiRequest('/clubs', { method: 'POST', body: JSON.stringify(data) }),
  joinClub: (clubId: number) => apiRequest(`/clubs/${clubId}/join`, { method: 'POST' }),
  postClubAnnouncement: (clubId: number, data: { title: string; content: string }) =>
    apiRequest(`/clubs/${clubId}/announcements`, { method: 'POST', body: JSON.stringify(data) }),

  // Chat & Messages
  getConversations: () => apiRequest('/chat/conversations'),
  getMessages: (conversationId: number) =>
    apiRequest(`/chat/conversations/${conversationId}/messages`),
  sendMessage: (data: { conversation_id?: number; recipient_id?: number; content: string; attachment_url?: string }) =>
    apiRequest('/chat/messages', { method: 'POST', body: JSON.stringify(data) }),

  // Notifications
  getNotifications: () => apiRequest('/notifications'),
  getUnreadNotificationsCount: () => apiRequest('/notifications/unread-count'),
  markNotificationRead: (id: number) =>
    apiRequest(`/notifications/${id}/read`, { method: 'POST' }),
  markAllNotificationsRead: () => apiRequest('/notifications/read-all', { method: 'POST' }),

  // Universal Search
  globalSearch: (q: string, college_id?: number) => {
    const params = new URLSearchParams({ q });
    if (college_id) params.append('college_id', String(college_id));
    return apiRequest(`/search?${params.toString()}`);
  },

  // Admin & Moderation
  getAdminMetrics: () => apiRequest('/admin/metrics'),
  getVerifications: (status = 'PENDING') =>
    apiRequest(`/admin/verifications?status_filter=${status}`),
  reviewVerification: (userId: number, status: 'VERIFIED' | 'REJECTED', reason?: string) =>
    apiRequest(`/admin/verifications/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ status, reason }),
    }),
  getReports: (status = 'PENDING') => apiRequest(`/admin/reports?status_filter=${status}`),
  resolveReport: (reportId: number, action: 'DISMISS' | 'DELETE_TARGET' | 'BAN_USER', details?: string) =>
    apiRequest(`/admin/reports/${reportId}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ action, details }),
    }),
  reportContent: (data: { target_type: string; target_id: number; reason: string; details?: string }) =>
    apiRequest('/admin/reports', { method: 'POST', body: JSON.stringify(data) }),
};
