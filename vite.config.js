import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'The Miwa - Pesan Dulu Jemput Nanti',
        short_name: 'The Miwa',
        description: 'Aplikasi pemesanan resmi The Miwa. Segar, Cepat, Tanpa Antri.',
        theme_color: '#F59E0B', // Warna Amber Utama Kita
        background_color: '#ffffff',
        display: 'standalone', // Agar tampilan full screen tanpa bar browser
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png', // Kita akan siapkan icon ini di langkah 3
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png', // Kita akan siapkan icon ini di langkah 3
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})