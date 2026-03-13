// @ts-expect-error -- no types for markdown-template
import { TemplateMarkTransformer } from '@accordproject/markdown-template';
import { ModelManager } from '@accordproject/concerto-core';
/** Walk tokens and collect variable names with a best-guess CTO type. */
export function extractVariableNames(tokens) {
    const vars = new Map();
    for (const tok of tokens) {
        const nameAttr = tok.attrs?.find((a) => a[0] === 'name')?.[1];
        if (nameAttr) {
            // First occurrence wins — don't overwrite an already-typed variable
            if (!vars.has(nameAttr)) {
                if (tok.type === 'variable')
                    vars.set(nameAttr, 'String');
                else if (tok.type === 'formula')
                    vars.set(nameAttr, 'Double');
                else if (tok.type?.includes('if'))
                    vars.set(nameAttr, 'Boolean');
                else
                    vars.set(nameAttr, 'String'); // clause, optional, foreach
            }
        }
        if (tok.children) {
            extractVariableNames(tok.children).forEach((type, name) => {
                if (!vars.has(name))
                    vars.set(name, type);
            });
        }
    }
    return vars;
}
/** Build a synthetic CTO model string from a variable name→type map. */
export function synthesizeCto(vars) {
    const fields = [...vars.entries()].map(([n, t]) => `  o ${t} ${n} optional`).join('\n');
    return `namespace generated@1.0.0\n@template\nconcept Template {\n${fields}\n}`;
}
/**
 * Parse a markdown template string → TemplateMark JSON using a two-pass approach:
 *  1. Tokenise (no model needed).
 *  2. Extract variable names from tokens and build a synthetic CTO model.
 *  3. Convert tokens → TemplateMark using that model.
 *
 * Returns null if parsing fails (e.g. while the user is mid-edit).
 */
export function parseMarkdownTemplate(text, originalName) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const transformer = new TemplateMarkTransformer();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        const tokens = transformer.toTokens({ content: text });
        const vars = extractVariableNames(tokens);
        const cto = synthesizeCto(vars);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        const mm = new ModelManager({ strict: false });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        mm.addCTOModel(cto, 'generated.cto', true);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        const result = transformer.tokensToMarkdownTemplate(tokens, mm, 'contract', {
            verbose: false,
        });
        // The result is a Document wrapping a ContractDefinition — unwrap it.
        const nodes = result.nodes;
        if (Array.isArray(nodes) && nodes.length > 0) {
            const contractDef = nodes[0];
            if (originalName)
                contractDef.name = originalName;
            delete contractDef.elementType;
            return contractDef;
        }
        return result;
    }
    catch {
        return null;
    }
}
