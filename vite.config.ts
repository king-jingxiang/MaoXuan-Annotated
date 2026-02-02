import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
const isGithubActions = process.env.GITHUB_ACTIONS === "true";

export default defineConfig({
  base: '/MaoXuan-Annotated/',
  publicDir: isGithubActions ? false : "public",
  build: {
    sourcemap: 'hidden',
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    tsconfigPaths()
  ],
})
