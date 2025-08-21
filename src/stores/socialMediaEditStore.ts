import { create } from 'zustand';

interface GeneratedPost {
  imageUrls: string[];
  caption: string;
  hashtags: string;
  bestTime: string;
}

interface SocialMediaEditState {
  // Current image being edited
  currentImage: string | null;
  
  // Generated post data
  originalPost: GeneratedPost | null;
  
  // Edit flow state
  isEditing: boolean;
  currentImageIndex: number;
  
  // Actions
  startEdit: (imageUrl: string, imageIndex: number, postData: GeneratedPost) => void;
  updateCurrentImage: (imageUrl: string) => void;
  finishEdit: () => void;
  clearEditState: () => void;
}

export const useSocialMediaEditStore = create<SocialMediaEditState>((set) => ({
  currentImage: null,
  originalPost: null,
  isEditing: false,
  currentImageIndex: 0,

  startEdit: (imageUrl: string, imageIndex: number, postData: GeneratedPost) => {
    set({
      currentImage: imageUrl,
      currentImageIndex: imageIndex,
      originalPost: postData,
      isEditing: true,
    });
  },

  updateCurrentImage: (imageUrl: string) => {
    set((state) => {
      if (!state.originalPost) return state;
      
      const updatedImageUrls = [...state.originalPost.imageUrls];
      updatedImageUrls[state.currentImageIndex] = imageUrl;
      
      return {
        currentImage: imageUrl,
        originalPost: {
          ...state.originalPost,
          imageUrls: updatedImageUrls,
        },
      };
    });
  },

  finishEdit: () => {
    set({
      isEditing: false,
      currentImage: null,
    });
  },

  clearEditState: () => {
    set({
      currentImage: null,
      originalPost: null,
      isEditing: false,
      currentImageIndex: 0,
    });
  },
}));