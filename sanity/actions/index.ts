import { TranslateAction } from './translateAction'
import { MarkReviewedAction } from './markReviewedAction'
import { RevalidateAction } from './revalidateAction'

export const documentActions = (prev: any, context: any) => {
  const { schemaType } = context
  
  // Only add these actions to i18n-enabled document types
  if (['character', 'weapon', 'guide'].includes(schemaType)) {
    return [
      TranslateAction,
      MarkReviewedAction,
      RevalidateAction,
      ...prev
    ]
  }
  
  return prev
}

