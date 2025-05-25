// import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { novels } from '../data/novels';
import { useAppContext } from '../context/AppContext';
import { BookOpen, Star, Clock } from 'lucide-react';

const NovelDetail = () => {
  const { id } = useParams();
  const novel = novels.find(n => n.id === id);
  const { readingProgress } = useAppContext();

  if (!novel) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">Novel not found</h1>
      </div>
    );
  }

  const lastReadChapter = readingProgress.find(p => p.novelId === id);
  const hasChapters = novel.chapters && novel.chapters.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="safe-area-top bg-gray-50 dark:bg-gray-900"></div>
      {/* Cover and Basic Info */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90">
          <img
            src={novel.cover}
            alt=""
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="relative container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-1/3 sm:w-48">
              <img
                src={novel.cover}
                alt={novel.title}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            <div className="flex-1 text-white">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{novel.title}</h1>
              <p className="text-lg text-gray-200 mb-2">{novel.author}</p>
              <div className="flex items-center gap-4 mb-4">
                <span className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400" />
                  {novel.rating}
                </span>
                <span className="px-2 py-1 rounded-full text-sm bg-green-500/20 text-green-400">
                  {novel.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {novel.genre.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 rounded-full text-sm bg-white/10"
                  >
                    {g}
                  </span>
                ))}
              </div>
              {!hasChapters ? (
                <button
                  disabled
                  className="block w-full sm:w-auto text-center bg-gray-500 text-white py-3 px-6 rounded-lg font-semibold cursor-not-allowed"
                >
                  暂无章节
                </button>
              ) : lastReadChapter ? (
                <Link
                  to={`/novel/${novel.id}/chapter/${lastReadChapter.chapterId}`}
                  className="block w-full sm:w-auto text-center bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  继续阅读
                </Link>
              ) : (
                <Link
                  to={`/novel/${novel.id}/chapter/${novel.chapters[0].id}`}
                  className="block w-full sm:w-auto text-center bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  开始阅读
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Synopsis */}
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">简介</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {novel.synopsis}
        </p>
      </div>

      {/* Chapters */}
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          章节列表
        </h2>
        {!hasChapters ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">暂无章节</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {novel.chapters.map((chapter) => (
              <Link
                key={chapter.id}
                to={`/novel/${novel.id}/chapter/${chapter.id}`}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  第{chapter.number}章：{chapter.title}
                </h3>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{chapter.readTime} 分钟</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NovelDetail;