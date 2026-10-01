// CodeQuest API Client
const API_BASE = '/api';

export const API = {
  getToken: () => localStorage.getItem('cq_token'),
  setToken: (token) => {
    if (token) localStorage.setItem('cq_token', token);
    else localStorage.removeItem('cq_token');
  },

  getUser: () => {
    try {
      const u = localStorage.getItem('cq_user');
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  },
  setUser: (user) => {
    if (user) localStorage.setItem('cq_user', JSON.stringify(user));
    else localStorage.removeItem('cq_user');
  },

  request: async (endpoint, options = {}) => {
    const token = API.getToken();
    const headers = { ...options.headers };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers
    };

    if (options.body && !(options.body instanceof FormData) && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401) {
        API.setToken(null);
        API.setUser(null);
      }
      throw new Error(data.message || 'An error occurred during request');
    }
    return data;
  },

  // Auth
  login: (email, password) => API.request('/auth/login', { method: 'POST', body: { email, password } }),
  register: (userData) => API.request('/auth/register', { method: 'POST', body: userData }),
  getMe: () => API.request('/auth/me'),
  updateProfile: (profileData) => API.request('/auth/profile', { method: 'PUT', body: profileData }),
  forgotPassword: (email) => API.request('/auth/forgot-password', { method: 'POST', body: { email } }),

  // Dashboard
  getDashboard: () => API.request('/dashboard'),

  // Learning Paths
  getPaths: () => API.request('/paths'),
  getPath: (slug) => API.request(`/paths/${slug}`),
  completeModule: (id) => API.request(`/paths/modules/${id}/complete`, { method: 'POST' }),

  // Resources
  getResources: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return API.request(`/resources${q ? '?' + q : ''}`);
  },
  toggleBookmark: (id) => API.request(`/resources/${id}/bookmark`, { method: 'POST' }),
  completeResource: (id) => API.request(`/resources/${id}/complete`, { method: 'POST' }),

  // Tasks
  getTasks: () => API.request('/tasks'),
  updateTaskStatus: (id, status, content) => API.request(`/tasks/${id}/status`, { method: 'PUT', body: { status, content } }),
  submitTask: (id, content) => API.request(`/tasks/${id}/submit`, { method: 'POST', body: { content } }),

  // Challenges & Code Judge
  getChallenges: () => API.request('/challenges'),
  getChallenge: (slug) => API.request(`/challenges/${slug}`),
  runCode: (data) => API.request('/challenges/run', { method: 'POST', body: data }),
  submitChallenge: (id, data) => API.request(`/challenges/${id}/submit`, { method: 'POST', body: data }),

  // Quizzes
  getQuizzes: () => API.request('/quizzes'),
  getQuiz: (id) => API.request(`/quizzes/${id}`),
  submitQuiz: (id, answers) => API.request(`/quizzes/${id}/submit`, { method: 'POST', body: { answers } }),

  // Gamification
  getLeaderboard: (period = 'all') => API.request(`/gamification/leaderboard?period=${period}`),
  getAchievements: () => API.request('/gamification/achievements'),
  getStreak: () => API.request('/gamification/streak'),
  getXPTransactions: () => API.request('/gamification/xp-transactions'),

  // Notifications
  getNotifications: () => API.request('/notifications'),
  markNotificationRead: (id) => API.request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => API.request('/notifications/mark-all-read', { method: 'PUT' }),

  // Announcements
  getAnnouncements: () => API.request('/announcements'),

  // Admin
  getAdminStats: () => API.request('/admin/stats'),
  getAdminStudents: () => API.request('/admin/students'),
  adjustStudentXP: (studentId, amount, reason) => API.request(`/admin/students/${studentId}/xp`, { method: 'POST', body: { amount, reason } }),
  createAdminResource: (formData) => API.request('/admin/resources', { method: 'POST', body: formData }),
  createAdminTask: (taskData) => API.request('/admin/tasks', { method: 'POST', body: taskData }),
  createAdminAnnouncement: (annData) => API.request('/admin/announcements', { method: 'POST', body: annData })
};