import type { Generator } from '../generator'
import type { Process } from '../type'
import { existsSync } from 'node:fs'

import { mkdir } from 'node:fs/promises'
import { normalizePath } from 'vite'
import { abort, writeJSON } from '../utils'

/**
 * Creates a Logfile
 * If needed it will also create a Logfolder
 */

export async function writeLog(gen: Generator, process: Process = 'default') {
  const { createLog, logPath } = gen.options

  if (!createLog)
    return

  const folder = normalizePath(logPath)
  const file = normalizePath(`${folder}/alias.json`)
  const data = gen.alias

  try {
    if (!existsSync(folder))
      await mkdir(folder, { recursive: true })

    await writeJSON(file, data, process)
  }
  catch (error) {
    abort(`Cannot create Logfolder ${folder}.`)
  }
}
