import { Editor, Node } from 'slate';
import { insertThematicBreak, isBlockHeading } from '../utilities/toolbarHelpers';
import { HR } from '../utilities/schema'

export const withText = (editor) => {
  // Inserts page break with dash
	const { insertText } = editor;
	editor.insertText = (text) => {
		insertText(text);
    const currentNode = Node.get(editor, editor.selection.focus.path);
		if(isBlockHeading(editor)){
			return;
		}
		const firstWord = currentNode.text;
		if(firstWord !== '---'){
			return;
		}
		Editor.deleteBackward(editor, { unit: 'word' });
		insertThematicBreak(editor, HR);
	}
	return editor;
}