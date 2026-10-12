import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // atualiza automaticamente quando houver push
      injectRegister: 'auto',
      devOptions: {
        enabled: false,
        type: 'module',
      },
      includeAssets: ['logo-192.png', 'logo-512.png', 'logo-1280-720.png', 'logo-720-1280.png' ], // arquivos públicos para cache
      manifest: {
        name: 'Agenda musical',
        short_name: 'Agenda musical',
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
            // Regra específica para o ping: SEMPRE rede, NUNCA cache
            urlPattern: ({ url }) => url.pathname.includes('/ping'),
            handler: 'NetworkOnly', 
          },
          {
            urlPattern: /^https?.*/,
            // Private API responses must not survive account or tenant changes.
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],
});
