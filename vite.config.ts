import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // atualiza automaticamente quando houver push
      includeAssets: ['logo-192.png', 'logo-512.png', 'logo-1280x720.png', 'logo-720x1280.png' ], // arquivos públicos para cache
      manifest: {
        name: 'Ministério de louvor Manancial',
        short_name: 'Min. Manancial',
        description: 'Aplicativo para gerenciar escalas e músicas',
        theme_color: '#00bfff',
        background_color: '#000',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/logo-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/logo-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        screenshots: [
          {
            src: '/logo-1280-720.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide'
          },
          {
            src: '/logo-720-1280.png',
            sizes: '720x1280',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https?.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'offline-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 dias
              },
            },
          },
        ],
      },
    }),
  ],
});
