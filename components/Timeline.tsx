
import React, { useState, useEffect } from 'react';
import { Milestone } from '../types';
import { getMilestones, saveMilestone, deleteMilestone } from '../services/storage';
import { PlusIcon, TrashIcon, CalendarIcon } from './Icons';

const Timeline: React.FC = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ date: '', title: '', description: '' });

  useEffect(() => {
    // Load and sort milestones by date (newest first)
    const stored = getMilestones().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setMilestones(stored);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.title) return;

    const newMilestone: Milestone = {
      id: Date.now().toString(),
      date: formData.date,
      title: formData.title,
      description: formData.description
    };

    saveMilestone(newMilestone);
    setMilestones(prev => [newMilestone, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setFormData({ date: '', title: '', description: '' });
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Remove this milestone?")) {
      deleteMilestone(id);
      setMilestones(prev => prev.filter(m => m.id !== id));
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h2 className="font-serif text-3xl sm:text-4xl text-romantic-deep font-bold mb-3">Our Journey</h2>
        <p className="text-gray-600 font-sans">Every step we've taken together.</p>
      </div>

      <div className="flex justify-center mb-8">
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-romantic-mauve text-white px-5 py-2.5 rounded-full hover:bg-romantic-deep transition-all shadow-md font-bold text-sm"
        >
          {isAdding ? "Close" : "Add Milestone"}
          <PlusIcon className={isAdding ? "rotate-45 transition-transform" : "transition-transform"} size={18} />
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-12 bg-white p-6 rounded-xl shadow-lg border-l-4 border-romantic-deep animate-float">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-romantic-mauve outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
              <input
                type="text"
                required
                placeholder="e.g. First Kiss"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-romantic-mauve outline-none"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-1">Memory Details</label>
            <textarea
              placeholder="What happened that day?"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-romantic-mauve outline-none h-24 resize-none"
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-romantic-deep text-white px-6 py-2 rounded-full font-bold hover:bg-romantic-accent transition-colors">
              Save Memory
            </button>
          </div>
        </form>
      )}

      {/* Timeline Visual */}
      <div className="relative border-l-2 border-romantic-mauve ml-4 sm:ml-8 pl-8 sm:pl-12 space-y-12 pb-8">
        {milestones.length === 0 ? (
          <div className="text-gray-400 italic py-4">
            Add our first milestone above to start the timeline...
          </div>
        ) : (
          milestones.map((milestone) => (
            <div key={milestone.id} className="relative group">
              {/* Dot on line */}
              <div className="absolute -left-[41px] sm:-left-[57px] top-1 bg-romantic-cream border-4 border-romantic-deep w-5 h-5 rounded-full z-10"></div>
              
              <div className="bg-white p-6 rounded-xl shadow-md border border-romantic-rose/50 relative hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-romantic-accent font-bold font-serif text-sm uppercase tracking-wide">
                    <CalendarIcon size={14} />
                    {new Date(milestone.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <button 
                    onClick={() => handleDelete(milestone.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete milestone"
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
                
                <h3 className="font-hand text-3xl text-romantic-deep mb-2">{milestone.title}</h3>
                <p className="text-gray-600 leading-relaxed font-sans">{milestone.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Timeline;
