import { mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { Generator } from '../src/generator'
import { logger } from '../src/utils'

const roots: string[] = []

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'vite-plugin-alias-'))
  roots.push(root)
  mkdirSync(join(root, 'src/components'), { recursive: true })
  mkdirSync(join(root, 'src/utils'), { recursive: true })
  return root
}

afterEach(() => {
  for (const root of roots.splice(0))
    rmSync(root, { recursive: true, force: true })
})

describe('alias generation', () => {
  it('discovers directories and adds the global alias exactly once', async () => {
    const root = fixture()
    const generator = new Generator('build', { root })
    await generator.init()
    expect(generator.alias).toEqual(expect.arrayContaining([
      { find: '~components', replacement: join(root, 'src/components') },
      { find: '~utils', replacement: join(root, 'src/utils') },
      { find: '~', replacement: join(root, 'src') },
    ]))
    expect(generator.alias).toHaveLength(3)
    expect(generator.paths['~components/*']).toEqual(['src/components/*'])
    await generator.init()
    expect(generator.alias).toHaveLength(3)
  })

  it('respects custom prefixes and absolute index paths', async () => {
    const root = fixture()
    const generator = new Generator('build', {
      root,
      prefix: '@',
      createGlobalAlias: false,
      useAbsolute: true,
      useIndexes: true,
    })
    await generator.init()
    expect(generator.alias).toHaveLength(2)
    expect(generator.paths['@components']).toEqual([join(root, 'src/components')])
    expect(generator.alias.some(alias => alias.find === '@')).toBe(false)
  })

  it('constructs the logger using the supported consola export', () => {
    const messages: unknown[] = []
    const isolated = logger.create({ level: 4, reporters: [{ log: entry => messages.push(entry) }] })
    isolated.info('validation smoke test')
    expect(messages).toHaveLength(1)
    expect(messages[0]).toMatchObject({ type: 'info', args: ['[vite-plugin-alias] -', 'validation smoke test'] })
  })
})
