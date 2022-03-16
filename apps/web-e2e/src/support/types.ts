import '@testing-library/cypress/add-commands'
import { CypressAuth0Commands } from './auth0'
import { CypressDatabaseCommands } from './database'
import { CypressHelpersCommands } from './helpers'
import { CypressSelectorsCommands } from './selectors'

export type CypressCommand = {
  name: keyof Cypress.Chainable<any>
  options?: any
  fn: any
}

/**
 * Merges with @testing-library/cypress, need to follow their global declare
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable<Subject>
      extends CypressDatabaseCommands,
        CypressAuth0Commands,
        CypressSelectorsCommands,
        CypressHelpersCommands {}
  }
}
