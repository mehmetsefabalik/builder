import {
  HttpMethod,
  HttpResponseType,
  ICreateActionDTO,
} from '@codelab/frontend/abstract/core'
import { SelectAction } from '@codelab/frontend/domain/type'
import { CodeMirrorField } from '@codelab/frontend/view/components'
import { CodeMirrorLanguage } from '@codelab/shared/abstract/codegen'
import { IActionKind } from '@codelab/shared/abstract/core'
import { hideField, showFieldOnDev } from '@codelab/shared/utils'
import { JSONSchemaType } from 'ajv'
import keys from 'lodash/keys'

export const codeMirrorTypescriptOptions = {
  editorOptions: { language: CodeMirrorLanguage.Typescript },
  containerProps: { style: { height: '100px' } },
}

export const codemirrorGraphQLOptions = {
  editorOptions: { language: CodeMirrorLanguage.Graphql },
  containerProps: { style: { height: '100px' } },
}

export const codemirrorJSONOptions = {
  editorOptions: { language: CodeMirrorLanguage.Json },
  containerProps: { style: { height: '100px' } },
}

export const createActionSchema: JSONSchemaType<ICreateActionDTO> = {
  title: 'Create Action',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      nullable: true,
      ...hideField,
    },
    storeId: {
      type: 'string',
      disabled: true,
      ...showFieldOnDev(),
    },
    name: {
      type: 'string',
      autoFocus: true,
    },
    type: {
      type: 'string',
      enum: Object.values(IActionKind),
    },
    resourceId: {
      type: 'string',
      nullable: true,
      label: 'Resource',
    },
    successActionId: {
      type: 'string',
      nullable: true,
      label: 'Success Action',
    },
    errorActionId: {
      type: 'string',
      nullable: true,
      label: 'Error Action',
    },
    config: {
      type: 'object',
      label: '',
      nullable: true,
      properties: {
        query: {
          type: 'string',
          nullable: true,
          uniforms: {
            component: CodeMirrorField({
              language: CodeMirrorLanguage.Graphql,
            }),
          },
        },
        variables: {
          type: 'string',
          nullable: true,
          uniforms: {
            component: CodeMirrorField({ language: CodeMirrorLanguage.Json }),
          },
        },
        body: {
          type: 'string',
          nullable: true,
          uniforms: {
            component: CodeMirrorField({ language: CodeMirrorLanguage.Json }),
          },
        },
        urlSegment: {
          type: 'string',
          nullable: true,
        },
        method: {
          type: 'string',
          enum: keys(HttpMethod) as Array<HttpMethod>,
          showSearch: true,
        },
        queryParams: {
          type: 'string',
          nullable: true,
          uniforms: {
            component: CodeMirrorField({ language: CodeMirrorLanguage.Json }),
          },
        },
        headers: {
          type: 'string',
          nullable: true,
          uniforms: {
            component: CodeMirrorField({ language: CodeMirrorLanguage.Json }),
          },
        },
        responseType: {
          type: 'string',
          enum: Object.values(HttpResponseType),
          showSearch: true,
        },
      },
      required: [],
    },
    code: {
      type: 'string',
      nullable: true,
      uniforms: {
        component: CodeMirrorField({ language: CodeMirrorLanguage.Typescript }),
      },
    },
    actionsIds: {
      type: 'array',
      label: 'Actions',
      items: {
        type: 'string',
        label: '',
        uniforms: { component: SelectAction },
        nullable: true,
      },
      nullable: true,
    },
  },
  required: ['name', 'type', 'storeId'],
} as const
