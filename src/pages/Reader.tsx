import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { novels } from '../data/novels';
import { useAppContext } from '../context/AppContext';
import { ChevronLeft, Settings, Bookmark, Sun, Moon, Book } from 'lucide-react';

const Reader = () => {
  const { id, chapterId } = useParams();
  const navigate = useNavigate();
  const { readingPreferences, updateReadingPreferences, addBookmark, bookmarks } = useAppContext();
  const [showControls, setShowControls] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const novel = novels.find(n => n.id === id);
  const currentChapterIndex = novel?.chapters.findIndex(c => c.id === chapterId) ?? -1;
  const chapter = novel?.chapters[currentChapterIndex];
  const prevChapter = currentChapterIndex > 0 ? novel?.chapters[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex < (novel?.chapters.length ?? 0) - 1 
    ? novel?.chapters[currentChapterIndex + 1] 
    : null;

  const isBookmarked = bookmarks.some(b => b.novelId === id && b.chapterId === chapterId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [chapterId]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (showSettings || isTransitioning) return;

      const height = window.innerHeight;
      const width = window.innerWidth;
      const clickX = e.clientX;
      const clickY = e.clientY;

      // Middle 40% of the screen vertically and horizontally for controls
      const middleXStart = width * 0.3;
      const middleXEnd = width * 0.7;
      const middleYStart = height * 0.3;
      const middleYEnd = height * 0.7;

      const isMiddleArea = 
        clickX >= middleXStart && 
        clickX <= middleXEnd && 
        clickY >= middleYStart && 
        clickY <= middleYEnd;

      if (isMiddleArea) {
        e.preventDefault();
        e.stopPropagation();
        setShowControls(!showControls);
        
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
        
        if (!showControls) {
          controlsTimeoutRef.current = setTimeout(() => {
            setShowControls(false);
          }, 3000);
        }
        return;
      }

      // Left 30% for previous, right 30% for next
      if (clickX < width * 0.3 && prevChapter) {
        handlePageTurn('prev');
      } else if (clickX > width * 0.7 && nextChapter) {
        handlePageTurn('next');
      } else if (clickX > width * 0.7 && !nextChapter) {
        showToBeUpdated();
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [prevChapter, nextChapter, showSettings, isTransitioning, showControls]);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if ((e.target as Element).closest('.settings-panel')) return;
      setTouchStartX(e.touches[0].clientX);
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartX === null || touchStartY === null || isTransitioning) return;
      if ((e.target as Element).closest('.settings-panel')) return;

      const touchEndX = e.touches[0].clientX;
      // const touchEndY = e.touches[0].clientY;
      const deltaX = touchStartX - touchEndX;
      const deltaY = Math.abs(touchStartY - e.touches[0].clientY);

      if (Math.abs(deltaX) > 50 && deltaY < 50) {
        e.preventDefault();
        if (deltaX > 0 && nextChapter) {
          handlePageTurn('next');
        } else if (deltaX < 0 && prevChapter) {
          handlePageTurn('prev');
        } else if (deltaX > 0 && !nextChapter) {
          showToBeUpdated();
        }
        setTouchStartX(null);
        setTouchStartY(null);
      }
    };

    const handleTouchEnd = () => {
      setTouchStartX(null);
      setTouchStartY(null);
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [touchStartX, touchStartY, isTransitioning, nextChapter, prevChapter]);

  const showToBeUpdated = () => {
    setShowUpdatePrompt(true);
    setTimeout(() => setShowUpdatePrompt(false), 2000);
  };

  const handlePageTurn = async (direction: 'prev' | 'next') => {
    if (isTransitioning) return;
    
    if (direction === 'next' && !nextChapter) {
      showToBeUpdated();
      return;
    }

    setIsTransitioning(true);

    const content = contentRef.current;
    if (!content) {
      setIsTransitioning(false);
      return;
    }

    content.style.transition = 'transform 0.3s ease-out';
    content.style.transform = `translateX(${direction === 'next' ? '-100%' : '100%'})`;

    setTimeout(() => {
      if (direction === 'next' && nextChapter) {
        navigate(`/novel/${novel?.id}/chapter/${nextChapter.id}`);
      } else if (direction === 'prev' && prevChapter) {
        navigate(`/novel/${novel?.id}/chapter/${prevChapter.id}`);
      }

      content.style.transition = 'none';
      content.style.transform = 'translateX(0)';
      setIsTransitioning(false);
      window.scrollTo(0, 0);
    }, 300);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (novel && chapter) {
      addBookmark({
        novelId: novel.id,
        chapterId: chapter.id,
        position: scrollPosition,
        createdAt: new Date().toISOString()
      });
    }
  };

  const toggleSettings = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSettings(!showSettings);
  };

  if (!novel || !chapter) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">Chapter not found</h1>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen ${
        readingPreferences.theme === 'dark' 
          ? 'bg-gray-900 text-gray-100' 
          : readingPreferences.theme === 'sepia'
          ? 'bg-[#f4ecd8] text-gray-900'
          : 'bg-white text-gray-900'
      }`}
    >
      {/* Top controls */}
      <div 
        className={`fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md transition-transform duration-300 z-50 ${
          showControls ? 'transform translate-y-0' : 'transform -translate-y-full'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={`/novel/${novel.id}`} className="flex items-center text-gray-600 dark:text-gray-300">
              <ChevronLeft className="w-6 h-6" />
              <span className="ml-2">{novel.title}</span>
            </Link>
            <div className="flex items-center gap-4">
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-full ${
                  isBookmarked 
                    ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                <Bookmark className="w-6 h-6" />
              </button>
              <button
                onClick={toggleSettings}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300"
              >
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div 
        ref={contentRef}
        className="min-h-screen pt-8 pb-16 px-4 transition-transform reader-content"
        style={{
          fontFamily: readingPreferences.fontFamily,
          fontSize: `${readingPreferences.fontSize}px`,
          lineHeight: readingPreferences.lineHeight
        }}
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8">
            Chapter {chapter.number}: {chapter.title}
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            {chapter.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 leading-relaxed" style={{ fontSize: `${readingPreferences.fontSize}px` }}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div 
          ref={settingsRef}
          className="fixed top-16 right-4 w-72 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg rounded-lg p-4 z-40 settings-panel"
          onClick={e => e.stopPropagation()}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">字体大小 ({readingPreferences.fontSize}px)</label>
              <input
                type="range"
                min="14"
                max="24"
                step="1"
                value={readingPreferences.fontSize}
                onChange={(e) => updateReadingPreferences({ fontSize: Number(e.target.value) })}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-xs mt-1">
                <span>小</span>
                <span>大</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">主题</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => updateReadingPreferences({ theme: 'light' })}
                  className={`flex flex-col items-center gap-1 p-2 rounded ${
                    readingPreferences.theme === 'light' ? 'bg-gray-200' : 'bg-gray-100'
                  }`}
                >
                  <Sun className="w-5 h-5" />
                  <span className="text-xs">浅色</span>
                </button>
                <button
                  onClick={() => updateReadingPreferences({ theme: 'dark' })}
                  className={`flex flex-col items-center gap-1 p-2 rounded ${
                    readingPreferences.theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-gray-800 text-white'
                  }`}
                >
                  <Moon className="w-5 h-5" />
                  <span className="text-xs">深色</span>
                </button>
                <button
                  onClick={() => updateReadingPreferences({ theme: 'sepia' })}
                  className={`flex flex-col items-center gap-1 p-2 rounded ${
                    readingPreferences.theme === 'sepia' ? 'bg-[#f4ecd8]' : 'bg-[#f4ecd8]'
                  }`}
                >
                  <Book className="w-5 h-5" />
                  <span className="text-xs">护眼</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update prompt */}
      {showUpdatePrompt && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm">
          敬请期待下一章...
        </div>
      )}
    </div>
  );
};

export default Reader;