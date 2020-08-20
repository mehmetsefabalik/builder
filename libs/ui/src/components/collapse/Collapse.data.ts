import { ReactNodeI } from '@codelab/graph'
import { TextProps } from '../text/Text.types'
import { CollapsePanelProps, CollapseProps } from './Collapse.types'

export const collapseData: ReactNodeI<
  CollapsePanelProps | CollapseProps | TextProps
> = {
  type: 'Collapse',
  nodeType: 'React',
  props: {
    defaultActiveKey: '1',
  },
  children: [
    {
      type: 'Collapse.Panel',
      nodeType: 'React',
      props: {
        header: 'This is panel header 1',
        key: 1,
      },
      children: [
        {
          type: 'Text',
          nodeType: 'React',
          props: {
            value: 'This is panel text 1',
          },
        },
      ],
    },
    {
      type: 'Collapse.Panel',
      nodeType: 'React',
      props: {
        header: 'This is panel header 2',
        key: 2,
      },
      children: [
        {
          type: 'Text',
          nodeType: 'React',
          props: {
            value: 'This is panel text 2',
          },
        },
      ],
    },
    {
      type: 'Collapse.Panel',
      nodeType: 'React',
      props: {
        header: 'This is panel header 3',
        key: 3,
        disabled: 'true',
      },
      children: [
        {
          type: 'Text',
          nodeType: 'React',
          props: {
            value: 'This is panel text 3',
          },
        },
      ],
    },
  ],
}
