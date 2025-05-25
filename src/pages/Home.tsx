import React, { useState, useEffect, useRef } from 'react';
import { novels } from '../data/novels';
// import NovelCard from '../components/NovelCard';
import SearchBar from '../components/SearchBar';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categories = ['推荐', '小说', '经典', '知识', '听书', '看剧', '视频'];
const rankingTypes = ['推荐榜', '完本榜', '巅峰榜', '口碑榜'];

const Home = () => {
  const [activeCategory, setActiveCategory] = React.useState('推荐');
  const [activeRanking, setActiveRanking] = React.useState('推荐榜');
  const [isRankingLoading, setIsRankingLoading] = useState(false);
  const navigate = useNavigate();
  const [displayedNovels, setDisplayedNovels] = useState(novels.slice(0, 6));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // Group novels into columns of 4 for the ranking section
  const groupedNovels = novels.slice(0, 16).reduce((acc, novel, index) => {
    const columnIndex = Math.floor(index / 4);
    if (!acc[columnIndex]) {
      acc[columnIndex] = [];
    }
    acc[columnIndex].push(novel);
    return acc;
  }, [] as typeof novels[]);

  const handleRankingChange = async (type: string) => {
    setIsRankingLoading(true);
    setActiveRanking(type);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setIsRankingLoading(false);
  };

  const loadMoreNovels = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const currentLength = displayedNovels.length;
      const nextNovels = novels.slice(currentLength, currentLength + 6);
      
      if (nextNovels.length > 0) {
        setDisplayedNovels(prev => [...prev, ...nextNovels]);
        setHasMore(currentLength + nextNovels.length < novels.length);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more novels:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreNovels();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [displayedNovels.length]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Search Header */}
      <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900">
        <div className="safe-area-top"></div>
        <div className="px-4 py-2">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <SearchBar />
            </div>
            <button className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="px-4">
            <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`text-sm whitespace-nowrap ${
                    activeCategory === category
                      ? 'text-indigo-600 dark:text-indigo-400 font-medium'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-2">
        {/* Rankings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
            {rankingTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleRankingChange(type)}
                className={`text-sm whitespace-nowrap px-2 py-1 rounded-full ${
                  activeRanking === type
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {type}
              </button>
            ))}
            <button className="text-sm text-gray-400 whitespace-nowrap flex items-center">
              完整榜单
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <div className={`flex gap-3 transition-opacity duration-300 ${isRankingLoading ? 'opacity-50' : ''}`} style={{ width: 'max-content' }}>
              {isRankingLoading ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, columnIndex) => (
                  <div key={columnIndex} className="flex flex-col gap-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="animate-pulse w-[280px]">
                        <div className="flex gap-2">
                          <div className="w-[60px] h-[80px] bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="flex-1">
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1"></div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-1"></div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                groupedNovels.map((column, columnIndex) => (
                  <div key={columnIndex} className="flex flex-col gap-2">
                    {column.map((novel, index) => (
                      <div
                        key={novel.id}
                        className="flex gap-2 w-[280px] cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded-lg transition-colors"
                        onClick={() => navigate(`/novel/${novel.id}`)}
                      >
                        <div className="relative w-[60px] shrink-0">
                          <div className="aspect-[3/4] rounded overflow-hidden">
                            <img
                              src={novel.cover}
                              alt={novel.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            {columnIndex === 0 && index < 3 && (
                              <div className="absolute top-0 left-0 w-5 h-5 flex items-center justify-center bg-indigo-600 text-white text-xs font-bold rounded-br">
                                {index + 1}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1 mb-1">
                            {novel.title}
                          </h3>
                          <div className="flex flex-wrap gap-1 mb-1">
                            {novel.tags.slice(0, 1).map((tag) => (
                              <span
                                key={tag}
                                className="px-1 py-0.5 text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                            {novel.synopsis}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Featured Section */}
        <div className="grid grid-cols-2 gap-4">
          {displayedNovels.map((novel) => (
            <div 
              key={novel.id}
              className="cursor-pointer"
              onClick={() => navigate(`/novel/${novel.id}`)}
            >
              <div className="aspect-[3/4] rounded-lg overflow-hidden mb-2">
                <img
                  src={novel.cover}
                  alt={novel.title}
                  className="w-full h-full object-cover transform transition-transform hover:scale-105"
                  loading="lazy"
                />
              </div>
              <h3 className="text-base font-medium text-gray-900 dark:text-white line-clamp-1 mb-1">
                {novel.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {novel.synopsis}
              </p>
            </div>
          ))}
        </div>

        {/* Loading indicator */}
        <div ref={loadingRef} className="py-8 text-center">
          {loading && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          )}
          {!hasMore && displayedNovels.length > 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-sm">没有更多小说了</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;