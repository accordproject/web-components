import { Plugin, PluginKey } from 'prosemirror-state';
import type { Transaction, EditorState } from 'prosemirror-state';
import type { Node as ProseMirrorNode } from 'prosemirror-model';

export const variableSyncPluginKey = new PluginKey('variableSync');

interface VariableEntry {
  pos: number;
  text: string;
  clausePos: number; // position of enclosing clause, or -1 if top-level
}

/**
 * Walk the document and collect all variable/formattedVariable nodes,
 * grouped by (clausePos, name). This lets us sync only within the same clause.
 */
function collectVariablesByName(doc: ProseMirrorNode): Map<string, VariableEntry[]> {
  const result = new Map<string, VariableEntry[]>();

  // Walk top-level nodes to track clause positions
  doc.forEach((topNode, topPos) => {
    const clausePos = topNode.type.name === 'clause' ? topPos : -1;

    const walk = (node: ProseMirrorNode, pos: number) => {
      if (node.type.name === 'variable' || node.type.name === 'formattedVariable') {
        const name = node.attrs.name as string;
        if (!name) return;
        // Key is "clausePos:name" to scope syncing within the same clause
        const key = `${clausePos}:${name}`;
        const entry: VariableEntry = { pos, text: node.textContent, clausePos };
        const existing = result.get(key) ?? [];
        existing.push(entry);
        result.set(key, existing);
      }
      node.forEach((child, offset) => {
        walk(child, pos + offset + 1);
      });
    };

    walk(topNode, topPos);
  });

  return result;
}

/**
 * Same as collectVariablesByName but returns a simpler Map<key, text>
 * representing the "last known" text for each variable entry position.
 */
function collectVariableTexts(doc: ProseMirrorNode): Map<number, string> {
  const result = new Map<number, string>();

  const walk = (node: ProseMirrorNode, pos: number) => {
    if (node.type.name === 'variable' || node.type.name === 'formattedVariable') {
      result.set(pos, node.textContent);
    }
    node.forEach((child, offset) => {
      walk(child, pos + offset + 1);
    });
  };

  doc.forEach((topNode, topPos) => {
    walk(topNode, topPos);
  });

  return result;
}

/**
 * When any variable node's text content changes, sync the same value
 * to all other variable nodes with the same name within the same clause.
 */
export function createVariableSyncPlugin(): Plugin {
  return new Plugin({
    key: variableSyncPluginKey,
    appendTransaction(transactions: readonly Transaction[], oldState: EditorState, newState: EditorState): Transaction | null {
      // Skip if doc didn't change or if this transaction is already a sync
      if (!transactions.some(tr => tr.docChanged)) return null;
      if (transactions.some(tr => tr.getMeta('variableSync'))) return null;

      const oldTexts = collectVariableTexts(oldState.doc);
      const newVarsByName = collectVariablesByName(newState.doc);

      let tr: Transaction | null = null;

      for (const [, entries] of newVarsByName) {
        if (entries.length <= 1) continue;

        // Check if all entries have the same text (already consistent)
        const texts = entries.map(e => e.text);
        if (new Set(texts).size <= 1) continue;

        // Find which entry changed relative to old state
        const changedEntry = entries.find(e => {
          const oldText = oldTexts.get(e.pos);
          return oldText !== undefined && e.text !== oldText;
        });

        const canonical = changedEntry ? changedEntry.text : entries[0].text;

        // Sync all entries that differ from canonical
        for (const entry of entries) {
          if (entry.text === canonical) continue;

          if (!tr) {
            tr = newState.tr.setMeta('addToHistory', false).setMeta('variableSync', true);
          }

          // Replace the text content of this variable node
          const nodeStart = entry.pos + 1; // +1 to step inside the node
          const nodeEnd = entry.pos + 1 + entry.text.length;
          if (nodeStart <= nodeEnd) {
            tr.replaceWith(nodeStart, nodeEnd, newState.schema.text(canonical));
          }
        }
      }

      return tr;
    },
  });
}
