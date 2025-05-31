import { useAppContext } from '../context/AppContext';
import NovelCard from '../components/NovelCard';
import { BookOpen, Clock } from 'lucide-react';

const Library = () => {
  const { bookmarks, readingProgress, novels } = useAppContext();

  // Get bookmarked novels
  const bookmarkedNovels = novels.filter(novel => 
    bookmarks.some(bookmark => bookmark.novelId === novel.id)
  );

  // Get recently read novels
  const recentNovels = novels.filter(novel =>
    readingProgress.some(progress => progress.novelId === novel.id)
  ).sort((a, b) => {
    const aProgress = readingProgress.find(p => p.novelId === a.id);
    const bProgress = readingProgress.find(p => p.novelId === b.id);
    return new Date(bProgress?.lastReadAt || 0).getTime() - 
           new Date(aProgress?.lastReadAt || 0).getTime();
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Recently Read Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">最近阅读</h2>
          </div>
          {recentNovels.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {recentNovels.map(novel => (
                <NovelCard key={novel.id} novel={novel} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">还没有阅读记录哦</p>
            </div>
          )}
        </div>

        {/* Bookmarked Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">我的书架</h2>
          </div>
          {bookmarkedNovels.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {bookmarkedNovels.map(novel => (
                <NovelCard key={novel.id} novel={novel} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">书架空空如也，快去添加喜欢的小说吧</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Library;