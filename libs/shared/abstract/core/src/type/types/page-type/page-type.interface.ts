import { z } from 'zod'
import { BaseTypeSchema } from '../base-type/base-type.interface'
import { TypeKind } from '../base-type/type-kind.enum'

export const PageTypeSchema = BaseTypeSchema.extend({
  typeKind: z.literal(TypeKind.PageType).default(TypeKind.PageType),
})

/**
 * Allows picking an existing page from the list of pages.
 *
 * TODO see how the page is handled in the render process
 */
export type IPageType = z.infer<typeof PageTypeSchema>
