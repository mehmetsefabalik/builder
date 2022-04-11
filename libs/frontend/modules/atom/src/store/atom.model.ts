import { InterfaceType, typeRef } from '@codelab/frontend/modules/type'
import { AtomType, IAtom, ITag } from '@codelab/shared/abstract/core'
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Tag } from 'libs/frontend/modules/tag/src/store/tag.model'
import {
  detach,
  idProp,
  Model,
  model,
  modelAction,
  prop,
  Ref,
  rootRef,
} from 'mobx-keystone'
import { AtomFragment } from '../graphql/atom.fragment.graphql.gen'

const fromFragment = (atom: AtomFragment) => {
  return new Atom({
    id: atom.id,
    name: atom.name,
    type: atom.type,
    api: typeRef(atom.api.id) as Ref<InterfaceType>,
    tags: atom.tags.map(
      (tag) => new Tag({ id: tag.id, name: tag.name, children: [] }),
    ),
  })
}

@model('codelab/Atom')
export class Atom
  extends Model({
    id: idProp,
    name: prop<string>(),
    type: prop<AtomType>(),
    tags: prop<Array<ITag>>(),
    api: prop<Ref<InterfaceType>>(),
  })
  implements IAtom
{
  @modelAction
  updateFromFragment(atom: AtomFragment) {
    this.name = atom.name
    this.type = atom.type
    this.api = typeRef(atom.api.id) as Ref<InterfaceType>
    this.tags = atom.tags.map(
      (tag) => new Tag({ id: tag.id, name: tag.name, children: [] }),
    )
  }

  // This must be defined outside the class or weird things happen https://github.com/xaviergonz/mobx-keystone/issues/173
  static fromFragment = fromFragment
}

export const atomRef = rootRef<Atom>('AtomRef', {
  onResolvedValueChange(ref, newAtom, oldAtom) {
    if (oldAtom && !newAtom) {
      detach(ref)
    }
  },
})
