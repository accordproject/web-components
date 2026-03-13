import { createTestEditor } from '../helpers/createTestEditor';
import { makeContract } from '../helpers/fixtures';

describe('OptionalDefinition node', () => {
  it('loads an OptionalDefinition node without error', () => {
    const doc = makeContract([
      {
        $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
        nodes: [
          {
            $class: 'org.accordproject.templatemark@0.5.0.OptionalDefinition',
            name: 'arbitration',
            hasSome: false,
            whenSome: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'applies' }],
            whenNone: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: '' }],
          },
        ],
      },
    ]);
    const editor = createTestEditor(doc);
    const json = JSON.stringify(editor.getJSON());
    expect(json).toContain('"type":"optional"');
    editor.destroy();
  });

  it('preserves hasSome=true after setNodeMarkup', () => {
    const doc = makeContract([
      {
        $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
        nodes: [
          {
            $class: 'org.accordproject.templatemark@0.5.0.OptionalDefinition',
            name: 'opt',
            hasSome: false,
            whenSome: [],
            whenNone: [],
          },
        ],
      },
    ]);
    const editor = createTestEditor(doc);
    let pos = -1;
    editor.state.doc.descendants((node, p) => {
      if (node.type.name === 'optional') { pos = p; return false; }
    });
    expect(pos).toBeGreaterThanOrEqual(0);

    editor.chain().command(({ tr, state }) => {
      const node = state.doc.nodeAt(pos);
      if (!node) return false;
      tr.setNodeMarkup(pos, undefined, { ...node.attrs, hasSome: true });
      return true;
    }).run();

    let hasSome = false;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'optional') hasSome = node.attrs.hasSome as boolean;
    });
    expect(hasSome).toBe(true);
    editor.destroy();
  });

  it('whenSome and whenNone branches preserved through round-trip', () => {
    const { tiptapToTemplateMark } = require('../../src/serializer/TipTapToTemplateMark');
    const doc = makeContract([
      {
        $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
        nodes: [
          {
            $class: 'org.accordproject.templatemark@0.5.0.OptionalDefinition',
            name: 'opt',
            hasSome: true,
            whenSome: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'some content' }],
            whenNone: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'none content' }],
          },
        ],
      },
    ]);
    const editor = createTestEditor(doc);
    const tm = tiptapToTemplateMark(editor.getJSON(), 'template');
    const tmJson = JSON.stringify(tm);
    expect(tmJson).toContain('some content');
    expect(tmJson).toContain('none content');
    editor.destroy();
  });
});
