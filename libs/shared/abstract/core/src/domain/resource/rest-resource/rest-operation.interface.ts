import { AbstractOperation } from '../abstract-operation.interface'
import { HttpMethod } from './http-method.enum'

export interface IRestOperationConfig {
  body: string
  method: HttpMethod
  queryParams: string
}

export type IRestOperation = AbstractOperation<IRestOperationConfig>
