import type { PluginOption } from 'vite'
import type { Options } from './type'
import { Generator } from './generator'

export default function Alias(options: Partial<Options> = {}): PluginOption {
  let gen: Generator

  return {
    name: 'vite-plugin-alias',
    enforce: 'pre',
    config(config, { command }) {
      gen = new Generator(command, options)
      gen.init()

      config.resolve = {
        alias: config.resolve?.alias ? [...(config.resolve.alias as any), ...gen.alias] : gen.alias,
      }
    },
  }
}
