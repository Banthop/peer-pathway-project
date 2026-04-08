import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Raise warning threshold - 500KB is fine for a gzipped app chunk
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // Core React runtime - loads on every page, tiny, cached aggressively
          if (id.includes("node_modules/react/") ||
              id.includes("node_modules/react-dom/") ||
              id.includes("node_modules/react-router-dom/") ||
              id.includes("node_modules/react-router/")) {
            return "vendor";
          }

          // Supabase client - large, infrequently changes
          if (id.includes("node_modules/@supabase/")) {
            return "supabase";
          }

          // TanStack Query - separate from React core
          if (id.includes("node_modules/@tanstack/")) {
            return "query";
          }

          // Radix UI primitives - separate chunk so portal/webinar pages
          // don't pull in the full UI library
          if (id.includes("node_modules/@radix-ui/")) {
            return "radix";
          }

          // Icons - lucide is large (~300KB untreated), keep separate
          if (id.includes("node_modules/lucide-react/")) {
            return "icons";
          }

          // Other UI utilities (class-variance-authority, clsx, tailwind-merge, etc.)
          if (id.includes("node_modules/class-variance-authority/") ||
              id.includes("node_modules/clsx/") ||
              id.includes("node_modules/tailwind-merge/") ||
              id.includes("node_modules/cmdk/") ||
              id.includes("node_modules/sonner/") ||
              id.includes("node_modules/vaul/")) {
            return "ui-utils";
          }

          // Date/form utilities
          if (id.includes("node_modules/date-fns/") ||
              id.includes("node_modules/react-hook-form/") ||
              id.includes("node_modules/@hookform/") ||
              id.includes("node_modules/zod/")) {
            return "form-utils";
          }
        },
      },
    },
  },
}));
