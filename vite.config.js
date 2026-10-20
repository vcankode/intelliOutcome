
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
        teacherLogin: resolve(process.cwd(), 'teacher_login.html'),
      },
    },
  },
})
