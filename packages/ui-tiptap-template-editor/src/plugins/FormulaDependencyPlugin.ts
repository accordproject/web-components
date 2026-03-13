import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import type { EditorState } from 'prosemirror-state';

export const formulaDependencyPluginKey = new PluginKey<{ hoveredDeps: string[] }>('formulaDependency');

export function createFormulaDependencyPlugin(): Plugin<{ hoveredDeps: string[] }> {
  return new Plugin({
    key: formulaDependencyPluginKey,
    state: {
      init(): { hoveredDeps: string[] } {
        return { hoveredDeps: [] };
      },
      apply(tr, value: { hoveredDeps: string[] }): { hoveredDeps: string[] } {
        const meta = tr.getMeta(formulaDependencyPluginKey) as { hoveredDeps?: string[] } | undefined;
        if (meta) {
          return { hoveredDeps: meta.hoveredDeps ?? [] };
        }
        return value;
      },
    },
    props: {
      decorations(state: EditorState): DecorationSet {
        const pluginState = formulaDependencyPluginKey.getState(state);
        if (!pluginState || pluginState.hoveredDeps.length === 0) {
          return DecorationSet.empty;
        }

        const { hoveredDeps } = pluginState;
        const decorations: Decoration[] = [];

        state.doc.descendants((node, pos) => {
          if (
            (node.type.name === 'variable' || node.type.name === 'formattedVariable' || node.type.name === 'enumVariable') &&
            hoveredDeps.includes(node.attrs.name as string)
          ) {
            decorations.push(
              Decoration.node(pos, pos + node.nodeSize, {
                class: 'formula-dependency-highlight',
              })
            );
          }
        });

        return DecorationSet.create(state.doc, decorations);
      },
    },
  });
}
