import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Define the root directory for Vite. By default, it's the project root,
  // but explicitly setting it can sometimes help resolve indexing issues.
  // This tells Vite where to find your 'index.html' and 'src' folder.
  root: process.cwd(), // Uses the current working directory as the root

  build: {
    // Defines the base URL for the deployed assets.
    // '/' is correct for deploying to the root of a domain (e.g., sankalp-sanatanam.vercel.app/)
    base: '/',

    // The directory where Vite will output the production build files.
    // This will be 'sankalp-app/dist'
    outDir: 'dist',

    // Essential Rollup options for configuring the build process.
    // We explicitly tell Rollup (Vite's underlying bundler) that 'public/index.html'
    // is the primary entry point for the application. This ensures it's processed.
    rollupOptions: {
      input: {
        main: path.resolve(process.cwd(), 'public/index.html')
      }
    },
    // Specify the public directory, which Vite will use for static assets
    // and where it expects to find index.html if not specified in input
    publicDir: 'public',
  },
});

