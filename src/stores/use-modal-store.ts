import React from 'react';
import { create } from 'zustand';

// ១. កំណត់ Interface សម្រាប់ Zustand Store
interface ModalState {
  visible: boolean;
  children: React.ReactNode | null;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}

// ២. បង្កើត Store
export const useModalStore = create<ModalState>((set) => ({
  visible: false,
  children: null,

  // អនុគមន៍សម្រាប់បើក Modal និងបោះ Content UI មកបង្ហាញ
  openModal: (content) => set({
    visible: true,
    children: content
  }),

  // អនុគមន៍សម្រាប់បិទ Modal
  closeModal: () => set({
    visible: false,
    // កុំទាន់អាលលុប children ចោលភ្លាមៗ ដើម្បីទុកពេលឱ្យចលនា fade បិទចប់សិន
    // អ្នកអាចលុបវាចោលពេលបិទចប់ក្នុង setTimeout បើចង់បាន clean memory
  }),
}));
