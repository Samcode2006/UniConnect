import { Post, PostCategory, ChatSession } from './types';

export const MOCK_POSTS: Post[] = [
  {
    id: '2',
    author: {
      id: 'club_photo',
      name: 'Photography Club',
      email: 'photo@college.edu',
      avatar: 'https://ui-avatars.com/api/?name=Photo+Club&background=10b981&color=fff',
      department: 'Arts',
      bio: 'Capturing moments around campus.',
      tags: ['Photography', 'Creativity'],
      followers: 450,
      following: 50
    },
    content: "Our weekend photo walk to the downtown historic district was a success! Here are some shots from our new members. Next meetup: Friday 4 PM @ Quad.",
    timestamp: '5 hours ago',
    category: PostCategory.CLUB_EVENT,
    image: 'https://picsum.photos/800/450',
    likes: 89,
    comments: 5
  },
  {
    id: '4',
    author: {
      id: 'music_club',
      name: 'Jazz Band',
      email: 'jazz@college.edu',
      avatar: 'https://ui-avatars.com/api/?name=Jazz+Band&background=f59e0b&color=fff',
      department: 'Music',
      bio: 'Smooth tunes for busy students.',
      tags: ['Music', 'Jazz', 'Live Performance'],
      followers: 320,
      following: 30
    },
    content: "Live performance tonight at the cafeteria! Come chill with us while you study. 7 PM onwards.",
    timestamp: '1 day ago',
    category: PostCategory.SOCIAL,
    likes: 56,
    comments: 2
  },
  {
    id: '5',
    author: {
      id: 'u_unknown',
      name: 'Campus Confessions',
      email: 'confess@college.edu',
      avatar: 'https://ui-avatars.com/api/?name=Confessions&background=ec4899&color=fff',
      department: 'General',
      bio: 'Anonymous confessions.',
      tags: [],
      followers: 2000,
      following: 0
    },
    content: "To the guy playing guitar in the quad yesterday: you're amazing, but please learn a second song.",
    timestamp: '2 hours ago',
    category: PostCategory.CONFESSION,
    likes: 342,
    comments: 45
  },
  {
    id: '6',
    author: {
      id: 'u_student1',
      name: 'Alex Chen',
      email: 'alex@college.edu',
      avatar: 'https://i.pravatar.cc/150?img=11',
      department: 'CSE',
      bio: 'Tech enthusiast',
      tags: ['Coding'],
      followers: 120,
      following: 200
    },
    content: "Does anyone know if the new coffee shop near the library is open yet? Need caffeine ASAP.",
    timestamp: '30 mins ago',
    category: PostCategory.QUESTION,
    likes: 12,
    comments: 8
  }
];

export const MOCK_SESSIONS: ChatSession[] = [
  {
    id: 'chat-ai',
    name: 'UniBot Assistant',
    participants: [],
    lastMessage: 'How can I help you today?',
    lastMessageTime: 'Now',
    type: 'ai',
    avatar: '',
    status: 'active'
  },
  {
    id: 'chat-1',
    name: 'Music Club Group',
    participants: [],
    lastMessage: 'Jam session at 5?',
    lastMessageTime: '10:30 AM',
    type: 'group',
    avatar: 'https://ui-avatars.com/api/?name=Music+Club&background=random',
    status: 'active'
  },
  {
    id: 'chat-2',
    name: 'Sarah Jenkins',
    participants: [],
    lastMessage: 'See you at the cafeteria!',
    lastMessageTime: 'Yesterday',
    type: 'direct',
    avatar: 'https://i.pravatar.cc/150?img=5',
    status: 'active'
  },
  {
    id: 'chat-3',
    name: 'Unknown Student',
    participants: [],
    lastMessage: 'Hi, I saw you at the hackathon. Are you looking for a teammate?',
    lastMessageTime: 'Tue',
    type: 'direct',
    avatar: 'https://ui-avatars.com/api/?name=Unknown&background=random',
    status: 'pending' 
  }
];