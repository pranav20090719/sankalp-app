import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Import the path module

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Explicitly define the build options
  build: {
    // Specify the base public path for the assets (defaults to '/')
    // If your app is hosted at a sub-path (e.g., yourdomain.com/my-app/),
    // you would set this to '/my-app/'
    // For general deployment, '/' is usually fine.
    base: '/',

    // Rollup options for fine-grained control over the build process
    rollupOptions: {
      // Define the entry point for your application.
      // Vite typically expects your HTML file in the public directory,
      // but explicitly setting it can help resolve detection issues.
      input: {
        main: path.resolve(__dirname, 'public/index.html')
      }
    },
    // The directory where Vite will output the production build files
    outDir: 'dist', // This is the default, but explicitly stating it is clear
  },
});
