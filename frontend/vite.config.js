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
        // Only cache same-origin requests — never touch the backend domain
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.origin === self.location.origin &&
              /\.(js|css)$/.test(url.pathname),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'assets-cache-v1',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 50, maxAgeSeconds: 86400 }
            }
          },
          {
            urlPattern: ({ url }) =>
              url.origin === self.location.origin &&
              /\.(png|jpg|jpeg|svg|gif|ico|webp)$/.test(url.pathname),
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
