import { serializeToMarkdown } from './serializeTemplate';
import { parseMarkdownTemplate } from './parseTemplate';
/**
 * Convert branch nodes (stored as JSON string in attrs) → editable markdown string.
 * Returns empty string on parse failure.
 */
export function branchToMarkdown(nodesJson) {
    try {
        const nodes = JSON.parse(nodesJson);
        // Determine if the branch contains block-level nodes already
        const hasBlocks = nodes.some((n) => {
            const c = n.$class;
            return c?.includes('Paragraph') || c?.includes('Heading') || c?.includes('BlockQuote');
        });
        const doc = {
            $class: 'org.accordproject.templatemark@0.5.0.ContractDefinition',
            name: 'branch',
            nodes: (hasBlocks
                ? nodes
                : [{ $class: 'org.accordproject.commonmark@0.5.0.Paragraph', nodes }]),
        };
        return serializeToMarkdown(doc).trim();
    }
    catch {
        return '';
    }
}
/**
 * Convert an edited markdown string back to branch nodes JSON string.
 * Returns '[]' on parse failure.
 */
export function markdownToBranch(md) {
    const trimmed = md.trim();
    if (!trimmed)
        return '[]';
    try {
        const doc = parseMarkdownTemplate(trimmed, 'branch');
        if (!doc)
            return '[]';
        const topNodes = doc.nodes ?? [];
        // Unwrap a single paragraph to inline content for simple cases
        if (topNodes.length === 1 &&
            topNodes[0].$class?.includes('Paragraph')) {
            return JSON.stringify(topNodes[0].nodes ?? []);
        }
        return JSON.stringify(topNodes);
    }
    catch {
        return '[]';
    }
}
/** Extract a short plain-text preview from a branch nodes JSON string. */
export function branchPreview(nodesJson, maxLen = 50) {
    try {
        const nodes = JSON.parse(nodesJson);
        const texts = [];
        const collect = (n) => {
            if (typeof n.text === 'string')
                texts.push(n.text);
            for (const key of ['nodes', 'whenTrue', 'whenFalse', 'whenSome', 'whenNone']) {
                if (Array.isArray(n[key]))
                    n[key].forEach(collect);
            }
        };
        nodes.forEach(collect);
        const full = texts.join('');
        return full.length > maxLen ? full.slice(0, maxLen) + '…' : full;
    }
    catch {
        return '';
    }
}
