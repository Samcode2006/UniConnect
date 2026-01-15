import React, { useState, useEffect, useRef } from 'react';
import { ChatSession, ChatMessage, User } from '../types';
import { Send, ArrowLeft, Bot, Sparkles, MoreVertical, Search, Check, X, AlertTriangle } from 'lucide-react';
import { generateAiResponse } from '../services/geminiService';

interface ChatInterfaceProps {
  sessions: ChatSession[];
  currentUser: User;
  onUpdateSession: (sessionId: string, updates: Partial<ChatSession>) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ sessions, currentUser, onUpdateSession }) => {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    'chat-ai': [
      {
        id: 'welcome-ai',
        senderId: 'ai-bot',
        text: "Hi there! I'm your UniBot assistant. Ask me about club events, confessions, or random trivia!",
        timestamp: new Date(),
        isAi: true
      }
    ],
    'chat-1': [
      { id: 'm1', senderId: 'u2', text: 'Guys, are we still meeting for the jam session?', timestamp: new Date(Date.now() - 3600000) },
      { id: 'm2', senderId: 'u3', text: 'Yes, 5 PM at the music room.', timestamp: new Date(Date.now() - 3500000) }
    ],
    'chat-3': [
        { id: 'm3', senderId: 'unknown', text: 'Hi, I saw you at the hackathon. Are you looking for a teammate?', timestamp: new Date(Date.now() - 3500000) }
    ]
  });
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const isPending = activeSession?.status === 'pending';

  useEffect(() => {
    if (activeSessionId && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages[activeSessionId || ''], activeSessionId]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeSessionId || isPending) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => ({
      ...prev,
      [activeSessionId]: [...(prev[activeSessionId] || []), newMessage]
    }));
    
    const userQuery = inputText;
    setInputText('');

    // Handle AI Logic
    if (activeSessionId === 'chat-ai') {
      setIsTyping(true);
      const currentHistory = (messages['chat-ai'] || []).map(m => ({
        role: m.senderId === currentUser.id ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const aiResponseText = await generateAiResponse(userQuery, currentHistory);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: 'ai-bot',
        text: aiResponseText,
        timestamp: new Date(),
        isAi: true
      };

      setIsTyping(false);
      setMessages(prev => ({
        ...prev,
        [activeSessionId]: [...(prev[activeSessionId] || []), aiMessage]
      }));
    }
  };

  const handleAcceptChat = () => {
    if (activeSessionId) {
        onUpdateSession(activeSessionId, { status: 'active' });
    }
  };

  const handleDeclineChat = () => {
      if (activeSessionId) {
          // In a real app, this might delete the session or block user
          setActiveSessionId(null); 
          onUpdateSession(activeSessionId, { status: 'blocked' }); // Mock status update
      }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // -- Render List View --
  if (!activeSessionId) {
    return (
      <div className="h-full flex flex-col bg-white dark:bg-black transition-colors duration-200 border-r border-gray-100 dark:border-gray-800">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h1>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search people..." 
              className="w-full bg-gray-100 dark:bg-gray-900 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-gray-200 border border-transparent focus:bg-white dark:focus:bg-black focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {sessions.filter(s => s.status !== 'blocked').map(session => (
            <button
              key={session.id}
              onClick={() => setActiveSessionId(session.id)}
              className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors border-b border-gray-50 dark:border-gray-800/50 relative"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                  session.type === 'ai' ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-800'
              }`}>
                {session.type === 'ai' ? (
                    <Sparkles className="text-white" size={20} />
                ) : (
                    <img src={session.avatar} alt={session.name} className="w-full h-full rounded-full object-cover" />
                )}
              </div>
              
              <div className="flex-1 text-left">
                <div className="flex justify-between items-center mb-1">
                  <h3 className={`font-semibold ${session.type === 'ai' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-white'}`}>
                    {session.name}
                  </h3>
                  <span className="text-xs text-gray-400">{session.lastMessageTime}</span>
                </div>
                <p className={`text-sm truncate max-w-[200px] ${session.status === 'pending' ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                   {messages[session.id] ? messages[session.id][messages[session.id].length - 1]?.text : session.lastMessage}
                </p>
              </div>
              {session.status === 'pending' && <div className="w-3 h-3 bg-indigo-500 rounded-full absolute right-4 bottom-8 border-2 border-white dark:border-black"></div>}
            </button>
          ))}
        </div>
        <div className="h-20 md:h-0"></div>
      </div>
    );
  }

  // -- Render Chat View --
  return (
    <div className="h-full flex flex-col bg-white dark:bg-black md:rounded-l-2xl overflow-hidden fixed inset-0 md:static z-50 md:z-auto transition-colors duration-200 border-l border-gray-100 dark:border-gray-800">
      {/* Chat Header */}
      <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 z-10 sticky top-0">
        <button 
          onClick={() => setActiveSessionId(null)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-900 dark:text-white" />
        </button>
        
        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
            activeSession?.type === 'ai' ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-800'
        }`}>
            {activeSession?.type === 'ai' ? <Bot className="text-white" size={18} /> : (
                <img src={activeSession?.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
            )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm md:text-base">{activeSession?.name}</h3>
          {activeSession?.type === 'ai' && <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">UniBot Assistant</span>}
        </div>
        
        <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <MoreVertical size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white dark:bg-black">
        
        {isPending && (
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-sm text-gray-600 dark:text-gray-300 flex items-start gap-3 mb-6 mx-auto max-w-md">
                <AlertTriangle size={18} className="mt-0.5 shrink-0 text-gray-400" />
                <p>This message is from someone you haven't chatted with before. Review the content below and decide if you want to connect.</p>
            </div>
        )}

        {(messages[activeSessionId] || []).map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-1`}>
              <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-2.5 ${
                isMe 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100'
              }`}>
                {!isMe && activeSession?.type === 'group' && (
                    <p className="text-xs font-bold text-gray-500 mb-1">Peer</p>
                )}
                {msg.isAi && (
                    <div className="flex items-center gap-1.5 mb-1 text-indigo-600 dark:text-indigo-400">
                        <Sparkles size={12} />
                        <span className="text-[10px] uppercase font-bold tracking-wider">UniBot</span>
                    </div>
                )}
                
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                
                <p className={`text-[10px] mt-1 text-right opacity-70`}>
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
        {isTyping && (
             <div className="flex justify-start">
                 <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl px-4 py-3 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                 </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area or Accept Request Area */}
      {isPending ? (
         <div className="bg-white dark:bg-black p-4 border-t border-gray-100 dark:border-gray-800 flex flex-col items-center gap-3">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Accept this request to continue chatting.</p>
            <div className="flex gap-3 w-full max-w-xs">
                <button onClick={handleDeclineChat} className="flex-1 py-2.5 rounded-full border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 flex items-center justify-center gap-2 transition-colors">
                    <X size={18} /> Decline
                </button>
                <button onClick={handleAcceptChat} className="flex-1 py-2.5 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2 transition-colors">
                    <Check size={18} /> Accept
                </button>
            </div>
         </div>
      ) : (
        <div className="bg-white dark:bg-black p-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex gap-2 items-center bg-gray-100 dark:bg-gray-900 rounded-full px-4 py-2 border border-transparent focus-within:border-indigo-500 focus-within:bg-white dark:focus-within:bg-black transition-all">
            <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={activeSession?.type === 'ai' ? "Ask UniBot..." : "Start a message..."}
                className="flex-1 bg-transparent border-none outline-none text-[15px] py-1 dark:text-white placeholder-gray-500"
            />
            <button 
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className={`p-1.5 rounded-full transition-all ${
                    inputText.trim() 
                    ? 'text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30' 
                    : 'text-gray-400'
                }`}
            >
                <Send size={20} />
            </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;