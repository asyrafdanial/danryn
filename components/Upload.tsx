import React, { useState, useRef } from 'react';
import { ViewState, GalleryImage } from '../types';
import { processImageFile, saveImage } from '../services/storage';
import { UploadIcon, XIcon } from './Icons';

interface UploadProps {
  setView: (view: ViewState) => void;
}

const Upload: React.FC<UploadProps> = ({ setView }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    
    setIsProcessing(true);
    try {
      const base64 = await processImageFile(file);
      setPreview(base64);
    } catch (error) {
      alert("Failed to process image. Please try another one.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSave = () => {
    if (!preview) return;

    const newImage: GalleryImage = {
      id: Date.now().toString(),
      dataUrl: preview,
      caption: caption.trim(),
      date: new Date().toISOString()
    };

    saveImage(newImage);
    setView('gallery');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h2 className="font-serif text-3xl text-romantic-deep font-bold text-center mb-8">Add to Our Collection</h2>
      
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-romantic-rose">
        {!preview ? (
          <div 
            className={`
              border-3 border-dashed rounded-xl p-12 text-center transition-all duration-300
              ${isDragging ? 'border-romantic-deep bg-romantic-rose/20 scale-[1.02]' : 'border-romantic-mauve hover:border-romantic-deep hover:bg-gray-50'}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleChange}
              accept="image/*"
              className="hidden"
            />
            <div className="flex flex-col items-center gap-4">
              <div className="bg-romantic-rose p-4 rounded-full">
                <UploadIcon className="w-8 h-8 text-romantic-deep" />
              </div>
              <div>
                <p className="font-bold text-lg text-gray-700">Click or drag photo here</p>
                <p className="text-sm text-gray-500 mt-1">Supports JPG, PNG</p>
              </div>
            </div>
            {isProcessing && <p className="mt-4 text-romantic-deep font-medium animate-pulse">Processing image...</p>}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative rounded-xl overflow-hidden shadow-md bg-gray-100 max-h-[400px] flex items-center justify-center">
              <img src={preview} alt="Preview" className="max-w-full max-h-[400px] object-contain" />
              <button 
                onClick={() => { setPreview(null); setCaption(''); }}
                className="absolute top-3 right-3 bg-white/80 p-2 rounded-full text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <XIcon size={20} />
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 ml-1">Caption (Optional)</label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="What is this memory about?"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-romantic-mauve focus:border-romantic-mauve outline-none transition-all"
                autoFocus
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setPreview(null)}
                className="flex-1 px-6 py-3 rounded-full border border-gray-300 font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 rounded-full bg-romantic-deep text-white font-bold shadow-lg hover:bg-romantic-accent transition-all transform hover:scale-[1.02]"
              >
                Save to Gallery
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;