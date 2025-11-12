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
            const content = readFileSync(filePath, 'utf-8')
            res.setHeader('Content-Type', 'application/json')
            res.end(content)
          } catch (err) {
            next()
          }
        })
      }
    },
    {
      name: 'serve-coverage',
      configureServer(server) {
        server.middlewares.use('/coverage', (req, res, next) => {
          try {
            const filePath = resolve(__dirname, 'coverage', req.url.replace(/^\//, ''))
            const content = readFileSync(filePath, 'utf-8')
            
            if (req.url.endsWith('.info')) {
              res.setHeader('Content-Type', 'text/plain')
            } else if (req.url.endsWith('.json')) {
              res.setHeader('Content-Type', 'application/json')
            } else {
              res.setHeader('Content-Type', 'text/html')
            }
            
            res.end(content)
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
