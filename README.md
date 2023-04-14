# vite-plugin-alias

[![NPM version](https://img.shields.io/npm/v/vite-plugin-alias?color=a1b858&label=)](https://www.npmjs.com/package/vite-plugin-alias)

> Alias auto generation for Vite.

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

## Credits

Thanks to:

- [@Subwaytime/vite-aliases](https://github.com/Subwaytime/vite-aliases)
- [@haiya6/vite-plugin-html-resolve-alias](https://github.com/haiya6/vite-plugin-html-resolve-alias)
- [@Codpoe/vite-plugin-ts-alias](https://github.com/Codpoe/vite-plugin-ts-alias)
- [@code-ManL/vite-plugin-alias2](https://github.com/code-ManL/vite-plugin-alias2)
