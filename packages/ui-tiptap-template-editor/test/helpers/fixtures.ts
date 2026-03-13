import type {
  ContractDefinitionNode,
  ClauseDefinitionNode,
  TemplateMarkNode,
} from '../../src/types/TemplateMark';
import type { TemplateMarkDocument } from '../../src/types/TemplateMark';

export const makeContract = (
  nodes: ContractDefinitionNode['nodes'],
  name = 'template'
): ContractDefinitionNode => ({
  $class: 'org.accordproject.templatemark@0.5.0.ContractDefinition',
  name,
  nodes,
});

/** Minimal template: single paragraph with text. */
export const minimalTemplate: TemplateMarkDocument = makeContract([
  {
    $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
    nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Hello world' }],
  },
]);

/** Template with a single variable. */
export const variableTemplate: TemplateMarkDocument = makeContract([
  {
    $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
    nodes: [
      { $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Party: ' },
      {
        $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
        name: 'partyName',
        elementType: 'String',
        nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Acme Corp' }],
      } as TemplateMarkNode,
    ],
  },
]);

/**
 * NDA-style template covering all inline node types:
 * FormattedVariableDefinition, VariableDefinition, ConditionalDefinition,
 * EnumVariableDefinition, OptionalDefinition, FormulaDefinition
 */
export const ndaTemplate: TemplateMarkDocument = makeContract(
  [
    {
      $class: 'org.accordproject.commonmark@0.5.0.Heading',
      level: '1',
      nodes: [
        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Non-Disclosure Agreement' },
      ],
    },
    // Paragraph 1: FormattedVariableDefinition + two VariableDefinitions
    {
      $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
      nodes: [
        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Effective date: ' },
        {
          $class: 'org.accordproject.templatemark@0.5.0.FormattedVariableDefinition',
          name: 'effectiveDate',
          elementType: 'DateTime',
          format: 'YYYY-MM-DD',
          nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: '2024-01-01' }],
        } as TemplateMarkNode,
        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: '. This agreement is between ' },
        {
          $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
          name: 'disclosingParty',
          elementType: 'String',
          nodes: [
            { $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Disclosing Party' },
          ],
        } as TemplateMarkNode,
        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: ' and ' },
        {
          $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
          name: 'receivingParty',
          elementType: 'String',
          nodes: [
            { $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Receiving Party' },
          ],
        } as TemplateMarkNode,
        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: '.' },
      ],
    },
    // Paragraph 2: ConditionalDefinition
    {
      $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
      nodes: [
        {
          $class: 'org.accordproject.templatemark@0.5.0.ConditionalDefinition',
          name: 'isMutual',
          isTrue: false,
          whenTrue: [
            { $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'This is a mutual NDA.' },
          ],
          whenFalse: [
            {
              $class: 'org.accordproject.commonmark@0.5.0.Text',
              text: 'This is a one-way NDA.',
            },
          ],
        } as TemplateMarkNode,
      ],
    },
    // Paragraph 3: EnumVariableDefinition
    {
      $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
      nodes: [
        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Jurisdiction: ' },
        {
          $class: 'org.accordproject.templatemark@0.5.0.EnumVariableDefinition',
          name: 'jurisdiction',
          elementType: 'String',
          enumValues: ['California', 'New York', 'Delaware', 'Texas'],
          value: 'California',
        } as TemplateMarkNode,
      ],
    },
    // Paragraph 4: OptionalDefinition
    {
      $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
      nodes: [
        {
          $class: 'org.accordproject.templatemark@0.5.0.OptionalDefinition',
          name: 'arbitration',
          hasSome: false,
          whenSome: [
            { $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Arbitration applies.' },
          ],
          whenNone: [
            { $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'No arbitration.' },
          ],
        } as TemplateMarkNode,
      ],
    },
    // Paragraph 5: VariableDefinition (Integer) + FormulaDefinition
    {
      $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
      nodes: [
        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Term: ' },
        {
          $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
          name: 'termYears',
          elementType: 'Integer',
          nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: '2' }],
        } as TemplateMarkNode,
        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: ' years. Total days: ' },
        {
          $class: 'org.accordproject.templatemark@0.5.0.FormulaDefinition',
          name: 'totalDays',
          elementType: 'Integer',
          dependencies: ['termYears'],
          code: {
            $class: 'org.accordproject.templatemark@0.5.0.Code',
            type: 'TYPESCRIPT',
            contents: 'data.termYears * 365',
          },
          nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: '730' }],
        } as TemplateMarkNode,
        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: '.' },
      ],
    },
  ],
  'ndaTemplate'
);

/** Block-level template covering all block node types. */
export const blockTemplate: TemplateMarkDocument = makeContract(
  [
    // ConditionalBlockDefinition
    {
      $class: 'org.accordproject.templatemark@0.5.0.ConditionalBlockDefinition',
      name: 'showSection',
      whenTrue: [
        {
          $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
          nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Section is visible.' }],
        },
      ],
      whenFalse: [
        {
          $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
          nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Section is hidden.' }],
        },
      ],
    } as TemplateMarkNode,
    // OptionalBlockDefinition
    {
      $class: 'org.accordproject.templatemark@0.5.0.OptionalBlockDefinition',
      name: 'bonusClause',
      whenSome: [
        {
          $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
          nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Bonus applies.' }],
        },
      ],
      whenNone: [
        {
          $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
          nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'No bonus.' }],
        },
      ],
    } as TemplateMarkNode,
    // WithBlockDefinition
    {
      $class: 'org.accordproject.templatemark@0.5.0.WithBlockDefinition',
      name: 'partyDetails',
      nodes: [
        {
          $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
          nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Party block content.' }],
        },
      ],
    } as TemplateMarkNode,
    // ClauseDefinition as nested block
    {
      $class: 'org.accordproject.templatemark@0.5.0.ClauseDefinition',
      name: 'paymentClause',
      nodes: [
        {
          $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
          nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Payment terms apply.' }],
        },
      ],
    } as TemplateMarkNode,
  ],
  'blockTemplate'
);

/** Clause-rooted template: ClauseDefinition as the root document. */
export const clauseTemplate: TemplateMarkDocument = {
  $class: 'org.accordproject.templatemark@0.5.0.ClauseDefinition',
  name: 'payment-clause',
  src: 'payment@1.0.0',
  nodes: [
    {
      $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
      nodes: [
        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'The payment amount is ' },
        {
          $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
          name: 'amount',
          elementType: 'Double',
          nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: '1000' }],
        } as TemplateMarkNode,
        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: ' USD.' },
      ],
    },
  ],
} as ClauseDefinitionNode;

/**
 * Service agreement template — covers:
 * FormattedVariable, Variable, ClauseDefinition (with nested ListBlock + ListItems),
 * FormulaDefinition, ThematicBreak, Image nodes.
 *
 * Based on the user-supplied template:
 *   SERVICE AGREEMENT — effectiveDate, clientName, clientAddress,
 *   providerName, providerAddress; clause compensation with ulist services
 *   (description, rate, quantity, paymentTerms); totalValue formula; images.
 *
 * The formula `return ' + compensation...` in the original had a typo;
 * fixed to `return '' + compensation...` (empty-string coercion).
 */
export const serviceAgreementTemplate: TemplateMarkDocument = makeContract(
  [
    // # SERVICE AGREEMENT
    {
      $class: 'org.accordproject.commonmark@0.5.0.Heading',
      level: '1',
      nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'SERVICE AGREEMENT' }],
    },
    // Parties paragraph — FormattedVariable + 4 Variables
    {
      $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
      nodes: [
        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'This Service Agreement is made and entered into as of ' },
        {
          $class: 'org.accordproject.templatemark@0.5.0.FormattedVariableDefinition',
          name: 'effectiveDate',
          elementType: 'DateTime',
          format: 'D MMMM YYYY',
          nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: '1 January 2024' }],
        } as TemplateMarkNode,
        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: ' by and between ' },
        {
          $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
          name: 'clientName',
          elementType: 'String',
          nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Client Name' }],
        } as TemplateMarkNode,
        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: ', located at ' },
        {
          $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
          name: 'clientAddress',
          elementType: 'String',
          nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: '123 Main St' }],
        } as TemplateMarkNode,
        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: ' (Client), and ' },
        {
          $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
          name: 'providerName',
          elementType: 'String',
          nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Provider Name' }],
        } as TemplateMarkNode,
        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: ', located at ' },
        {
          $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
          name: 'providerAddress',
          elementType: 'String',
          nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: '456 Oak Ave' }],
        } as TemplateMarkNode,
        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: ' (Provider).' },
      ],
    },
    // --- (ThematicBreak)
    { $class: 'org.accordproject.commonmark@0.5.0.ThematicBreak' },
    // ## 1. Services
    {
      $class: 'org.accordproject.commonmark@0.5.0.Heading',
      level: '2',
      nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: '1. Services' }],
    },
    // {{#clause compensation}} ... {{/clause}}
    {
      $class: 'org.accordproject.templatemark@0.5.0.ClauseDefinition',
      name: 'compensation',
      nodes: [
        {
          $class: 'org.accordproject.commonmark@0.5.0.Heading',
          level: '3',
          nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Services Provided' }],
        },
        // {{#ulist services}} - description, rate (formatted), quantity
        {
          $class: 'org.accordproject.templatemark@0.5.0.ListBlockDefinition',
          name: 'services',
          listType: 'bullet',
          tight: true,
          nodes: [
            {
              $class: 'org.accordproject.commonmark@0.5.0.Item',
              nodes: [
                {
                  $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
                  nodes: [
                    {
                      $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
                      name: 'description',
                      elementType: 'String',
                      nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Service' }],
                    } as TemplateMarkNode,
                    { $class: 'org.accordproject.commonmark@0.5.0.Text', text: ' at ' },
                    {
                      $class: 'org.accordproject.templatemark@0.5.0.FormattedVariableDefinition',
                      name: 'rate',
                      elementType: 'Double',
                      format: '0.00',
                      nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: '100.00' }],
                    } as TemplateMarkNode,
                    { $class: 'org.accordproject.commonmark@0.5.0.Text', text: ' per unit \u00d7 ' },
                    {
                      $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
                      name: 'quantity',
                      elementType: 'Integer',
                      nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: '1' }],
                    } as TemplateMarkNode,
                  ],
                },
              ],
            },
          ],
        } as TemplateMarkNode,
        {
          $class: 'org.accordproject.commonmark@0.5.0.Heading',
          level: '3',
          nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Payment Terms' }],
        },
        {
          $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
          nodes: [
            { $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Payment is due within ' },
            {
              $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
              name: 'paymentTerms',
              elementType: 'Integer',
              nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: '30' }],
            } as TemplateMarkNode,
            { $class: 'org.accordproject.commonmark@0.5.0.Text', text: ' days of invoice.' },
          ],
        },
      ],
    } as TemplateMarkNode,
    // ---
    { $class: 'org.accordproject.commonmark@0.5.0.ThematicBreak' },
    // ## 2. Total Compensation
    {
      $class: 'org.accordproject.commonmark@0.5.0.Heading',
      level: '2',
      nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: '2. Total Compensation' }],
    },
    // **Total Service Value:** {{% formula %}}
    // Note: original template had `return ' + compensation...` (typo).
    // Fixed to `return '' + compensation...` (empty-string coercion).
    {
      $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
      nodes: [
        {
          $class: 'org.accordproject.commonmark@0.5.0.Strong',
          nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Total Service Value:' }],
        },
        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: ' ' },
        {
          $class: 'org.accordproject.templatemark@0.5.0.FormulaDefinition',
          name: 'totalValue',
          elementType: 'String',
          dependencies: [],
          code: {
            $class: 'org.accordproject.templatemark@0.5.0.Code',
            type: 'TYPESCRIPT',
            contents: "return '' + compensation.services.map(s => s.rate * s.quantity).reduce((sum, cur) => sum + cur, 0).toFixed(2);",
          },
          nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: '0.00' }],
        } as TemplateMarkNode,
      ],
    },
    // ---
    { $class: 'org.accordproject.commonmark@0.5.0.ThematicBreak' },
    // ## 3. Execution
    {
      $class: 'org.accordproject.commonmark@0.5.0.Heading',
      level: '2',
      nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: '3. Execution' }],
    },
    {
      $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
      nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'IN WITNESS WHEREOF, the parties hereto have executed this Agreement.' }],
    },
    // ### Client:
    {
      $class: 'org.accordproject.commonmark@0.5.0.Heading',
      level: '3',
      nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Client:' }],
    },
    // ![Client Logo](https://ui-avatars.com/api/?name=AcmeCorp&size=40)
    {
      $class: 'org.accordproject.commonmark@0.5.0.Image',
      destination: 'https://ui-avatars.com/api/?name=AcmeCorp&size=40',
      nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Client Logo' }],
    } as TemplateMarkNode,
    {
      $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
      nodes: [
        {
          $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
          name: 'clientName',
          elementType: 'String',
          nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Client Name' }],
        } as TemplateMarkNode,
      ],
    },
    // ### Provider:
    {
      $class: 'org.accordproject.commonmark@0.5.0.Heading',
      level: '3',
      nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Provider:' }],
    },
    // ![provider logo](https://ui-avatars.com/api/?name=DevConsult+Ltd&size=40)
    {
      $class: 'org.accordproject.commonmark@0.5.0.Image',
      destination: 'https://ui-avatars.com/api/?name=DevConsult+Ltd&size=40',
      nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'provider logo' }],
    } as TemplateMarkNode,
    {
      $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
      nodes: [
        {
          $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
          name: 'providerName',
          elementType: 'String',
          nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Provider Name' }],
        } as TemplateMarkNode,
      ],
    },
  ],
  'serviceAgreement'
);
