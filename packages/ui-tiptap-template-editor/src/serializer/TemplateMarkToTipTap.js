import { convertChildren } from './nodeConverters';
export function templateMarkToTipTap(doc) {
    const cls = doc.$class;
    if (cls === 'org.accordproject.templatemark@0.5.0.ContractDefinition' ||
        cls === 'org.accordproject.commonmark@0.5.0.Document') {
        return {
            type: 'doc',
            content: convertChildren((doc.nodes ?? [])),
        };
    }
    if (cls === 'org.accordproject.templatemark@0.5.0.ClauseDefinition') {
        const n = doc;
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
                    content: convertChildren(n.nodes ?? [{ $class: 'org.accordproject.commonmark@0.5.0.Paragraph', nodes: [] }]),
                },
            ],
        };
    }
    const fallbackDoc = doc;
    return {
        type: 'doc',
        content: convertChildren(fallbackDoc.nodes ?? []),
    };
}
