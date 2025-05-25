import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleBlur = () => {
    if (!searchQuery) {
      setIsExpanded(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsExpanded(false);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className={`relative transition-all duration-300 ${isExpanded ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}`}>
        <input
          type="text"
          placeholder="搜索小说"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`w-full px-4 py-3 pl-12 rounded-lg focus:outline-none transition-all duration-300
            ${isExpanded 
              ? 'bg-gray-100 dark:bg-gray-800 shadow-inner' 
              : 'bg-white dark:bg-gray-900'}`}
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        {isExpanded && searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {isExpanded && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-lg rounded-b-lg mt-1 z-50">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">热门搜索</h3>
            <div className="flex flex-wrap gap-2">
              {['修仙', '都市', '玄幻', '穿越', '系统', '重生'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSearchQuery(tag);
                    navigate(`/search?q=${encodeURIComponent(tag)}`);
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default SearchBar;