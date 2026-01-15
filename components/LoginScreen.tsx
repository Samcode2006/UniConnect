import React, { useState } from 'react';
import { GraduationCap, AlertCircle, ArrowRight } from 'lucide-react';
import { User } from '../types';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  onRegisterClick: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const parseStudentEmail = (emailStr: string) => {
    // Regex: vvce + 2 digits (Year) + 3-4 chars (Branch) + 4 digits (ID) + @vvce.ac.in
    const regex = /^vvce(\d{2})([a-z]+)(\d{4})@vvce\.ac\.in$/i;
    const match = emailStr.match(regex);
    
    if (!match) return null;

    const yearShort = parseInt(match[1]); // e.g., 24
    const branchCode = match[2].toLowerCase(); // e.g., cse
    const studentId = match[3]; // e.g., 0178
    
    // Branch Mapping
    const branchMap: Record<string, string> = {
      cse: 'Computer Science & Engineering',
      ise: 'Information Science & Engineering',
      ece: 'Electronics & Communication',
      aiml: 'AI & Machine Learning',
      me: 'Mechanical Engineering',
      cv: 'Civil Engineering'
    };
    
    const department = branchMap[branchCode] || branchCode.toUpperCase();
    const batchYear = 2000 + yearShort;
    
    // Semester Calculation
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-11
    
    let semester = (currentYear - batchYear) * 2;
    if (currentMonth >= 6) {
        semester += 1;
    } else {
        semester = Math.max(1, semester);
    }

    return { department, batchYear, semester, studentId };
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulation delay
    setTimeout(() => {
        // Validation logic
        const details = parseStudentEmail(email);

        if (!details) {
            setError('Invalid format. Use college email (e.g., vvce24cse0178@vvce.ac.in).');
            setIsLoading(false);
            return;
        }

        // Success - Mock User
        const mockUser: User = {
            id: `u-${details.studentId}`,
            name: `${details.department.split(' ')[0]} Student`, // Placeholder name
            email: email,
            department: details.department,
            avatar: `https://ui-avatars.com/api/?name=${details.department.substring(0,2)}&background=4f46e5&color=fff`,
            bio: `${details.department} | Batch of ${details.batchYear} | Sem ${details.semester}`,
            tags: [details.department.split(' ')[0], 'Student'],
            followers: 0,
            following: 0,
            semester: details.semester,
            studentId: details.studentId,
            batchYear: details.batchYear
        };

        onLogin(mockUser);
        setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col justify-center items-center p-6 transition-colors duration-300">
      
      <div className="w-full max-w-sm z-10 relative">
        <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl mb-6 shadow-lg shadow-indigo-200 dark:shadow-none">
                <GraduationCap size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Log in to your UniConnect account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <label className="block text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">College Email</label>
                <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 outline-none transition-all bg-white dark:bg-gray-900 dark:text-white"
                />
                <p className="text-[10px] text-gray-400 mt-1.5">Format: vvce[YY][BRANCH][ID]@vvce.ac.in</p>
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Password</label>
                <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 outline-none transition-all bg-white dark:bg-gray-900 dark:text-white"
                />
            </div>

            {error && (
                <div className="flex items-start gap-2 text-red-600 dark:text-red-400 text-xs bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/20">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-full shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
                {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                    <>
                        <span>Log In</span>
                        <ArrowRight size={18} />
                    </>
                )}
            </button>
        </form>

        <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Don't have an account?{' '}
                <button onClick={onRegisterClick} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                    Register here
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;