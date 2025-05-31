import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Book, BookMarked, User } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  // Hide navigation in reader view and drama player
  if (location.pathname.includes('/chapter/') || location.pathname.includes('/drama/')) {
    return null;
  }
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-2 z-50">
      <div className="max-w-lg mx-auto">
        <ul className="flex justify-around items-center">
          <li>
            <Link
              to="/"
              className={`flex flex-col items-center px-4 py-2 text-xs ${
                isActive('/') && !isActive('/drama') && !isActive('/novel') && !isActive('/settings')
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Home size={20} />
              <span className="mt-1">书城</span>
            </Link>
          </li>
          <li>
            <Link
              to="/drama"
              className={`flex flex-col items-center px-4 py-2 text-xs ${
                isActive('/drama')
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Book size={20} />
              <span className="mt-1">短剧</span>
            </Link>
          </li>
          <li>
            <Link
              to="/library"
              className={`flex flex-col items-center px-4 py-2 text-xs ${
                isActive('/library')
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <BookMarked size={20} />
              <span className="mt-1">书架</span>
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className={`flex flex-col items-center px-4 py-2 text-xs ${
                isActive('/settings')
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <User size={20} />
              <span className="mt-1">我的</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;