import { useState, useEffect, useRef } from 'react';
import { Play, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Drama {
  id: string;
  title: string;
  cover: string;
  category: string;
  views: string;
  status: string;
  isNew?: boolean;
}

const initialDramas: Drama[] = [
  {
    id: '1',
    title: '我已弃宗当散修',
    cover: 'https://p9-reading-sign.fqnovelpic.com/novel-pic/p2oa88b4f0f9b702b3c0eb94c5bbd206479~tplv-resize:225:0.image?lk3s=5b7047ff&x-expires=1749287045&x-signature=rFAGxsJs%2BT3szPuC8Ju81P0E60c%3D',
    category: '玄幻仙侠',
    views: '6539',
    status: '更新至12集',
    isNew: true
  },
];

const categories = ['热剧', '新剧', '逆袭', '总裁', '现代', '筛选'];

const Drama = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('热剧');
  const [dramas, setDramas] = useState<Drama[]>(initialDramas);
  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Drama[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const loadMoreDramas = async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newDramas = Array.from({ length: 9 }, (_, i) => ({
        id: `${page}-${i}`,
        title: `新上架短剧 ${page}-${i}`,
        cover: `https://p9-reading-sign.fqnovelpic.com/novel-pic/p2oa88b4f0f9b702b3c0eb94c5bbd206479~tplv-resize:225:0.image?lk3s=5b7047ff&x-expires=1749287045&x-signature=rFAGxsJs%2BT3szPuC8Ju81P0E60c%3D`,
        category: '玄幻仙侠',
        views: Math.floor(Math.random() * 10000).toString(),
        status: '更新至12集',
        isNew: Math.random() > 0.7
      }));

      setDramas(prev => [...prev, ...newDramas]);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Failed to load more dramas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (category: string) => {
    setCategoryLoading(true);
    setActiveCategory(category);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newDramas = Array.from({ length: 9 }, (_, i) => ({
        id: `${page}-${i}`,
        title: `新上架短剧 ${page}-${i}`,
        cover: `https://p9-reading-sign.fqnovelpic.com/novel-pic/p2oa88b4f0f9b702b3c0eb94c5bbd206479~tplv-resize:225:0.image?lk3s=5b7047ff&x-expires=1749287045&x-signature=rFAGxsJs%2BT3szPuC8Ju81P0E60c%3D`,
        category: '玄幻仙侠',
        views: Math.floor(Math.random() * 10000).toString(),
        status: '更新至12集',
        isNew: Math.random() > 0.7
      }));

      setDramas(newDramas);
      setPage(1);
    } catch (error) {
      console.error('Failed to load category dramas:', error);
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const filtered = dramas.filter(drama =>
      drama.title.toLowerCase().includes(query.toLowerCase()) ||
      drama.category.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
  };

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !searchQuery) {
          loadMoreDramas();
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
  }, [searchQuery]);

  const displayedDramas = searchQuery ? searchResults : dramas;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Search Bar */}
      <div className="bg-gray-50 dark:bg-gray-900">
        <div className="safe-area-top"></div>
        <div className="bg-white dark:bg-gray-800 px-4 py-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="搜索短剧"
              className="w-full bg-gray-100 dark:bg-gray-700 rounded-full px-5 py-2 pl-10 text-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Categories */}
        <div className="px-4 py-3">
          <div className="flex gap-4 overflow-x-auto no-scrollbar">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                disabled={categoryLoading}
                className={`px-4 py-1 rounded-full whitespace-nowrap transition-all duration-200 ${
                  activeCategory === category
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                } ${categoryLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Drama Grid */}
      <div className="px-4 py-4">
        <div className={`grid grid-cols-3 gap-3 transition-opacity duration-200 ${categoryLoading ? 'opacity-50' : ''}`}>
          {displayedDramas.map((drama) => (
            <div 
              key={drama.id} 
              className="relative group cursor-pointer"
              onClick={() => navigate(`/drama/${drama.id}`)}
            >
              <div className="aspect-[3/4] rounded-lg overflow-hidden relative">
                <img
                  src={drama.cover}
                  alt={drama.title}
                  className="w-full h-full object-cover transform transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                {drama.isNew && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    上新
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <div className="flex items-center justify-between text-white text-xs">
                    <span>{drama.category}</span>
                    <span>{drama.views}</span>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                {drama.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {drama.status}
              </p>
            </div>
          ))}
        </div>
        
        {/* Loading indicator */}
        <div ref={loadingRef} className="py-4 text-center">
          {loading && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          )}
        </div>

        {/* No results message */}
        {searchQuery && displayedDramas.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            没有找到相关短剧
          </div>
        )}
      </div>
    </div>
  );
};

export default Drama;