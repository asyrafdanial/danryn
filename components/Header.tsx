import React, { useState } from 'react';
import { ViewState } from '../types';
import { HeartIcon } from './Icons';

interface HeaderProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems: { id: ViewState; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'notes', label: 'Love Notes' },
    { id: 'upload', label: 'Upload' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-romantic-cream/95 backdrop-blur-sm border-b border-romantic-rose shadow-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => setView('home')}
          >
            <HeartIcon className="text-romantic-deep group-hover:text-romantic-accent transition-colors duration-300" />
            <span className="ml-2 font-hand text-2xl font-bold text-romantic-deep">
              Our Story
            </span>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden sm:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`
                  px-3 py-2 rounded-md text-sm font-serif font-medium transition-all duration-300
                  ${currentView === item.id 
                    ? 'text-romantic-deep bg-romantic-rose shadow-sm' 
                    : 'text-gray-600 hover:text-romantic-deep hover:bg-romantic-rose/50'}
                `}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-romantic-deep p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMenuOpen && (
        <div className="sm:hidden bg-romantic-cream border-t border-romantic-rose">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  setIsMenuOpen(false);
                }}
                className={`
                  block w-full text-left px-3 py-2 rounded-md text-base font-medium
                  ${currentView === item.id
                    ? 'bg-romantic-rose text-romantic-deep'
                    : 'text-gray-600 hover:bg-romantic-rose/50 hover:text-romantic-deep'}
                `}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;