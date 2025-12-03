
import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { HeartIcon } from './Icons';
import { getStartDate, saveStartDate } from '../services/storage';

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
  const [startDate, setStartDate] = useState<string | null>(null);
  const [timeTogether, setTimeTogether] = useState<{days: number, years: number, months: number} | null>(null);
  const [isEditingDate, setIsEditingDate] = useState(false);

  useEffect(() => {
    const savedDate = getStartDate();
    if (savedDate) {
      setStartDate(savedDate);
    }
  }, []);

  useEffect(() => {
    if (startDate) {
      const calculateTime = () => {
        const start = new Date(startDate);
        const now = new Date();
        
        let years = now.getFullYear() - start.getFullYear();
        let months = now.getMonth() - start.getMonth();
        let days = now.getDate() - start.getDate();

        if (days < 0) {
          months--;
          days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        }
        if (months < 0) {
          years--;
          months += 12;
        }
        setTimeTogether({ years, months, days });
      };

      calculateTime();
      const timer = setInterval(calculateTime, 1000 * 60 * 60); // Update every hour
      return () => clearInterval(timer);
    }
  }, [startDate]);

  const handleDateSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const date = formData.get('startDate') as string;
    if (date) {
      saveStartDate(date);
      setStartDate(date);
      setIsEditingDate(false);
    }
  };

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
      <div className="animate-float mb-8 mt-4">
        <HeartIcon className="text-romantic-deep w-24 h-24 sm:w-32 sm:h-32 drop-shadow-lg" />
      </div>

      <h1 className="font-hand text-5xl sm:text-7xl text-romantic-deep mb-4">
        Welcome, My Love
      </h1>

      {/* Relationship Counter */}
      <div className="mb-8 p-4 bg-white/50 rounded-xl border border-romantic-rose/50 backdrop-blur-sm max-w-md w-full">
        {!startDate || isEditingDate ? (
          <form onSubmit={handleDateSave} className="flex flex-col gap-2 items-center">
            <label className="text-sm font-serif text-gray-600">When did our story begin?</label>
            <div className="flex gap-2">
              <input 
                name="startDate"
                type="date" 
                defaultValue={startDate || ''}
                className="px-3 py-1 rounded border border-romantic-mauve focus:outline-none focus:ring-2 focus:ring-romantic-deep text-gray-700 bg-white"
                required
              />
              <button type="submit" className="bg-romantic-deep text-white px-3 py-1 rounded text-sm hover:bg-romantic-accent transition">Save</button>
              {isEditingDate && startDate && (
                <button type="button" onClick={() => setIsEditingDate(false)} className="text-gray-500 text-sm hover:text-gray-700">Cancel</button>
              )}
            </div>
          </form>
        ) : (
          <div onClick={() => setIsEditingDate(true)} className="cursor-pointer group relative" title="Click to edit date">
            <p className="font-serif text-gray-600 mb-1">We have been falling in love for</p>
            <div className="font-serif text-2xl sm:text-3xl text-romantic-deep font-bold flex gap-4 justify-center items-baseline">
              {timeTogether && (
                <>
                  <span className="flex flex-col items-center">
                    {timeTogether.years} <span className="text-xs font-normal text-gray-500 uppercase tracking-wider">Years</span>
                  </span>
                  <span className="flex flex-col items-center">
                    {timeTogether.months} <span className="text-xs font-normal text-gray-500 uppercase tracking-wider">Months</span>
                  </span>
                  <span className="flex flex-col items-center">
                    {timeTogether.days} <span className="text-xs font-normal text-gray-500 uppercase tracking-wider">Days</span>
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

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
          onClick={() => setView('timeline')}
          className="bg-white text-romantic-deep border-2 border-romantic-deep px-8 py-4 rounded-full font-serif font-bold text-lg shadow-md hover:bg-romantic-rose hover:scale-105 transition-all duration-300"
        >
          View Our Timeline
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
