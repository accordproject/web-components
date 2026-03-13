/**
 * TemplateMark JSON types — mirrors the Concerto model from
 * @accordproject/template-engine org.accordproject.templatemark@0.5.0
 */

export type TemplateMarkNodeType =
  | 'org.accordproject.templatemark@0.5.0.ContractDefinition'
  | 'org.accordproject.templatemark@0.5.0.ClauseDefinition'
  | 'org.accordproject.templatemark@0.5.0.VariableDefinition'
  | 'org.accordproject.templatemark@0.5.0.FormattedVariableDefinition'
  | 'org.accordproject.templatemark@0.5.0.EnumVariableDefinition'
  | 'org.accordproject.templatemark@0.5.0.FormulaDefinition'
  | 'org.accordproject.templatemark@0.5.0.ConditionalDefinition'
  | 'org.accordproject.templatemark@0.5.0.OptionalDefinition'
  | 'org.accordproject.templatemark@0.5.0.WithDefinition'
  | 'org.accordproject.templatemark@0.5.0.ListBlockDefinition'
  | 'org.accordproject.templatemark@0.5.0.ForeachDefinition'
  | 'org.accordproject.templatemark@0.5.0.JoinDefinition'
  // Block-level variants (distinct from inline)
  | 'org.accordproject.templatemark@0.5.0.WithBlockDefinition'
  | 'org.accordproject.templatemark@0.5.0.ConditionalBlockDefinition'
  | 'org.accordproject.templatemark@0.5.0.OptionalBlockDefinition'
  // CommonMark types
  | 'org.accordproject.commonmark@0.5.0.Document'
  | 'org.accordproject.commonmark@0.5.0.Paragraph'
  | 'org.accordproject.commonmark@0.5.0.Heading'
  | 'org.accordproject.commonmark@0.5.0.Text'
  | 'org.accordproject.commonmark@0.5.0.Strong'
  | 'org.accordproject.commonmark@0.5.0.Emph'
  | 'org.accordproject.commonmark@0.5.0.BlockQuote'
  | 'org.accordproject.commonmark@0.5.0.Code'
  | 'org.accordproject.commonmark@0.5.0.CodeBlock'
  | 'org.accordproject.commonmark@0.5.0.HtmlInline'
  | 'org.accordproject.commonmark@0.5.0.HtmlBlock'
  | 'org.accordproject.commonmark@0.5.0.Link'
  | 'org.accordproject.commonmark@0.5.0.Image'
  | 'org.accordproject.commonmark@0.5.0.List'
  | 'org.accordproject.commonmark@0.5.0.Item'
  | 'org.accordproject.commonmark@0.5.0.ThematicBreak'
  | 'org.accordproject.commonmark@0.5.0.Softbreak'
  | string;

export interface BaseTemplateMarkNode {
  $class: TemplateMarkNodeType;
  nodes?: TemplateMarkNode[];
}

export interface TextNode extends BaseTemplateMarkNode {
  $class: 'org.accordproject.commonmark@0.5.0.Text';
  text: string;
}

export interface ParagraphNode extends BaseTemplateMarkNode {
  $class: 'org.accordproject.commonmark@0.5.0.Paragraph';
  nodes: TemplateMarkNode[];
}

export interface HeadingNode extends BaseTemplateMarkNode {
  $class: 'org.accordproject.commonmark@0.5.0.Heading';
  level: string;
  nodes: TemplateMarkNode[];
}

export interface StrongNode extends BaseTemplateMarkNode {
  $class: 'org.accordproject.commonmark@0.5.0.Strong';
  nodes: TemplateMarkNode[];
}

export interface EmphNode extends BaseTemplateMarkNode {
  $class: 'org.accordproject.commonmark@0.5.0.Emph';
  nodes: TemplateMarkNode[];
}

export interface VariableDefinitionNode extends BaseTemplateMarkNode {
  $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition';
  name: string;
  elementType?: string;
  identifiedBy?: string;
  decorators?: unknown[];
  nodes?: TemplateMarkNode[];
}

export interface FormattedVariableDefinitionNode extends BaseTemplateMarkNode {
  $class: 'org.accordproject.templatemark@0.5.0.FormattedVariableDefinition';
  name: string;
  elementType?: string;
  format?: string;
  nodes?: TemplateMarkNode[];
}

export interface EnumVariableDefinitionNode extends BaseTemplateMarkNode {
  $class: 'org.accordproject.templatemark@0.5.0.EnumVariableDefinition';
  name: string;
  elementType?: string;
  enumValues: string[];
  value?: string;
}

export interface FormulaDefinitionNode extends BaseTemplateMarkNode {
  $class: 'org.accordproject.templatemark@0.5.0.FormulaDefinition';
  name: string;
  elementType?: string;
  dependencies?: string[];
  code?: { $class: 'org.accordproject.templatemark@0.5.0.Code'; type: 'TYPESCRIPT' | 'ES_2020'; contents: string };
  value?: string;
}

export interface ConditionalDefinitionNode extends BaseTemplateMarkNode {
  $class: 'org.accordproject.templatemark@0.5.0.ConditionalDefinition';
  name: string;
  condition?: string;
  dependencies?: string[];
  isTrue?: boolean;
  whenTrue: TemplateMarkNode[];
  whenFalse: TemplateMarkNode[];
}

export interface OptionalDefinitionNode extends BaseTemplateMarkNode {
  $class: 'org.accordproject.templatemark@0.5.0.OptionalDefinition';
  name: string;
  hasSome?: boolean;
  whenSome: TemplateMarkNode[];
  whenNone: TemplateMarkNode[];
}

export interface WithDefinitionNode extends BaseTemplateMarkNode {
  $class: 'org.accordproject.templatemark@0.5.0.WithDefinition';
  name: string;
  elementType?: string;
  nodes?: TemplateMarkNode[];
}

export interface ListBlockDefinitionNode extends BaseTemplateMarkNode {
  $class: 'org.accordproject.templatemark@0.5.0.ListBlockDefinition';
  name?: string;
  elementType?: string;
  listType?: string;
  tight?: boolean;
  start?: number;
  delimiter?: string;
  nodes?: TemplateMarkNode[];
}

export interface ForeachDefinitionNode extends BaseTemplateMarkNode {
  $class: 'org.accordproject.templatemark@0.5.0.ForeachDefinition';
  name: string;
  elementType?: string;
  nodes?: TemplateMarkNode[];
}

export interface JoinDefinitionNode extends BaseTemplateMarkNode {
  $class: 'org.accordproject.templatemark@0.5.0.JoinDefinition';
  name: string;
  elementType?: string;
  separator?: string;
  locale?: string;
  listFormatType?: string;
}

export interface ClauseDefinitionNode extends BaseTemplateMarkNode {
  $class: 'org.accordproject.templatemark@0.5.0.ClauseDefinition';
  name: string;
  src?: string;
  elementType?: string;
  condition?: CodeNode;
  error?: string;
  parseable?: boolean;
  nodes?: TemplateMarkNode[];
}

export interface ContractDefinitionNode extends BaseTemplateMarkNode {
  $class: 'org.accordproject.templatemark@0.5.0.ContractDefinition';
  name?: string;
  elementType?: string;
  nodes?: TemplateMarkNode[];
}

export interface DocumentNode extends BaseTemplateMarkNode {
  $class: 'org.accordproject.commonmark@0.5.0.Document';
  xmlns?: string;
  nodes?: TemplateMarkNode[];
}

// ── Block Definition types (distinct from inline variants) ────────────────────

export interface CodeNode {
  $class: 'org.accordproject.templatemark@0.5.0.Code';
  type: 'TYPESCRIPT' | 'ES_2020';
  contents: string;
}

export interface WithBlockDefinitionNode extends BaseTemplateMarkNode {
  $class: 'org.accordproject.templatemark@0.5.0.WithBlockDefinition';
  name: string;
  elementType?: string;
  nodes?: TemplateMarkNode[];
}

export interface ConditionalBlockDefinitionNode extends BaseTemplateMarkNode {
  $class: 'org.accordproject.templatemark@0.5.0.ConditionalBlockDefinition';
  name: string;
  condition?: CodeNode;
  whenTrue: TemplateMarkNode[];
  whenFalse: TemplateMarkNode[];
}

export interface OptionalBlockDefinitionNode extends BaseTemplateMarkNode {
  $class: 'org.accordproject.templatemark@0.5.0.OptionalBlockDefinition';
  name: string;
  whenSome: TemplateMarkNode[];
  whenNone: TemplateMarkNode[];
}

// ── CommonMark types ──────────────────────────────────────────────────────────

export interface ImageNode extends BaseTemplateMarkNode {
  $class: 'org.accordproject.commonmark@0.5.0.Image';
  destination: string;
  title?: string;
  nodes?: TemplateMarkNode[]; // Alt text as Text nodes
}

export interface ThematicBreakNode extends BaseTemplateMarkNode {
  $class: 'org.accordproject.commonmark@0.5.0.ThematicBreak';
}

export interface HtmlInlineNode extends BaseTemplateMarkNode {
  $class: 'org.accordproject.commonmark@0.5.0.HtmlInline';
  text: string;
}

export interface HtmlBlockNode extends BaseTemplateMarkNode {
  $class: 'org.accordproject.commonmark@0.5.0.HtmlBlock';
  text: string;
}

export type TemplateMarkNode =
  | TextNode
  | ParagraphNode
  | HeadingNode
  | StrongNode
  | EmphNode
  | VariableDefinitionNode
  | FormattedVariableDefinitionNode
  | EnumVariableDefinitionNode
  | FormulaDefinitionNode
  | ConditionalDefinitionNode
  | OptionalDefinitionNode
  | WithDefinitionNode
  | ListBlockDefinitionNode
  | ForeachDefinitionNode
  | JoinDefinitionNode
  | ClauseDefinitionNode
  | ContractDefinitionNode
  | DocumentNode
  // Block definition types
  | WithBlockDefinitionNode
  | ConditionalBlockDefinitionNode
  | OptionalBlockDefinitionNode
  // CommonMark types
  | ImageNode
  | ThematicBreakNode
  | HtmlInlineNode
  | HtmlBlockNode
  | BaseTemplateMarkNode;

export type TemplateMarkDocument = ContractDefinitionNode | DocumentNode | ClauseDefinitionNode;
