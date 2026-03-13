import { Extension } from '@tiptap/core';
import { Plugin } from 'prosemirror-state';
import { templateMarkToTipTap } from '../serializer/TemplateMarkToTipTap';
import { parseMarkdownTemplate } from '../utils/parseTemplate';
/** Intercepts paste events. If clipboard text contains TemplateMark syntax, parse and insert as nodes. */
export const PasteTemplateMarkExtension = Extension.create({
    name: 'pasteTemplateMark',
    addProseMirrorPlugins() {
        return [
            new Plugin({
                props: {
                    handlePaste(view, event) {
                        const text = event.clipboardData?.getData('text/plain') ?? '';
                        if (!text.includes('{{') && !text.includes('{%'))
                            return false;
                        const parsed = parseMarkdownTemplate(text);
                        if (!parsed)
                            return false;
                        event.preventDefault();
                        const tiptapJson = templateMarkToTipTap(parsed);
                        const content = tiptapJson.content ?? [];
                        const { state, dispatch } = view;
                        const tr = state.tr;
                        let inserted = false;
                        for (const nodeJson of content) {
                            try {
                                const node = state.schema.nodeFromJSON(nodeJson);
                                tr.replaceSelectionWith(node);
                                inserted = true;
                            }
                            catch {
                                // Skip unrecognised nodes
                            }
                        }
                        if (inserted) {
                            dispatch(tr);
                            return true;
                        }
                        return false;
                    },
                },
            }),
        ];
    },
});
