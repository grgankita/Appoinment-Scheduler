import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

//vite.dev/config/
// https:
// export default defineConfig({
//   plugins: [react()],
//   server: { port: 5173 },
// });

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:4001",
        changeOrigin: true,
        // secure: false,
      },
    },
  },
});
