import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { HeartIcon } from './Icons';

declare global {
  interface Window {
    confetti: any;
  }
}

interface HomeProps {
  setView: (view: ViewState) => void;
}

const QUOTES = [
  "In all the world, there is no heart for me like yours.",
  "You are my sun, my moon, and all my stars.",
  "Every love story is beautiful, but ours is my favorite.",
  "I love you more than yesterday, but less than tomorrow.",
  "You make my heart smile.",
  "With you, I am home."
];

const Home: React.FC<HomeProps> = ({ setView }) => {
  const [showSurprise, setShowSurprise] = useState(false);
  const [quote, setQuote] = useState("");

  const handleSurprise = () => {
    // Select random quote
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setQuote(randomQuote);
    setShowSurprise(true);

    // Trigger confetti
    if (window.confetti) {
      window.confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F8E6EE', '#D8A3C7', '#7B3E5B']
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="animate-float mb-8">
        <HeartIcon className="text-romantic-deep w-24 h-24 sm:w-32 sm:h-32 drop-shadow-lg" />
      </div>

      <h1 className="font-hand text-5xl sm:text-7xl text-romantic-deep mb-6">
        Welcome, My Love
      </h1>

      <p className="font-serif text-lg sm:text-xl text-gray-700 max-w-lg mb-10 leading-relaxed">
        I built this little corner of the internet just for us. A place to keep our memories, our notes, and the little moments that make life sweet.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleSurprise}
          className="bg-romantic-deep text-romantic-cream px-8 py-4 rounded-full font-serif font-bold text-lg shadow-lg hover:bg-romantic-accent hover:scale-105 transition-all duration-300 ring-4 ring-romantic-rose"
        >
          Click for a Surprise
        </button>
        
        <button
          onClick={() => setView('gallery')}
          className="bg-white text-romantic-deep border-2 border-romantic-deep px-8 py-4 rounded-full font-serif font-bold text-lg shadow-md hover:bg-romantic-rose hover:scale-105 transition-all duration-300"
        >
          View Our Gallery
        </button>
      </div>

      {/* Surprise Modal */}
      {showSurprise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full relative transform transition-all scale-100">
            <button 
              onClick={() => setShowSurprise(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-romantic-deep"
            >
              <span className="text-2xl">&times;</span>
            </button>
            
            <div className="text-center py-6">
              <HeartIcon className="w-12 h-12 text-romantic-accent mx-auto mb-4 animate-pulse-slow" />
              <h3 className="font-hand text-3xl text-romantic-deep mb-4">I Love You!</h3>
              <p className="font-serif text-xl italic text-gray-700">
                "{quote}"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;