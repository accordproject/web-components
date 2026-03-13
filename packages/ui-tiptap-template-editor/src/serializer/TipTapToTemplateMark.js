import { convertTipTapChildren } from './nodeConverters';
export function tiptapToTemplateMark(doc, originalName) {
    if (doc.type !== 'doc') {
        throw new Error(`Expected TipTap doc node, got: ${doc.type}`);
    }
    return {
        $class: 'org.accordproject.templatemark@0.5.0.ContractDefinition',
        name: originalName ?? 'contract',
        nodes: convertTipTapChildren(doc.content ?? []),
    };
}
