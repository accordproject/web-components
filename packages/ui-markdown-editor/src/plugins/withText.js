import { Editor, Node, Transforms } from 'slate';
import { isBlockHeading } from '../utilities/toolbarHelpers';
import { HR } from '../utilities/schema'
import MatchHeadings from './MatchCases/MatchHeadings'

export const withText = (editor) => {
	const { insertText } = editor;
	editor.insertText = (text) => {
		insertText(text);
    const currentNode = Node.get(editor, editor.selection.focus.path);
		if(isBlockHeading(editor)){
			return;
		}
		
		let matchingText;
		const currentLine = currentNode.text;
		const headingMatchCase = currentLine.match(/(^\s*)#{1,6}\s/m);
		
		// Assignment inside of conditional statements
		if((matchingText = headingMatchCase)){
			MatchHeadings(editor, matchingText);
			Editor.deleteBackward(editor, { unit: 'word' });
		}

		if(currentLine === '---'){
			Editor.deleteBackward(editor, { unit: 'word' });
			Transforms.setNodes(editor, { type: HR })
			return;
		}
	}
	return editor;
}