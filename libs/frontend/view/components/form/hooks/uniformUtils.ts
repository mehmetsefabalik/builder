import { SubmitController } from '@codelab/frontend/abstract/types'
import { EntityRecord, Maybe, Nullish } from '@codelab/shared/abstract/types'
import Ajv, { JSONSchemaType } from 'ajv'
import { Children, MutableRefObject, ReactElement } from 'react'
import { Context, useForm } from 'uniforms'
import JSONSchemaBridge from 'uniforms-bridge-json-schema'

export const connectUniformSubmitRef =
  (submitRef: Maybe<MutableRefObject<Maybe<SubmitController>>>) =>
  (r: Nullish<{ submit: () => any }>) => {
    if (submitRef && r) {
      // eslint-disable-next-line no-param-reassign
      submitRef.current = {
        submit() {
          return r.submit()
        },
      }
    }
  }

const ajv = new Ajv({ allErrors: true, useDefaults: true, strict: false })

export const createValidator = <T = unknown>(schema: any) => {
  const validator = ajv.compile(schema)

  return (model: EntityRecord) => {
    validator(model)

    return validator.errors?.length ? { details: validator.errors } : null
  }
}

export const createBridge = <T = unknown>(schema: JSONSchemaType<T>) => {
  const schemaValidator = createValidator(schema)

  return new JSONSchemaBridge(schema as any, schemaValidator)
}

type DisplayIfProps<T> = {
  children: ReactElement
  condition: (context: Context<T>) => boolean
}

// We have to ensure that there's only one child, because returning an array
// from a component is prohibited.
export const DisplayIf = <T = any>({
  children,
  condition,
}: DisplayIfProps<T>) => {
  const uniforms = useForm<T>()

  return condition(uniforms) ? Children.only(children) : null
}
