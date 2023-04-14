import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Alias from 'vite-plugin-alias'
import Inspect from 'vite-plugin-inspect'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Inspect(),
    Alias({
      useTypescript: true,
    }),
  ],
})
