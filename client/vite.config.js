import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), nodePolyfills()],
    define: {
        "process.env": {},
    },
    // Add the build configuration here to silence the warning
    build: {
        rollupOptions: {
            onwarn(warning, warn) {
                // Suppress specific warning for 'use client' directives
                if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
                    return;
                }
                // Pass other warnings through
                warn(warning);
            },
        },
    },
});