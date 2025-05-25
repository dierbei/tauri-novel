import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Novel } from '../types';

interface NovelCardProps {
  novel: Novel;
  ranking?: number;
  showRanking?: boolean;
  compact?: boolean;
}

const NovelCard: React.FC<NovelCardProps> = ({ novel, ranking, showRanking = false, compact = false }) => {
  return (
    <Link to={`/novel/${novel.id}`} className="block group">
      <div className="flex gap-3">
        <div className={`relative ${compact ? 'w-20' : 'w-28'}`}>
          <div className="aspect-[3/4] rounded-lg overflow-hidden">
            <img
              src={novel.cover}
              alt={novel.title}
              className="w-full h-full object-cover transform transition-transform group-hover:scale-105"
              loading="lazy"
            />
          </div>
          {showRanking && ranking && (
            <div className="absolute top-0 left-0 w-6 h-6 flex items-center justify-center bg-indigo-600 text-white text-sm font-bold rounded-tl-lg rounded-br-lg">
              {ranking}
            </div>
          )}
          {novel.status === 'ongoing' && (
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
              连载
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">
            {novel.title}
          </h3>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {novel.genre[0]} · {novel.author}
          </div>
          <div className="mt-1 flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {novel.rating.toFixed(1)}
            </span>
          </div>
          {!compact && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
              {novel.synopsis}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default NovelCard;