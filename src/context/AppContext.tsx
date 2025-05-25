import React, { createContext, useContext, useEffect, useState } from 'react';
import { BookmarkType, Novel, ReadingPreferences, ReadingProgress } from '../types';
import { novels } from '../data/novels';
import { authApi } from '../services/api';

interface User {
  id: string;
  email: string;
  created_at: string;
  avatar_url?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AppContextType {
  novels: Novel[];
  currentNovel: Novel | null;
  currentChapter: string | null;
  bookmarks: BookmarkType[];
  readingProgress: ReadingProgress[];
  readingPreferences: ReadingPreferences;
  searchQuery: string;
  user: User | null;
  setCurrentNovel: (novel: Novel | null) => void;
  setCurrentChapter: (chapterId: string | null) => void;
  addBookmark: (bookmark: BookmarkType) => void;
  removeBookmark: (novelId: string, chapterId: string) => void;
  updateReadingProgress: (progress: ReadingProgress) => void;
  updateReadingPreferences: (preferences: Partial<ReadingPreferences>) => void;
  setSearchQuery: (query: string) => void;
  filteredNovels: Novel[];
  getNovelById: (id: string) => Novel | undefined;
  getChapterById: (novelId: string, chapterId: string) => any;
  login: (data: LoginData) => Promise<void>;
  register: (data: LoginData) => Promise<void>;
  signOut: () => void;
}

const defaultReadingPreferences: ReadingPreferences = {
  fontSize: 18,
  fontFamily: 'Georgia, serif',
  lineHeight: 1.6,
  theme: 'light',
  readingMode: 'scroll',
  autoScroll: false,
  scrollSpeed: 1,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentNovel, setCurrentNovel] = useState<Novel | null>(null);
  const [currentChapter, setCurrentChapter] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [readingProgress, setReadingProgress] = useState<ReadingProgress[]>([]);
  const [readingPreferences, setReadingPreferences] = useState<ReadingPreferences>(() => {
    const savedPreferences = localStorage.getItem('readingPreferences');
    return savedPreferences ? JSON.parse(savedPreferences) : defaultReadingPreferences;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarks');
    const savedProgress = localStorage.getItem('readingProgress');
    const token = localStorage.getItem('token');
    
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
    
    if (savedProgress) {
      setReadingProgress(JSON.parse(savedProgress));
    }

    if (token) {
      authApi.getProfile().then(response => {
        setUser(response.data);
      }).catch(() => {
        localStorage.removeItem('token');
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    localStorage.setItem('readingProgress', JSON.stringify(readingProgress));
    localStorage.setItem('readingPreferences', JSON.stringify(readingPreferences));
  }, [bookmarks, readingProgress, readingPreferences]);

  const login = async (data: LoginData) => {
    const response = await authApi.login(data);
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
  };

  const register = async (data: LoginData) => {
    const response = await authApi.register(data);
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
  };

  const signOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const addBookmark = (bookmark: BookmarkType) => {
    setBookmarks(prev => [...prev.filter(b => 
      !(b.novelId === bookmark.novelId && b.chapterId === bookmark.chapterId)
    ), bookmark]);
  };

  const removeBookmark = (novelId: string, chapterId: string) => {
    setBookmarks(prev => prev.filter(
      bookmark => !(bookmark.novelId === novelId && bookmark.chapterId === chapterId)
    ));
  };

  const updateReadingProgress = (progress: ReadingProgress) => {
    setReadingProgress(prev => {
      const filtered = prev.filter(
        p => !(p.novelId === progress.novelId && p.chapterId === progress.chapterId)
      );
      return [...filtered, progress];
    });
  };

  const updateReadingPreferences = (preferences: Partial<ReadingPreferences>) => {
    setReadingPreferences(prev => ({ ...prev, ...preferences }));
  };

  const filteredNovels = novels.filter(novel => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      novel.title.toLowerCase().includes(query) ||
      novel.author.toLowerCase().includes(query) ||
      novel.synopsis.toLowerCase().includes(query) ||
      novel.genre.some(g => g.toLowerCase().includes(query)) ||
      novel.tags.some(t => t.toLowerCase().includes(query))
    );
  });

  const getNovelById = (id: string) => {
    return novels.find(novel => novel.id === id);
  };

  const getChapterById = (novelId: string, chapterId: string) => {
    const novel = novels.find(n => n.id === novelId);
    if (!novel) return null;
    return novel.chapters.find(chapter => chapter.id === chapterId);
  };

  const value = {
    novels,
    currentNovel,
    currentChapter,
    bookmarks,
    readingProgress,
    readingPreferences,
    searchQuery,
    user,
    setCurrentNovel,
    setCurrentChapter,
    addBookmark,
    removeBookmark,
    updateReadingProgress,
    updateReadingPreferences,
    setSearchQuery,
    filteredNovels,
    getNovelById,
    getChapterById,
    login,
    register,
    signOut,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};