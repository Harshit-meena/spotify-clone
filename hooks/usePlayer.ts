import { create } from 'zustand';

interface PlayerStore {
  ids: string[];
  activeId: string | null;

  volume: number;

  isShuffle: boolean;

  // 🔥 repeat modes
  repeatMode: 'off' | 'one' | 'all';

  setId: (id: string | null) => void;
  setIds: (ids: string[]) => void;

  playNext: () => void;
  playPrev: () => void;

  toggleShuffle: () => void;
  toggleRepeat: () => void;

  setVolume: (volume: number) => void;

  close: () => void;
}

export const usePlayer = create<PlayerStore>((set, get) => ({
  ids: [],
  activeId: null,
  volume: 0.7,

  isShuffle: false,
  repeatMode: 'off',

  setId: (id) => set({ activeId: id }),
  setIds: (ids) => set({ ids }),

  // 🔥 NEXT
  playNext: () => {
    const { ids, activeId, isShuffle, repeatMode } = get();

    if (!ids.length || !activeId) return;

    // 🔁 REPEAT ONE
    if (repeatMode === 'one') {
      set({ activeId: null });

      setTimeout(() => {
        set({ activeId });
      }, 50);

      return;
    }

    // 🔀 SHUFFLE
    if (isShuffle) {
      const random = ids[Math.floor(Math.random() * ids.length)];
      set({ activeId: random });
      return;
    }

    const index = ids.findIndex((id) => id === activeId);
    const next = ids[index + 1];

    // 🔂 REPEAT ALL
    if (!next) {
      if (repeatMode === 'all') {
        set({ activeId: ids[0] });
      }
      return;
    }

    set({ activeId: next });
  },

  // 🔥 PREV
  playPrev: () => {
    const { ids, activeId } = get();

    if (!ids.length || !activeId) return;

    const index = ids.findIndex((id) => id === activeId);
    const prev = ids[index - 1];

    set({
      activeId: prev || ids[ids.length - 1]
    });
  },

  toggleShuffle: () =>
    set((state) => ({ isShuffle: !state.isShuffle })),

  // 🔁 cycle: off → all → one → off
  toggleRepeat: () =>
    set((state) => ({
      repeatMode:
        state.repeatMode === 'off'
          ? 'all'
          : state.repeatMode === 'all'
          ? 'one'
          : 'off'
    })),

  setVolume: (volume) => set({ volume }),

  close: () =>
    set({
      activeId: null
    })
}));