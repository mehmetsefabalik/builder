import { IDomain, IDomainDTO } from '@codelab/frontend/abstract/core'
import {
  VercelDomainConfigData,
  VercelProjectDomainData,
  // VercelProjectDomainData,
} from '@codelab/shared/abstract/codegen'
import { detach, idProp, Model, model, prop, rootRef } from 'mobx-keystone'

const hydrate = (domain: IDomainDTO) => {
  return new Domain({
    id: domain.id,
    name: domain.name,
    // app: domain.app.id,
    domainConfig: domain.domainConfig,
    projectDomainData: domain.projectDomain,
  })
}

@model('@codelab/Domain')
export class Domain
  extends Model({
    id: idProp,
    name: prop<string>(),
    // app: prop<IApp>(),
    domainConfig: prop<VercelDomainConfigData>(),
    projectDomainData: prop<VercelProjectDomainData>(),
  })
  implements IDomain
{
  static hydrate = hydrate
}

export const domainRef = rootRef<Domain>('@codelab/AppRef', {
  onResolvedValueChange(ref, newApp, oldApp) {
    if (oldApp && !newApp) {
      detach(ref)
    }
  },
})
