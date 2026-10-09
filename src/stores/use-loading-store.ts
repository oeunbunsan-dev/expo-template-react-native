import { create } from 'zustand';

interface LoadingState {
  visible: boolean;
  label: string;
  variant: 'default' | 'dark' | 'light';
  startLoading: (label?: string, variant?: 'default' | 'dark' | 'light') => void;
  dismissLoading: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  visible: false,
  label: 'កំពុងដំណើរការ...',
  variant: 'default',

  startLoading: (label = 'កំពុងដំណើរការ...', variant = 'default') => set({
    visible: true,
    label,
    variant
  }),

  dismissLoading: () => set({
    visible: false
  }),
}));
