// @ts-expect-error -- no types for markdown-template
import { TemplateMarkTransformer } from '@accordproject/markdown-template';
/**
 * Recursively strip UI-only properties and normalise field names/types for
 * the @accordproject/markdown-template library's Concerto model, which differs
 * from our internal TypeScript types in several ways:
 *
 * - ConditionalDefinition.isTrue → stripped (UI state)
 * - OptionalDefinition.hasSome   → stripped (UI state)
 * - EnumVariableDefinition.value → stripped (UI state)
 * - ClauseDefinition: src, parseable, error, elementType, condition → stripped
 *   (library's ClauseDefinition model does not include these fields)
 * - ListBlockDefinition.listType → renamed to `type` (library uses `type`)
 * - ListBlockDefinition.tight    → converted Boolean → String (library expects String)
 * - ListBlockDefinition.start    → converted Number → String (library expects String)
 * - ListBlockDefinition: delimiter, elementType → stripped
 */
function stripUIProps(node) {
    const cleaned = { ...node };
    const cls = cleaned.$class;
    // UI-only state fields
    delete cleaned.isTrue; // ConditionalDefinition UI state
    delete cleaned.hasSome; // OptionalDefinition UI state
    delete cleaned.value; // EnumVariableDefinition selected value
    // ClauseDefinition: strip fields not in the library's Concerto model
    if (cls === 'org.accordproject.templatemark@0.5.0.ClauseDefinition') {
        delete cleaned.src;
        delete cleaned.parseable;
        delete cleaned.error;
        delete cleaned.elementType;
        delete cleaned.condition;
    }
    // Image: library requires 'title' (String); default to '' if absent
    if (cls === 'org.accordproject.commonmark@0.5.0.Image') {
        if (cleaned.title === undefined || cleaned.title === null) {
            cleaned.title = '';
        }
    }
    // ListBlockDefinition: normalise to the library's expected field names/types
    if (cls === 'org.accordproject.templatemark@0.5.0.ListBlockDefinition') {
        // Rename listType → type (library uses 'type', not 'listType')
        if (cleaned.listType !== undefined) {
            cleaned.type = cleaned.listType;
            delete cleaned.listType;
        }
        // Convert tight Boolean → String
        if (typeof cleaned.tight === 'boolean') {
            cleaned.tight = String(cleaned.tight);
        }
        // Convert start Number → String
        if (typeof cleaned.start === 'number') {
            cleaned.start = String(cleaned.start);
        }
        delete cleaned.delimiter;
        delete cleaned.elementType;
    }
    for (const key of ['nodes', 'whenTrue', 'whenFalse', 'whenSome', 'whenNone']) {
        if (Array.isArray(cleaned[key])) {
            cleaned[key] = cleaned[key].map(stripUIProps);
        }
    }
    return cleaned;
}
/**
 * Collect FormulaDefinition code expressions in document traversal order.
 * The transformer serializes formula nodes as a broken placeholder
 * ({{%Resource {id=...Code}%}}); we replace them in order with the real expressions.
 */
function collectFormulaExprs(node) {
    const exprs = [];
    if (node.$class === 'org.accordproject.templatemark@0.5.0.FormulaDefinition') {
        const code = node.code;
        if (code && typeof code === 'object' && typeof code.contents === 'string') {
            exprs.push(code.contents);
        }
    }
    for (const key of ['nodes', 'whenTrue', 'whenFalse', 'whenSome', 'whenNone']) {
        if (Array.isArray(node[key])) {
            for (const child of node[key]) {
                exprs.push(...collectFormulaExprs(child));
            }
        }
    }
    return exprs;
}
const FORMULA_PLACEHOLDER = /\{\{%Resource \{id=org\.accordproject\.templatemark@0\.5\.0\.Code\}%\}\}/g;
/** Convert TemplateMark JSON → markdown template string using the official library. */
export function serializeToMarkdown(doc) {
    const cleaned = stripUIProps(doc);
    // Collect formula expressions before the transformer mangles them
    const formulaExprs = collectFormulaExprs(cleaned);
    // toMarkdownTemplate expects a Document wrapper around the ContractDefinition
    const wrapped = {
        $class: 'org.accordproject.commonmark@0.5.0.Document',
        nodes: [cleaned],
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const raw = new TemplateMarkTransformer().toMarkdownTemplate(wrapped);
    // The transformer serializes FormulaDefinition.code (a Code resource) as
    // "{{%Resource {id=...Code}%}}" instead of "{{% expr %}}". Replace in order.
    let i = 0;
    return raw.replace(FORMULA_PLACEHOLDER, () => {
        const expr = formulaExprs[i++] ?? '';
        return `{{% ${expr} %}}`;
    });
}
