import { EntityLike } from '@codelab/shared/abstract/types'
import { extractId } from './extractId'

export const entityIdSet = <T extends EntityLike>(entities: Array<T>) =>
  new Set(entities.map(extractId))
