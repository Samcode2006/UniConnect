import React, { useState } from 'react';
import { User, Post } from '../types';
import Feed from './Feed';
import { Mail, Award, LogOut, MapPin, Calendar, Users, Settings, Lock, Globe, Plus, X, MessageSquare, Edit2, Check, Camera, RefreshCcw } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface ProfileViewProps {
  user: User;
  onLogout: () => void;
  userPosts: Post[];
  onUpdateUser?: (user: User) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout, userPosts, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'connections' | 'settings'>('posts');
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    showEmail: true,
    allowMessages: true,
  });
  const [tags, setTags] = useState<string[]>(user.tags || []);
  const [newTag, setNewTag] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  
  // Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editBio, setEditBio] = useState(user.bio || '');
  const [editAvatar, setEditAvatar] = useState(user.avatar);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);

  const handleAddTag = () => {
    if (newTag.trim()) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      if (onUpdateUser) onUpdateUser({ ...user, tags: updatedTags });
      setNewTag('');
      setIsAddingTag(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
      const updatedTags = tags.filter(t => t !== tagToRemove);
      setTags(updatedTags);
      if (onUpdateUser) onUpdateUser({ ...user, tags: updatedTags });
  };

  const togglePrivacy = (key: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveProfile = () => {
      if (onUpdateUser) {
          onUpdateUser({
              ...user,
              name: editName,
              bio: editBio,
              avatar: editAvatar
          });
      }
      setIsEditing(false);
  };

  const regenerateAvatar = async () => {
      if (!process.env.API_KEY) return;
      setIsGeneratingAvatar(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `A minimal, cool, artistic circular profile avatar illustration representing: ${tags.join(', ')}. Vector flat art style, vibrant colors.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] }
        });

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
            setEditAvatar(generatedImage);
        }
      } catch (e) {
          console.error(e);
      } finally {
          setIsGeneratingAvatar(false);
      }
  }

  return (
    <div className="pb-24">
      {/* Cover Image - Solid color */}
      <div className="h-40 md:h-52 w-full bg-gray-200 dark:bg-zinc-900 relative">
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-white dark:bg-black rounded-none md:rounded-3xl shadow-none md:shadow-sm border-x border-b border-transparent md:border-gray-100 dark:md:border-gray-800 overflow-hidden pb-6 transition-colors duration-200">
          
          {/* Header Section */}
          <div className="px-4 md:px-10 pt-2 md:pt-8">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white dark:border-black shadow-sm overflow-hidden bg-white dark:bg-gray-800">
                  <img src={isEditing ? editAvatar : user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                {!isEditing && (
                    <button onClick={() => setActiveTab('settings')} className="absolute bottom-1 right-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-200 transition-colors">
                    <Settings size={16} />
                    </button>
                )}
                {isEditing && (
                     <button 
                        onClick={regenerateAvatar}
                        disabled={isGeneratingAvatar}
                        className="absolute bottom-1 right-1 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors"
                     >
                        {isGeneratingAvatar ? <RefreshCcw size={16} className="animate-spin"/> : <Camera size={16} />}
                    </button>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 pt-2 md:pt-10 w-full">
                <div className="flex justify-between items-start">
                  <div className="w-full">
                    {isEditing ? (
                        <div className="mb-2">
                            <label className="text-xs text-gray-400 uppercase font-bold">Display Name</label>
                            <input 
                                type="text" 
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full text-2xl md:text-3xl font-bold text-gray-900 dark:text-white bg-transparent border-b border-gray-300 dark:border-gray-700 focus:border-indigo-500 outline-none pb-1"
                            />
                        </div>
                    ) : (
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                    )}
                    <p className="text-gray-500 dark:text-gray-500 font-medium">{user.department || 'Student'}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                        onClick={onLogout}
                        className="hidden md:flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-800 text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-900/10 text-sm font-semibold transition-colors"
                    >
                        <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>

                {isEditing ? (
                    <div className="mt-3">
                         <label className="text-xs text-gray-400 uppercase font-bold">Bio</label>
                         <textarea 
                            value={editBio}
                            onChange={(e) => setEditBio(e.target.value)}
                            className="w-full mt-1 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-sm md:text-base outline-none focus:ring-1 focus:ring-indigo-500 border border-gray-200 dark:border-gray-800"
                            rows={3}
                         />
                    </div>
                ) : (
                    <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl text-sm md:text-base">{user.bio || 'No bio added yet.'}</p>
                )}

                {/* Stats */}
                <div className="flex gap-8 mt-6">
                  <div className="text-left">
                    <span className="block font-bold text-gray-900 dark:text-white text-lg">{userPosts.length}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-500">Posts</span>
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-gray-900 dark:text-white text-lg">{user.followers || 0}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-500">Followers</span>
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-gray-900 dark:text-white text-lg">{user.following || 0}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-500">Following</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags / Clubs */}
            <div className="mt-8">
                <div className="flex items-center gap-2 mb-3">
                    <Award size={16} className="text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Clubs & Communities</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, idx) => (
                        <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-transparent">
                            {tag}
                            <button onClick={() => handleRemoveTag(tag)} className="ml-2 hover:text-red-500">
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                    
                    {isAddingTag ? (
                        <div className="flex items-center gap-2">
                            <input 
                                type="text" 
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                className="px-3 py-1 rounded-full text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 w-32"
                                placeholder="Club Name"
                                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                autoFocus
                            />
                            <button onClick={handleAddTag} className="p-1 text-green-600 hover:bg-green-50 rounded-full"><Plus size={16} /></button>
                            <button onClick={() => setIsAddingTag(false)} className="p-1 text-red-600 hover:bg-red-50 rounded-full"><X size={16} /></button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setIsAddingTag(true)}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                            <Plus size={14} className="mr-1" /> Add
                        </button>
                    )}
                </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8 border-b border-gray-100 dark:border-gray-800 px-4 md:px-10">
            <div className="flex gap-8 overflow-x-auto no-scrollbar">
              {['posts', 'about', 'connections', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`pb-4 text-sm font-semibold capitalize transition-colors relative whitespace-nowrap ${
                    activeTab === tab ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4 md:p-10 min-h-[300px] bg-white dark:bg-black">
            
            {activeTab === 'posts' && (
                <div className="max-w-2xl mx-auto">
                    <Feed posts={userPosts} showHeader={false} />
                </div>
            )}

            {activeTab === 'about' && (
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
                    <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Users size={18} className="text-indigo-600" /> Personal Details
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold">Full Name</label>
                                <p className="text-gray-900 dark:text-gray-100 font-medium">{user.name}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold">Email</label>
                                <p className="text-gray-900 dark:text-gray-100 font-medium flex items-center gap-2">
                                    {privacySettings.showEmail ? user.email : 'Hidden'}
                                    {privacySettings.showEmail && <span className="text-green-600 text-xs bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">Verified</span>}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold">Details</label>
                                <p className="text-gray-900 dark:text-gray-100 font-medium flex items-center gap-2">
                                    <Calendar size={14} /> Batch: {user.batchYear || 'N/A'} • Sem: {user.semester || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <MapPin size={18} className="text-indigo-600" /> Campus Activity
                        </h3>
                         <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold">Department</label>
                                <p className="text-gray-900 dark:text-gray-100 font-medium">{user.department}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold">Student ID</label>
                                <p className="text-gray-900 dark:text-gray-100 font-medium">{user.studentId || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'connections' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                            <img src={`https://i.pravatar.cc/150?img=${i + 20}`} alt="Connection" className="w-12 h-12 rounded-full" />
                            <div>
                                <h4 className="font-bold text-sm text-gray-900 dark:text-white">Student Name {i}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Computer Science</p>
                            </div>
                            <button className="ml-auto text-xs bg-black dark:bg-white text-white dark:text-black px-3 py-1.5 rounded-full font-bold">
                                Message
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="max-w-2xl mx-auto space-y-6">
                    
                    {/* Edit Profile Section */}
                    <div className="border border-gray-100 dark:border-gray-800 rounded-2xl p-6 bg-gray-50/50 dark:bg-gray-900/20">
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
                                <Edit2 size={20} /> Edit Profile
                            </h3>
                            {isEditing ? (
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleSaveProfile}
                                        className="px-4 py-2 text-sm font-semibold bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center gap-2"
                                    >
                                        <Check size={16} /> Save
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                                >
                                    Edit Details
                                </button>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Update your personal information and bio. To change your avatar, click the Edit button then the camera icon on your profile picture.
                        </p>
                    </div>

                    <div className="border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <Lock size={20} /> Privacy & Security
                        </h3>
                        
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                        <Globe size={16} /> Public Profile
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Allow users to see your posts.</p>
                                </div>
                                <button 
                                    onClick={() => togglePrivacy('publicProfile')}
                                    className={`w-11 h-6 rounded-full p-1 transition-colors ${privacySettings.publicProfile ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${privacySettings.publicProfile ? 'translate-x-5' : ''}`}></div>
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                        <Mail size={16} /> Show Email Address
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Display your email on your profile.</p>
                                </div>
                                <button 
                                    onClick={() => togglePrivacy('showEmail')}
                                    className={`w-11 h-6 rounded-full p-1 transition-colors ${privacySettings.showEmail ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${privacySettings.showEmail ? 'translate-x-5' : ''}`}></div>
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                        <MessageSquare size={16} /> Allow Messages
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Allow students to message you.</p>
                                </div>
                                <button 
                                    onClick={() => togglePrivacy('allowMessages')}
                                    className={`w-11 h-6 rounded-full p-1 transition-colors ${privacySettings.allowMessages ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${privacySettings.allowMessages ? 'translate-x-5' : ''}`}></div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileView;