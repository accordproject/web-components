import { Node } from 'slate';
import { isBlockHeading } from '../utilities/toolbarHelpers';
import { matchCases } from "utilities/matchCases";

export const withText = (editor) => {
	const { insertText } = editor;
	editor.insertText = (text) => {
		insertText(text);
    const currentNode = Node.get(editor, editor.selection.focus.path);
		if(isBlockHeading(editor)){
			return;
		}
		const currentLine = currentNode.text;
		matchCases(editor, currentLine);
	}
	return editor;
}