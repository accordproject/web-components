import type { TemplateMarkDocument } from '@accordproject/ui-tiptap-template-editor';

/**
 * NDA template as a flat ContractDefinition (no clause wrapper)
 * so it loads cleanly in the TemplateEditor.
 */
export const ndaTemplate: TemplateMarkDocument = {
  $class: 'org.accordproject.templatemark@0.5.0.ContractDefinition',
  name: 'nda-template',
  nodes: [
    {
      $class: 'org.accordproject.commonmark@0.5.0.Heading',
      level: '1',
      nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Non-Disclosure Agreement' }],
    },
    {
      $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
      nodes: [
        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'This Agreement is entered into as of ' },
        {
          $class: 'org.accordproject.templatemark@0.5.0.FormattedVariableDefinition',
          name: 'effectiveDate',
          elementType: 'DateTime',
          format: 'YYYY-MM-DD',
          nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: '2024-01-01' }],
        },
        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: ', by and between ' },
        {
          $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
          name: 'disclosingParty',
          elementType: 'String',
          nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Acme Corp' }],
        },
        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: ' ("Disclosing Party") and ' },
        {
          $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
          name: 'receivingParty',
          elementType: 'String',
          nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Beta Inc' }],
        },
        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: ' ("Receiving Party").' },
      ],
    },
    {
      $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
      nodes: [
        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'This is a ' },
        {
          $class: 'org.accordproject.templatemark@0.5.0.ConditionalDefinition',
          name: 'isMutual',
          isTrue: false,
          whenTrue: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'mutual' }],
          whenFalse: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'one-way' }],
        },
        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: ' NDA.' },
      ],
    },
    {
      $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
      nodes: [
        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Governing law: ' },
        {
          $class: 'org.accordproject.templatemark@0.5.0.EnumVariableDefinition',
          name: 'jurisdiction',
          elementType: 'String',
          enumValues: ['California', 'New York', 'Delaware', 'Texas'],
          value: 'California',
        },
        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: '.' },
      ],
    },
    {
      $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
      nodes: [
        {
          $class: 'org.accordproject.templatemark@0.5.0.OptionalDefinition',
          name: 'arbitration',
          hasSome: false,
          whenSome: [
            {
              $class: 'org.accordproject.commonmark@0.5.0.Text',
              text: 'Any dispute shall be resolved by binding arbitration.',
            },
          ],
          whenNone: [
            {
              $class: 'org.accordproject.commonmark@0.5.0.Text',
              text: 'Disputes shall be resolved in the courts of the governing jurisdiction.',
            },
          ],
        },
      ],
    },
    {
      $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
      nodes: [
        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'Term: ' },
        {
          $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
          name: 'termYears',
          elementType: 'Integer',
          nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: '2' }],
        },
        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: ' year(s) from the effective date. Total duration in days: ' },
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
          value: '',
        },
        { $class: 'org.accordproject.commonmark@0.5.0.Text', text: '.' },
      ],
    },
  ],
};
