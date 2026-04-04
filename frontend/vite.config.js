import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',       // auto skipWaiting + clientsClaim
      injectRegister: false,            // we register manually in main.jsx for reload control
      devOptions: { enabled: false },   // disabled in dev mode

      manifest: {
        name: 'Exam Management System',
        short_name: 'ExamSystem',
        description: 'Online Examination Management System - Sadakathullah Appa College',
        start_url: '/',
        display: 'standalone',
        theme_color: '#4f46e5',
        background_color: '#ffffff',
        icons: [
          {
            src: '/sadak1.jpg',
            sizes: '192x192',
            type: 'image/jpeg',
            purpose: 'any maskable'
          },
          {
            src: '/sadak1.jpg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'any maskable'
          }
        ]
      },

      workbox: {
        // Network-first for all navigation and API requests
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/],

        runtimeCaching: [
          {
            // Network-first for HTML pages
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache-v1',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 10, maxAgeSeconds: 86400 }
            }
          },
          {
            // Network-first for JS/CSS assets
            urlPattern: /\.(js|css)$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'assets-cache-v1',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 50, maxAgeSeconds: 86400 }
            }
          },
          {
            // Cache-first only for images (rarely change)
            urlPattern: /\.(png|jpg|jpeg|svg|gif|ico|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache-v1',
              expiration: { maxEntries: 30, maxAgeSeconds: 604800 }
            }
          }
        ],

        // Auto-delete old caches on activation
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
