'use client';

import { useEffect } from 'react';

export const useBackground = (imageUrl?: string) => {
  useEffect(() => {
    if (!imageUrl) return;

    document.body.style.background = `
      linear-gradient(to bottom, rgba(0,0,0,0.6), black),
      url(${imageUrl})
    `;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
  }, [imageUrl]);
};