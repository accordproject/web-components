/**
 * Service Agreement template tests.
 *
 * Exercises the following TemplateMark node types in combination:
 *   FormattedVariableDefinition, VariableDefinition, ClauseDefinition,
 *   ListBlockDefinition (ulist), ListItem (Item), FormulaDefinition,
 *   ThematicBreak, Image.
 *
 * Bug fixes covered here:
 *   - ListItemExtension added (group: 'block') so listItem nodes are valid
 *     inside ListBlockExtension's 'block+' content schema.
 *   - ImageExtension + ThematicBreakExtension added to createTestEditor.
 *   - Formula `return ' + compensation...` → `return '' + compensation...`
 *     (empty-string coercion; original had a stray single-quote).
 */
import { createTestEditor } from '../helpers/createTestEditor';
import { serviceAgreementTemplate } from '../helpers/fixtures';
import { tiptapToTemplateMark } from '../../src/serializer/TipTapToTemplateMark';
import { serializeToMarkdown } from '../../src/utils/serializeTemplate';

describe('service-agreement template', () => {

  // ── Loading & structure ──────────────────────────────────────────────────────

  it('loads without throwing and produces a doc root', () => {
    const editor = createTestEditor(serviceAgreementTemplate);
    expect(editor.isDestroyed).toBe(false);
    expect(editor.getJSON().type).toBe('doc');
    editor.destroy();
  });

  it('contains all expected node types', () => {
    const editor = createTestEditor(serviceAgreementTemplate);
    const json = JSON.stringify(editor.getJSON());
    expect(json).toContain('"formattedVariable"');  // effectiveDate, rate
    expect(json).toContain('"variable"');            // clientName etc
    expect(json).toContain('"clause"');              // compensation
    expect(json).toContain('"listBlock"');           // ulist services
    expect(json).toContain('"listItem"');            // Item nodes
    expect(json).toContain('"formula"');             // totalValue
    expect(json).toContain('"thematicBreak"');       // --- separators
    expect(json).toContain('"image"');               // logos
    editor.destroy();
  });

  // ── Clause node ──────────────────────────────────────────────────────────────

  it('clause node has name="compensation"', () => {
    const editor = createTestEditor(serviceAgreementTemplate);
    let found = false;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'clause' && node.attrs.name === 'compensation') {
        found = true;
        return false;
      }
    });
    expect(found).toBe(true);
    editor.destroy();
  });

  // ── List block ───────────────────────────────────────────────────────────────

  it('listBlock inside clause has name="services" and listType="bullet"', () => {
    const editor = createTestEditor(serviceAgreementTemplate);
    let found = false;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'listBlock') {
        expect(node.attrs.name).toBe('services');
        expect(node.attrs.listType).toBe('bullet');
        found = true;
        return false;
      }
    });
    expect(found).toBe(true);
    editor.destroy();
  });

  it('listItem inside listBlock contains formattedVariable (rate) and variable nodes', () => {
    const editor = createTestEditor(serviceAgreementTemplate);
    let hasFormattedVar = false;
    let hasVariable = false;
    let inListItem = false;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'listItem') inListItem = true;
      if (inListItem && node.type.name === 'formattedVariable') hasFormattedVar = true;
      if (inListItem && node.type.name === 'variable') hasVariable = true;
    });
    expect(hasFormattedVar).toBe(true);
    expect(hasVariable).toBe(true);
    editor.destroy();
  });

  // ── Formula node ─────────────────────────────────────────────────────────────

  it('formula node has name="totalValue" and correct codeContents', () => {
    const editor = createTestEditor(serviceAgreementTemplate);
    let found = false;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'formula') {
        expect(node.attrs.name).toBe('totalValue');
        expect(node.attrs.codeContents).toContain('compensation.services');
        expect(node.attrs.codeContents).toContain('.map(');
        expect(node.attrs.codeContents).toContain('.reduce(');
        // Verify the typo was fixed: should start with '' + not ' +
        expect(node.attrs.codeContents).toContain("return ''");
        found = true;
        return false;
      }
    });
    expect(found).toBe(true);
    editor.destroy();
  });

  // ── Image nodes ──────────────────────────────────────────────────────────────

  it('two image nodes are present with correct src attrs', () => {
    const editor = createTestEditor(serviceAgreementTemplate);
    const images: string[] = [];
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'image') images.push(node.attrs.src as string);
    });
    expect(images).toHaveLength(2);
    expect(images[0]).toContain('AcmeCorp');
    expect(images[1]).toContain('DevConsult');
    editor.destroy();
  });

  // ── Thematic breaks ──────────────────────────────────────────────────────────

  it('three thematic break nodes are present', () => {
    const editor = createTestEditor(serviceAgreementTemplate);
    let count = 0;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'thematicBreak') count++;
    });
    expect(count).toBe(3);
    editor.destroy();
  });

  // ── Roundtrip: TemplateMark → TipTap → TemplateMark ─────────────────────────

  it('roundtrip preserves clause name and listBlock name', () => {
    const editor = createTestEditor(serviceAgreementTemplate);
    const tm = tiptapToTemplateMark(editor.getJSON(), 'serviceAgreement');

    const serialized = JSON.stringify(tm);
    expect(serialized).toContain('"compensation"');
    expect(serialized).toContain('"services"');
    expect(serialized).toContain('ListBlockDefinition');
    expect(serialized).toContain('ClauseDefinition');
    editor.destroy();
  });

  it('roundtrip preserves formula code structure', () => {
    const editor = createTestEditor(serviceAgreementTemplate);
    const tm = tiptapToTemplateMark(editor.getJSON(), 'serviceAgreement');

    const serialized = JSON.stringify(tm);
    expect(serialized).toContain('FormulaDefinition');
    expect(serialized).toContain('org.accordproject.templatemark@0.5.0.Code');
    expect(serialized).toContain('TYPESCRIPT');
    expect(serialized).toContain('compensation.services');
    editor.destroy();
  });

  it('roundtrip preserves image destinations', () => {
    const editor = createTestEditor(serviceAgreementTemplate);
    const tm = tiptapToTemplateMark(editor.getJSON(), 'serviceAgreement');

    const serialized = JSON.stringify(tm);
    expect(serialized).toContain('AcmeCorp');
    expect(serialized).toContain('DevConsult');
    editor.destroy();
  });

  it('roundtrip preserves thematic breaks', () => {
    const editor = createTestEditor(serviceAgreementTemplate);
    const tm = tiptapToTemplateMark(editor.getJSON(), 'serviceAgreement');

    const serialized = JSON.stringify(tm);
    expect(serialized).toContain('ThematicBreak');
    editor.destroy();
  });

  it('roundtrip produces all 8 top-level variable names', () => {
    const editor = createTestEditor(serviceAgreementTemplate);
    const tm = tiptapToTemplateMark(editor.getJSON(), 'serviceAgreement');
    const serialized = JSON.stringify(tm);

    // Contract-level variables
    expect(serialized).toContain('"effectiveDate"');
    expect(serialized).toContain('"clientName"');
    expect(serialized).toContain('"clientAddress"');
    expect(serialized).toContain('"providerName"');
    expect(serialized).toContain('"providerAddress"');
    // Clause-level variables
    expect(serialized).toContain('"description"');
    expect(serialized).toContain('"rate"');
    expect(serialized).toContain('"quantity"');
    expect(serialized).toContain('"paymentTerms"');
    editor.destroy();
  });

  // ── Markdown serialization roundtrip ─────────────────────────────────────────

  it('TemplateMark → markdown produces non-empty string', () => {
    const md = serializeToMarkdown(serviceAgreementTemplate);
    expect(typeof md).toBe('string');
    expect(md.length).toBeGreaterThan(50);
  });

  it('TemplateMark → TipTap → TemplateMark → markdown produces non-empty string', () => {
    const editor = createTestEditor(serviceAgreementTemplate);
    const tm = tiptapToTemplateMark(editor.getJSON(), 'serviceAgreement');
    const md = serializeToMarkdown(tm);
    expect(typeof md).toBe('string');
    expect(md.length).toBeGreaterThan(50);
    editor.destroy();
  });
});
