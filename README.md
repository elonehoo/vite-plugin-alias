# vite-plugin-alias

Alias auto generation for Vite.

## Install

```bash
#npm
npm install --save-dev vite-plugin-alias

# yarn
yarn add --dev vite-plugin-alias

# pnpm
pnpm install --save-dev vite-plugin-alias
```

## Usage

Add it to `vite.config.js`

```ts
// vite.config.ts
import Alias from 'vite-plugin-alias'

export default {
  plugins: [
    Alias()
  ]
}
```
