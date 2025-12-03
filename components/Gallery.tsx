import React, { useState, useEffect } from 'react';
import { GalleryImage } from '../types';
import { getImages, deleteImage } from '../services/storage';
import { TrashIcon, XIcon, PlusIcon } from './Icons';

interface GalleryProps {
  onNavigateUpload: () => void;
}

const Gallery: React.FC<GalleryProps> = ({ onNavigateUpload }) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    setImages(getImages());
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this memory?")) {
      deleteImage(id);
      setImages(prev => prev.filter(img => img.id !== id));
      if (selectedImage?.id === id) setSelectedImage(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-serif text-3xl sm:text-4xl text-romantic-deep font-bold">Our Memories</h2>
        <button
          onClick={onNavigateUpload}
          className="flex items-center gap-2 bg-romantic-mauve text-white px-4 py-2 rounded-full hover:bg-romantic-deep transition-colors shadow-sm"
        >
          <PlusIcon size={20} />
          <span>Add New</span>
        </button>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-20 bg-white/50 rounded-xl border-2 border-dashed border-romantic-mauve">
          <p className="font-serif text-xl text-gray-500 mb-4">No photos yet.</p>
          <button 
            onClick={onNavigateUpload}
            className="text-romantic-deep font-bold hover:underline"
          >
            Upload the first memory
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div 
              key={img.id}
              onClick={() => setSelectedImage(img)}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl shadow-md bg-white"
            >
              <img 
                src={img.dataUrl} 
                alt={img.caption} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              
              {/* Caption Overlay on Hover */}
              {img.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-xs sm:text-sm font-medium truncate">{img.caption}</p>
                </div>
              )}

              {/* Delete Button */}
              <button 
                onClick={(e) => handleDelete(e, img.id)}
                className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                title="Delete"
              >
                <TrashIcon size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
            onClick={() => setSelectedImage(null)}
          >
            <XIcon size={32} />
          </button>
          
          <div 
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center" 
            onClick={e => e.stopPropagation()}
          >
            <img 
              src={selectedImage.dataUrl} 
              alt={selectedImage.caption} 
              className="max-w-full max-h-[80vh] rounded-lg shadow-2xl" 
            />
            {selectedImage.caption && (
              <div className="mt-4 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full text-white font-serif text-lg">
                {selectedImage.caption}
              </div>
            )}
            <div className="mt-2 text-white/50 text-sm font-sans">
              Added on {new Date(selectedImage.date).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;