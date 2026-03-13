import { generateConcertoModel, collectVariables } from '../../src/utils/generateConcertoModel';
import type { ContractDefinitionNode } from '../../src/types/TemplateMark';

const makeContract = (
  nodes: ContractDefinitionNode['nodes'],
  name = 'template'
): ContractDefinitionNode => ({
  $class: 'org.accordproject.templatemark@0.5.0.ContractDefinition',
  name,
  nodes,
});

describe('generateConcertoModel', () => {
  it('generates a CTO field for a single String variable', () => {
    const doc = makeContract([
      {
        $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
        nodes: [
          {
            $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
            name: 'partyName',
            elementType: 'String',
            nodes: [],
          },
        ],
      },
    ]);
    const cto = generateConcertoModel(doc);
    expect(cto).toContain('namespace com.template@1.0.0');
    expect(cto).toContain('concept TemplateData');
    expect(cto).toContain('o String partyName');
  });

  it('generates a CTO field with format annotation for FormattedVariable', () => {
    const doc = makeContract([
      {
        $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
        nodes: [
          {
            $class: 'org.accordproject.templatemark@0.5.0.FormattedVariableDefinition',
            name: 'agreementDate',
            elementType: 'DateTime',
            format: 'DD/MM/YYYY',
            nodes: [],
          },
        ],
      },
    ]);
    const cto = generateConcertoModel(doc);
    expect(cto).toContain('o DateTime agreementDate');
    expect(cto).toContain('@format("DD/MM/YYYY")');
  });

  it('deduplicates variables with the same name', () => {
    const doc = makeContract([
      {
        $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
        nodes: [
          {
            $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
            name: 'partyName',
            elementType: 'String',
            nodes: [],
          },
          {
            $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
            name: 'partyName',
            elementType: 'String',
            nodes: [],
          },
        ],
      },
    ]);
    const vars = collectVariables(doc);
    // Should only have one entry
    expect(vars.filter((v) => v.name === 'partyName').length).toBe(1);
  });

  it('generates correct fields for NDA fixture with multiple variable types', () => {
    const doc = makeContract([
      {
        $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
        nodes: [
          {
            $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
            name: 'disclosingParty',
            elementType: 'String',
            nodes: [],
          },
          {
            $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
            name: 'receivingParty',
            elementType: 'String',
            nodes: [],
          },
          {
            $class: 'org.accordproject.templatemark@0.5.0.ConditionalDefinition',
            name: 'isMutual',
            isTrue: false,
            whenTrue: [],
            whenFalse: [],
          },
        ],
      },
    ]);
    const cto = generateConcertoModel(doc);
    expect(cto).toContain('o String disclosingParty');
    expect(cto).toContain('o String receivingParty');
    expect(cto).toContain('o Boolean isMutual');
  });
});
