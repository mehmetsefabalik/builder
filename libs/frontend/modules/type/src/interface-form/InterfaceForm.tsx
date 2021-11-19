import {
  FormUniforms,
  FormUniformsProps,
} from '@codelab/frontend/view/components'
import {
  IElementType,
  IJsonSchemaOptions,
  TypeKind,
} from '@codelab/shared/abstract/core'
import { TypeTree } from '@codelab/shared/core'
import * as _ from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { Bridge, DeepPartial } from 'uniforms'
import {
  getSelectElementComponent,
  SelectComponent,
  SelectLambda,
} from './fields'

export interface InterfaceFormProps<TData>
  extends Omit<FormUniformsProps<TData>, 'schema'> {
  interfaceTree: TypeTree
}

export const uniformsFactory: IJsonSchemaOptions['jsonPropertiesMapper'] = (
  type,
) => {
  switch (type.typeKind) {
    case TypeKind.ReactNodeType:
    case TypeKind.RenderPropsType:
      return {
        uniforms: {
          component: SelectComponent,
        },
      }

    case TypeKind.LambdaType:
      return {
        uniforms: {
          component: SelectLambda,
        },
      }

    case TypeKind.ElementType:
      return {
        uniforms: {
          component: getSelectElementComponent(
            (type as IElementType).elementKind,
          ),
        },
      }
    case TypeKind.ComponentType:
      return {
        type: 'string',
        uniforms: {
          component: SelectComponent,
        },
      }
  }

  return {}
}

/**
 * Uniforms form generated by an Interface
 */
export const InterfaceForm = <TData extends any>({
  interfaceTree,
  children,
  model,
  onSubmit,
}: React.PropsWithChildren<InterfaceFormProps<TData>>) => {
  const formChangedKey = useRef('')
  const [formSchema, setFormSchema] = useState<Bridge>()

  const updateFormSchema = (formModel: DeepPartial<TData> = {}) => {
    setFormSchema(
      interfaceTree.toJsonSchema(
        {
          jsonPropertiesMapper: uniformsFactory,
        },
        formModel,
      ) as any,
    )
  }

  useEffect(() => {
    updateFormSchema(model)
  }, [])

  if (!formSchema) {
    return null
  }

  return (
    <FormUniforms
      schema={formSchema}
      model={model}
      onChangeModel={(newModel: any) => {
        // E.g: loading.type -> loading.properties.type
        const formatChangedKey = formChangedKey.current
          ?.split('.')
          .join('.properties.')

        const isUnionTypeInput = _.get(
          formSchema,
          `properties.${formatChangedKey}.isUnionTypeInput`,
        )

        if (isUnionTypeInput) {
          updateFormSchema(newModel)
        }
      }}
      onChange={(key) => {
        formChangedKey.current = key
      }}
      onSubmit={onSubmit}
    >
      {children}
    </FormUniforms>
  )
}

InterfaceForm.displayName = 'InterfaceForm'
InterfaceForm.whyDidYouRender = true
