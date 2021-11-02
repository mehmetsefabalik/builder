import executor from './executor'
import { BuildExecutorSchema } from './schema'

const options: BuildExecutorSchema = {}

describe('Build Executor', () => {
  it('should run', async () => {
    const output = await executor(options)

    expect(output.success).toStrictEqual(true)
  })
})
