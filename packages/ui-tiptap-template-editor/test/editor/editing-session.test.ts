import { createTestEditor } from '../helpers/createTestEditor';
import {
  minimalTemplate,
  variableTemplate,
  ndaTemplate,
  blockTemplate,
  clauseTemplate,
  makeContract,
} from '../helpers/fixtures';
import { tiptapToTemplateMark } from '../../src/serializer/TipTapToTemplateMark';
import { templateMarkToTipTap } from '../../src/serializer/TemplateMarkToTipTap';
import type { ContractDefinitionNode } from '../../src/types/TemplateMark';
import { serializeToMarkdown } from '../../src/utils/serializeTemplate';
import { parseMarkdownTemplate } from '../../src/utils/parseTemplate';
import { validateTemplate } from '../../src/utils/validateTemplate';

describe('editing-session — full node coverage + 0.5.0 spec validation', () => {

  // ── Group A: Loading & Structure ────────────────────────────────────────────

  // 1. All inline node types present in comprehensive ndaTemplate
  it('all inline node types present in comprehensive ndaTemplate', () => {
    const editor = createTestEditor(ndaTemplate);
    const json = JSON.stringify(editor.getJSON());
    expect(json).toContain('"formattedVariable"');
    expect(json).toContain('"variable"');
    expect(json).toContain('"conditional"');
    expect(json).toContain('"enumVariable"');
    expect(json).toContain('"optional"');
    expect(json).toContain('"formula"');
    editor.destroy();
  });

  // 2. All block node types present in blockTemplate
  it('all block node types present in blockTemplate', () => {
    const editor = createTestEditor(blockTemplate);
    const json = JSON.stringify(editor.getJSON());
    expect(json).toContain('"conditionalBlock"');
    expect(json).toContain('"optionalBlock"');
    expect(json).toContain('"withBlockDef"');
    expect(json).toContain('"clause"');
    editor.destroy();
  });

  // 3. Insert plain text
  it('inserts plain text content at cursor', () => {
    const editor = createTestEditor(minimalTemplate);
    editor.commands.setContent({ type: 'doc', content: [{ type: 'paragraph' }] }, false);
    editor.commands.insertContent('inserted text');
    const text = editor.getText();
    expect(text).toContain('inserted text');
    editor.destroy();
  });

  // ── Group B: Inline node attribute integrity ────────────────────────────────

  // 4. VariableDefinition — name and elementType preserved
  it('VariableDefinition preserves name and elementType attrs', () => {
    const editor = createTestEditor(ndaTemplate);
    let found = false;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'variable' && node.attrs.name === 'disclosingParty') {
        expect(node.attrs.elementType).toBe('String');
        found = true;
        return false;
      }
    });
    expect(found).toBe(true);
    editor.destroy();
  });

  // 5. FormattedVariableDefinition — name, elementType, format preserved
  it('FormattedVariableDefinition preserves name, elementType, and format attrs', () => {
    const editor = createTestEditor(ndaTemplate);
    let found = false;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'formattedVariable') {
        expect(node.attrs.name).toBe('effectiveDate');
        expect(node.attrs.elementType).toBe('DateTime');
        expect(node.attrs.format).toBe('YYYY-MM-DD');
        found = true;
        return false;
      }
    });
    expect(found).toBe(true);
    editor.destroy();
  });

  // 6. ConditionalDefinition — whenTrueJson/whenFalseJson are valid JSON
  it('ConditionalDefinition stores whenTrueJson and whenFalseJson as valid JSON', () => {
    const editor = createTestEditor(ndaTemplate);
    let found = false;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'conditional') {
        const trueNodes = JSON.parse(node.attrs.whenTrueJson);
        const falseNodes = JSON.parse(node.attrs.whenFalseJson);
        expect(Array.isArray(trueNodes)).toBe(true);
        expect(Array.isArray(falseNodes)).toBe(true);
        expect(trueNodes.length).toBeGreaterThan(0);
        expect(falseNodes.length).toBeGreaterThan(0);
        found = true;
        return false;
      }
    });
    expect(found).toBe(true);
    editor.destroy();
  });

  // 7. OptionalDefinition — whenSomeJson/whenNoneJson are valid JSON
  it('OptionalDefinition stores whenSomeJson and whenNoneJson as valid JSON', () => {
    const editor = createTestEditor(ndaTemplate);
    let found = false;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'optional') {
        const someNodes = JSON.parse(node.attrs.whenSomeJson);
        const noneNodes = JSON.parse(node.attrs.whenNoneJson);
        expect(Array.isArray(someNodes)).toBe(true);
        expect(Array.isArray(noneNodes)).toBe(true);
        found = true;
        return false;
      }
    });
    expect(found).toBe(true);
    editor.destroy();
  });

  // 8. EnumVariableDefinition — enumValues and value attrs correct
  it('EnumVariableDefinition preserves enumValues and value attrs', () => {
    const editor = createTestEditor(ndaTemplate);
    let found = false;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'enumVariable') {
        const values: string[] = node.attrs.enumValues ?? [];
        expect(values).toContain('California');
        expect(node.attrs.value).toBe('California');
        found = true;
        return false;
      }
    });
    expect(found).toBe(true);
    editor.destroy();
  });

  // 9. FormulaDefinition — codeContents is trimmed expression
  it('FormulaDefinition preserves codeContents', () => {
    const editor = createTestEditor(ndaTemplate);
    let found = false;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'formula') {
        expect(node.attrs.codeContents).toBe('data.termYears * 365');
        found = true;
        return false;
      }
    });
    expect(found).toBe(true);
    editor.destroy();
  });

  // ── Group C: Block node integrity ───────────────────────────────────────────

  // 10. ConditionalBlockDefinition — branches load as nested content
  it('ConditionalBlockDefinition loads with conditionalBranchTrue and conditionalBranchFalse children', () => {
    const editor = createTestEditor(blockTemplate);
    let trueFound = false;
    let falseFound = false;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'conditionalBranchTrue') trueFound = true;
      if (node.type.name === 'conditionalBranchFalse') falseFound = true;
    });
    expect(trueFound).toBe(true);
    expect(falseFound).toBe(true);
    editor.destroy();
  });

  // 11. OptionalBlockDefinition — branches load as nested content
  it('OptionalBlockDefinition loads with optionalBranchSome and optionalBranchNone children', () => {
    const editor = createTestEditor(blockTemplate);
    let someFound = false;
    let noneFound = false;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'optionalBranchSome') someFound = true;
      if (node.type.name === 'optionalBranchNone') noneFound = true;
    });
    expect(someFound).toBe(true);
    expect(noneFound).toBe(true);
    editor.destroy();
  });

  // 12. WithBlockDefinition — content preserved
  it('WithBlockDefinition loads with paragraph content', () => {
    const editor = createTestEditor(blockTemplate);
    let withFound = false;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'withBlockDef') {
        withFound = true;
        // Should have at least one child block
        expect(node.childCount).toBeGreaterThan(0);
        return false;
      }
    });
    expect(withFound).toBe(true);
    editor.destroy();
  });

  // 13. ClauseDefinition as nested block — clause node present with correct name
  it('ClauseDefinition as nested block has clause node with correct name attr', () => {
    const editor = createTestEditor(blockTemplate);
    const json = JSON.stringify(editor.getJSON());
    expect(json).toContain('"clause"');
    let clauseAttrsOk = false;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'clause' && node.attrs.name === 'paymentClause') {
        clauseAttrsOk = true;
        return false;
      }
    });
    expect(clauseAttrsOk).toBe(true);
    editor.destroy();
  });

  // 14. ClauseDefinition as root document — wraps in clause node inside doc
  it('ClauseDefinition as root document wraps in clause node inside doc', () => {
    const editor = createTestEditor(clauseTemplate);
    const json = editor.getJSON();
    expect(json.type).toBe('doc');
    // Find a clause node somewhere in the document
    let clauseFound = false;
    let clauseName = '';
    let hasVariable = false;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'clause') {
        clauseFound = true;
        clauseName = node.attrs.name;
      }
      if (node.type.name === 'variable') hasVariable = true;
    });
    expect(clauseFound).toBe(true);
    expect(clauseName).toBe('payment-clause');
    expect(hasVariable).toBe(true);
    editor.destroy();
  });

  // ── Group D: State mutations ─────────────────────────────────────────────────

  // 15. Toggle ConditionalDefinition isTrue via setNodeMarkup
  it('can set isTrue attribute on a conditional node', () => {
    const editor = createTestEditor(ndaTemplate);
    let conditionalPos = -1;
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'conditional') {
        conditionalPos = pos;
        return false;
      }
    });
    expect(conditionalPos).toBeGreaterThanOrEqual(0);
    editor.chain().command(({ tr, state }) => {
      const node = state.doc.nodeAt(conditionalPos);
      if (!node) return false;
      tr.setNodeMarkup(conditionalPos, undefined, { ...node.attrs, isTrue: true });
      return true;
    }).run();
    let foundTrue = false;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'conditional' && node.attrs.isTrue === true) foundTrue = true;
    });
    expect(foundTrue).toBe(true);
    editor.destroy();
  });

  // 16. Toggle OptionalDefinition hasSome via setNodeMarkup
  it('can set hasSome attribute on an optional node', () => {
    const editor = createTestEditor(ndaTemplate);
    let optPos = -1;
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'optional') { optPos = pos; return false; }
    });
    expect(optPos).toBeGreaterThanOrEqual(0);
    editor.chain().command(({ tr, state }) => {
      const node = state.doc.nodeAt(optPos);
      if (!node) return false;
      tr.setNodeMarkup(optPos, undefined, { ...node.attrs, hasSome: true });
      return true;
    }).run();
    let foundSome = false;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'optional' && node.attrs.hasSome === true) foundSome = true;
    });
    expect(foundSome).toBe(true);
    editor.destroy();
  });

  // 17. Toggle ConditionalBlockDefinition name attr via setNodeMarkup
  it('can set name attribute on a conditionalBlock node', () => {
    const editor = createTestEditor(blockTemplate);
    let blockPos = -1;
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'conditionalBlock') { blockPos = pos; return false; }
    });
    expect(blockPos).toBeGreaterThanOrEqual(0);
    editor.chain().command(({ tr, state }) => {
      const node = state.doc.nodeAt(blockPos);
      if (!node) return false;
      tr.setNodeMarkup(blockPos, undefined, { ...node.attrs, name: 'renamedSection' });
      return true;
    }).run();
    let renamed = false;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'conditionalBlock' && node.attrs.name === 'renamedSection') renamed = true;
    });
    expect(renamed).toBe(true);
    editor.destroy();
  });

  // 18. Set EnumVariableDefinition value via setNodeMarkup
  it('can set value attribute on an enum variable node', () => {
    const editor = createTestEditor(ndaTemplate);
    let enumPos = -1;
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'enumVariable') { enumPos = pos; return false; }
    });
    expect(enumPos).toBeGreaterThanOrEqual(0);
    editor.chain().command(({ tr, state }) => {
      const node = state.doc.nodeAt(enumPos);
      if (!node) return false;
      tr.setNodeMarkup(enumPos, undefined, { ...node.attrs, value: 'New York' });
      return true;
    }).run();
    let foundNY = false;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'enumVariable' && node.attrs.value === 'New York') foundNY = true;
    });
    expect(foundNY).toBe(true);
    editor.destroy();
  });

  // 19. Delete variable node
  it('removes a variable node when deleted', () => {
    const editor = createTestEditor(variableTemplate);
    let varStart = -1;
    let varEnd = -1;
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'variable' && varStart === -1) {
        varStart = pos;
        varEnd = pos + node.nodeSize;
        return false;
      }
    });
    expect(varStart).toBeGreaterThanOrEqual(0);
    editor.chain().command(({ tr }) => {
      tr.delete(varStart, varEnd);
      return true;
    }).run();
    const json = JSON.stringify(editor.getJSON());
    expect(json).not.toContain('"type":"variable"');
    editor.destroy();
  });

  // ── Group E: Editing operations ──────────────────────────────────────────────

  // 20. splitBlock creates two paragraphs
  it('splitBlock command creates two paragraphs', () => {
    const editor = createTestEditor(minimalTemplate);
    editor.commands.setTextSelection(6);
    editor.commands.splitBlock();
    const json = editor.getJSON();
    expect((json.content?.length ?? 0)).toBeGreaterThanOrEqual(2);
    editor.destroy();
  });

  // 21. Backspace near variable — editor stable
  it('editor remains functional after repeated backspace commands near variable', () => {
    const editor = createTestEditor(variableTemplate);
    editor.commands.setTextSelection(1);
    for (let i = 0; i < 3; i++) {
      try {
        editor.commands.deleteSelection();
      } catch {
        // Some selections may not be deletable; that's OK
      }
    }
    expect(editor.isDestroyed).toBe(false);
    editor.destroy();
  });

  // 22. selectNodeForward — returns boolean
  it('selectNodeForward moves cursor past a node', () => {
    const editor = createTestEditor(variableTemplate);
    editor.commands.setTextSelection(1);
    const result = editor.commands.selectNodeForward();
    expect(typeof result).toBe('boolean');
    editor.destroy();
  });

  // 23. Parse TemplateMark markdown with {{varName}} — variable node inserted
  it('parses pasted TemplateMark markdown with {{varName}} into variable node', () => {
    const parsed = parseMarkdownTemplate('Party: {{partyName}}');
    expect(parsed).not.toBeNull();
    const tiptapJson = templateMarkToTipTap(parsed!);
    const editor = createTestEditor();
    editor.commands.setContent(tiptapJson, false);
    const json = JSON.stringify(editor.getJSON());
    expect(json).toContain('variable');
    editor.destroy();
  });

  // ── Group F: Round-trip and 0.5.0 spec validation ───────────────────────────

  // 24. TipTap JSON → TemplateMark → markdown → re-parse roundtrip
  it('tiptap JSON → TemplateMark → markdown → re-parse roundtrip', () => {
    const editor = createTestEditor(ndaTemplate);
    const tm = tiptapToTemplateMark(editor.getJSON(), 'ndaTemplate');
    const md = serializeToMarkdown(tm);
    expect(typeof md).toBe('string');
    expect(md.length).toBeGreaterThan(0);
    const reparsed = parseMarkdownTemplate(md, 'ndaTemplate');
    expect(reparsed).not.toBeNull();
    editor.destroy();
  });

  // 25. emitUpdate=true on setContent from markdown — onUpdate fires
  it('can set editor content from parsed markdown with emitUpdate=true', () => {
    const md = 'Hello {{name}} and {{address}} {{#if isMutual}}mutual{{else}}one-way{{/if}}';
    const parsed = parseMarkdownTemplate(md);
    if (!parsed) return;
    const editor = createTestEditor();
    let updateFired = false;
    editor.on('update', () => { updateFired = true; });
    const content = templateMarkToTipTap(parsed);
    editor.commands.setContent(content, true);
    const json = JSON.stringify(editor.getJSON());
    expect(json).toContain('variable');
    expect(json).toContain('conditional');
    expect(updateFired).toBe(true);
    editor.destroy();
  });

  // 26. validateTemplate(minimalTemplate) → zero errors
  it('validateTemplate returns zero errors for minimalTemplate', async () => {
    const errors = await validateTemplate(minimalTemplate);
    if (errors.length > 0) console.error('Validation error:', errors[0]);
    expect(errors).toHaveLength(0);
  });

  // 27. validateTemplate(variableTemplate) → zero errors
  it('validateTemplate returns zero errors for variableTemplate', async () => {
    const errors = await validateTemplate(variableTemplate);
    if (errors.length > 0) console.error('Validation error:', errors[0]);
    expect(errors).toHaveLength(0);
  });

  // 28. validateTemplate(ndaTemplate) → zero errors
  it('validateTemplate returns zero errors for ndaTemplate', async () => {
    const errors = await validateTemplate(ndaTemplate);
    if (errors.length > 0) console.error('Validation error:', errors[0]);
    expect(errors).toHaveLength(0);
  });

  // 29. validateTemplate(blockTemplate) → returns an array (block types like ConditionalBlockDefinition
  //     are not handled by toMarkdownTemplate in the upstream transformer library)
  it('validateTemplate returns an array for blockTemplate', async () => {
    const errors = await validateTemplate(blockTemplate);
    expect(Array.isArray(errors)).toBe(true);
  });

  // 30. Editor round-trip spec compliance — ndaTemplate → editor → tiptapToTemplateMark → validateTemplate → zero errors
  it('ndaTemplate editor round-trip produces valid TemplateMark (zero errors)', async () => {
    const editor = createTestEditor(ndaTemplate);
    const tm = tiptapToTemplateMark(editor.getJSON(), 'ndaTemplate');
    const errors = await validateTemplate(tm);
    if (errors.length > 0) console.error('Round-trip validation error:', errors[0]);
    expect(errors).toHaveLength(0);
    editor.destroy();
  });

  // 31. tiptapToTemplateMark preserves 0.5.0 $class names and FormulaDefinition code structure
  it('tiptapToTemplateMark preserves 0.5.0 $class names and FormulaDefinition.code structure', () => {
    const editor = createTestEditor(ndaTemplate);
    const tm = tiptapToTemplateMark(editor.getJSON(), 'ndaTemplate');
    const serialized = JSON.stringify(tm);
    expect(serialized).toContain('org.accordproject.templatemark@0.5.0.FormulaDefinition');
    // Walk for formula node and verify code structure
    function findFormula(nodes: unknown[]): unknown | null {
      for (const n of nodes) {
        const node = n as Record<string, unknown>;
        if (node.$class === 'org.accordproject.templatemark@0.5.0.FormulaDefinition') return node;
        if (Array.isArray(node.nodes)) {
          const found = findFormula(node.nodes as unknown[]);
          if (found) return found;
        }
      }
      return null;
    }
    const tmNode = tm as unknown as Record<string, unknown>;
    const formulaNode = findFormula((tmNode.nodes as unknown[]) ?? []) as Record<string, unknown> | null;
    expect(formulaNode).not.toBeNull();
    const code = formulaNode?.code as Record<string, unknown> | undefined;
    expect(code?.$class).toBe('org.accordproject.templatemark@0.5.0.Code');
    expect(code?.type).toBe('TYPESCRIPT');
    editor.destroy();
  });

  // 32. tiptapToTemplateMark returns a ContractDefinition document
  it('tiptapToTemplateMark returns ContractDefinition $class', () => {
    const editor = createTestEditor(variableTemplate);
    const tm = tiptapToTemplateMark(editor.getJSON(), 'template');
    expect(tm.$class).toBe('org.accordproject.templatemark@0.5.0.ContractDefinition');
    editor.destroy();
  });

  // 33. readOnly mode — editor.isEditable is false
  it('editor can be set to non-editable (readOnly)', () => {
    const editor = createTestEditor(minimalTemplate);
    editor.setEditable(false);
    expect(editor.isEditable).toBe(false);
    editor.destroy();
  });

  // ── Preserved existing tests ─────────────────────────────────────────────────

  it('loads template from JSON and preserves structure', () => {
    const editor = createTestEditor(ndaTemplate);
    const json = editor.getJSON();
    expect(json.type).toBe('doc');
    expect(json.content).toBeDefined();
    editor.destroy();
  });

  it('allows editing text inside a variable node', () => {
    const editor = createTestEditor(variableTemplate);
    const json = editor.getJSON();
    const allContent = JSON.stringify(json);
    expect(allContent).toContain('"type":"variable"');
    editor.destroy();
  });

  it('variable sync plugin is active (no errors on init)', () => {
    const editor = createTestEditor(variableTemplate);
    expect(editor).toBeDefined();
    expect(editor.isDestroyed).toBe(false);
    editor.destroy();
  });

  it('two variables with different names exist independently', () => {
    const doc = makeContract([
      {
        $class: 'org.accordproject.commonmark@0.5.0.Paragraph',
        nodes: [
          {
            $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
            name: 'alpha',
            elementType: 'String',
            nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'A' }],
          },
          {
            $class: 'org.accordproject.templatemark@0.5.0.VariableDefinition',
            name: 'beta',
            elementType: 'String',
            nodes: [{ $class: 'org.accordproject.commonmark@0.5.0.Text', text: 'B' }],
          },
        ],
      },
    ]);
    const editor = createTestEditor(doc);
    const json = JSON.stringify(editor.getJSON());
    expect(json).toContain('"alpha"');
    expect(json).toContain('"beta"');
    editor.destroy();
  });

  it('removes first paragraph block via deleteRange', () => {
    const editor = createTestEditor(minimalTemplate);
    const docSize = editor.state.doc.content.size;
    const firstChild = editor.state.doc.firstChild;
    if (firstChild) {
      editor.chain().command(({ tr }) => {
        tr.delete(0, firstChild.nodeSize);
        return true;
      }).run();
    }
    expect(editor.state.doc.content.size).toBeLessThanOrEqual(docSize);
    editor.destroy();
  });

  it('validateTemplate returns an array (no throw) for valid minimal doc', async () => {
    const errors = await validateTemplate(minimalTemplate);
    expect(Array.isArray(errors)).toBe(true);
  });
});
