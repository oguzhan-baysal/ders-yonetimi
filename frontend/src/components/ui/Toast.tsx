'use client';

import { Toaster } from 'react-hot-toast';
import { toast as hotToast } from 'react-hot-toast';

interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

const defaultOptions: ToastOptions = {
  duration: 3000,
  position: 'top-right',
};

export const toast = {
  success: (message: string, options?: ToastOptions) => {
    hotToast.success(message, { ...defaultOptions, ...options });
  },
  error: (message: string, options?: ToastOptions) => {
    hotToast.error(message, { ...defaultOptions, ...options });
  },
  info: (message: string, options?: ToastOptions) => {
    hotToast(message, { ...defaultOptions, ...options });
  },
};

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        duration: 3000,
        style: {
          background: '#fff',
          color: '#363636',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#4F46E5',
            secondary: '#fff',
          },
        },
        error: {
          duration: 3000,
          iconTheme: {
            primary: '#EF4444',
            secondary: '#fff',
          },
        },
      }}
    />
  );
} 