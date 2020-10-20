/**
 * We have 3 top level node types `Tree`, `Model`, & `React`, each can be broken down further
 */

export enum BaseNodeType {
  React = 'React',
  Tree = 'Tree',
  Model = 'Model',
  Field = 'Field',
}

/**
 * used for forms
 */
export const nodeTypeEntries = Object.entries(BaseNodeType)

/**
 * Used with Graphql
 */
export enum NodeType {
  /**
   * React, requires additional `type` key
   */
  'React.Fragment' = 'React.Fragment',
  'React.Html.div' = 'React.Html.div',
  'React.Html.p' = 'React.Html.p',
  'React.Html.a' = 'React.Html.a',
  'React.Html.span' = 'React.Html.span',
  'React.Text' = 'React.Text',
  'React.Icon' = 'React.Icon',
  'React.Menu' = 'React.Menu',
  'React.Menu.Item' = 'React.Menu.Item',
  'React.Menu.ItemGroup' = 'React.Menu.ItemGroup',
  'React.Menu.SubMenu' = 'React.Menu.SubMenu',
  'React.Card' = 'React.Card',
  'React.Card.Grid' = 'React.Card.Grid',
  'React.Card.Meta' = 'React.Card.Meta',
  'React.Typography' = 'React.Typography',
  'React.Typography.Title' = 'React.Typography.Title',
  'React.Typography.Text' = 'React.Typography.Text',
  'React.Typography.Paragraph' = 'React.Typography.Paragraph',
  'React.Alert' = 'React.Alert',
  'React.Affix' = 'React.Affix',
  'React.AutoComplete' = 'React.AutoComplete',
  'React.Button' = 'React.Button',
  'React.Breadcrumb' = 'React.Breadcrumb',
  'React.Breadcrumb.Item' = 'React.Breadcrumb.Item',
  'React.Dropdown' = 'React.Dropdown',
  'React.Form' = 'React.Form',
  'React.Form.Item' = 'React.Form.Item',
  'React.Form.ItemHook' = 'React.Form.ItemHook',
  'React.Form.List' = 'React.Form.List',
  'React.Checkbox' = 'React.Checkbox',
  'React.Input' = 'React.Input',
  'React.InputNumber' = 'React.InputNumber',
  'React.Select' = 'React.Select',
  'React.Select.Option' = 'React.Select.Option',
  'React.Grid' = 'React.Grid',
  'React.ResponsiveGrid' = 'React.ResponsiveGrid',
  'React.Provider' = 'React.Provider',
  'React.Modal' = 'React.Modal',
  'React.Radio.Group' = 'React.Radio.Group',
  'React.Radio' = 'React.Radio',
  'React.Rate' = 'React.Rate',
  'React.Slider' = 'React.Slider',
  'React.Switch' = 'React.Switch',
  'React.Table' = 'React.Table',
  'React.Space' = 'React.Space',
  'React.DatePicker' = 'React.DatePicker',
  'React.Divider' = 'React.Divider',
  'React.Pagination' = 'React.Pagination',
  'React.PageHeader' = 'React.PageHeader',
  'React.Badge' = 'React.Badge',
  'React.Avatar' = 'React.Avatar',
  'React.Comment' = 'React.Comment',
  'React.Calendar' = 'React.Calendar',
  'React.Descriptions' = 'React.Descriptions',
  'React.Descriptions.Item' = 'React.Descriptions.Item',
  'React.Empty' = 'React.Empty',
  'React.Timeline' = 'React.Timeline',
  'React.Timeline.Item' = 'React.Timeline.Item',
  'React.Tabs' = 'React.Tabs',
  'React.Tabs.TabPane' = 'React.Tabs.TabPane',
  'React.Statistic' = 'React.Statistic',
  'React.Tooltip' = 'React.Tooltip',
  'React.Tag' = 'React.Tag',
  'React.Tree' = 'React.Tree',
  'React.Drawer' = 'React.Drawer',
  'React.Progress' = 'React.Progress',
  'React.Result' = 'React.Result',
  'React.Spin' = 'React.Spin',
  'React.Skeleton' = 'React.Skeleton',
  'React.Anchor' = 'React.Anchor',
  'React.Anchor.Link' = 'React.Anchor.Link',
  'React.BackTop' = 'React.BackTop',
  'React.ConfigProvider' = 'React.ConfigProvider',
  'React.Popconfirm' = 'React.Popconfirm',
  'React.Transfer' = 'React.Transfer',
  'React.TreeSelect' = 'React.TreeSelect',
  'React.TreeNode' = 'React.TreeNode',
  'React.TimePicker' = 'React.TimePicker',
  'React.Upload' = 'React.Upload',
  'React.Steps' = 'React.Steps',
  'React.Steps.Step' = 'React.Steps.Step',
  'React.Collapse' = 'React.Collapse',
  'React.Collapse.Panel' = 'React.Collapse.Panel',
  'React.Carousel' = 'React.Carousel',
  'React.List' = 'React.List',
  'React.List.Item' = 'React.List.Item',
  'React.List.Item.Meta' = 'React.List.Item.Meta',
  'React.Mentions' = 'React.Mentions',
  'React.Mentions.Option' = 'React.Mentions.Option',
  'React.Layout' = 'React.Layout',
  'React.Layout.Header' = 'React.Layout.Header',
  'React.Layout.Sider' = 'React.Layout.Sider',
  'React.Layout.Content' = 'React.Layout.Content',
  'React.Layout.Footer' = 'React.Layout.Footer',
  'React.Cascader' = 'React.Cascader',
  'React.Popover' = 'React.Popover',
  'React.RenderComponent' = 'React.RenderComponent',
  'React.RenderContainer' = 'React.RenderContainer',
  /**
   * Mongoose Model
   */
  Model = 'Model',
  /**
   * Mongoose Schema
   */
  Schema = 'Schema',
  /**
   * Non-react tree, requires ID
   */
  Tree = 'Tree',
  /**
   * Flat array, uses ref to build tree, requires parentRef, childrenRef
   */
  Ref = 'Ref',
}

/**
 * All possible values
 */
export const nodeTypeLiterals: Array<NodeTypeLiteral> = [
  ...Object.values(NodeType),
]

export type NodeTypeLiteral = keyof typeof NodeType
