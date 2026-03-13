import { serializeToMarkdown } from '../../src/utils/serializeTemplate';
import { parseMarkdownTemplate } from '../../src/utils/parseTemplate';
import type { ContractDefinitionNode } from '../../src/types/TemplateMark';

const makeContract = (
  nodes: ContractDefinitionNode['nodes'],
  name = 'template'
): ContractDefinitionNode => ({
  $class: 'org.accordproject.templatemark@0.5.0.ContractDefinition',
  name,
  nodes,
});

describe('serializeToMarkdown', () => {
  it('serializes a paragraph with text to markdown string', () => {
    const doc = makeContract([
      {
        $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
        nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Hello world' }],
      },
    ]);
    const md = serializeToMarkdown(doc);
    expect(typeof md).toBe('string');
    expect(md).toContain('Hello world');
  });

  it('serializes a VariableDefinition to {{varName}} syntax', () => {
    const doc = makeContract([
      {
        $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
        nodes: [
          {
            $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
            name: 'partyName',
            elementType: 'String',
            nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Acme Corp' }],
          },
        ],
      },
    ]);
    const md = serializeToMarkdown(doc);
    expect(md).toContain('{{partyName}}');
  });

  it('serializes a ConditionalDefinition with branches', () => {
    // Note: isTrue is a UI-only property not in the TemplateMark schema;
    // we omit it here so TemplateMarkTransformer.toMarkdownTemplate doesn't reject it
    const doc = makeContract([
      {
        $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
        nodes: [
          {
            $class: 'org.accordproject.templatemark@0.5.0.ConditionalDefinition',
            name: 'isMutual',
            whenTrue: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'mutual' }],
            whenFalse: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'one-way' }],
          },
        ],
      },
    ]);
    const md = serializeToMarkdown(doc);
    expect(typeof md).toBe('string');
    expect(md.length).toBeGreaterThan(5);
  });

  it('serializes a FormulaDefinition to {{% expr %}} syntax', () => {
    const doc = makeContract([
      {
        $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
        nodes: [
          { $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Days: ' },
          {
            $class: 'org.accordproject.templatemark@0.5.0.FormulaDefinition',
            name: 'totalDays',
            elementType: 'Integer',
            dependencies: ['termYears'],
            code: {
              $class: 'org.accordproject.templatemark@0.5.0.Code',
              type: 'TYPESCRIPT' as const,
              contents: 'data.termYears * 365',
            },
          },
        ],
      },
    ]);
    const md = serializeToMarkdown(doc);
    expect(md).toContain('{{% data.termYears * 365 %}}');
    expect(md).not.toContain('Resource');
  });

  it('roundtrips: JSON → markdown → parse → JSON preserves variable names', () => {
    const doc = makeContract([
      {
        $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
        nodes: [
          { $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Party: ' },
          {
            $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
            name: 'partyName',
            elementType: 'String',
            nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Acme' }],
          },
        ],
      },
    ]);
    const md = serializeToMarkdown(doc);
    const reparsed = parseMarkdownTemplate(md);
    expect(reparsed).not.toBeNull();
    expect(JSON.stringify(reparsed)).toContain('partyName');
  });
});
