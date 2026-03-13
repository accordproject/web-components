// Main exported component
export { TemplateEditor } from './components/TemplateEditor';
// Sub-components (for custom composition)
export { Toolbar } from './components/Toolbar';
export { MarkdownEditor } from './components/MarkdownEditor';
export { ValidationPanel } from './components/ValidationPanel';
// Hooks (for headless use)
export { useTemplateEditor } from './hooks/useTemplateEditor';
export { useMarkdownSync } from './hooks/useMarkdownSync';
export { useValidation } from './hooks/useValidation';
// Extensions
export { PasteTemplateMarkExtension } from './extensions/PasteTemplateMarkExtension';
// Utilities
export { parseMarkdownTemplate, extractVariableNames, synthesizeCto } from './utils/parseTemplate';
export { serializeToMarkdown } from './utils/serializeTemplate';
export { generateConcertoModel, collectVariables } from './utils/generateConcertoModel';
export { validateTemplate } from './utils/validateTemplate';
// Type constants (for external use)
export { PRIMITIVE_TYPES, ACCORD_PROJECT_TYPES, getFriendlyTypeName, getFullTypeName, isAccordProjectType, getBadgeModifier, } from './constants/types';
// Serializers (for external use)
export { templateMarkToTipTap } from './serializer/TemplateMarkToTipTap';
export { tiptapToTemplateMark } from './serializer/TipTapToTemplateMark';
