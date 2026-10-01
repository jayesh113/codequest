import React, { useState, useEffect } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";
import { API } from "./api.js";
import { Sound } from "./sound.js";
import { Navbar } from "./components/Navbar.js";
import { Sidebar } from "./components/Sidebar.js";
import { MobileNav } from "./components/MobileNav.js";
import { LevelUpModal, XPFloater, TaskModal, ResourceModal } from "./components/Modals.js";

import { LandingView } from "./views/LandingView.js";
import { AuthView } from "./views/AuthView.js";
import { DashboardView } from "./views/DashboardView.js";
import { LearningPathsView } from "./views/LearningPathsView.js";
import { ResourceLibraryView } from "./views/ResourceLibraryView.js";
import { TaskBoardView } from "./views/TaskBoardView.js";
import { ChallengesView } from "./views/ChallengesView.js";
import { QuizzesView } from "./views/QuizzesView.js";
import { LeaderboardView } from "./views/LeaderboardView.js";
import { AchievementsView } from "./views/AchievementsView.js";
import { ProfileView } from "./views/ProfileView.js";
import { AdminDashboardView } from "./views/AdminDashboardView.js";

const App = () => {
  const [user, setUser] = useState(API.getUser());
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState(API.getUser() ? 'dashboard' : 'landing');
  const [authMode, setAuthMode] = useState('login');
  
  // Theme & Sound states
  const [isDark, setIsDark] = useState(localStorage.getItem('cq_theme') !== 'light');
  const [soundEnabled, setSoundEnabled] = useState(Sound.isEnabled());

  // Dashboard Data
  const [dashboardData, setDashboardData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Global Modals & Floaters
  const [levelUpLevel, setLevelUpLevel] = useState(null);
  const [xpToast, setXpToast] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);

  useEffect(() => {
    // Theme setup
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.remove('bg-slate-50', 'text-slate-900');
      document.body.classList.add('bg-[#0A0D17]', 'text-slate-100');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-[#0A0D17]', 'text-slate-100');
      document.body.classList.add('bg-slate-50', 'text-slate-900');
    }
    localStorage.setItem('cq_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      const [meRes, dashRes, notifRes] = await Promise.all([
        API.getMe().catch(() => null),
        API.getDashboard().catch(() => null),
        API.getNotifications().catch(() => null)
      ]);

      if (meRes) {
        setUser(meRes.user);
        setProfile(meRes.profile);
      }
      if (dashRes) {
        setDashboardData(dashRes);
      }
      if (notifRes) {
        setNotifications(notifRes.notifications || []);
        setUnreadCount(notifRes.unreadCount || 0);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleTheme = () => {
    Sound.playClick();
    setIsDark(!isDark);
  };

  const handleToggleSound = () => {
    const next = Sound.toggle();
    setSoundEnabled(next);
  };

  const handleNavigate = (tab, params = {}) => {
    if (tab === 'auth') {
      setAuthMode(params.mode || 'login');
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = (loggedUser, userProfile) => {
    setUser(loggedUser);
    setProfile(userProfile);
    if (loggedUser.role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    Sound.playClick();
    API.setToken(null);
    API.setUser(null);
    setUser(null);
    setProfile(null);
    setActiveTab('landing');
  };

  const triggerXPAward = (amount, message, newLevel) => {
    Sound.playXP();
    setXpToast({ amount, message });
    setTimeout(() => setXpToast(null), 3000);

    if (newLevel && profile && newLevel > profile.level) {
      setTimeout(() => {
        setLevelUpLevel(newLevel);
      }, 500);
    }
    loadUserData();
  };

  const handleTaskSubmit = async (taskId, content) => {
    try {
      const res = await API.submitTask(taskId, content);
      setSelectedTask(null);
      triggerXPAward(res.amount || 50, res.message, res.newLevel);
      if (window.confetti) window.confetti({ particleCount: 70, spread: 50 });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCompleteResource = async (resourceId) => {
    try {
      const res = await API.completeResource(resourceId);
      setSelectedResource(null);
      triggerXPAward(res.amount || 25, res.message, res.newLevel);
    } catch (err) {
      alert(err.message);
    }
  };

  // Render appropriate view
  const renderContent = () => {
    if (activeTab === 'landing') {
      return React.createElement(LandingView, { onNavigate: handleNavigate });
    }
    if (activeTab === 'auth') {
      return React.createElement(AuthView, {
        initialMode: authMode,
        onAuthSuccess: handleAuthSuccess,
        onNavigate: handleNavigate
      });
    }
    if (activeTab === 'dashboard') {
      return React.createElement(DashboardView, {
        data: dashboardData,
        onNavigate: handleNavigate,
        onOpenTask: (task) => setSelectedTask(task),
        onCompleteModule: (modId) => {}
      });
    }
    if (activeTab === 'paths') {
      return React.createElement(LearningPathsView, {
        onCompleteModuleSuccess: (amt, msg) => triggerXPAward(amt, msg)
      });
    }
    if (activeTab === 'resources') {
      return React.createElement(ResourceLibraryView, {
        onSelectResource: (res) => setSelectedResource(res)
      });
    }
    if (activeTab === 'tasks') {
      return React.createElement(TaskBoardView, {
        onOpenTaskModal: (task) => setSelectedTask(task)
      });
    }
    if (activeTab === 'challenges') {
      return React.createElement(ChallengesView, {
        onChallengeSolved: (amt, msg) => triggerXPAward(amt, msg)
      });
    }
    if (activeTab === 'quizzes') {
      return React.createElement(QuizzesView, {
        onQuizCompleted: (amt, msg) => triggerXPAward(amt, msg)
      });
    }
    if (activeTab === 'leaderboard') {
      return React.createElement(LeaderboardView, {
        currentUser: user
      });
    }
    if (activeTab === 'achievements') {
      return React.createElement(AchievementsView);
    }
    if (activeTab === 'profile') {
      return React.createElement(ProfileView, {
        user,
        profile,
        onUpdateProfile: (u, p) => { setUser(u); setProfile(p); }
      });
    }
    if (activeTab === 'admin') {
      return React.createElement(AdminDashboardView);
    }
    return React.createElement(DashboardView, { data: dashboardData, onNavigate: handleNavigate });
  };

  return React.createElement('div', { className: 'min-h-screen flex flex-col' },
    
    // Top Navbar
    React.createElement(Navbar, {
      user,
      profile,
      notifications,
      unreadCount,
      onLogout: handleLogout,
      onNavigate: handleNavigate,
      activeTab,
      isDark,
      onToggleTheme: handleToggleTheme,
      soundEnabled,
      onToggleSound: handleToggleSound
    }),

    // Main App Body
    React.createElement('div', { className: 'flex-1 flex max-w-[1600px] w-full mx-auto' },
      
      // Sidebar on Desktop (if not landing/auth)
      user && activeTab !== 'landing' && activeTab !== 'auth' &&
        React.createElement(Sidebar, {
          activeTab,
          onNavigate: handleNavigate,
          user,
          profile
        }),

      // Content Area
      React.createElement('main', { className: 'flex-1 pb-20 lg:pb-12 overflow-x-hidden' },
        renderContent()
      )
    ),

    // Bottom Navigation Bar on Mobile
    user && React.createElement(MobileNav, {
      activeTab,
      onNavigate: handleNavigate,
      user
    }),

    // Global Modals
    levelUpLevel && React.createElement(LevelUpModal, {
      level: levelUpLevel,
      onClose: () => setLevelUpLevel(null)
    }),

    xpToast && React.createElement(XPFloater, {
      amount: xpToast.amount,
      message: xpToast.message
    }),

    selectedTask && React.createElement(TaskModal, {
      task: selectedTask,
      onClose: () => setSelectedTask(null),
      onSubmit: handleTaskSubmit
    }),

    selectedResource && React.createElement(ResourceModal, {
      resource: selectedResource,
      onClose: () => setSelectedResource(null),
      onComplete: handleCompleteResource
    })
  );
};

const root = createRoot(document.getElementById('root'));
root.render(React.createElement(App));