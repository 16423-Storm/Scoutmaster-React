import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
    plugins: [
        react(),
        svgr({
            include: "**/*.svg?react",
        }),
        cloudflare({ viteEnvironment: { name: "worker" } }),
    ],
    base: "/",
    build: {
        sourcemap: false,
    },
});
