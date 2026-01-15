import React, { useState } from 'react';
import { User } from '../types';
import { ArrowLeft, Check, Sparkles, RefreshCw, Wand2, Palette, ArrowRight } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface RegisterScreenProps {
  onRegister: (user: User) => void;
  onLoginClick: () => void;
}

const INTERESTS_LIST = [
  { id: 'coding', label: 'Coding', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
  { id: 'music', label: 'Music', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300' },
  { id: 'dance', label: 'Dance', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
  { id: 'sports', label: 'Sports', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' },
  { id: 'debate', label: 'Debate', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' },
  { id: 'photo', label: 'Photography', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300' },
  { id: 'gaming', label: 'Gaming', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' },
  { id: 'art', label: 'Art', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300' },
  { id: 'robotics', label: 'Robotics', color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300' },
  { id: 'startup', label: 'Startup', color: 'bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300' }
];

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegister, onLoginClick }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);

  // Helper to parse student details
  const parseStudentEmail = (emailStr: string) => {
    const regex = /^vvce(\d{2})([a-z]+)(\d{4})@vvce\.ac\.in$/i;
    const match = emailStr.match(regex);
    if (!match) return null;
    
    const yearShort = parseInt(match[1]);
    const branchCode = match[2].toLowerCase();
    const studentId = match[3];

    const branchMap: Record<string, string> = {
      cse: 'Computer Science', ise: 'Information Science', ece: 'Electronics',
      aiml: 'AI & ML', me: 'Mechanical', cv: 'Civil'
    };
    
    const department = branchMap[branchCode] || branchCode.toUpperCase();
    const batchYear = 2000 + yearShort;
    
    return { department, batchYear, studentId };
  };

  const generateAiAvatar = async () => {
    if (selectedInterests.length === 0) {
        setError('Please select at least one interest to generate an artistic avatar.');
        return;
    }
    setError('');
    setIsGeneratingAvatar(true);

    try {
        if (!process.env.API_KEY) {
            throw new Error("API Key missing");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `A minimal, cool, artistic circular profile avatar illustration representing these themes: ${selectedInterests.join(', ')}. Vector flat art style, vibrant colors, clean background.`;
        
        // Use Nano Banana (gemini-2.5-flash-image) for image generation
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] }
        });

        // Loop through parts to find the image
        let generatedImage = null;
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    generatedImage = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                    break;
                }
            }
        }

        if (generatedImage) {
            setAvatarUrl(generatedImage);
        } else {
             // Fallback if no image returned
             setAvatarUrl(`https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random&size=256`);
             setError('Could not generate AI image. Using default.');
        }

    } catch (e) {
        console.error("AI Generation Error", e);
        setAvatarUrl(`https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random&size=256`);
        setError('AI generation failed. Using default.');
    } finally {
        setIsGeneratingAvatar(false);
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
        if (!email.includes('@vvce.ac.in')) {
            setError('Please use a valid college email (@vvce.ac.in)');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        
        const details = parseStudentEmail(email);
        if (details && !name) {
            setName(`Student ${details.studentId}`);
        }
        
        setError('');
        setStep(2);
    } else if (step === 2) {
        if (selectedInterests.length === 0) {
            setError('Select at least one interest.');
            return;
        }
        setError('');
        setStep(3); // Go to avatar generation
        // Set default avatar initially
        if (!avatarUrl) {
            setAvatarUrl(`https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=4f46e5&color=fff`);
        }
    }
  };

  const handleRegister = () => {
    setIsLoading(true);
    setTimeout(() => {
        const details = parseStudentEmail(email);
        
        const newUser: User = {
            id: details ? `u-${details.studentId}` : `u-${Date.now()}`,
            name: name,
            email: email,
            department: details ? details.department : 'General',
            avatar: avatarUrl,
            bio: `Student at VVCE. Interested in ${selectedInterests.join(', ')}.`,
            tags: selectedInterests,
            followers: 0,
            following: 0,
            batchYear: details?.batchYear
        };

        onRegister(newUser);
    }, 1000);
  };

  const toggleInterest = (interestLabel: string) => {
    if (selectedInterests.includes(interestLabel)) {
        setSelectedInterests(prev => prev.filter(i => i !== interestLabel));
    } else {
        if (selectedInterests.length < 5) {
            setSelectedInterests(prev => [...prev, interestLabel]);
        }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col justify-center items-center p-6 transition-colors duration-200">
      <div className="w-full max-w-md">
        <button onClick={onLoginClick} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-8 transition-colors">
            <ArrowLeft size={18} /> Back to Login
        </button>

        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {step === 1 ? 'Create Account' : step === 2 ? 'Your Interests' : 'Artistic Touch'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
                {step === 1 ? 'Join the exclusive network for VVCE students.' : step === 2 ? 'Select up to 5 designer tags.' : 'Let AI create your unique identity.'}
            </p>
        </div>

        {step === 1 && (
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">College Email</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="E.g. John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button 
                    onClick={handleNextStep}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all mt-4"
                >
                    Continue
                </button>
            </div>
        )}

        {step === 2 && (
            <div className="space-y-6">
                <div>
                    <div className="flex justify-between items-center mb-4">
                         <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Designer Tags</label>
                         <span className="text-xs text-gray-400">{selectedInterests.length}/5 selected</span>
                    </div>
                   
                    <div className="grid grid-cols-2 gap-3">
                        {INTERESTS_LIST.map(interest => {
                            const isSelected = selectedInterests.includes(interest.label);
                            return (
                                <button
                                    key={interest.id}
                                    onClick={() => toggleInterest(interest.label)}
                                    className={`relative px-4 py-3 rounded-xl text-sm font-bold border transition-all duration-300 flex items-center justify-between group overflow-hidden ${
                                        isSelected
                                            ? 'border-transparent shadow-md transform scale-[1.02]'
                                            : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700'
                                    }`}
                                >
                                    {/* Designer Background for Selected State */}
                                    {isSelected && (
                                        <div className={`absolute inset-0 opacity-20 dark:opacity-30 ${interest.color.split(' ')[0]}`}></div>
                                    )}
                                    
                                    <span className={`relative z-10 ${isSelected ? 'text-gray-900 dark:text-white' : ''}`}>
                                        {interest.label}
                                    </span>
                                    
                                    {isSelected && <Check size={16} className="relative z-10 text-indigo-600 dark:text-indigo-400" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button 
                    onClick={handleNextStep}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
                >
                   Next: Artistic Touch <ArrowRight size={18} />
                </button>
            </div>
        )}

        {step === 3 && (
            <div className="space-y-8 flex flex-col items-center">
                
                <div className="relative group">
                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl relative bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        {isGeneratingAvatar ? (
                             <div className="flex flex-col items-center gap-2">
                                <RefreshCw className="animate-spin text-indigo-600" size={32} />
                                <span className="text-xs font-medium text-gray-500">Creating art...</span>
                             </div>
                        ) : (
                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        )}
                    </div>
                    {!isGeneratingAvatar && (
                        <button 
                            onClick={generateAiAvatar}
                            className="absolute bottom-0 right-0 bg-black dark:bg-white text-white dark:text-black p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
                            title="Regenerate with AI"
                        >
                            <Wand2 size={18} />
                        </button>
                    )}
                </div>

                <div className="text-center space-y-2">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                        <Palette size={18} className="text-indigo-500" />
                        AI-Generated Avatar
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                        We used your interests ({selectedInterests.slice(0,3).join(', ')}...) to create a unique artistic profile picture just for you.
                    </p>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button 
                    onClick={handleRegister}
                    disabled={isLoading || isGeneratingAvatar}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <Sparkles size={18} />
                            <span>Complete Setup</span>
                        </>
                    )}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default RegisterScreen;