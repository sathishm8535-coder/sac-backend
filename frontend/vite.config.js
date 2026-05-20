import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: { enabled: false },

      manifest: {
        name: 'SAC Net Exam',
        short_name: 'SAC Exam',
        description: 'Online Examination Management System - Sadakathullah Appa College',
        start_url: '/',
        display: 'standalone',
        theme_color: '#4f46e5',
        background_color: '#ffffff',
        icons: [
          {
            src: '/Assest/sadak1.jpg',
            sizes: '192x192',
            type: 'image/jpeg',
            purpose: 'any'
          },
          {
            src: '/Assest/sadak1.jpg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'any'
          },
          {
            src: '/Assest/sadak1.jpg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'maskable'
          }
        ]
      },

      workbox: {
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/, /^https:\/\/sac-backend/],
        runtimeCaching: [
          {
            urlPattern: ({ request, url }) =>
              request.mode === 'navigate' &&
              !url.hostname.includes('onrender.com'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache-v1',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 10, maxAgeSeconds: 86400 }
            }
          },
          {
            urlPattern: ({ url }) =>
              /\.(js|css)$/.test(url.pathname) &&
              !url.hostname.includes('onrender.com'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'assets-cache-v1',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 50, maxAgeSeconds: 86400 }
            }
          },
          {
            urlPattern: ({ url }) =>
              /\.(png|jpg|jpeg|svg|gif|ico|webp)$/.test(url.pathname) &&
              !url.hostname.includes('onrender.com'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache-v1',
              expiration: { maxEntries: 30, maxAgeSeconds: 604800 }
            }
          }
        ],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true
      }
    })
  ],
  server: {
    port: 3000,
    strictPort: true,
    host: true
  }
});
