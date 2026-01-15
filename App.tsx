import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Feed from './components/Feed';
import ChatInterface from './components/ChatInterface';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import LandingPage from './components/LandingPage';
import ProfileView from './components/ProfileView';
import { User, ViewState, ChatSession } from './types';
import { MOCK_POSTS, MOCK_SESSIONS } from './constants';
import { Users } from 'lucide-react';

// Community/Clubs Placeholder Component
const CommunitiesView = () => (
  <div className="p-6 md:p-12 pb-24 max-w-2xl mx-auto">
    <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Discover Communities</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {['Robotics Club', 'Debate Society', 'Dance Crew', 'Coding Club', 'Eco Warriors', 'Music Band'].map((club, idx) => (
        <div key={idx} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{club}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">250+ members</p>
          </div>
          <button className="ml-auto text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-full font-medium">
            Join
          </button>
        </div>
      ))}
    </div>
  </div>
);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LANDING);
  const [sessions, setSessions] = useState<ChatSession[]>(MOCK_SESSIONS);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply dark mode class to root div (or body)
  useEffect(() => {
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentView(ViewState.FEED);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(ViewState.LOGIN);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleUpdateSession = (sessionId: string, updates: Partial<ChatSession>) => {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, ...updates } : s));
  };

  if (!user) {
    if (currentView === ViewState.LANDING) {
        return <LandingPage 
            onGetStarted={() => setCurrentView(ViewState.REGISTER)} 
            onLogin={() => setCurrentView(ViewState.LOGIN)}
            isDarkMode={isDarkMode}
            toggleTheme={() => setIsDarkMode(!isDarkMode)} 
        />;
    }
    if (currentView === ViewState.REGISTER) {
        return <RegisterScreen 
            onRegister={handleLogin} 
            onLoginClick={() => setCurrentView(ViewState.LOGIN)}
        />;
    }
    // Default to Login
    return <LoginScreen 
        onLogin={handleLogin} 
        onRegisterClick={() => setCurrentView(ViewState.REGISTER)}
    />;
  }

  // Filter posts for the current user for the profile view
  const userPosts = MOCK_POSTS.filter(p => p.author.id === user.id);

  return (
    <div className={`flex h-screen w-screen bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors duration-200`}>
      
      {/* Sidebar / Bottom Nav */}
      <Navigation 
        currentView={currentView} 
        onNavigate={setCurrentView}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden md:ml-64 relative scroll-smooth bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {currentView === ViewState.FEED && <Feed posts={MOCK_POSTS} />}
        {currentView === ViewState.CHAT && (
            <ChatInterface 
                sessions={sessions} 
                currentUser={user} 
                onUpdateSession={handleUpdateSession}
            />
        )}
        {currentView === ViewState.COMMUNITIES && <CommunitiesView />}
        {currentView === ViewState.PROFILE && (
            <ProfileView 
                user={user} 
                onLogout={handleLogout} 
                userPosts={userPosts}
                onUpdateUser={handleUpdateUser}
            />
        )}
      </main>

    </div>
  );
};

export default App;