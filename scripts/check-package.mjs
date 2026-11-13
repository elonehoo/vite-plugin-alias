import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import process from 'node:process'

const root = process.cwd()
const temporary = mkdtempSync(join(tmpdir(), '.package-check-'))
const consumer = join(temporary, 'consumer')
const packageName = 'vite-plugin-alias'

function run(command, args, cwd = root) {
  return execFileSync(command, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] })
}

try {
  const packed = JSON.parse(run('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', temporary]))
  run('tar', ['-xzf', join(temporary, packed[0].filename), '-C', temporary])
  const scope = join(consumer, 'node_modules')
  mkdirSync(scope, { recursive: true })
  renameSync(join(temporary, 'package'), join(scope, packageName))
  // Link only declared runtime dependencies with their validated dependency closures.
  const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
  for (const name of Object.keys(manifest.dependencies))
    symlinkSync(resolve(root, 'node_modules', name), join(scope, name), 'dir')
  mkdirSync(join(scope, '@types'), { recursive: true })
  symlinkSync(resolve(root, 'node_modules/@types/node'), join(scope, '@types/node'), 'dir')
  // An external package scope cannot inherit the repository's node_modules.
  writeFileSync(join(consumer, 'package.json'), JSON.stringify({ name: 'package-consumer', private: true, type: 'module' }))

  const assertion = `const plugin: PluginOption = alias({ dir: 'src', deep: true, depth: 2 })
void plugin
// @ts-expect-error The options contract must reject invalid depths.
alias({ depth: 'invalid' })
`
  writeFileSync(join(consumer, 'esm.mts'), `import type { PluginOption } from 'vite'\nimport alias from '${packageName}'\n${assertion}`)
  writeFileSync(join(consumer, 'common.cts'), `import type { PluginOption } from 'vite' with { 'resolution-mode': 'import' }\nimport alias = require('${packageName}')\n${assertion}`)
  writeFileSync(join(consumer, 'bundler.ts'), `import type { PluginOption } from 'vite'\nimport alias from '${packageName}'\n${assertion}`)
  const compiler = resolve(root, 'node_modules/typescript/bin/tsc')
  const options = [compiler, '--noEmit', '--strict', '--skipLibCheck', 'false', '--target', 'ES2022']
  for (const file of ['esm.mts', 'common.cts'])
    run(process.execPath, [...options, '--module', 'NodeNext', '--moduleResolution', 'NodeNext', join(consumer, file)])
  // Vite's host declarations require a modern resolver; Node10 cannot resolve its package imports.
  run(process.execPath, [...options, '--module', 'ESNext', '--moduleResolution', 'Bundler', join(consumer, 'bundler.ts')])

  writeFileSync(join(consumer, 'esm.mjs'), `import alias from '${packageName}'; import assert from 'node:assert/strict'; assert.equal(alias().name, 'vite-plugin-alias');`)
  writeFileSync(join(consumer, 'common.cjs'), `const alias = require('${packageName}'); const assert = require('node:assert/strict'); assert.ok(require.resolve('${packageName}').includes('.package-check-')); assert.equal(alias().name, 'vite-plugin-alias');`)
  run(process.execPath, [join(consumer, 'esm.mjs')])
  run(process.execPath, [join(consumer, 'common.cjs')])
}
finally {
  rmSync(temporary, { recursive: true, force: true })
}
