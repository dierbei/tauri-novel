// import React from 'react';

const SplashScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center px-4">
      <div className="text-center mb-20">
        <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          爱看免费小说
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          海量小说免费看
        </p>
      </div>
      
      <div className="w-full max-w-sm">
        <div className="relative">
          <div className="h-1 bg-orange-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 dark:bg-orange-400 rounded-full w-full animate-[loading_3s_linear]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;