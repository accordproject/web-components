import type { JSONContent } from '@tiptap/core';
import type { TemplateMarkDocument, TemplateMarkNode } from '../types/TemplateMark';
import { convertChildren } from './nodeConverters';

export function templateMarkToTipTap(doc: TemplateMarkDocument): JSONContent {
  const cls = doc.$class;

  if (cls === 'org.accordproject.templatemark@0.5.0.ContractDefinition' ||
      cls === 'org.accordproject.commonmark@0.5.0.Document') {
    return {
      type: 'doc',
      content: convertChildren((doc.nodes ?? []) as TemplateMarkNode[]),
    };
  }

  if (cls === 'org.accordproject.templatemark@0.5.0.ClauseDefinition') {
    const n = doc as { $class: string; name: string; src?: string; elementType?: string; error?: string; parseable?: boolean; nodes?: TemplateMarkNode[] };
    return {
      type: 'doc',
      content: [
        {
          type: 'clause',
          attrs: {
            name: n.name,
            src: n.src ?? null,
            elementType: n.elementType ?? null,
            error: n.error ?? null,
            parseable: n.parseable ?? true,
          },
          content: convertChildren(n.nodes ?? [{ $class: 'org.accordproject.commonmark@0.5.0.Paragraph', nodes: [] } as TemplateMarkNode]),
        },
      ],
    };
  }

  const fallbackDoc = doc as { nodes?: TemplateMarkNode[] };
  return {
    type: 'doc',
    content: convertChildren(fallbackDoc.nodes ?? []),
  };
}
