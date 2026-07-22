import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Относительный путь — сайт будет работать по адресу вида
  // https://<username>.github.io/<repo-name>/ независимо от названия репозитория.
  base: './',
  plugins: [react()],
})
