
import { Transforms } from 'slate';
import { H1, H2, H3, H4, H5, H6 } from '../../utilities/schema';

const MatchHeadings = (editor, matchingText) => {
	const count = (matchingText[0].match(/#/g) || []).length;
	if (count === 1) Transforms.setNodes(editor, { type: H1 });
	else if (count === 2) Transforms.setNodes(editor, { type: H2 });
	else if (count === 3) Transforms.setNodes(editor, { type: H3 });
	else if (count === 4) Transforms.setNodes(editor, { type: H4 });
	else if (count === 5) Transforms.setNodes(editor, { type: H5 });
	else if (count === 6) Transforms.setNodes(editor, { type: H6 });
	return;
}

export default MatchHeadings;