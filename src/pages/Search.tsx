import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Search as SearchIcon, X, BookOpen, Users, Star } from 'lucide-react';
import { novels } from '../data/novels';

interface SearchResult {
  id: string;
  title: string;
  cover: string;
  author: string;
  description: string;
  tags: string[];
  wordCount: string;
  readers: string;
  rating: string;
  category: string;
  status: string;
}

const mockCategories = ['综合', '都市', '玄幻', '修仙', '科幻', '历史'];

const Search = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeCategory, setActiveCategory] = useState('综合');
  const observerRef = useRef<IntersectionObserver>();
  const loadingRef = useRef<HTMLDivElement>(null);

  // Simulate search results
  const searchNovels = async (searchQuery: string, pageNum: number) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const filtered = novels
        .filter(novel => 
          novel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          novel.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          novel.synopsis.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(novel => ({
          id: novel.id,
          title: novel.title,
          cover: novel.cover,
          author: novel.author,
          description: novel.synopsis.slice(0, 100) + '...',
          tags: novel.genre,
          wordCount: Math.floor(Math.random() * 1000000).toLocaleString() + '字',
          readers: Math.floor(Math.random() * 100000).toLocaleString(),
          rating: novel.rating.toFixed(1),
          category: novel.genre[0],
          status: novel.status === '连载中' ? '连载中' : '已完结'
        }));

      // Simulate pagination
      const start = (pageNum - 1) * 10;
      const paginatedResults = filtered.slice(start, start + 10);

      if (pageNum === 1) {
        setResults(paginatedResults);
      } else {
        setResults(prev => [...prev, ...paginatedResults]);
      }
      
      setHasMore(paginatedResults.length === 10);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      searchNovels(query, page);
      setSearchParams({ q: query });
    }
  }, [query, page]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prev => prev + 1);
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
  }, [hasMore, loading]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setPage(1);
      searchNovels(query, 1);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Search Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
        <form onSubmit={handleSearch} className="flex items-center gap-2 p-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索小说"
              className="w-full bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 pl-10 pr-10 text-gray-900 dark:text-white"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
          
          <button
            type="submit"
            className="px-4 py-2 text-orange-500 font-medium"
          >
            搜索
          </button>
        </form>

        {/* Categories */}
        <div className="px-3 pb-2">
          <div className="flex gap-4 overflow-x-auto no-scrollbar">
            {mockCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1 rounded-full whitespace-nowrap text-sm ${
                  activeCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="px-4 pt-2">
        {results.map((result) => (
          <div
            key={result.id}
            onClick={() => navigate(`/novel/${result.id}`)}
            className="flex gap-4 mb-6 cursor-pointer"
          >
            <img
              src={result.cover}
              alt={result.title}
              className="w-24 h-32 object-cover rounded-lg shadow-md"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                {result.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {result.author}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                {result.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-200">
                  {result.category}
                </span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200">
                  {result.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {result.wordCount}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {result.readers}人在读
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  {result.rating}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        <div ref={loadingRef} className="py-4 text-center">
          {loading && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          )}
        </div>

        {/* Empty state */}
        {!loading && results.length === 0 && query && (
          <div className="text-center py-12">
            <SearchIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              未找到相关小说
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;