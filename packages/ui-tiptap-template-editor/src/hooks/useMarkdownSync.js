import { useState, useCallback, useRef } from 'react';
import { tiptapToTemplateMark } from '../serializer/TipTapToTemplateMark';
import { templateMarkToTipTap } from '../serializer/TemplateMarkToTipTap';
import { serializeToMarkdown } from '../utils/serializeTemplate';
import { parseMarkdownTemplate } from '../utils/parseTemplate';
export function useMarkdownSync(editor, nameRef) {
    const [view, setView] = useState('rich');
    const [markdownText, setMarkdownText] = useState('');
    // Stable ref to avoid stale closure on nameRef
    const nameRefRef = useRef(nameRef);
    nameRefRef.current = nameRef;
    const switchToMarkdown = useCallback(() => {
        if (!editor)
            return;
        const tm = tiptapToTemplateMark(editor.getJSON(), nameRefRef.current.current);
        const md = serializeToMarkdown(tm);
        setMarkdownText(md);
        setView('markdown');
    }, [editor]);
    const switchToRich = useCallback(() => {
        if (!editor) {
            setView('rich');
            return;
        }
        const parsed = parseMarkdownTemplate(markdownText, nameRefRef.current.current);
        if (parsed) {
            const content = templateMarkToTipTap(parsed);
            // emitUpdate=true so onUpdate fires → currentDoc and parent onChange are synced
            editor.commands.setContent(content, true);
        }
        setView('rich');
    }, [editor, markdownText]);
    const toggleView = useCallback(() => {
        if (view === 'rich') {
            switchToMarkdown();
        }
        else {
            switchToRich();
        }
    }, [view, switchToMarkdown, switchToRich]);
    return { view, markdownText, setMarkdownText, toggleView };
}
