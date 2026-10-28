// TypeScript 5.3+ is required for the CommonJS declaration bridge to Vite's ESM types.
import type Alias from 'vite-plugin-alias' with { 'resolution-mode': 'import' }

declare const alias: typeof Alias
export = alias
