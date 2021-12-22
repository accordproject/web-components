import { Node } from 'slate';
import { isBlockHeading } from '../utilities/toolbarHelpers';
import { matchCases } from "utilities/matchCases";
import { SPACE_CHARACTER } from "utilities/constants";

export const withText = (editor) => {
	const { insertText } = editor;
	editor.insertText = (text) => {
		insertText(text);
    const currentNode = Node.get(editor, editor.selection.focus.path);
		if(isBlockHeading(editor)){
			return;
		}

		const currentLine = currentNode.text

		onkeyup = (ev) => {
			if(ev.key === SPACE_CHARACTER){
				matchCases(editor, currentLine);
			}
		}	
	}
	return editor;
}