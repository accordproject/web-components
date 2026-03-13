import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
export const formulaDependencyPluginKey = new PluginKey('formulaDependency');
export function createFormulaDependencyPlugin() {
    return new Plugin({
        key: formulaDependencyPluginKey,
        state: {
            init() {
                return { hoveredDeps: [] };
            },
            apply(tr, value) {
                const meta = tr.getMeta(formulaDependencyPluginKey);
                if (meta) {
                    return { hoveredDeps: meta.hoveredDeps ?? [] };
                }
                return value;
            },
        },
        props: {
            decorations(state) {
                const pluginState = formulaDependencyPluginKey.getState(state);
                if (!pluginState || pluginState.hoveredDeps.length === 0) {
                    return DecorationSet.empty;
                }
                const { hoveredDeps } = pluginState;
                const decorations = [];
                state.doc.descendants((node, pos) => {
                    if ((node.type.name === 'variable' || node.type.name === 'formattedVariable' || node.type.name === 'enumVariable') &&
                        hoveredDeps.includes(node.attrs.name)) {
                        decorations.push(Decoration.node(pos, pos + node.nodeSize, {
                            class: 'formula-dependency-highlight',
                        }));
                    }
                });
                return DecorationSet.create(state.doc, decorations);
            },
        },
    });
}
