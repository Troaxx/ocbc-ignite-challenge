import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import istanbul from 'vite-plugin-istanbul'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    istanbul({
      include: 'src/*',
      exclude: ['node_modules', 'tests/'],
      extension: ['.js', '.jsx'],
      requireEnv: false,
      forceBuildInstrument: true
    }),
    {
      name: 'serve-test-results',
      configureServer(server) {
        server.middlewares.use('/test-results', (req, res, next) => {
          try {
            const filePath = resolve(__dirname, 'test-results', req.url.replace(/^\//, ''))
            const content = readFileSync(filePath)
            
            const ext = filePath.split('.').pop().toLowerCase()
            const contentTypeMap = {
              'json': 'application/json',
              'png': 'image/png',
              'jpg': 'image/jpeg',
              'jpeg': 'image/jpeg',
              'gif': 'image/gif',
              'webp': 'image/webp',
              'svg': 'image/svg+xml',
              'mp4': 'video/mp4',
              'webm': 'video/webm',
              'zip': 'application/zip',
              'txt': 'text/plain',
              'har': 'application/json'
            }
            
            const contentType = contentTypeMap[ext] || 'application/octet-stream'
            res.setHeader('Content-Type', contentType)
            
            if (ext === 'json' || ext === 'txt' || ext === 'har') {
              res.end(content.toString('utf-8'))
            } else {
              res.end(content)
            }
          } catch (err) {
            next()
          }
        })
      }
    }
  ],
  server: {
    fs: {
      allow: ['..']
    }
  },
  publicDir: 'public'
})
