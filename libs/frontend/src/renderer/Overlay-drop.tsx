import React from 'react'
import { OverlayToolbar } from '../components/overlay-toolbar/OverlayToolbar'
import { NodeA } from 'libs/modules/graph/src/core/domain/node/Node'

export const DROP_OVERLAY_ID = 'dropOverlay'

export const DropOverlay = () => {
  return (
    <OverlayToolbar<NodeA>
      overlayId={DROP_OVERLAY_ID}
      containerProps={{
        style: {
          border: '1px solid rgb(41, 205, 255)',
        },
      }}
      toolbarProps={{
        style: {
          background: 'transparent',
          color: 'rgb(41, 205, 255)',
        },
      }}
      content={(n) => {
        return <div style={{ textAlign: 'center' }}>Drop here</div>
      }}
    />
  )
}
