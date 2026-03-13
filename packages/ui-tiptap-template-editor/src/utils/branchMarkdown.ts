/**
 * Helpers to convert the JSON-string branch content stored in
 * conditional/optional node attrs to/from editable markdown.
 */
import type { TemplateMarkDocument } from '../types/TemplateMark';
import { serializeToMarkdown } from './serializeTemplate';
import { parseMarkdownTemplate } from './parseTemplate';

type AnyNode = Record<string, unknown>;

/**
 * Convert branch nodes (stored as JSON string in attrs) → editable markdown string.
 * Returns empty string on parse failure.
 */
export function branchToMarkdown(nodesJson: string): string {
  try {
    const nodes = JSON.parse(nodesJson) as AnyNode[];
    // Determine if the branch contains block-level nodes already
    const hasBlocks = nodes.some((n) => {
      const c = n.$class as string | undefined;
      return c?.includes('Paragraph') || c?.includes('Heading') || c?.includes('BlockQuote');
    });
    const doc: TemplateMarkDocument = {
      $class: 'org.accordproject.templatemark@0.5.0.ContractDefinition',
      name: 'branch',
      nodes: (hasBlocks
        ? nodes
        : [{ $class: 'org.accordproject.commonmark@0.5.0.Paragraph', nodes }]) as unknown as TemplateMarkDocument['nodes'],
    } as unknown as TemplateMarkDocument;
    return serializeToMarkdown(doc).trim();
  } catch {
    return '';
  }
}

/**
 * Convert an edited markdown string back to branch nodes JSON string.
 * Returns '[]' on parse failure.
 */
export function markdownToBranch(md: string): string {
  const trimmed = md.trim();
  if (!trimmed) return '[]';
  try {
    const doc = parseMarkdownTemplate(trimmed, 'branch');
    if (!doc) return '[]';
    const topNodes = (doc as { nodes?: AnyNode[] }).nodes ?? [];
    // Unwrap a single paragraph to inline content for simple cases
    if (
      topNodes.length === 1 &&
      (topNodes[0].$class as string)?.includes('Paragraph')
    ) {
      return JSON.stringify((topNodes[0].nodes as AnyNode[]) ?? []);
    }
    return JSON.stringify(topNodes);
  } catch {
    return '[]';
  }
}

/** Extract a short plain-text preview from a branch nodes JSON string. */
export function branchPreview(nodesJson: string, maxLen = 50): string {
  try {
    const nodes = JSON.parse(nodesJson) as AnyNode[];
    const texts: string[] = [];
    const collect = (n: AnyNode) => {
      if (typeof n.text === 'string') texts.push(n.text);
      for (const key of ['nodes', 'whenTrue', 'whenFalse', 'whenSome', 'whenNone']) {
        if (Array.isArray(n[key])) (n[key] as AnyNode[]).forEach(collect);
      }
    };
    nodes.forEach(collect);
    const full = texts.join('');
    return full.length > maxLen ? full.slice(0, maxLen) + '…' : full;
  } catch {
    return '';
  }
}
