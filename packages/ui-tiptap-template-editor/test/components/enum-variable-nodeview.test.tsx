import { createTestEditor } from '../helpers/createTestEditor';
import { makeContract } from '../helpers/fixtures';

describe('EnumVariableDefinition node', () => {
  it('loads an EnumVariableDefinition node without error', () => {
    const doc = makeContract([
      {
        $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
        nodes: [
          {
            $class: 'org.accordproject.templatemark@0.5.0.EnumVariableDefinition',
            name: 'jurisdiction',
            elementType: 'String',
            enumValues: ['California', 'New York', 'Delaware'],
            value: 'California',
          },
        ],
      },
    ]);
    const editor = createTestEditor(doc);
    const json = JSON.stringify(editor.getJSON());
    expect(json).toContain('"type":"enumVariable"');
    expect(json).toContain('California');
    editor.destroy();
  });

  it('can update selected value via setNodeMarkup', () => {
    const doc = makeContract([
      {
        $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
        nodes: [
          {
            $class: 'org.accordproject.templatemark@0.5.0.EnumVariableDefinition',
            name: 'state',
            elementType: 'String',
            enumValues: ['CA', 'NY', 'DE'],
            value: 'CA',
          },
        ],
      },
    ]);
    const editor = createTestEditor(doc);
    let pos = -1;
    editor.state.doc.descendants((node, p) => {
      if (node.type.name === 'enumVariable') { pos = p; return false; }
    });
    expect(pos).toBeGreaterThanOrEqual(0);

    editor.chain().command(({ tr, state }) => {
      const node = state.doc.nodeAt(pos);
      if (!node) return false;
      tr.setNodeMarkup(pos, undefined, { ...node.attrs, value: 'NY' });
      return true;
    }).run();

    let selectedValue: string | undefined;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'enumVariable') selectedValue = node.attrs.value as string;
    });
    expect(selectedValue).toBe('NY');
    editor.destroy();
  });

  it('preserves all enumValues through round-trip', () => {
    const { tiptapToTemplateMark } = require('../../src/serializer/TipTapToTemplateMark');
    const doc = makeContract([
      {
        $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
        nodes: [
          {
            $class: 'org.accordproject.templatemark@0.5.0.EnumVariableDefinition',
            name: 'choice',
            elementType: 'String',
            enumValues: ['alpha', 'beta', 'gamma'],
            value: 'alpha',
          },
        ],
      },
    ]);
    const editor = createTestEditor(doc);
    const tm = tiptapToTemplateMark(editor.getJSON(), 'template');
    const tmJson = JSON.stringify(tm);
    expect(tmJson).toContain('alpha');
    expect(tmJson).toContain('beta');
    expect(tmJson).toContain('gamma');
    editor.destroy();
  });
});
