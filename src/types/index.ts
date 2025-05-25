export interface Novel {
    id: string;
    title: string;
    author: string;
    cover: string;
    synopsis: string;
    genre: string[];
    rating: number;
    chapters: Chapter[];
    publishedDate: string;
    status: '连载中' | '已完结';
    tags: string[];
  }
  
  export interface Chapter {
    id: string;
    title: string;
    content: string;
    number: number;
    readTime: number; // in minutes
  }
  
  export interface BookmarkType {
    novelId: string;
    chapterId: string;
    position: number; // paragraph index
    createdAt: string;
  }
  
  export interface ReadingProgress {
    novelId: string;
    chapterId: string;
    position: number; // paragraph index
    completionPercentage: number;
    lastReadAt: string;
  }
  
  export interface ReadingPreferences {
    fontSize: number;
    fontFamily: string;
    lineHeight: number;
    theme: 'light' | 'dark' | 'sepia';
    readingMode: 'scroll' | 'paginated';
    autoScroll: boolean;
    scrollSpeed: number;
  }