import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Base public path when served in production
  base: '/',
  
  // Build configuration
  build: {
    // Output directory for the build
    outDir: 'dist',
    // Generate source maps for better debugging
    sourcemap: mode === 'development',
    // Clean the output directory before building
    emptyOutDir: true,
    // Minify the output
    minify: 'esbuild',
    // Target modern browsers
    target: 'esnext',
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Configure rollup options
    rollupOptions: {
      output: {
        // Split vendor and app code
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'react-icons'],
          'utils': ['axios', 'date-fns', 'dompurify'],
        },
        // Enable better chunking
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    // Disable large chunk warnings
    chunkSizeWarningLimit: 1000,
  },

  // Development server configuration
  server: {
    port: 3000,
    open: true,
    host: true,
    strictPort: true,
    // Enable HMR
    hmr: {
      overlay: true,
    },
  },

  // Preview server configuration
  preview: {
    port: 4173,
    host: true,
    strictPort: true,
  },

  // Plugin configuration
  plugins: [
    // React plugin for Vite
    react({
      // Enable Fast Refresh
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    
    // Visualize bundle size (only in analyze mode)
    mode === 'analyze' && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
    
    // PWA support
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'AI RecSys',
        short_name: 'AI RecSys',
        description: 'AI Recommendation System',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ].filter(Boolean),

  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'react-icons',
      'axios',
      'date-fns',
      'dompurify',
    ],
    // Enable esbuild optimizations
    esbuildOptions: {
      target: 'esnext',
    },
  },

  // Resolve configuration
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // CSS configuration
  css: {
    devSourcemap: true,
    modules: {
      // Enable CSS modules
      localsConvention: 'camelCaseOnly',
    },
  },
}));
