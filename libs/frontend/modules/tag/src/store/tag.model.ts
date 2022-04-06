import { idProp, Model, model, prop } from 'mobx-keystone'
import { TagFragment } from '../graphql/tag.fragment.graphql.gen'

@model('codelab/Tag')
export class Tag extends Model({
  id: idProp,
  name: prop<string>(),
}) {
  static fromFragment(tag: TagFragment) {
    return new Tag({
      id: tag.id,
      name: tag.name,
    })
  }
}
