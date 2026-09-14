import { copyFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The types are hand-written rather than generated, so they just need copying
// into the published output. Doing it here keeps the build a single command
// and avoids a cross-platform shell one-liner in package.json.
const copyTypes = () => ({
    name: 'copy-types',
    closeBundle() {
        copyFileSync('src/lib/index.d.ts', 'dist/index.d.ts');
    },
});

// Library build only. vite.config.js stays the demo's config so neither build
// entangles the other.
export default defineConfig({
    plugins: [react(), copyTypes()],
    build: {
        // es2020 transpiles and polyfills nothing here: the source needs only
        // string iteration, Array.sort, Promise.all and object spread. This
        // puts the floor at Chrome 80 / Firefox 74 / Safari 13.1 / Edge 80,
        // all shipped by March 2020 and below what React 19 itself supports.
        target: 'es2020',
        minify: false, // consumers minify; a readable dist aids debugging
        sourcemap: true,
        lib: {
            entry: 'src/lib/index.js',
            formats: ['es', 'cjs'],
            // .mjs/.cjs rather than index.js + index.cjs, so there is no
            // dist/index.js at all. Anyone still deep-requiring the old path
            // gets an honest MODULE_NOT_FOUND instead of a SyntaxError.
            fileName: (format) => (format === 'es' ? 'index.mjs' : 'index.cjs'),
        },
        rollupOptions: {
            // Regex, not string literals, so react/jsx-runtime and
            // react-dom/client stay external too.
            external: [/^react($|\/)/, /^react-dom($|\/)/],
            output: {
                // The entry has both a default and a named export, so CJS
                // consumers use require('...').default. That is the same shape
                // the old Babel build produced; declaring it silences Rollup's
                // MIXED_EXPORTS warning.
                exports: 'named',
            },
        },
    },
});
