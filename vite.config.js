import { defineConfig } from 'vite'

export default defineConfig({
  // Define env variables as constants for build-time embedding
  define: {
    'process.env.NEXT_PUBLIC_SANITY_PROJECT_ID': JSON.stringify('u9m27k7u'),
    'process.env.NEXT_PUBLIC_SANITY_DATASET': JSON.stringify('production'),
  },
  server: {
    host: true,
    allowedHosts: ['duetnightabyss.gachabuild.com', 'localhost', '127.0.0.1'],
    hmr: {
      host: 'duetnightabyss.gachabuild.com',
      clientPort: 443,
      protocol: 'wss',
    },
  },
})

