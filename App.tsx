import React, { useState } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import Gallery from './components/Gallery';
import Upload from './components/Upload';
import LoveNotes from './components/LoveNotes';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home setView={setCurrentView} />;
      case 'gallery':
        return <Gallery onNavigateUpload={() => setCurrentView('upload')} />;
      case 'upload':
        return <Upload setView={setCurrentView} />;
      case 'notes':
        return <LoveNotes />;
      default:
        return <Home setView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-romantic-cream text-gray-800 font-sans selection:bg-romantic-mauve selection:text-white">
      <Header currentView={currentView} setView={setCurrentView} />
      <main className="container mx-auto pb-12 animate-fade-in">
        {renderView()}
      </main>
      
      <footer className="py-6 text-center text-romantic-deep/60 text-sm font-serif">
        <p>&copy; {new Date().getFullYear()} Made with ❤️ for you</p>
      </footer>
    </div>
  );
};

export default App;