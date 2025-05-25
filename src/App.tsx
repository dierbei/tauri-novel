import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navigation from './components/Navigation';

// Import pages
const Home = React.lazy(() => import('./pages/Home'));
const Library = React.lazy(() => import('./pages/Library'));
const Drama = React.lazy(() => import('./pages/Drama'));
const DramaPlayer = React.lazy(() => import('./pages/DramaPlayer'));
const Settings = React.lazy(() => import('./pages/Settings'));
const NovelDetail = React.lazy(() => import('./pages/NovelDetail'));
const Reader = React.lazy(() => import('./pages/Reader'));
const Search = React.lazy(() => import('./pages/Search'));

function App() {
  return (
    <Router>
      <AppProvider>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
          <React.Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/library" element={<Library />} />
              <Route path="/drama" element={<Drama />} />
              <Route path="/drama/:id" element={<DramaPlayer />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/novel/:id" element={<NovelDetail />} />
              <Route path="/novel/:id/chapter/:chapterId" element={<Reader />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </React.Suspense>
          <Navigation />
        </div>
      </AppProvider>
    </Router>
  );
}

export default App;