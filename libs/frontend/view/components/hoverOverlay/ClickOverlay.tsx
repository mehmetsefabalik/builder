import React from 'react'
import { OverlayProps } from './overlay.interface'
import { OverlayToolbar } from './OverlayToolbar'

export const ClickOverlay = ({
  nodeId,
  content,
  getOverlayElement,
}: OverlayProps) => {
  if (!nodeId || !document) {
    return null
  }

  const element = getOverlayElement(nodeId)

  if (!element) {
    return null
  }

  return <OverlayToolbar overlayElement={element}>{content}</OverlayToolbar>
}
