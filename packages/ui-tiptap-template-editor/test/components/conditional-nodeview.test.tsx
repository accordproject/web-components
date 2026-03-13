import { createTestEditor } from '../helpers/createTestEditor';
import { makeContract } from '../helpers/fixtures';

describe('ConditionalDefinition node', () => {
  it('loads a ConditionalDefinition node without error', () => {
    const doc = makeContract([
      {
        $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
        nodes: [
          {
            $class: 'org.accordproject.templatemark@0.5.0.ConditionalDefinition',
            name: 'isMutual',
            isTrue: false,
            whenTrue: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'mutual' }],
            whenFalse: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'one-way' }],
          },
        ],
      },
    ]);
    const editor = createTestEditor(doc);
    const json = JSON.stringify(editor.getJSON());
    expect(json).toContain('"type":"conditional"');
    editor.destroy();
  });

  it('preserves isTrue=true after setNodeMarkup', () => {
    const doc = makeContract([
      {
        $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
        nodes: [
          {
            $class: 'org.accordproject.templatemark@0.5.0.ConditionalDefinition',
            name: 'flag',
            isTrue: false,
            whenTrue: [],
            whenFalse: [],
          },
        ],
      },
    ]);
    const editor = createTestEditor(doc);
    let pos = -1;
    editor.state.doc.descendants((node, p) => {
      if (node.type.name === 'conditional') { pos = p; return false; }
    });
    expect(pos).toBeGreaterThanOrEqual(0);

    editor.chain().command(({ tr, state }) => {
      const node = state.doc.nodeAt(pos);
      if (!node) return false;
      tr.setNodeMarkup(pos, undefined, { ...node.attrs, isTrue: true });
      return true;
    }).run();

    let isTrue = false;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'conditional') isTrue = node.attrs.isTrue as boolean;
    });
    expect(isTrue).toBe(true);
    editor.destroy();
  });

  it('whenTrue and whenFalse branches are preserved through round-trip', () => {
    const { tiptapToTemplateMark } = require('../../src/serializer/TipTapToTemplateMark'); const { templateMarkToTipTap } = require('../../src/serializer/TemplateMarkToTipTap');
    const doc = makeContract([
      {
        $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
        nodes: [
          {
            $class: 'org.accordproject.templatemark@0.5.0.ConditionalDefinition',
            name: 'cond',
            isTrue: true,
            whenTrue: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'yes' }],
            whenFalse: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'no' }],
          },
        ],
      },
    ]);
    const editor = createTestEditor(doc);
    const tm = tiptapToTemplateMark(editor.getJSON(), 'template');
    const tmJson = JSON.stringify(tm);
    expect(tmJson).toContain('yes');
    expect(tmJson).toContain('no');
    editor.destroy();
  });
});
