import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Demo dev server / demo build, plus the vitest config. The library is built
// by vite.config.lib.js.
export default defineConfig({
    plugins: [react()],
    // GitHub Pages serves the demo from a repo subpath.
    base: process.env.GITHUB_ACTIONS ? '/react-anagram-animation/' : '/',
    test: {
        environment: 'jsdom',
        globals: false,
        include: ['src/**/*.test.{js,jsx}'],
    },
});
