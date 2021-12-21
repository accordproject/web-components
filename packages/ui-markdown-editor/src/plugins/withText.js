import { Node } from 'slate';
import { isBlockHeading } from '../utilities/toolbarHelpers';
import { matchCases } from "utilities/matchCases";
import { SPACE_BAR } from "utilities/constants";

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
			switch (ev.key) {
  	    case SPACE_BAR:
					matchCases(editor, currentLine);
				break;
			}
		}	
	}
	return editor;
}