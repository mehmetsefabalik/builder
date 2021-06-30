import { __InterfaceFragment } from '@codelab/codegen/graphql'
import { FormUniforms, FormUniformsProps } from '@codelab/frontend/shared'
import React, { useEffect, useState } from 'react'
import { InterfaceJsonSchemaAdaptor } from './InterfaceJsonSchemaAdaptor'

export interface InterfaceFormProps<TData>
  extends Omit<FormUniformsProps<TData>, 'schema'> {
  interface: __InterfaceFragment
}

/**
 * Uniforms form generated by an Interface
 */
export const InterfaceForm = <TData extends any>({
  interface: intface,
  children,
  ...props
}: React.PropsWithChildren<InterfaceFormProps<TData>>) => {
  const [generatedSchema, setGeneratedSchema] = useState(
    InterfaceJsonSchemaAdaptor.toJsonSchema<TData>(intface),
  )

  useEffect(() => {
    setGeneratedSchema(InterfaceJsonSchemaAdaptor.toJsonSchema<TData>(intface))
  }, [intface])

  return (
    <FormUniforms schema={generatedSchema} {...props}>
      {children}
    </FormUniforms>
  )
}

InterfaceForm.displayName = 'InterfaceForm'
