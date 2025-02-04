import {
  IAuth0Id,
  IComponentDTO,
  ICreateElementDTO,
  ICreatePropMapBindingDTO,
  IElement,
  IElementDTO,
  IElementRef,
  IElementService,
  IElementTree,
  IInterfaceType,
  isAtomDTO,
  IUpdateElementDTO,
  IUpdatePropMapBindingDTO,
} from '@codelab/frontend/abstract/core'
import { getAtomService } from '@codelab/frontend/domain/atom'
import { getComponentService } from '@codelab/frontend/presenter/container'
import {
  ElementCreateInput,
  ElementUpdateInput,
  ElementWhere,
} from '@codelab/shared/abstract/codegen'
import { ITypeKind } from '@codelab/shared/abstract/core'
import { IEntity, Nullable } from '@codelab/shared/abstract/types'
import {
  connectNode,
  connectOwner,
  connectTypeOwner,
  reconnectNode,
} from '@codelab/shared/data'
import { isNonNullable } from '@codelab/shared/utils'
import omit from 'lodash/omit'
import {
  _async,
  _await,
  Model,
  model,
  modelAction,
  modelFlow,
  objectMap,
  prop,
  transaction,
} from 'mobx-keystone'
import { v4 } from 'uuid'
import { UpdateElementsMutationVariables } from '../graphql/element.endpoints.graphql.gen'
import {
  makeCreateInput,
  makeDuplicateInput,
  makeUpdateInput,
} from './api.utils'
import { elementApi, propMapBindingApi } from './apis'
import { Element } from './element.model'
import {
  CreateElementModalService,
  ElementModalService,
} from './element-modal.service'
import { PropMapBinding } from './prop-map-binding.model'
import { PropMapBindingModalService } from './prop-map-binding-modal.service'

/**
 * We will have a single ElementService that contains all elements from
 *
 * - PageElementTree
 * - ComponentElementTree
 */
@model('@codelab/ElementService')
export class ElementService
  extends Model({
    /**
     * Contains all elements
     *
     * - Elements part of rootTree
     * - Elements that are detached
     */
    elements: prop(() => objectMap<IElement>()),
    createModal: prop(() => new CreateElementModalService({})),
    updateModal: prop(() => new ElementModalService({})),
    deleteModal: prop(() => new ElementModalService({})),

    createPropMapBindingModal: prop(() => new ElementModalService({})),
    updatePropMapBindingModal: prop(() => new PropMapBindingModalService({})),
    deletePropMapBindingModal: prop(() => new PropMapBindingModalService({})),
  })
  implements IElementService
{
  @modelFlow
  @transaction
  getAll = _async(function* (this: ElementService, where?: ElementWhere) {
    const { elements } = yield* _await(
      elementApi.GetElements({
        where,
      }),
    )

    return elements.map((element) => this.writeCache(element))
  })

  @modelAction
  private writeAtomsCache(elements: Array<IElementDTO>) {
    console.debug('ElementService.writeAtomsCache', elements)

    // Add all non-existing atoms to the AtomStore, so we can safely reference them in Element
    const atomService = getAtomService(this)

    const atoms = elements
      .map((element) => element.renderAtomType)
      .filter(isAtomDTO)

    return atoms.map((atom) => atomService.writeCache(atom))
  }

  @modelAction
  private writeComponentsCache(elements: Array<IElementDTO>) {
    // Add all non-existing components to the ComponentStore, so we can safely reference them in Element
    const componentService = getComponentService(this)

    const components = elements
      .map((v) => v.parentComponent || v.renderComponentType)
      .filter((component): component is IComponentDTO => Boolean(component))

    components.map((component) => componentService.writeCache(component))
  }

  @modelAction
  public writeCache = (element: IElementDTO): IElement => {
    console.debug('ElementService.writeCache', element)
    this.writeAtomsCache([element])
    this.writeComponentsCache([element])

    let elementModel = this.elements.get(element.id)

    if (elementModel) {
      elementModel.writeCache(element)
    } else {
      elementModel = Element.hydrate(element)
      this.elements.set(element.id, elementModel)
    }

    return elementModel
  }

  /**
   * We need a separate create function for element trees
   */
  @modelFlow
  @transaction
  create = _async(function* (
    this: ElementService,
    data: Array<ICreateElementDTO>,
  ) {
    const input = data.map((element) => makeCreateInput(element))

    const {
      createElements: { elements },
    } = yield* _await(elementApi.CreateElements({ input }))

    if (!elements.length) {
      throw new Error('No elements created')
    }

    return elements.map((element) => this.writeCache(element))
  })

  /**
   * Used to load the entire page tree
   */
  @modelFlow
  getDescendants = _async(function* (
    this: ElementService,
    rootId: IElementRef,
  ) {
    const { elementTrees } = yield* _await(
      elementApi.GetElementTree({ where: { id: rootId } }),
    )

    const elements = [elementTrees[0], ...elementTrees[0].descendantElements]

    return elements.map((element) => this.writeCache(element))
  })

  @modelAction
  element(id: string) {
    return this.elements?.get(id)
  }

  @modelFlow
  @transaction
  update = _async(function* (
    this: ElementService,
    element: IEntity,
    input: IUpdateElementDTO,
  ) {
    const update = makeUpdateInput(input)

    const {
      updateElements: {
        elements: [updatedElement],
      },
    } = yield* _await(
      elementApi.UpdateElements({
        where: { id: element.id },
        update,
      }),
    )

    if (!updatedElement) {
      throw new Error('No elements updated')
    }

    return this.writeCache(updatedElement)
  })

  @modelFlow
  @transaction
  updateElementsPropTransformationJs = _async(function* (
    this: ElementService,
    element: IElement,
    newPropTransformJs: string,
  ) {
    const input: ElementUpdateInput = {
      propTransformationJs: newPropTransformJs,
    }

    return yield* _await(this.update(element, input))
  })

  /**
   * Directly uses generated GraphQL operations
   */
  @modelFlow
  @transaction
  patchElement = _async(function* (
    this: ElementService,
    element: Pick<IElement, 'id'>,
    input: ElementUpdateInput,
  ) {
    const {
      updateElements: {
        elements: [updatedElement],
      },
    } = yield* _await(
      elementApi.UpdateElements({
        where: { id: element.id },
        update: input,
      }),
    )

    if (!updatedElement) {
      throw new Error('No elements updated')
    }

    const elementFromCache = this.element(element.id)

    if (!elementFromCache) {
      throw new Error('Element not found')
    }

    return elementFromCache.writeCache(updatedElement)
  })

  @modelFlow
  @transaction
  detachElementFromElementTree = _async(function* (
    this: ElementService,
    elemenId: string,
  ) {
    /**
Detaches element from an element tree. Will perform 3 conditional checks to see which specific detach to call

- Detach from parent
- Detach from next sibling
- Detach from prev sibling
- Connect prev to next
     */
    const element = this.element(elemenId)

    if (!element) {
      console.warn(`Can't find element id ${elemenId}`)

      return
    }

    /**
parent
  prev
  element
  next
     */
    const updateElementInputs = [
      // Detach from parent
      element.makeDetachParentInput(),
      // Detach from next sibling
      element.makeDetachNextSiblingInput(),
      // Detach from prev sibling
      element.makeDetachPrevSiblingInput(),
    ]

    const updateElementCacheFns: Array<() => void> = [
      // Detach from parent
      element.detachParent(),
      // Attach next to prev
      element.attachPrevToNextSibling(),
      // Detach from next sibling
      element.detachNextSibling(),
      // Detach from prev sibling
      element.detachPrevSibling(),
    ]

    const updateElementRequests = updateElementInputs
      .filter(isNonNullable)
      .map((input) => elementApi.UpdateElements(input))

    yield* _await(Promise.all(updateElementRequests))
    updateElementCacheFns.forEach((fn) => fn())
  })

  /**
   * Moves an element to the next postion of target element
   */
  @modelFlow
  @transaction
  moveElementAsNextSibling = _async(function* (
    this: ElementService,
    {
      elementId,
      targetElementId,
    }: Parameters<IElementService['moveElementAsNextSibling']>[0],
  ) {
    const element = this.element(elementId)
    const targetElement = this.element(targetElementId)

    if (!element || !targetElement) {
      return
    }

    if (targetElement.nextSiblingId === elementId) {
      return
    }

    yield* _await(this.detachElementFromElementTree(elementId))

    yield* _await(
      this.attachElementAsNextSibling({ elementId, targetElementId }),
    )
  })

  @modelFlow
  @transaction
  moveElementAsFirstChild = _async(function* (
    this: ElementService,
    {
      elementId,
      parentElementId,
    }: Parameters<IElementService['moveElementAsFirstChild']>[0],
  ) {
    const element = this.element(elementId)
    const parentElement = this.element(parentElementId)

    if (!element || !parentElement) {
      return
    }

    yield* _await(this.detachElementFromElementTree(elementId))
    yield* _await(
      this.attachElementAsFirstChild({ elementId, parentElementId }),
    )
  })

  @modelFlow
  @transaction
  createElementAsFirstChild = _async(function* (
    this: ElementService,
    data: ICreateElementDTO,
  ) {
    if (!data.parentElementId) {
      throw new Error('Parent element id doesnt exist')
    }

    const [element] = yield* _await(this.create([data]))
    yield* _await(
      this.attachElementAsFirstChild({
        elementId: element.id,
        parentElementId: data.parentElementId,
      }),
    )

    return element
  })

  @modelFlow
  @transaction
  createElementAsNextSibling = _async(function* (
    this: ElementService,
    data: ICreateElementDTO,
  ) {
    const [element] = yield* _await(this.create([data]))
    yield* _await(
      this.attachElementAsNextSibling({
        elementId: element.id,
        targetElementId: String(data.prevSiblingId),
      }),
    )

    return element
  })

  @modelFlow
  @transaction
  attachElementAsNextSibling = _async(function* (
    this: ElementService,
    {
      elementId,
      targetElementId,
    }: Parameters<IElementService['attachElementAsNextSibling']>[0],
  ) {
    const element = this.element(elementId)
    const targetElement = this.element(targetElementId)

    if (!element || !targetElement) {
      return
    }

    const updateElementInputs: Array<UpdateElementsMutationVariables> = []
    const updateElementCacheFns: Array<() => void> = []

    // Attach to parent
    if (targetElement.parentElement) {
      updateElementCacheFns.push(
        element.attachToParent(targetElement.parentElement.id),
      )
    }

    /**
     * [target]-nextSbiling
     * target-[element]-nextSibling
     * element appends to nextSibling
     */
    if (targetElement.nextSibling) {
      updateElementInputs.push(
        element.makeAppendSiblingInput(targetElement.nextSibling.id),
      )
      updateElementCacheFns.push(
        element.appendSibling(targetElement.nextSibling.id),
      )

      /** [element]-nextSibling */
      updateElementInputs.push(
        targetElement.nextSibling.makePrependSiblingInput(element.id),
      )
      updateElementCacheFns.push(
        targetElement.nextSibling.prependSibling(element.id),
      )
    }

    updateElementInputs.push(element.makePrependSiblingInput(targetElement.id))
    updateElementCacheFns.push(element.prependSibling(targetElement.id))

    const updateElementRequests = updateElementInputs
      .filter(isNonNullable)
      .map((input) => elementApi.UpdateElements(input))

    yield* _await(Promise.all(updateElementRequests))
    updateElementCacheFns.forEach((fn) => fn())
  })

  /**
   * Moves an element to the next position of children[0] of parent children element
   */
  @modelFlow
  @transaction
  attachElementAsFirstChild = _async(function* (
    this: ElementService,
    {
      elementId,
      parentElementId,
    }: Parameters<IElementService['attachElementAsFirstChild']>[0],
  ) {
    const element = this.element(elementId)
    const parentElement = this.element(parentElementId)

    if (!element || !parentElement) {
      return
    }

    const updateElementInputs = []
    const updateElementCacheFns: Array<() => void> = []

    /**
parentElement
  firstChild

parentElement
  [element]
  firstChild

element is new parentElement's first child
     */
    if (parentElement.firstChild) {
      updateElementInputs.push(
        element.makeAppendSiblingInput(parentElement.firstChild.id),
      )
      updateElementCacheFns.push(
        element.appendSibling(parentElement.firstChild.id),
      )
    }

    // attach to parent
    updateElementInputs.push(
      element.makeAttachToParentAsFirstChildInput(parentElementId),
    )
    updateElementCacheFns.push(
      element.attachToParentAsFirstChild(parentElement.id),
    )

    const updateElementRequests = updateElementInputs.map((input) =>
      elementApi.UpdateElements(input),
    )

    yield* _await(Promise.all(updateElementRequests))
    updateElementCacheFns.forEach((fn) => fn())
  })

  @modelFlow
  @transaction
  deleteElementSubgraph = _async(function* (
    this: ElementService,
    root: IElementRef,
  ) {
    const { elementTrees } = yield* _await(
      elementApi.GetElementTree({ where: { id: root } }),
    )

    const idsToDelete = [
      elementTrees[0].id,
      ...elementTrees[0].descendantElements.map((element) => element.id),
    ]

    const rootElement = this.element(root)

    if (rootElement) {
      yield* _await(this.detachElementFromElementTree(rootElement.id))
    }

    for (const id of idsToDelete.reverse()) {
      this.elements.delete(id)
    }

    const {
      deleteElements: { nodesDeleted },
    } = yield* _await(
      elementApi.DeleteElements({
        where: {
          id_IN: idsToDelete,
        },
        delete: {
          propMapBindings: [{}],
          props: {},
        },
      }),
    )

    if (nodesDeleted === 0) {
      throw new Error('No elements deleted')
    }

    return idsToDelete
  })

  @modelFlow
  @transaction
  duplicateElement = _async(function* (
    this: ElementService,
    targetElement: Element,
    auth0Id: IAuth0Id,
    elementTree: IElementTree | null,
  ) {
    if (!targetElement.parentElement) {
      throw new Error("Can't duplicate root element")
    }

    const oldToNewIdMap = new Map<string, string>()

    const recursiveDuplicate = async (element: IElement, parentId: string) => {
      const createInput: ElementCreateInput = makeDuplicateInput(
        element,
        parentId,
        auth0Id,
      )

      const {
        createElements: {
          elements: [createdElement],
        },
      } = await elementApi.CreateElements({ input: createInput })

      if (!createdElement) {
        throw new Error('No elements created')
      }

      const elementModel = this.writeCache(createdElement)

      if (elementTree) {
        elementTree.addElements([elementModel])
      }

      oldToNewIdMap.set(element.id, elementModel.id)

      for (const child of element.children) {
        await recursiveDuplicate(child, elementModel.id)
      }

      return elementModel
    }

    yield* _await(
      recursiveDuplicate(targetElement, targetElement.parentElement.id),
    )

    // re-attach the prop map bindings now that we have the new ids
    const allInputs = [targetElement, ...targetElement.descendants]

    for (const inputElement of allInputs) {
      const newId = oldToNewIdMap.get(inputElement.id)

      if (!newId) {
        throw new Error(`Could not find new id for ${inputElement.id}`)
      }

      const duplicated = elementTree?.element(newId)

      if (!duplicated) {
        throw new Error(`Could not find duplicated element ${newId}`)
      }

      for (const propMapBinding of inputElement.propMapBindings.values()) {
        yield* _await(
          this.createPropMapBinding(duplicated, {
            elementId: newId,
            targetElementId: propMapBinding.targetElement
              ? oldToNewIdMap.get(propMapBinding.targetElement.id)
              : undefined,
            targetKey: propMapBinding.targetKey,
            sourceKey: propMapBinding.sourceKey,
          }),
        )
      }
    }
  })

  @modelFlow
  @transaction
  convertElementToComponent = _async(function* (
    this: ElementService,
    element: Element,
    auth0Id: IAuth0Id,
    elementTree: Nullable<IElementTree>,
  ) {
    if (!element.parentElement) {
      throw new Error("Can't convert root element")
    }

    if (!elementTree) {
      throw new Error('Element is not attached to a tree')
    }

    // 2. Attach a Component to the Element and detach it from the parent
    const parentId = element.parentElement.id

    yield* _await(
      this.patchElement(element, {
        parentComponent: {
          create: {
            node: {
              id: v4(),
              name: element.label,
              owner: connectOwner(auth0Id),
              rootElement: connectNode(element.id),
              api: {
                create: {
                  node: {
                    id: v4(),
                    name: `${element.label} API`,
                    fields: {},
                    kind: ITypeKind.InterfaceType,
                    apiOfAtoms: {},
                    owner: connectTypeOwner(auth0Id),
                  },
                },
              },
            },
          },
        },
      }),
    )

    if (!element.parentComponent) {
      throw new Error('Could not find component')
    }

    // 3. Load component so we can use reference
    const componentService = getComponentService(this)

    // 3. Make an intermediate element with instance of the Component
    const [newElement] = yield* _await(
      this.create([
        {
          name: element.label,
          renderComponentTypeId: element.parentComponent.id,
          parentElementId: parentId,
        },
      ]),
    )

    if (elementTree) {
      elementTree.addElements([newElement])
    }
  })

  @modelFlow
  @transaction
  createPropMapBinding = _async(function* (
    this: ElementService,
    element: IElement,
    createInput: ICreatePropMapBindingDTO,
  ) {
    const {
      createPropMapBindings: {
        propMapBindings: [createdPropMapBinding],
      },
    } = yield* _await(
      propMapBindingApi.CreatePropMapBindings({
        input: {
          sourceKey: createInput.sourceKey.trim(),
          targetKey: createInput.targetKey.trim(),
          element: connectNode(element.id),
          targetElement: connectNode(createInput.targetElementId),
        },
      }),
    )

    if (!createdPropMapBinding) {
      throw new Error('No prop map bindings created')
    }

    const propMapBinding = PropMapBinding.hydrate(createdPropMapBinding)

    element.addPropMapBinding(propMapBinding)

    return propMapBinding
  })

  @modelFlow
  @transaction
  updatePropMapBinding = _async(function* (
    this: ElementService,
    element: Element,
    propMapBinding: PropMapBinding,
    updateData: IUpdatePropMapBindingDTO,
  ) {
    const {
      updatePropMapBindings: {
        propMapBindings: [updatedPropMapBinding],
      },
    } = yield* _await(
      propMapBindingApi.UpdatePropMapBindings({
        where: { id: propMapBinding.id },
        update: {
          sourceKey: updateData.sourceKey,
          targetKey: updateData.targetKey,
          targetElement: reconnectNode(updateData.targetElementId),
        },
      }),
    )

    if (!updatedPropMapBinding) {
      throw new Error('No prop map bindings updated')
    }

    propMapBinding.writeCache(updatedPropMapBinding)

    return propMapBinding
  })

  @modelFlow
  @transaction
  deletePropMapBinding = _async(function* (
    this: ElementService,
    element: Element,
    propMapBinding: PropMapBinding,
  ) {
    const {
      deletePropMapBindings: { nodesDeleted },
    } = yield* _await(
      propMapBindingApi.DeletePropMapBindings({
        where: { id: propMapBinding.id },
      }),
    )

    if (nodesDeleted === 0) {
      throw new Error('No prop map bindings deleted')
    }

    element.removePropMapBinding(propMapBinding)

    return propMapBinding
  })

  @modelFlow
  @transaction
  removeDeletedPropDataFromElements = _async(function* (
    this: ElementService,
    interfaceType: IInterfaceType,
    propKey: string,
  ) {
    const elementsThatUseTheProp = yield* _await(
      this.getAll({ renderAtomType: { api: { id: interfaceType.id } } }),
    )

    const promises = elementsThatUseTheProp.map((element) => {
      const updatedProps = omit(element.props?.data, propKey)

      return this.patchElement(element, {
        props: {
          update: {
            node: {
              data: JSON.stringify(updatedProps),
            },
          },
        },
      })
    })

    yield* _await(Promise.all(promises))
  })
}
