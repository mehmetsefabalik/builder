import { CypressCommand } from '../types'
import { resetDatabase } from './admin'
import { createApp } from './app'
import { createAtom, importAtoms } from './atom'
import { createComponent } from './component'
import { createElement, updateElement } from './element'
import { createField } from './field'
import { createPage, getPages } from './page'
import { createType } from './type'
import { getCurrentUserId } from './user'

export interface CypressDatabaseCommands {
  /** app model */
  createApp: typeof createApp

  /** page model */
  createPage: typeof createPage
  getPages: typeof getPages

  /** admin model */
  resetDatabase: typeof resetDatabase

  /** component model */
  createComponent: typeof createComponent

  /** element model */
  updateElement: typeof updateElement
  createElement: typeof createElement

  /** element model */
  createAtom: typeof createAtom
  importAtoms: typeof importAtoms

  /** type model */
  createField: typeof createField
  createType: typeof createType

  /** user model */
  getCurrentUserId: typeof getCurrentUserId
}

export const databaseCommands: Array<CypressCommand> = [
  { name: 'createApp', fn: createApp },
  { name: 'createPage', fn: createPage },
  { name: 'getPages', fn: getPages },
  { name: 'resetDatabase', fn: resetDatabase },
  { name: 'createComponent', fn: createComponent },
  { name: 'createElement', fn: createElement },
  { name: 'updateElement', fn: updateElement },
  { name: 'createAtom', fn: createAtom },
  { name: 'createField', fn: createField },
  { name: 'createType', fn: createType },
  { name: 'getCurrentUserId', fn: getCurrentUserId },
  { name: 'importAtoms', fn: importAtoms },
]
