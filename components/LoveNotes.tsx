import React, { useState, useEffect } from 'react';
import { LoveNote } from '../types';
import { getNotes, saveNote, deleteNote } from '../services/storage';
import { TrashIcon, PlusIcon } from './Icons';

// Sticky note colors
const COLORS = [
  'bg-yellow-100',
  'bg-pink-100',
  'bg-blue-100',
  'bg-green-100',
  'bg-purple-100',
  'bg-orange-100'
];

const LoveNotes: React.FC = () => {
  const [notes, setNotes] = useState<LoveNote[]>([]);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    setNotes(getNotes());
  }, []);

  const handleAddNote = () => {
    if (!newNoteContent.trim()) return;

    const newNote: LoveNote = {
      id: Date.now().toString(),
      content: newNoteContent.trim(),
      date: new Date().toISOString(),
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    };

    saveNote(newNote);
    setNotes([newNote, ...notes]);
    setNewNoteContent('');
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this note?")) {
      deleteNote(id);
      setNotes(prev => prev.filter(n => n.id !== id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h2 className="font-serif text-3xl sm:text-4xl text-romantic-deep font-bold mb-3">Love Notes</h2>
        <p className="text-gray-600 font-sans">Little thoughts, big feelings.</p>
      </div>

      {/* Input Area */}
      {isCreating ? (
        <div className="max-w-md mx-auto mb-10 bg-white p-6 rounded-xl shadow-lg border border-romantic-rose animate-fade-in">
          <textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Write something sweet..."
            className="w-full h-32 p-3 border-none focus:ring-0 text-lg font-hand text-gray-800 resize-none bg-transparent placeholder-gray-400"
            autoFocus
          />
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
            <button 
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
            <button 
              onClick={handleAddNote}
              disabled={!newNoteContent.trim()}
              className="bg-romantic-deep text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-romantic-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Post Note
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center mb-10">
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-romantic-deep text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-romantic-accent hover:scale-105 transition-all"
          >
            <PlusIcon size={20} />
            Write a Note
          </button>
        </div>
      )}

      {/* Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.length === 0 && !isCreating ? (
          <div className="col-span-full text-center py-10 opacity-60">
            <p className="font-serif italic text-xl">The pages are empty... start writing our story.</p>
          </div>
        ) : (
          notes.map((note) => (
            <div 
              key={note.id}
              className={`
                ${note.color} p-6 rounded-sm shadow-md rotate-1 hover:rotate-0 transition-transform duration-300 relative group min-h-[200px] flex flex-col
              `}
              style={{
                boxShadow: '2px 4px 8px rgba(0,0,0,0.1)'
              }}
            >
              <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 w-32 h-8 bg-yellow-200/50 rotate-[-2deg] opacity-70"></div>
              
              <p className="font-hand text-2xl text-gray-800 whitespace-pre-wrap flex-grow leading-relaxed">
                {note.content}
              </p>
              
              <div className="flex justify-between items-end mt-4 pt-4 border-t border-black/5">
                <span className="text-xs font-sans text-gray-500">
                  {new Date(note.date).toLocaleDateString()}
                </span>
                <button 
                  onClick={() => handleDelete(note.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <TrashIcon size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LoveNotes;