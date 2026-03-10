import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Vite configuration for the camiloavila.dev frontend.
 *
 * Build output goes to `dist/` — this folder is synced to the S3 frontend
 * bucket by the GitHub Actions deploy.yml pipeline.
 *
 * The `/api` proxy is active only in local development (npm run dev).
 * In production, VITE_API_URL points directly to the API Gateway URL.
 *
 * Environment variables:
 *   VITE_API_URL — API Gateway base URL (set in GitHub Actions, or .env.local)
 *                  Example: https://abc123.execute-api.us-east-1.amazonaws.com/prod
 */
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
        },
      },
    },
  },
  server: {
    port: 5173,
    // Proxy /api/* to the local SAM `sam local start-api` server during development
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
