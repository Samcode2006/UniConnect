import React, { useEffect, useState } from 'react';
import { Sparkles, Users, ArrowRight, Shield, Globe, Moon, Sun } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin, isDarkMode, toggleTheme }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="h-screen w-full overflow-y-auto bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 relative flex flex-col transition-colors duration-300 scroll-smooth">
      
      {/* Subtle Grid Pattern - Fixed to background */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-6 py-5 md:px-12 border-b border-gray-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 transition-colors duration-300">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-bold">U</span>
          </div>
          <span>UniConnect</span>
        </div>
        <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
            onClick={onLogin}
            className="text-sm font-semibold text-gray-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
            >
            Log In
            </button>
            <button 
            onClick={onGetStarted}
            className="text-sm font-semibold bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full hover:opacity-80 transition-opacity"
            >
            Sign Up
            </button>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 text-center relative z-10 pt-16 pb-24">
        <div className={`max-w-4xl mx-auto transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-8 border border-indigo-100 dark:border-indigo-900/30 shadow-sm">
            <Sparkles size={14} />
            <span>The Social Network for VVCE</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight text-gray-900 dark:text-white">
            Connect.<br />
            Collaborate.
          </h1>
          
          <p className="text-xl text-gray-500 dark:text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            A dedicated space for students to share moments, join clubs, and chat securely. No noise, just campus life.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-sm mx-auto sm:max-w-none">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-xl shadow-indigo-200 dark:shadow-indigo-900/20"
            >
              Join the Community
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className={`mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full px-4 transition-all duration-700 delay-200 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 p-8 rounded-3xl text-left hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors group shadow-sm backdrop-blur-sm">
                <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 text-gray-900 dark:text-white group-hover:text-indigo-600 rounded-2xl flex items-center justify-center mb-6 transition-colors">
                    <Globe size={24} />
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white">Campus Feed</h3>
                <p className="text-gray-500 dark:text-zinc-400 leading-relaxed">See what's happening around you. From official announcements to trending discussions.</p>
            </div>
            
            <div className="bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 p-8 rounded-3xl text-left hover:border-purple-500 dark:hover:border-purple-500 transition-colors group shadow-sm backdrop-blur-sm">
                <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 text-gray-900 dark:text-white group-hover:text-purple-600 rounded-2xl flex items-center justify-center mb-6 transition-colors">
                    <Users size={24} />
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white">Clubs & Groups</h3>
                <p className="text-gray-500 dark:text-zinc-400 leading-relaxed">Find your people. Join interest-based communities and never miss an event.</p>
            </div>

            <div className="bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 p-8 rounded-3xl text-left hover:border-pink-500 dark:hover:border-pink-500 transition-colors group shadow-sm backdrop-blur-sm">
                <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20 text-gray-900 dark:text-white group-hover:text-pink-600 rounded-2xl flex items-center justify-center mb-6 transition-colors">
                    <Shield size={24} />
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white">Verified Profiles</h3>
                <p className="text-gray-500 dark:text-zinc-400 leading-relaxed">Safe and secure. Connect only with verified students from your university.</p>
            </div>
        </div>
      </main>

      <footer className="py-8 text-center text-gray-500 dark:text-zinc-600 text-sm border-t border-gray-100 dark:border-zinc-800 relative z-10 bg-white dark:bg-zinc-950 transition-colors duration-300">
        <div className="flex justify-center gap-6 mb-4">
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Guidelines</a>
        </div>
        &copy; 2024 UniConnect. Made for Students.
      </footer>
    </div>
  );
};

export default LandingPage;