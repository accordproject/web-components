export type { TemplateMarkDocument, TemplateMarkNode } from './TemplateMark';
import type { ModelManager } from '@accordproject/concerto-core';

export interface ValidationError {
  message: string;
  severity: 'error' | 'warning';
  location?: {
    line?: number;
    column?: number;
    nodeType?: string;
    nodeName?: string;
  };
}

export interface TemplateEditorProps {
  /** TemplateMark JSON document to initialise from */
  value?: import('./TemplateMark').TemplateMarkDocument;
  /** Called with updated TemplateMark JSON on every document change */
  onChange?: (doc: import('./TemplateMark').TemplateMarkDocument) => void;
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
