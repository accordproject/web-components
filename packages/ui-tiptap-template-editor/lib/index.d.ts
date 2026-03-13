import React$1 from 'react';
import { ModelManager } from '@accordproject/concerto-core';
import { Editor, Extension, JSONContent } from '@tiptap/core';

/**
 * TemplateMark JSON types — mirrors the Concerto model from
 * @accordproject/template-engine org.accordproject.templatemark@0.5.0
 */
type TemplateMarkNodeType = 'org.accordproject.templatemark@0.5.0.ContractDefinition' | 'org.accordproject.templatemark@0.5.0.ClauseDefinition' | 'org.accordproject.templatemark@0.5.0.VariableDefinition' | 'org.accordproject.templatemark@0.5.0.FormattedVariableDefinition' | 'org.accordproject.templatemark@0.5.0.EnumVariableDefinition' | 'org.accordproject.templatemark@0.5.0.FormulaDefinition' | 'org.accordproject.templatemark@0.5.0.ConditionalDefinition' | 'org.accordproject.templatemark@0.5.0.OptionalDefinition' | 'org.accordproject.templatemark@0.5.0.WithDefinition' | 'org.accordproject.templatemark@0.5.0.ListBlockDefinition' | 'org.accordproject.templatemark@0.5.0.ForeachDefinition' | 'org.accordproject.templatemark@0.5.0.JoinDefinition' | 'org.accordproject.templatemark@0.5.0.WithBlockDefinition' | 'org.accordproject.templatemark@0.5.0.ConditionalBlockDefinition' | 'org.accordproject.templatemark@0.5.0.OptionalBlockDefinition' | 'org.accordproject.commonmark@0.5.0.Document' | 'org.accordproject.commonmark@0.5.0.Paragraph' | 'org.accordproject.commonmark@0.5.0.Heading' | 'org.accordproject.commonmark@0.5.0.Text' | 'org.accordproject.commonmark@0.5.0.Strong' | 'org.accordproject.commonmark@0.5.0.Emph' | 'org.accordproject.commonmark@0.5.0.BlockQuote' | 'org.accordproject.commonmark@0.5.0.Code' | 'org.accordproject.commonmark@0.5.0.CodeBlock' | 'org.accordproject.commonmark@0.5.0.HtmlInline' | 'org.accordproject.commonmark@0.5.0.HtmlBlock' | 'org.accordproject.commonmark@0.5.0.Link' | 'org.accordproject.commonmark@0.5.0.Image' | 'org.accordproject.commonmark@0.5.0.List' | 'org.accordproject.commonmark@0.5.0.Item' | 'org.accordproject.commonmark@0.5.0.ThematicBreak' | 'org.accordproject.commonmark@0.5.0.Softbreak' | string;
interface BaseTemplateMarkNode {
    $class: TemplateMarkNodeType;
    nodes?: TemplateMarkNode[];
}
interface TextNode extends BaseTemplateMarkNode {
    $class: 'org.accordproject.commonmark@0.5.0.Text';
    text: string;
}
interface ParagraphNode extends BaseTemplateMarkNode {
    $class: 'org.accordproject.commonmark@0.5.0.Paragraph';
    nodes: TemplateMarkNode[];
}
interface HeadingNode extends BaseTemplateMarkNode {
    $class: 'org.accordproject.commonmark@0.5.0.Heading';
    level: string;
    nodes: TemplateMarkNode[];
}
interface StrongNode extends BaseTemplateMarkNode {
    $class: 'org.accordproject.commonmark@0.5.0.Strong';
    nodes: TemplateMarkNode[];
}
interface EmphNode extends BaseTemplateMarkNode {
    $class: 'org.accordproject.commonmark@0.5.0.Emph';
    nodes: TemplateMarkNode[];
}
interface VariableDefinitionNode extends BaseTemplateMarkNode {
    $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition';
    name: string;
    elementType?: string;
    identifiedBy?: string;
    decorators?: unknown[];
    nodes?: TemplateMarkNode[];
}
interface FormattedVariableDefinitionNode extends BaseTemplateMarkNode {
    $class: 'org.accordproject.templatemark@0.5.0.FormattedVariableDefinition';
    name: string;
    elementType?: string;
    format?: string;
    nodes?: TemplateMarkNode[];
}
interface EnumVariableDefinitionNode extends BaseTemplateMarkNode {
    $class: 'org.accordproject.templatemark@0.5.0.EnumVariableDefinition';
    name: string;
    elementType?: string;
    enumValues: string[];
    value?: string;
}
interface FormulaDefinitionNode extends BaseTemplateMarkNode {
    $class: 'org.accordproject.templatemark@0.5.0.FormulaDefinition';
    name: string;
    elementType?: string;
    dependencies?: string[];
    code?: {
        $class: 'org.accordproject.templatemark@0.5.0.Code';
        type: 'TYPESCRIPT' | 'ES_2020';
        contents: string;
    };
    value?: string;
}
interface ConditionalDefinitionNode extends BaseTemplateMarkNode {
    $class: 'org.accordproject.templatemark@0.5.0.ConditionalDefinition';
    name: string;
    condition?: string;
    dependencies?: string[];
    isTrue?: boolean;
    whenTrue: TemplateMarkNode[];
    whenFalse: TemplateMarkNode[];
}
interface OptionalDefinitionNode extends BaseTemplateMarkNode {
    $class: 'org.accordproject.templatemark@0.5.0.OptionalDefinition';
    name: string;
    hasSome?: boolean;
    whenSome: TemplateMarkNode[];
    whenNone: TemplateMarkNode[];
}
interface WithDefinitionNode extends BaseTemplateMarkNode {
    $class: 'org.accordproject.templatemark@0.5.0.WithDefinition';
    name: string;
    elementType?: string;
    nodes?: TemplateMarkNode[];
}
interface ListBlockDefinitionNode extends BaseTemplateMarkNode {
    $class: 'org.accordproject.templatemark@0.5.0.ListBlockDefinition';
    name?: string;
    elementType?: string;
    listType?: string;
    tight?: boolean;
    start?: number;
    delimiter?: string;
    nodes?: TemplateMarkNode[];
}
interface ForeachDefinitionNode extends BaseTemplateMarkNode {
    $class: 'org.accordproject.templatemark@0.5.0.ForeachDefinition';
    name: string;
    elementType?: string;
    nodes?: TemplateMarkNode[];
}
interface JoinDefinitionNode extends BaseTemplateMarkNode {
    $class: 'org.accordproject.templatemark@0.5.0.JoinDefinition';
    name: string;
    elementType?: string;
    separator?: string;
    locale?: string;
    listFormatType?: string;
}
interface ClauseDefinitionNode extends BaseTemplateMarkNode {
    $class: 'org.accordproject.templatemark@0.5.0.ClauseDefinition';
    name: string;
    src?: string;
    elementType?: string;
    condition?: CodeNode;
    error?: string;
    parseable?: boolean;
    nodes?: TemplateMarkNode[];
}
interface ContractDefinitionNode extends BaseTemplateMarkNode {
    $class: 'org.accordproject.templatemark@0.5.0.ContractDefinition';
    name?: string;
    elementType?: string;
    nodes?: TemplateMarkNode[];
}
interface DocumentNode extends BaseTemplateMarkNode {
    $class: 'org.accordproject.commonmark@0.5.0.Document';
    xmlns?: string;
    nodes?: TemplateMarkNode[];
}
interface CodeNode {
    $class: 'org.accordproject.templatemark@0.5.0.Code';
    type: 'TYPESCRIPT' | 'ES_2020';
    contents: string;
}
interface WithBlockDefinitionNode extends BaseTemplateMarkNode {
    $class: 'org.accordproject.templatemark@0.5.0.WithBlockDefinition';
    name: string;
    elementType?: string;
    nodes?: TemplateMarkNode[];
}
interface ConditionalBlockDefinitionNode extends BaseTemplateMarkNode {
    $class: 'org.accordproject.templatemark@0.5.0.ConditionalBlockDefinition';
    name: string;
    condition?: CodeNode;
    whenTrue: TemplateMarkNode[];
    whenFalse: TemplateMarkNode[];
}
interface OptionalBlockDefinitionNode extends BaseTemplateMarkNode {
    $class: 'org.accordproject.templatemark@0.5.0.OptionalBlockDefinition';
    name: string;
    whenSome: TemplateMarkNode[];
    whenNone: TemplateMarkNode[];
}
interface ImageNode extends BaseTemplateMarkNode {
    $class: 'org.accordproject.commonmark@0.5.0.Image';
    destination: string;
    title?: string;
    nodes?: TemplateMarkNode[];
}
interface ThematicBreakNode extends BaseTemplateMarkNode {
    $class: 'org.accordproject.commonmark@0.5.0.ThematicBreak';
}
interface HtmlInlineNode extends BaseTemplateMarkNode {
    $class: 'org.accordproject.commonmark@0.5.0.HtmlInline';
    text: string;
}
interface HtmlBlockNode extends BaseTemplateMarkNode {
    $class: 'org.accordproject.commonmark@0.5.0.HtmlBlock';
    text: string;
}
type TemplateMarkNode = TextNode | ParagraphNode | HeadingNode | StrongNode | EmphNode | VariableDefinitionNode | FormattedVariableDefinitionNode | EnumVariableDefinitionNode | FormulaDefinitionNode | ConditionalDefinitionNode | OptionalDefinitionNode | WithDefinitionNode | ListBlockDefinitionNode | ForeachDefinitionNode | JoinDefinitionNode | ClauseDefinitionNode | ContractDefinitionNode | DocumentNode | WithBlockDefinitionNode | ConditionalBlockDefinitionNode | OptionalBlockDefinitionNode | ImageNode | ThematicBreakNode | HtmlInlineNode | HtmlBlockNode | BaseTemplateMarkNode;
type TemplateMarkDocument = ContractDefinitionNode | DocumentNode | ClauseDefinitionNode;

interface ValidationError {
    message: string;
    severity: 'error' | 'warning';
    location?: {
        line?: number;
        column?: number;
        nodeType?: string;
        nodeName?: string;
    };
}
interface TemplateEditorProps {
    /** TemplateMark JSON document to initialise from */
    value?: TemplateMarkDocument;
    /** Called with updated TemplateMark JSON on every document change */
    onChange?: (doc: TemplateMarkDocument) => void;
    /** Called when validation state changes */
    onValidation?: (errors: ValidationError[]) => void;
    /** 'rich' | 'markdown' (default 'rich') */
    initialView?: 'rich' | 'markdown';
    /** Show the insert toolbar (default true) */
    showToolbar?: boolean;
    /** Show the markdown toggle button in toolbar (default true) */
    showMarkdownToggle?: boolean;
    /** Show validation error panel (default true) */
    showValidation?: boolean;
    /** Placeholder text when editor is empty */
    placeholder?: string;
    /** Additional CSS class for the root container */
    className?: string;
    /** Color theme for the editor ('light' | 'dark', default 'light') */
    theme?: 'light' | 'dark';
    /** Optional pre-configured ModelManager for validation and markdown parsing. */
    modelManager?: ModelManager;
}

declare const TemplateEditor: React$1.FC<TemplateEditorProps>;

interface ToolbarProps {
    editor: Editor | null;
    view: 'rich' | 'markdown';
    onToggleView: () => void;
    showMarkdownToggle?: boolean;
}
declare const Toolbar: React$1.FC<ToolbarProps>;

interface MarkdownEditorProps {
    value: string;
    onChange: (text: string) => void;
    placeholder?: string;
}
declare const MarkdownEditor: React$1.FC<MarkdownEditorProps>;

interface ValidationPanelProps {
    errors: ValidationError[];
}
declare const ValidationPanel: React$1.FC<ValidationPanelProps>;

interface UseTemplateEditorResult {
    editor: Editor | null;
    nameRef: React.MutableRefObject<string>;
    currentDoc: React.MutableRefObject<TemplateMarkDocument | null>;
}
declare function useTemplateEditor(props: TemplateEditorProps): UseTemplateEditorResult;

interface UseMarkdownSyncResult {
    view: 'rich' | 'markdown';
    markdownText: string;
    setMarkdownText: (text: string) => void;
    toggleView: () => void;
}
declare function useMarkdownSync(editor: Editor | null, nameRef: React.MutableRefObject<string>, modelManager?: ModelManager): UseMarkdownSyncResult;

declare function useValidation(doc: TemplateMarkDocument | null, enabled: boolean, onValidation?: (errors: ValidationError[]) => void, modelManager?: ModelManager): ValidationError[];

/** Intercepts paste events. If clipboard text contains TemplateMark syntax, parse and insert as nodes. */
declare const PasteTemplateMarkExtension: Extension<any, any>;

type Token = {
    type: string;
    attrs?: [string, string][] | null;
    children?: Token[];
};
/** Walk tokens and collect variable names with a best-guess CTO type. */
declare function extractVariableNames(tokens: Token[]): Map<string, string>;
/** Build a synthetic CTO model string from a variable name→type map. */
declare function synthesizeCto(vars: Map<string, string>): string;
/**
 * Parse a markdown template string → TemplateMark JSON using a two-pass approach:
 *  1. Tokenise (no model needed).
 *  2. Extract variable names from tokens and build a synthetic CTO model.
 *  3. Convert tokens → TemplateMark using that model.
 *
 * Returns null if parsing fails (e.g. while the user is mid-edit).
 */
declare function parseMarkdownTemplate(text: string, originalName?: string, modelManager?: ModelManager): TemplateMarkDocument | null;

/** Convert TemplateMark JSON → markdown template string using the official library. */
declare function serializeToMarkdown(doc: TemplateMarkDocument): string;

interface CollectedVar {
    name: string;
    elementType?: string;
    format?: string;
    enumValues?: string[];
}
/** Walk a TemplateMark document and collect all declared variable definitions. */
declare function collectVariables(doc: TemplateMarkDocument): CollectedVar[];
/**
 * Generate a Concerto CTO model string from a TemplateMark document.
 * Walks the document tree to collect all variable definitions.
 */
declare function generateConcertoModel(doc: TemplateMarkDocument): string;

/**
 * Validate a TemplateMark document by:
 * 1. Generating a Concerto model from its variables
 * 2. Serializing to markdown
 * 3. Parsing the markdown back with the model (throws on invalid structure)
 */
declare function validateTemplate(doc: TemplateMarkDocument, modelManager?: ModelManager): Promise<ValidationError[]>;

/**
 * Type constants for template variables and formulas.
 *
 * Defines primitive types and Accord Project complex types used in TemplateMark.
 * The editor stores full qualified names (FQN) for Accord Project types,
 * but displays friendly names in the UI.
 */
/** Primitive types supported in TemplateMark */
declare const PRIMITIVE_TYPES: readonly ["String", "Integer", "Double", "Boolean", "DateTime", "Long"];
/** Accord Project complex types with their full qualified names */
declare const ACCORD_PROJECT_TYPES: {
    readonly MonetaryAmount: "org.accordproject.money@0.3.0.MonetaryAmount";
    readonly Duration: "org.accordproject.time@0.3.0.Duration";
    readonly Period: "org.accordproject.time@0.3.0.Period";
};
type PrimitiveType = typeof PRIMITIVE_TYPES[number];
type AccordProjectTypeName = keyof typeof ACCORD_PROJECT_TYPES;
type AccordProjectTypeFQN = typeof ACCORD_PROJECT_TYPES[AccordProjectTypeName];
/**
 * Get the friendly display name for a type.
 * Returns the FQN suffix for Accord Project types, or the type as-is for primitives.
 * @example getFriendlyTypeName('org.accordproject.money@0.3.0.MonetaryAmount') → 'MonetaryAmount'
 * @example getFriendlyTypeName('String') → 'String'
 */
declare function getFriendlyTypeName(typeOrFqn: string): string;
/**
 * Get the full qualified name for a type.
 * Returns the FQN for Accord Project friendly names, or the type as-is for primitives.
 * @example getFullTypeName('MonetaryAmount') → 'org.accordproject.money@0.3.0.MonetaryAmount'
 * @example getFullTypeName('String') → 'String'
 */
declare function getFullTypeName(friendlyOrType: string): string;
/**
 * Check if a type is an Accord Project complex type (by FQN or friendly name).
 */
declare function isAccordProjectType(typeOrFqn: string): boolean;
/**
 * Get the badge CSS modifier class based on the element type.
 * @example getBadgeModifier('org.accordproject.money@0.3.0.MonetaryAmount') → 'monetary'
 * @example getBadgeModifier('String') → 'variable'
 */
declare function getBadgeModifier(elementType: string | undefined): string;

declare function templateMarkToTipTap(doc: TemplateMarkDocument): JSONContent;

declare function tiptapToTemplateMark(doc: JSONContent, originalName?: string): TemplateMarkDocument;

export { ACCORD_PROJECT_TYPES, MarkdownEditor, PRIMITIVE_TYPES, PasteTemplateMarkExtension, TemplateEditor, Toolbar, ValidationPanel, collectVariables, extractVariableNames, generateConcertoModel, getBadgeModifier, getFriendlyTypeName, getFullTypeName, isAccordProjectType, parseMarkdownTemplate, serializeToMarkdown, synthesizeCto, templateMarkToTipTap, tiptapToTemplateMark, useMarkdownSync, useTemplateEditor, useValidation, validateTemplate };
export type { AccordProjectTypeFQN, AccordProjectTypeName, PrimitiveType, TemplateEditorProps, TemplateMarkDocument, TemplateMarkNode, ValidationError };
