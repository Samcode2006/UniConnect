import React from 'react';
import { Home, MessageCircle, Users, User, LogOut, Sun, Moon } from 'lucide-react';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate, onLogout, isDarkMode, toggleTheme }) => {
  const navItems = [
    { view: ViewState.FEED, icon: Home, label: 'Home' },
    { view: ViewState.COMMUNITIES, icon: Users, label: 'Clubs' },
    { view: ViewState.CHAT, icon: MessageCircle, label: 'Messages' },
    { view: ViewState.PROFILE, icon: User, label: 'Profile' },
  ];

  return (
    <>
      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800 px-6 py-3 flex justify-between items-center z-50 safe-area-pb transition-colors duration-200">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.view)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              currentView === item.view
                ? 'text-indigo-600 dark:text-white'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            <item.icon size={26} strokeWidth={currentView === item.view ? 2.5 : 2} />
          </button>
        ))}
      </div>

      {/* Desktop Sidebar (Left) */}
      <div className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-white dark:bg-black text-gray-900 dark:text-white p-4 z-50 transition-colors duration-200 border-r border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-8 px-4 pt-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="font-bold text-white text-lg">U</span>
          </div>
          <span className="font-bold text-xl tracking-tight">UniConnect</span>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.view)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-full transition-all group ${
                currentView === item.view
                  ? 'font-bold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
              }`}
            >
              <item.icon size={26} strokeWidth={currentView === item.view ? 2.5 : 2} className={currentView === item.view ? 'text-indigo-600 dark:text-white' : 'group-hover:text-gray-900 dark:group-hover:text-white transition-colors'} />
              <span className="text-lg">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-2 pb-4">
            <button 
                onClick={toggleTheme}
                className="w-full flex items-center gap-4 px-4 py-3.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors"
            >
                {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
                <span className="font-medium text-lg">{isDarkMode ? 'Light' : 'Dark'}</span>
            </button>
            
            <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
            >
            <LogOut size={24} />
            <span className="font-medium text-lg">Sign Out</span>
            </button>
        </div>
      </div>
    </>
  );
};

export default Navigation;