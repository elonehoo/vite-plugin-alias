import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Alias from 'vite-plugin-alias'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Alias({
      useConfig:true,
      useTypescript: true,
    })
  ],
})
