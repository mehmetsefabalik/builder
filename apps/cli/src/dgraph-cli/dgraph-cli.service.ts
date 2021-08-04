import { dgraphConfig, DgraphService } from '@codelab/backend'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { Command, Console } from 'nestjs-console'
import shell from 'shelljs'
import { envOption } from '../env-helper'

@Console({
  command: 'dgraph',
  description: 'A command to initiate dgraph clis',
})
@Injectable()
export class DgraphCliService {
  constructor(
    private readonly dgraphService: DgraphService,
    @Inject(dgraphConfig.KEY)
    private readonly _dgraphConfig: ConfigType<typeof dgraphConfig>,
  ) {}

  @Command({
    command: 'update-scheme',
    options: [envOption],
  })
  public async updateScheme() {
    try {
      await this.dgraphService.updateDqlSchema()

      shell.echo(
        'Update Scheme process completed! You may Ctrl + C the terminal.',
      )
      shell.exit(0)
    } catch (e) {
      console.error(e)
    }
  }

  @Command({
    command: 'reset-data',
    options: [envOption],
  })
  public async resetData() {
    try {
      await this.dgraphService.resetDb()

      shell.echo('Reset Data process completed! You may Ctrl + C the terminal.')
      shell.exit(0)
    } catch (e) {
      console.error(e)
    }
  }
}
