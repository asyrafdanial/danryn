
import { GalleryImage, LoveNote, Milestone } from '../types';

const IMAGES_KEY = 'our_love_story_images';
const NOTES_KEY = 'our_love_story_notes';
const MILESTONES_KEY = 'our_love_story_milestones';
const START_DATE_KEY = 'our_love_story_start_date';

// Helper to resize image before saving to avoid LocalStorage quota limits
export const processImageFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress to JPEG with 0.7 quality
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        } else {
          reject(new Error('Canvas context unavailable'));
        }
      };
      img.onerror = (err) => reject(err);
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  });
};

export const getImages = (): GalleryImage[] => {
  try {
    const stored = localStorage.getItem(IMAGES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load images", error);
    return [];
  }
};

export const saveImage = (image: GalleryImage): void => {
  try {
    const images = getImages();
    const updated = [image, ...images];
    localStorage.setItem(IMAGES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save image (storage full?)", error);
    alert("Storage might be full! Try deleting some old photos.");
  }
};

export const deleteImage = (id: string): void => {
  const images = getImages().filter(img => img.id !== id);
  localStorage.setItem(IMAGES_KEY, JSON.stringify(images));
};

export const getNotes = (): LoveNote[] => {
  try {
    const stored = localStorage.getItem(NOTES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
};

export const saveNote = (note: LoveNote): void => {
  const notes = getNotes();
  const updated = [note, ...notes];
  localStorage.setItem(NOTES_KEY, JSON.stringify(updated));
};

export const deleteNote = (id: string): void => {
  const notes = getNotes().filter(note => note.id !== id);
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
};

export const getMilestones = (): Milestone[] => {
  try {
    const stored = localStorage.getItem(MILESTONES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
};

export const saveMilestone = (milestone: Milestone): void => {
  const milestones = getMilestones();
  const updated = [...milestones, milestone];
  localStorage.setItem(MILESTONES_KEY, JSON.stringify(updated));
};

export const deleteMilestone = (id: string): void => {
  const milestones = getMilestones().filter(m => m.id !== id);
  localStorage.setItem(MILESTONES_KEY, JSON.stringify(milestones));
};

export const getStartDate = (): string | null => {
  return localStorage.getItem(START_DATE_KEY);
};

export const saveStartDate = (date: string): void => {
  localStorage.setItem(START_DATE_KEY, date);
};
