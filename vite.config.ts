import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

// reconstruir __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        login: resolve(__dirname, 'index.html'),
        recuperarPassword: resolve(__dirname, 'src/pages/recuperar-password/index.html'),
        home: resolve(__dirname, 'src/pages/home/index.html'),
        materias: resolve(__dirname, 'src/pages/materias/index.html'),
      }
    }
  }
})
