// @ts-expect-error -- no types for markdown-template
import { TemplateMarkTransformer } from '@accordproject/markdown-template';
import { ModelManager } from '@accordproject/concerto-core';
import type { TemplateMarkDocument } from '../types/TemplateMark';
import type { ValidationError } from '../types';
import { serializeToMarkdown } from './serializeTemplate';
import { generateConcertoModel } from './generateConcertoModel';

/** Parse an error thrown by TemplateMarkTransformer into a ValidationError. */
function parseTransformerError(err: unknown): ValidationError {
  if (err instanceof Error) {
    const msg = err.message;
    // Try to extract location info from common error message patterns
    const lineMatch = msg.match(/line (\d+)/i);
    const colMatch = msg.match(/column (\d+)/i);
    const nodeMatch = msg.match(/node[Tt]ype[:\s]+(\w+)/);
    const nameMatch = msg.match(/name[:\s]+"?(\w+)"?/);
    return {
      message: msg,
      severity: 'error',
      location: {
        line: lineMatch ? parseInt(lineMatch[1], 10) : undefined,
        column: colMatch ? parseInt(colMatch[1], 10) : undefined,
        nodeType: nodeMatch?.[1],
        nodeName: nameMatch?.[1],
      },
    };
  }
  return { message: String(err), severity: 'error' };
}

/**
 * Validate a TemplateMark document by:
 * 1. Generating a Concerto model from its variables
 * 2. Serializing to markdown
 * 3. Parsing the markdown back with the model (throws on invalid structure)
 */
export async function validateTemplate(
  doc: TemplateMarkDocument,
  modelManager?: ModelManager
): Promise<ValidationError[]> {
  const errors: ValidationError[] = [];
  try {
    const markdown = serializeToMarkdown(doc);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let mm: ModelManager;
    if (modelManager) {
      mm = modelManager;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      mm = new ModelManager({ strict: false });
      const cto = generateConcertoModel(doc);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      mm.addCTOModel(cto, 'template.cto', true);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const transformer = new TemplateMarkTransformer();
    // fromMarkdownTemplate validates the template against the model — throws on error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    transformer.fromMarkdownTemplate({ content: markdown }, mm, 'contract', { verbose: false });
  } catch (err: unknown) {
    errors.push(parseTransformerError(err));
  }
  return errors;
}
