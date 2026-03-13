// ——— TemplateMark → TipTap ———
export function tmNodeToTipTap(node) {
    const cls = node.$class;
    if (cls === 'org.accordproject.commonmark@0.5.0.Text') {
        const n = node;
        return { type: 'text', text: n.text ?? '' };
    }
    if (cls === 'org.accordproject.commonmark@0.5.0.Softbreak') {
        return { type: 'hardBreak' };
    }
    if (cls === 'org.accordproject.commonmark@0.5.0.Strong') {
        const children = convertChildren(node.nodes ?? []);
        return children.map(c => ({
            ...c,
            marks: [...(c.marks ?? []), { type: 'bold' }],
        }));
    }
    if (cls === 'org.accordproject.commonmark@0.5.0.Emph') {
        const children = convertChildren(node.nodes ?? []);
        return children.map(c => ({
            ...c,
            marks: [...(c.marks ?? []), { type: 'italic' }],
        }));
    }
    if (cls === 'org.accordproject.commonmark@0.5.0.Paragraph') {
        return {
            type: 'paragraph',
            content: convertChildren(node.nodes ?? []),
        };
    }
    if (cls === 'org.accordproject.commonmark@0.5.0.Heading') {
        const n = node;
        return {
            type: 'heading',
            attrs: { level: parseInt(n.level, 10) || 1 },
            content: convertChildren(n.nodes ?? []),
        };
    }
    if (cls === 'org.accordproject.commonmark@0.5.0.BlockQuote') {
        return {
            type: 'blockquote',
            content: convertChildren(node.nodes ?? []),
        };
    }
    if (cls === 'org.accordproject.commonmark@0.5.0.Code') {
        const n = node;
        return {
            type: 'text',
            text: n.text ?? '',
            marks: [{ type: 'code' }],
        };
    }
    if (cls === 'org.accordproject.commonmark@0.5.0.CodeBlock') {
        const n = node;
        return {
            type: 'codeBlock',
            attrs: { language: n.info ?? null },
            content: [{ type: 'text', text: n.text ?? '' }],
        };
    }
    if (cls === 'org.accordproject.commonmark@0.5.0.Link') {
        const n = node;
        const children = convertChildren(n.nodes ?? []);
        return children.map(c => ({
            ...c,
            marks: [...(c.marks ?? []), { type: 'link', attrs: { href: n.destination ?? '', title: n.title } }],
        }));
    }
    if (cls === 'org.accordproject.commonmark@0.5.0.List') {
        const n = node;
        const isOrdered = n.type === 'ordered';
        return {
            type: isOrdered ? 'orderedList' : 'bulletList',
            attrs: isOrdered ? { start: typeof n.start === 'string' ? parseInt(n.start, 10) : (n.start ?? 1) } : {},
            content: convertChildren(n.nodes ?? []),
        };
    }
    if (cls === 'org.accordproject.templatemark@0.5.0.ListBlockDefinition') {
        const n = node;
        const listType = n.listType ?? n.type ?? 'bullet';
        return {
            type: 'listBlock',
            attrs: {
                name: n.name ?? null,
                elementType: n.elementType ?? null,
                listType,
                tight: typeof n.tight === 'string' ? n.tight === 'true' : (n.tight ?? true),
                start: typeof n.start === 'string' ? parseInt(n.start, 10) : (n.start ?? 1),
                delimiter: n.delimiter ?? null,
            },
            content: convertChildren(n.nodes ?? []),
        };
    }
    if (cls === 'org.accordproject.commonmark@0.5.0.Item') {
        return {
            type: 'listItem',
            content: convertChildren(node.nodes ?? []),
        };
    }
    if (cls === 'org.accordproject.templatemark@0.5.0.ClauseDefinition') {
        const n = node;
        return {
            type: 'clause',
            attrs: {
                name: n.name,
                src: n.src ?? null,
                elementType: n.elementType ?? null,
                error: n.error ?? null,
                parseable: n.parseable ?? true,
            },
            content: convertChildren(n.nodes ?? [{ $class: 'org.accordproject.commonmark@0.5.0.Paragraph', nodes: [] }]),
        };
    }
    if (cls === 'org.accordproject.templatemark@0.5.0.VariableDefinition') {
        const n = node;
        return {
            type: 'variable',
            attrs: {
                name: n.name,
                elementType: n.elementType ?? null,
                identifiedBy: n.identifiedBy ?? null,
                decorators: n.decorators ?? [],
            },
            content: convertChildren(n.nodes ?? []),
        };
    }
    if (cls === 'org.accordproject.templatemark@0.5.0.FormattedVariableDefinition') {
        const n = node;
        return {
            type: 'formattedVariable',
            attrs: {
                name: n.name,
                elementType: n.elementType ?? null,
                format: n.format ?? null,
            },
            content: convertChildren(n.nodes ?? []),
        };
    }
    if (cls === 'org.accordproject.templatemark@0.5.0.EnumVariableDefinition') {
        const n = node;
        return {
            type: 'enumVariable',
            attrs: {
                name: n.name,
                elementType: n.elementType ?? null,
                enumValues: n.enumValues ?? [],
                value: n.value ?? '',
            },
        };
    }
    if (cls === 'org.accordproject.templatemark@0.5.0.FormulaDefinition') {
        const n = node;
        return {
            type: 'formula',
            attrs: {
                name: n.name,
                elementType: n.elementType ?? null,
                dependencies: n.dependencies ?? [],
                codeContents: (n.code?.contents ?? '').trim(),
                value: n.value ?? '',
            },
        };
    }
    if (cls === 'org.accordproject.templatemark@0.5.0.ConditionalDefinition') {
        const n = node;
        return {
            type: 'conditional',
            attrs: {
                name: n.name,
                condition: n.condition ?? null,
                dependencies: n.dependencies ?? [],
                isTrue: n.isTrue ?? false,
                whenTrueJson: JSON.stringify(n.whenTrue ?? []),
                whenFalseJson: JSON.stringify(n.whenFalse ?? []),
            },
        };
    }
    if (cls === 'org.accordproject.templatemark@0.5.0.OptionalDefinition') {
        const n = node;
        return {
            type: 'optional',
            attrs: {
                name: n.name,
                hasSome: n.hasSome ?? false,
                whenSomeJson: JSON.stringify(n.whenSome ?? []),
                whenNoneJson: JSON.stringify(n.whenNone ?? []),
            },
        };
    }
    if (cls === 'org.accordproject.templatemark@0.5.0.WithDefinition') {
        const n = node;
        return {
            type: 'withBlock',
            attrs: { name: n.name, elementType: n.elementType ?? null },
            content: convertChildren(n.nodes ?? []),
        };
    }
    if (cls === 'org.accordproject.templatemark@0.5.0.ForeachDefinition') {
        const n = node;
        return {
            type: 'foreach',
            attrs: { name: n.name, elementType: n.elementType ?? null },
            content: convertChildren(n.nodes ?? []),
        };
    }
    if (cls === 'org.accordproject.templatemark@0.5.0.JoinDefinition') {
        const n = node;
        return {
            type: 'join',
            attrs: {
                name: n.name,
                elementType: n.elementType ?? null,
                separator: n.separator ?? ', ',
                locale: n.locale ?? null,
                listFormatType: n.listFormatType ?? null,
            },
        };
    }
    // ── Block Definition types (distinct from inline variants) ──────────────────
    if (cls === 'org.accordproject.templatemark@0.5.0.ContractDefinition') {
        const n = node;
        return {
            type: 'contract',
            attrs: { name: n.name ?? '', elementType: n.elementType ?? null },
            content: convertChildren(n.nodes ?? [{ $class: 'org.accordproject.commonmark@0.5.0.Paragraph', nodes: [] }]),
        };
    }
    if (cls === 'org.accordproject.templatemark@0.5.0.WithBlockDefinition') {
        const n = node;
        return {
            type: 'withBlockDef',
            attrs: { name: n.name, elementType: n.elementType ?? null },
            content: convertChildren(n.nodes ?? []),
        };
    }
    if (cls === 'org.accordproject.templatemark@0.5.0.ConditionalBlockDefinition') {
        const n = node;
        return {
            type: 'conditionalBlock',
            attrs: {
                name: n.name,
                condition: n.condition ?? null,
            },
            content: [
                {
                    type: 'conditionalBranchTrue',
                    content: convertChildren(n.whenTrue ?? [{ $class: 'org.accordproject.commonmark@0.5.0.Paragraph', nodes: [] }]),
                },
                {
                    type: 'conditionalBranchFalse',
                    content: convertChildren(n.whenFalse ?? [{ $class: 'org.accordproject.commonmark@0.5.0.Paragraph', nodes: [] }]),
                },
            ],
        };
    }
    if (cls === 'org.accordproject.templatemark@0.5.0.OptionalBlockDefinition') {
        const n = node;
        return {
            type: 'optionalBlock',
            attrs: { name: n.name },
            content: [
                {
                    type: 'optionalBranchSome',
                    content: convertChildren(n.whenSome ?? [{ $class: 'org.accordproject.commonmark@0.5.0.Paragraph', nodes: [] }]),
                },
                {
                    type: 'optionalBranchNone',
                    content: convertChildren(n.whenNone ?? [{ $class: 'org.accordproject.commonmark@0.5.0.Paragraph', nodes: [] }]),
                },
            ],
        };
    }
    // ── CommonMark types ────────────────────────────────────────────────────────
    if (cls === 'org.accordproject.commonmark@0.5.0.Image') {
        const n = node;
        const altText = n.nodes?.find((c) => c.$class === 'org.accordproject.commonmark@0.5.0.Text');
        return {
            type: 'image',
            attrs: {
                src: n.destination ?? null,
                alt: altText?.text ?? null,
                title: n.title ?? null,
            },
        };
    }
    if (cls === 'org.accordproject.commonmark@0.5.0.ThematicBreak') {
        return { type: 'thematicBreak' };
    }
    if (cls === 'org.accordproject.commonmark@0.5.0.HtmlInline') {
        const n = node;
        return {
            type: 'htmlInline',
            attrs: { text: n.text ?? '' },
        };
    }
    if (cls === 'org.accordproject.commonmark@0.5.0.HtmlBlock') {
        const n = node;
        return {
            type: 'htmlBlock',
            attrs: { text: n.text ?? '' },
        };
    }
    // Fallback: recurse into children
    if (node.nodes && node.nodes.length > 0) {
        return convertChildren(node.nodes);
    }
    return null;
}
export function convertChildren(nodes) {
    const result = [];
    for (const n of nodes) {
        const converted = tmNodeToTipTap(n);
        if (!converted)
            continue;
        if (Array.isArray(converted)) {
            result.push(...converted);
        }
        else {
            result.push(converted);
        }
    }
    return result;
}
// ——— TipTap → TemplateMark ———
export function tipTapNodeToTM(node) {
    const type = node.type;
    if (type === 'text') {
        const text = node.text ?? '';
        const marks = node.marks ?? [];
        let result = { $class: 'org.accordproject.commonmark@0.5.0.Text', text };
        for (const mark of marks) {
            if (mark.type === 'bold') {
                result = { $class: 'org.accordproject.commonmark@0.5.0.Strong', nodes: [result] };
            }
            else if (mark.type === 'italic') {
                result = { $class: 'org.accordproject.commonmark@0.5.0.Emph', nodes: [result] };
            }
            else if (mark.type === 'code') {
                result = { $class: 'org.accordproject.commonmark@0.5.0.Code', nodes: [result] };
            }
            else if (mark.type === 'link') {
                result = {
                    $class: 'org.accordproject.commonmark@0.5.0.Link',
                    destination: mark.attrs?.href ?? '',
                    title: mark.attrs?.title,
                    nodes: [result],
                };
            }
        }
        return result;
    }
    if (type === 'hardBreak') {
        return { $class: 'org.accordproject.commonmark@0.5.0.Softbreak' };
    }
    if (type === 'paragraph') {
        return {
            $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
            nodes: convertTipTapChildren(node.content ?? []),
        };
    }
    if (type === 'heading') {
        return {
            $class: 'org.accordproject.commonmark@0.5.0.Heading',
            level: String(node.attrs?.level ?? 1),
            nodes: convertTipTapChildren(node.content ?? []),
        };
    }
    if (type === 'blockquote') {
        return {
            $class: 'org.accordproject.commonmark@0.5.0.BlockQuote',
            nodes: convertTipTapChildren(node.content ?? []),
        };
    }
    if (type === 'codeBlock') {
        return {
            $class: 'org.accordproject.commonmark@0.5.0.CodeBlock',
            info: node.attrs?.language ?? null,
            text: (node.content ?? []).map(c => c.text ?? '').join(''),
        };
    }
    if (type === 'listBlock') {
        return {
            $class: 'org.accordproject.templatemark@0.5.0.ListBlockDefinition',
            name: node.attrs?.name ?? null,
            elementType: node.attrs?.elementType ?? null,
            listType: node.attrs?.listType ?? 'bullet',
            tight: node.attrs?.tight ?? true,
            start: node.attrs?.start ?? 1,
            delimiter: node.attrs?.delimiter ?? null,
            nodes: convertTipTapChildren(node.content ?? []),
        };
    }
    if (type === 'listItem') {
        return {
            $class: 'org.accordproject.commonmark@0.5.0.Item',
            nodes: convertTipTapChildren(node.content ?? []),
        };
    }
    if (type === 'bulletList') {
        return {
            $class: 'org.accordproject.commonmark@0.5.0.List',
            type: 'bullet',
            tight: 'true',
            nodes: convertTipTapChildren(node.content ?? []),
        };
    }
    if (type === 'orderedList') {
        return {
            $class: 'org.accordproject.commonmark@0.5.0.List',
            type: 'ordered',
            tight: 'true',
            start: String(node.attrs?.start ?? 1),
            nodes: convertTipTapChildren(node.content ?? []),
        };
    }
    if (type === 'clause') {
        return {
            $class: 'org.accordproject.templatemark@0.5.0.ClauseDefinition',
            name: node.attrs?.name ?? '',
            src: node.attrs?.src ?? undefined,
            elementType: node.attrs?.elementType ?? undefined,
            error: node.attrs?.error ?? undefined,
            parseable: node.attrs?.parseable ?? true,
            nodes: convertTipTapChildren(node.content ?? []),
        };
    }
    if (type === 'variable') {
        return {
            $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
            name: node.attrs?.name ?? '',
            elementType: node.attrs?.elementType ?? undefined,
            identifiedBy: node.attrs?.identifiedBy ?? undefined,
            decorators: node.attrs?.decorators ?? undefined,
            nodes: convertTipTapChildren(node.content ?? []),
        };
    }
    if (type === 'formattedVariable') {
        return {
            $class: 'org.accordproject.templatemark@0.5.0.FormattedVariableDefinition',
            name: node.attrs?.name ?? '',
            elementType: node.attrs?.elementType ?? undefined,
            format: node.attrs?.format ?? undefined,
            nodes: convertTipTapChildren(node.content ?? []),
        };
    }
    if (type === 'enumVariable') {
        return {
            $class: 'org.accordproject.templatemark@0.5.0.EnumVariableDefinition',
            name: node.attrs?.name ?? '',
            elementType: node.attrs?.elementType ?? undefined,
            enumValues: node.attrs?.enumValues ?? [],
            value: node.attrs?.value ?? undefined,
        };
    }
    if (type === 'formula') {
        return {
            $class: 'org.accordproject.templatemark@0.5.0.FormulaDefinition',
            name: node.attrs?.name ?? '',
            elementType: node.attrs?.elementType ?? undefined,
            dependencies: node.attrs?.dependencies ?? [],
            code: node.attrs?.codeContents
                ? { $class: 'org.accordproject.templatemark@0.5.0.Code', type: 'TYPESCRIPT', contents: node.attrs.codeContents }
                : undefined,
            value: node.attrs?.value ?? undefined,
        };
    }
    if (type === 'conditional') {
        let whenTrue = [];
        let whenFalse = [];
        try {
            whenTrue = JSON.parse(node.attrs?.whenTrueJson ?? '[]');
        }
        catch { /* ignore */ }
        try {
            whenFalse = JSON.parse(node.attrs?.whenFalseJson ?? '[]');
        }
        catch { /* ignore */ }
        return {
            $class: 'org.accordproject.templatemark@0.5.0.ConditionalDefinition',
            name: node.attrs?.name ?? '',
            condition: node.attrs?.condition ?? undefined,
            dependencies: node.attrs?.dependencies ?? [],
            isTrue: node.attrs?.isTrue ?? false,
            whenTrue,
            whenFalse,
        };
    }
    if (type === 'optional') {
        let whenSome = [];
        let whenNone = [];
        try {
            whenSome = JSON.parse(node.attrs?.whenSomeJson ?? '[]');
        }
        catch { /* ignore */ }
        try {
            whenNone = JSON.parse(node.attrs?.whenNoneJson ?? '[]');
        }
        catch { /* ignore */ }
        return {
            $class: 'org.accordproject.templatemark@0.5.0.OptionalDefinition',
            name: node.attrs?.name ?? '',
            hasSome: node.attrs?.hasSome ?? false,
            whenSome,
            whenNone,
        };
    }
    if (type === 'withBlock') {
        return {
            $class: 'org.accordproject.templatemark@0.5.0.WithDefinition',
            name: node.attrs?.name ?? '',
            elementType: node.attrs?.elementType ?? undefined,
            nodes: convertTipTapChildren(node.content ?? []),
        };
    }
    if (type === 'foreach') {
        return {
            $class: 'org.accordproject.templatemark@0.5.0.ForeachDefinition',
            name: node.attrs?.name ?? '',
            elementType: node.attrs?.elementType ?? undefined,
            nodes: convertTipTapChildren(node.content ?? []),
        };
    }
    if (type === 'join') {
        return {
            $class: 'org.accordproject.templatemark@0.5.0.JoinDefinition',
            name: node.attrs?.name ?? '',
            elementType: node.attrs?.elementType ?? undefined,
            separator: node.attrs?.separator ?? ', ',
            locale: node.attrs?.locale ?? undefined,
            listFormatType: node.attrs?.listFormatType ?? undefined,
        };
    }
    // ── Block Definition types (distinct from inline variants) ──────────────────
    if (type === 'contract') {
        return {
            $class: 'org.accordproject.templatemark@0.5.0.ContractDefinition',
            name: node.attrs?.name ?? '',
            elementType: node.attrs?.elementType ?? undefined,
            nodes: convertTipTapChildren(node.content ?? []),
        };
    }
    if (type === 'withBlockDef') {
        return {
            $class: 'org.accordproject.templatemark@0.5.0.WithBlockDefinition',
            name: node.attrs?.name ?? '',
            elementType: node.attrs?.elementType ?? undefined,
            nodes: convertTipTapChildren(node.content ?? []),
        };
    }
    if (type === 'conditionalBlock') {
        // Extract branches from nested structure
        const trueBranch = node.content?.find((c) => c.type === 'conditionalBranchTrue');
        const falseBranch = node.content?.find((c) => c.type === 'conditionalBranchFalse');
        return {
            $class: 'org.accordproject.templatemark@0.5.0.ConditionalBlockDefinition',
            name: node.attrs?.name ?? '',
            condition: node.attrs?.condition ?? undefined,
            whenTrue: convertTipTapChildren(trueBranch?.content ?? []),
            whenFalse: convertTipTapChildren(falseBranch?.content ?? []),
        };
    }
    if (type === 'optionalBlock') {
        // Extract branches from nested structure
        const someBranch = node.content?.find((c) => c.type === 'optionalBranchSome');
        const noneBranch = node.content?.find((c) => c.type === 'optionalBranchNone');
        return {
            $class: 'org.accordproject.templatemark@0.5.0.OptionalBlockDefinition',
            name: node.attrs?.name ?? '',
            whenSome: convertTipTapChildren(someBranch?.content ?? []),
            whenNone: convertTipTapChildren(noneBranch?.content ?? []),
        };
    }
    // Skip branch wrapper nodes (they're handled by parent)
    if (type === 'conditionalBranchTrue' || type === 'conditionalBranchFalse' ||
        type === 'optionalBranchSome' || type === 'optionalBranchNone') {
        return convertTipTapChildren(node.content ?? []);
    }
    // ── CommonMark types ────────────────────────────────────────────────────────
    if (type === 'image') {
        const altTextNode = node.attrs?.alt
            ? [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: node.attrs.alt }]
            : [];
        return {
            $class: 'org.accordproject.commonmark@0.5.0.Image',
            destination: node.attrs?.src ?? '',
            title: node.attrs?.title ?? null,
            nodes: altTextNode,
        };
    }
    if (type === 'thematicBreak' || type === 'horizontalRule') {
        return {
            $class: 'org.accordproject.commonmark@0.5.0.ThematicBreak',
        };
    }
    if (type === 'htmlInline') {
        return {
            $class: 'org.accordproject.commonmark@0.5.0.HtmlInline',
            text: node.attrs?.text ?? '',
        };
    }
    if (type === 'htmlBlock') {
        return {
            $class: 'org.accordproject.commonmark@0.5.0.HtmlBlock',
            text: node.attrs?.text ?? '',
        };
    }
    if (type === 'doc') {
        return null;
    }
    return null;
}
export function convertTipTapChildren(nodes) {
    const result = [];
    for (const n of nodes) {
        const converted = tipTapNodeToTM(n);
        if (!converted)
            continue;
        if (Array.isArray(converted)) {
            result.push(...converted);
        }
        else {
            result.push(converted);
        }
    }
    return result;
}
