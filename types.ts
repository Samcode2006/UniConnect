export enum ViewState {
  LANDING = 'LANDING',
  REGISTER = 'REGISTER',
  LOGIN = 'LOGIN',
  FEED = 'FEED',
  CHAT = 'CHAT',
  COMMUNITIES = 'COMMUNITIES',
  PROFILE = 'PROFILE'
}

export enum PostCategory {
  SOCIAL = 'Social',
  CLUB_EVENT = 'Club Event',
  CONFESSION = 'Confession',
  QUESTION = 'Question'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  department?: string;
  bio?: string;
  tags?: string[];
  followers?: number;
  following?: number;
  semester?: number;
  studentId?: string;
  batchYear?: number;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  image?: string;
  timestamp: string;
  category: PostCategory;
  likes: number;
  comments: number;
  isOfficial?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isAi?: boolean;
}

export interface ChatSession {
  id: string;
  name: string;
  participants: User[];
  lastMessage: string;
  lastMessageTime: string;
  type: 'group' | 'direct' | 'ai';
  avatar?: string;
  status?: 'active' | 'pending' | 'blocked';
}