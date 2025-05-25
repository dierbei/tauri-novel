import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Heart, 
  MessageCircle, 
  Bookmark,
  Share2,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';

// Sample vertical video from a reliable source
const sampleVideo = "https://assets.mixkit.co/754zwuw47tnyt3miojrdsduceq55";

interface DramaEpisode {
  id: string;
  videoUrl: string;
  likes: number;
  comments: number;
  description: string;
}

const mockEpisodes: DramaEpisode[] = [
  {
    id: '1',
    videoUrl: sampleVideo,
    likes: 12453,
    comments: 342,
    description: '第1集：少年意外获得修仙传承，踏上逆天之路'
  },
  {
    id: '2',
    videoUrl: sampleVideo,
    likes: 8234,
    comments: 156,
    description: '第2集：初入仙门，结识同门师兄弟'
  },
  {
    id: '3',
    videoUrl: sampleVideo,
    likes: 15678,
    comments: 489,
    description: '第3集：参加门派大比，展露惊人天赋'
  }
];

const DramaPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playIconTimeoutRef = useRef<NodeJS.Timeout>();
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const currentEpisode = mockEpisodes[currentEpisodeIndex];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setIsPlaying(true);
      setShowPlayIcon(false);
    };
    
    const handlePause = () => {
      setIsPlaying(false);
      setShowPlayIcon(true);
      if (playIconTimeoutRef.current) {
        clearTimeout(playIconTimeoutRef.current);
      }
      playIconTimeoutRef.current = setTimeout(() => {
        setShowPlayIcon(false);
      }, 1000);
    };

    const handleEnded = () => {
      if (currentEpisodeIndex < mockEpisodes.length - 1) {
        setCurrentEpisodeIndex(prev => prev + 1);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      if (playIconTimeoutRef.current) {
        clearTimeout(playIconTimeoutRef.current);
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [currentEpisodeIndex]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = isMuted;
  }, [isMuted]);

  const startControlsTimer = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    controlsTimeoutRef.current = setTimeout(() => {
      if (!showComments) {
        setShowControls(false);
      }
    }, 3000);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + 'w';
    }
    return num.toString();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    // Prevent click handling if clicking on controls
    if (
      e.target instanceof Element && 
      (e.target.closest('button') || e.target.closest('.controls-area'))
    ) {
      return;
    }
    togglePlay();
    startControlsTimer();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // Prevent touch handling if touching controls
    if (
      e.target instanceof Element && 
      (e.target.closest('button') || e.target.closest('.controls-area'))
    ) {
      return;
    }
    togglePlay();
    startControlsTimer();
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const progressBar = e.currentTarget;
    if (!video || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * duration;
    startControlsTimer();
  };

  const handleMouseMove = () => {
    startControlsTimer();
  };

  return (
    <div 
      className="fixed inset-0 bg-black"
      onMouseMove={handleMouseMove}
      onTouchStart={handleMouseMove}
    >
      {/* Video Container */}
      <div 
        ref={containerRef}
        className="relative w-full h-full"
        onClick={handleVideoClick}
        onTouchStart={handleTouchStart}
      >
        <video
          ref={videoRef}
          src={currentEpisode.videoUrl}
          className="w-full h-full object-cover"
          playsInline
          loop
          autoPlay
        />

        {/* Play/Pause Icon Overlay */}
        {showPlayIcon && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-black/40 flex items-center justify-center">
              {isPlaying ? (
                <Pause className="w-10 h-10 text-white" />
              ) : (
                <Play className="w-10 h-10 text-white ml-1" />
              )}
            </div>
          </div>
        )}

        {/* Controls Overlay */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent controls-area">
            <button
              onClick={() => navigate(-1)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          </div>

          {/* Right Side Actions */}
          <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6 controls-area">
            <button 
              onClick={handleLike}
              className="flex flex-col items-center gap-1"
            >
              <div className={`w-12 h-12 rounded-full bg-black/40 flex items-center justify-center ${
                isLiked ? 'text-red-500' : 'text-white'
              }`}>
                <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
              </div>
              <span className="text-white text-sm">{formatNumber(currentEpisode.likes)}</span>
            </button>

            <button 
              onClick={() => setShowComments(true)}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center text-white">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-white text-sm">{formatNumber(currentEpisode.comments)}</span>
            </button>

            <button 
              onClick={handleBookmark}
              className="flex flex-col items-center gap-1"
            >
              <div className={`w-12 h-12 rounded-full bg-black/40 flex items-center justify-center ${
                isBookmarked ? 'text-yellow-500' : 'text-white'
              }`}>
                <Bookmark className={`w-6 h-6 ${isBookmarked ? 'fill-current' : ''}`} />
              </div>
              <span className="text-white text-sm">收藏</span>
            </button>

            <button className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center text-white">
                <Share2 className="w-6 h-6" />
              </div>
              <span className="text-white text-sm">分享</span>
            </button>
          </div>

          {/* Bottom Info and Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent controls-area">
            {/* Progress Bar */}
            <div className="px-4 pb-2">
              <div 
                className="h-1 bg-white/30 rounded-full cursor-pointer"
                onClick={handleSeek}
              >
                <div 
                  className="h-full bg-white rounded-full relative"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full transform scale-0 hover:scale-100 transition-transform" />
                </div>
              </div>
            </div>

            <div className="px-4 pb-4">
              <p className="text-white text-sm mb-2">{currentEpisode.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={togglePlay}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="w-6 h-6" />
                    ) : (
                      <Volume2 className="w-6 h-6" />
                    )}
                  </button>
                </div>
                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Panel */}
        {showComments && (
          <div className="absolute inset-0 bg-black/80 z-50 controls-area">
            <div className="h-full flex flex-col">
              <div className="p-4 flex items-center justify-between border-b border-gray-800">
                <h2 className="text-white text-lg font-medium">评论 ({currentEpisode.comments})</h2>
                <button 
                  onClick={() => setShowComments(false)}
                  className="text-white"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {/* Mock comments would go here */}
                <div className="text-gray-400 text-center">暂无评论</div>
              </div>
              <div className="p-4 border-t border-gray-800">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="添加评论..."
                    className="flex-1 bg-gray-800 rounded-full px-4 py-2 text-white"
                  />
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-full">
                    发送
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DramaPlayer;