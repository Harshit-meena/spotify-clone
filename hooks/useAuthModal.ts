import { create } from 'zustand';

interface AuthModalStore {
  isOpen: boolean;
  view: 'login' | 'signup'; // 🔥 NEW

  onOpen: (view: 'login' | 'signup') => void; // 🔥 UPDATED
  onClose: () => void;
}

export const useAuthModal = create<AuthModalStore>((set) => ({
  isOpen: false,
  view: 'login', // default

  onOpen: (view) => set({ isOpen: true, view }),
  onClose: () => set({ isOpen: false }),
}));