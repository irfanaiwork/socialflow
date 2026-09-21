import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';

// Feature Views
import { DashboardView } from './components/dashboard/DashboardView';
import { ContentLibraryView } from './components/library/ContentLibraryView';
import { CreatePostView } from './components/composer/CreatePostView';
import { ScheduledPostsView } from './components/scheduler/ScheduledPostsView';
import { PublishingQueueView } from './components/queue/PublishingQueueView';
import { PinterestView } from './components/pinterest/PinterestView';
import { FacebookView } from './components/facebook/FacebookView';
import { YouTubeView } from './components/youtube/YouTubeView';
import { AiGeneratorView } from './components/ai/AiGeneratorView';
import { AutomationView } from './components/automation/AutomationView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { ActivityLogsView } from './components/logs/ActivityLogsView';
import { SettingsView } from './components/settings/SettingsView';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  switch (currentView) {
    case 'dashboard':
      return <DashboardView />;
    case 'library':
      return <ContentLibraryView />;
    case 'create':
      return <CreatePostView />;
    case 'scheduled':
      return <ScheduledPostsView />;
    case 'queue':
      return <PublishingQueueView />;
    case 'pinterest':
      return <PinterestView />;
    case 'facebook':
      return <FacebookView />;
    case 'youtube':
      return <YouTubeView />;
    case 'ai':
      return <AiGeneratorView />;
    case 'automation':
      return <AutomationView />;
    case 'analytics':
      return <AnalyticsView />;
    case 'logs':
      return <ActivityLogsView />;
    case 'integrations':
    case 'settings':
      return <SettingsView />;
    default:
      return <DashboardView />;
  }
};

const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050b14] text-slate-100 font-sans antialiased selection:bg-sky-500 selection:text-white flex flex-col">
      {/* Top Navbar */}
      <Navbar onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} />

      {/* Body Layout: Sticky Sidebar + Scrollable Content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full">
          <MainContent />
        </main>
      </div>

      {/* Global Footer (Requested: Created by ❤️ Irfan Gulzar linking to irfangulzar.com) */}
      <footer className="bg-[#070e1c] border-t border-[#142848] py-4 px-6 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 z-20">
        <div className="flex items-center gap-2.5">
          <a href="https://irfangulzar.com" target="_blank" rel="noopener noreferrer">
            <img
              src="https://irfangulzar.com/wp-content/uploads/2026/03/irfan-gulzar-logo1-e1773074593503.webp"
              alt="Irfan Gulzar Logo"
              className="h-6 w-auto object-contain"
            />
          </a>
          <span className="text-slate-400 font-medium">SocialFlow CRM • AI Automation Engine</span>
        </div>

        <div className="text-slate-300 font-medium">
          Created with <span className="text-rose-500 mx-0.5">❤️</span> by{' '}
          <a
            href="https://irfangulzar.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 hover:text-sky-300 font-bold underline underline-offset-4 decoration-sky-500/50 hover:decoration-sky-300 transition"
          >
            Irfan Gulzar
          </a>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Local Engine Active • No Account Required</span>
        </div>
      </footer>

      {/* Global Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}
